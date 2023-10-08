<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\AuthTiktok;
use App\Models\ProductTiktok;
use App\Models\StockTiktok;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class MappingProductController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function list(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $status_mapping = $request->status_mapping;

        $product =  ProductTiktok::query();
        if ($search) {
            $product->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
                $query->orWhere('tiktok_product_id', 'like', "%$search%");
                $query->orWhere('sku_id', 'like', "%$search%");
                $query->orWhere('seller_sku', 'like', "%$search%");
                $query->orWhere('status_mapping', 'like', "%$search%");
            });
        }

        if ($status) {
            $product->where('status', $status);
        }

        if ($status_mapping) {
            $product->where('status_mapping', $status_mapping);
        }

        $products = $product->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $products,
            'message' => 'List Ticket'
        ]);
    }

    public function listSku(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $sku =  ProductTiktok::query();
        if ($search) {
            $sku->where(function ($query) use ($search) {
                $query->where('sku', 'like', "%$search%");
            });
        }

        if ($status) {
            $sku->where('status', $status);
        }

        $variants = $sku->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $variants,
            'message' => 'List SkuMaster'
        ]);
    }

    public function detail($id)
    {
        $product = ProductTiktok::where('id', $id)->first();
        $product['warehouse'] = StockTiktok::leftjoin('warehouse_tiktoks', 'stock_tiktoks.warehouse_tiktok_id', 'warehouse_tiktoks.tiktok_warehouse_id')->where('product_tiktok_id', $product->tiktok_product_id)->get();
        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Detail Product'
        ]);
    }

    public function syncron(Request $request)
    {
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'shop_id' => '');
        $sign = generateSHA256('/api/products/search', $queries, $app_secret);

        $data = array(
            'page_number' => 1,
            'page_size' => 100
        );
        $url = 'https://open-api.tiktokglobalshop.com/api/products/search?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

        $content = json_encode($data);
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array("Content-type: application/json")
        );
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        $response = json_decode($json_response, true);
        // echo"<pre>";print_r($response);die();
        $data = $response['data']['products'];
        if (!empty($data)) {
            foreach ($data as $row) {
                $check = ProductTiktok::where('tiktok_product_id', $row['id'])->first();
                $product = Product::where('sku', $row['skus'][0]['id'])->first();
                $stocks = $row['skus'][0]['stock_infos'];
                if (empty($check)) {
                    $insert = ProductTiktok::create([
                        'tiktok_product_id'  => $row['id'],
                        'name' => $row['name'],
                        'sku_id'  => $row['skus'][0]['id'],
                        'currency'  => $row['skus'][0]['price']['currency'],
                        'price'  => $row['skus'][0]['price']['original_price'],
                        'seller_sku'  => $row['skus'][0]['seller_sku'],
                        'status'  => $row['status'],
                        'create_time'  => $row['create_time'],
                        'update_time'  => $row['update_time'],
                        'status_mapping' => ($product) ? 'Mapped' : 'Not Mapped'
                    ]);

                    foreach ($stocks as $sto) {
                        $insertStock = StockTiktok::create([
                            'product_tiktok_id'  => $row['id'],
                            'warehouse_tiktok_id' => $sto['warehouse_id'],
                            'stock' => $sto['available_stock']
                        ]);
                    }
                } else {
                    $check->status_mapping = ($product) ? 'Mapped' : 'Not Mapped';
                    $check->save();
                }
            }
        }

        return $response;
    }


    public function refreshToken()
    {
        $auth = AuthTiktok::all();
        if (count($auth) > 0) {
            $access = AuthTiktok::find(1);

            $data = array(
                'grant_type' => 'refresh_token',
                'app_key' => getSetting('TIKTOK_APP_KEY'),
                'app_secret' => getSetting('TIKTOK_SECRET_KEY'),
                'refresh_token' => $access->refresh_token
            );
            $url = "https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=" . $data['app_key'] . "&app_secret=" . $data['app_secret'] . "&refresh_token=" . $data['refresh_token'] . "&grant_type=" . $data['grant_type'];

            $content = json_encode($data);
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt(
                $curl,
                CURLOPT_HTTPHEADER,
                array("Content-type: application/json")
            );
            $json_response = curl_exec($curl);

            $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);

            $response = json_decode($json_response, true);
            $data = $response['data'];
            $update = AuthTiktok::find(1);
            $update->access_token = $data['access_token'];
            $update->access_token_expire_in = $data['access_token_expire_in'];
            $update->refresh_token = $data['refresh_token'];
            $update->refresh_token_expire_in = $data['refresh_token_expire_in'];
            $update->open_id = $data['open_id'];
            $update->seller_name = $data['seller_name'];
            $update->seller_base_region = $data['seller_base_region'];
            $update->user_type = $data['user_type'];
            $update->save();

            return $response;
        } else {
            $respon = [
                'error' => true,
                'status_code' => 201,
                'message' => 'Anda belum melakukan authentikasi'
            ];
            return response()->json($respon, 200);
        }
    }
}
