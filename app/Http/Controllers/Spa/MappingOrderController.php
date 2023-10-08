<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Jobs\GetOrderTiktok;
use App\Models\Ticket;
use App\Models\AuthTiktok;
use App\Models\OrderTiktok;
use App\Models\OrderItemTiktok;
use App\Models\OrderTracker;
use App\Models\LogError;
use App\Models\Warehouse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDF;

class MappingOrderController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function list(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $tanggal_transaksi = $request->tanggal_transaksi;
        $warehouse_id = $request->warehouse_id;

        $user = auth()->user();
        if (in_array($user->role->role_type, ['warehouse', 'mitra'])) {
            $warehouses = Warehouse::leftjoin('warehouse_users', 'warehouse_users.warehouse_id', 'warehouses.id')->where('warehouse_users.user_id', $user->id)->where('warehouses.status', 1)->select('warehouses.*')->first();
            $warehouse_id = $warehouses->warehouse_tiktok_id;
        }

        $stock_ready = 0;
        $order =  OrderTiktok::query();
        try {
            if ($search) {
                $order->where(function ($query) use ($search) {
                    $query->where('tiktok_order_id', 'like', "%$search%");
                    $query->orWhere('buyer_uid', 'like', "%$search%");
                    $query->orWhere('create_time', 'like', "%$search%");
                    $query->orWhere('delivery_option', 'like', "%$search%");
                    $query->orWhere('delivery_option_description', 'like', "%$search%");
                    $query->orWhere('fulfillment_type', 'like', "%$search%");
                    $query->orWhere('is_cod', 'like', "%$search%");
                    $query->orWhere('paid_time', 'like', "%$search%");
                    $query->orWhere('payment_method', 'like', "%$search%");
                    $query->orWhere('payment_method_name', 'like', "%$search%");
                    $query->orWhere('shipping_provider', 'like', "%$search%");
                    $query->orWhere('tracking_number', 'like', "%$search%");
                    $query->orWhere('buyer_phone', 'like', "%$search%");
                    $query->orWhere('buyer_name', 'like', "%$search%");
                    $query->orWhere('zipcode', 'like', "%$search%");
                    $query->orWhere('town', 'like', "%$search%");
                    $query->orWhere('state', 'like', "%$search%");
                    $query->orWhere('region', 'like', "%$search%");
                    $query->orWhere('district', 'like', "%$search%");
                    $query->orWhere('city', 'like', "%$search%");
                    $query->orWhere('full_address', 'like', "%$search%");
                    $query->orWhere('warehouse_id', 'like', "%$search%");
                });
            }

            if ($status) {
                $order->where('status', $status);
            }

            if ($tanggal_transaksi) {
                $order->whereBetween('create_time', $tanggal_transaksi);
            }

            if ($warehouse_id) {
                $order->where('warehouse_id', $warehouse_id);
            }

            // foreach ($warehouse->get() as $wh) {
            //     if ($wh->status_stock == 'out_of_stock') {
            //         $stock_ready = 1;
            //     }
            // }
            $log_error = LogError::where('action', 'like', "%CEKSTOCK%")->first();
            // print_r($log_error);die();
            $variants = $order->orderBy('created_at', 'desc')->paginate($request->perpage);
            return response()->json([
                'status' => 'success',
                'data' => $variants,
                'tiktok_order_total' => getSetting('tiktok_order_total'),
                'message' => 'List Warehouse',
                'stock_ready' => $stock_ready,
                'log_error' => (!empty($log_error) ? 1 : 0),
                'error_logs' =>  LogError::where('action', 'like', "%CEKSTOCK%")->get()
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            dd($th->getMessage());
        }
    }

    public function generatePDF()
    {
        $pdf = PDF::loadView('export.label');
        return $pdf->stream('my_pdf.pdf');
    }


    public function detail($id)
    {
        $order = OrderTiktok::where('id', $id)->first();
        $client = new Client();
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'shop_id' => '');
        $sign = generateSHA256('/api/orders/detail/query', $queries, $app_secret);


        $url = 'https://open-api.tiktokglobalshop.com/api/orders/detail/query?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

        try {
            $response = $client->request('POST',  $url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'order_id_list' =>  [$order->tiktok_order_id]
                ]),
            ]);

            $responseJSON = json_decode($response->getBody(), true);
            return response()->json([
                'status' => 'success',
                'data' => $order,
                'tiktok' => $responseJSON['data'],
                'message' => 'Detail Order'
            ]);
        } catch (ClientException $th) {
            return response()->json(['message' => 'Error', 'data' => $th->getMessage()], 400);
        }
    }

    public function getTrackingHistory($tiktok_order_id)
    {
        $client = new Client();
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'order_id' => $tiktok_order_id, 'shop_id' => '');
        $sign = generateSHA256('/api/logistics/ship/get', $queries, $app_secret);
        $url = 'https://open-api.tiktokglobalshop.com/api/logistics/ship/get?access_token=' . $access_token . '&app_key=' . $app_key . '&order_id=' . $tiktok_order_id . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;
        try {
            $response = $client->request('GET',  $url);

            $responseJSON = json_decode($response->getBody(), true);
            return response()->json([
                'status' => 'success',
                'data' => $responseJSON['data']['tracking_info_list'],
                'message' => 'Detail Order'
            ]);
        } catch (ClientException $th) {
            return response()->json(['message' => 'Error', 'data' => $th->getMessage()], 400);
        }
    }

    public function syncron(Request $request)
    {
        try {
            DB::beginTransaction();
            setSetting('sync_tiktok', 'true');
            $params = [];
            if ($request->tanggal_transaksi) {
                $params = [
                    'create_time_from' => strtotime($request->tanggal_transaksi[0]),
                    'create_time_to' => strtotime($request->tanggal_transaksi[1]),
                ];
            }

            GetOrderTiktok::dispatch(false, null, $params)->onQueue('send-notification');
            DB::commit();
            return response()->json([
                'status' => 'success',
                'data' => [
                    'progress' => 0,
                    'sync' => true
                ],
                'message' => 'Sync Data'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'success',
                'data' => [],
                'message' => 'Sync Data Gagal',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function syncronCancel()
    {
        try {
            DB::beginTransaction();

            setSetting('sync_tiktok', 'false');
            removeSetting('tiktok_order_total');
            removeSetting('tiktok_sync_total');
            DB::table('jobs')->truncate();

            DB::commit();
            return response()->json([
                'status' => 'success',
                'data' => [
                    'progress' => 100,
                    'sync' => false
                ],
                'message' => 'Sync Data'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'success',
                'data' => [],
                'message' => 'Sync Data Gagal'
            ], 400);
        }
    }

    public function syncron_test(Request $request)
    {
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'shop_id' => '');
        $sign = generateSHA256('/api/orders/search', $queries, $app_secret);

        $data = array(
            'page_size' => 20
        );
        $url = 'https://open-api.tiktokglobalshop.com/api/orders/search?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

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
        $data = $response['data']['order_list'];
        if (!empty($data)) {
            foreach ($data as $row) {
                $getdetail = $this->get_detail($row['order_id']);
                $detail = $getdetail['data']['order_list'][0];
                $gettrack = $this->get_tracker($row['order_id']);
                $track = @$gettrack['data']['tracking_info_list'][0];
                $check = OrderTiktok::where('tiktok_order_id', $row['order_id'])->first();
                $paid_time = (@$detail['paid_time']) ? date('Y-m-d h:i:s', $detail['paid_time'] / 1000) : '';
                if (empty($check)) {
                    $insert = OrderTiktok::create([
                        'tiktok_order_id'  => $row['order_id'],
                        'buyer_uid' => @$detail['buyer_uid'],
                        'create_time' => @$detail['create_time'],
                        'delivery_option' => @$detail['delivery_option'],
                        'delivery_option_description' => @$detail['delivery_option_description'],
                        'fulfillment_type' => @$detail['fulfillment_type'],
                        'is_cod'  => @$detail['is_cod'],
                        'paid_time'  => @$paid_time,
                        'payment_method'  => @$detail['payment_method'],
                        'payment_method_name'  => @$detail['payment_method_name'],
                        'shipping_provider'  => @$detail['shipping_provider'],
                        'tracking_number'  => @$detail['tracking_number'],
                        'warehouse_id'  => @$detail['warehouse_id'],
                        'total_amount' => @$detail['payment_info']['total_amount'],
                        'shipping_fee' => @$detail['payment_info']['shipping_fee'],
                        'order_status' => $this->getOrderStatus($detail['order_status']),
                        'full_address' => @$detail['recipient_address']['full_address'],
                        'city' => @$detail['recipient_address']['city'],
                        'district' => @$detail['recipient_address']['district'],
                        'region' => @$detail['recipient_address']['region'],
                        'state' => @$detail['recipient_address']['state'],
                        'town' => @$detail['recipient_address']['town'],
                        'zipcode' => @$detail['recipient_address']['zipcode'],
                        'buyer_name' => @$detail['recipient_address']['name'],
                        'buyer_phone' => @$detail['recipient_address']['phone'],
                    ]);

                    foreach ($detail['item_list'] as $item) {
                        $insertItem = OrderItemTiktok::create([
                            'tiktok_order_id'  => $row['order_id'],
                            'product_id' => $item['product_id'],
                            'product_name' => $item['product_name'],
                            'quantity' => $item['quantity'],
                            'seller_sku' => $item['seller_sku'],
                            'sku_id' => $item['sku_id'],
                            'sku_original_price'  => $item['sku_original_price'],
                            'sku_platform_discount'  => $item['sku_platform_discount'],
                            'sku_platform_discount_total'  => $item['sku_platform_discount_total'],
                            'sku_sale_price'  => $item['sku_sale_price'],
                        ]);
                    }
                    if (!empty($track)) {
                        foreach ($track['tracking_info'] as $trc) {
                            $insertItem = OrderTracker::create([
                                'tiktok_order_id'  => $row['order_id'],
                                'description' => $trc['description'],
                                'update_time' => $trc['update_time']
                            ]);
                        }
                    }
                }
            }
        }
        return $response;
    }

    public function get_detail($id)
    {
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'shop_id' => '');
        $sign = generateSHA256('/api/orders/detail/query', $queries, $app_secret);

        $data = array(
            'order_id_list' => [$id]
        );
        $url = 'https://open-api.tiktokglobalshop.com/api/orders/detail/query?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

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

        curl_close($curl);

        $response = json_decode($json_response, true);

        return $response;
    }

    public function getOrderStatus($status)
    {
        switch ($status) {
            case 100:
                return 'UNPAID';
                break;
            case 105:
                return 'ON_HOLD';
                break;
            case 111:
                return 'AWAITING_SHIPMENT';
                break;
            case 112:
                return 'AWAITING_COLLECTION';
                break;
            case 114:
                return 'PARTIALLY_SHIPPING';
                break;
            case 121:
                return 'IN_TRANSIT';
                break;
            case 122:
                return 'DELIVERED';
                break;
            case 130:
                return 'COMPLETED';
                break;
            case 140:
                return 'CANCELLED';
                break;
            default:
                return '-';
                break;
        }
    }

    public function get_tracker($id)
    {
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'order_id' => $id, 'shop_id' => '');
        $sign = generateSHA256('/api/logistics/ship/get', $queries, $app_secret);
        $url = 'https://open-api.tiktokglobalshop.com/api/logistics/ship/get?access_token=' . $access_token . '&app_key=' . $app_key . '&order_id=' . $id . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array("Content-type: application/json; charset=utf-8")
        );
        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        $response = json_decode($json_response, true);

        return $response;
    }

    public function printInvoice(Request $request)
    {
        $selected =  $request->transaction_id;
        $urls = [];
        foreach ($selected as $value) {
            $urls[] = route('invoice.print.tiktok', $value);
        }

        print_invoice($urls);
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mencetak invoice',
            'data' => $urls
        ]);
    }

    public function printLabel(Request $request)
    {
        $selected =  $request->transaction_id;
        $urls = [];
        foreach ($selected as $value) {
            $order = OrderTiktok::find($value);

            $urls[] = $order->label_url;
            $warehouse = Warehouse::where('warehouse_tiktok_id', $order->warehouse_id)->first();
            if ($warehouse) {
                foreach ($warehouse->users as $key => $user) {
                    if ($user->role == 'mitra') {
                        createNotification(
                            'PRINTLABELMITRA',
                            [
                                'user_id' => $user->id
                            ],
                            [
                                'order_id' => $order->id,
                                'name' => $user->name,
                                'label_url' =>  $order->label_url
                            ],
                            ['brand_id' => 8]
                        );
                    }
                }
            }
        }

        print_invoice($urls);
        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mencetak label',
            'data' => $urls
        ]);
    }
}
