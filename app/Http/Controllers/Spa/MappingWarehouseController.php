<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\AuthTiktok;
use App\Models\WarehouseTiktok;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class MappingWarehouseController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function list(Request $request)
    {
        $search = $request->search;

        $warehouse =  WarehouseTiktok::query();
        if ($search) {
            $warehouse->where(function ($query) use ($search) {
                $query->where('warehouse_name', 'like', "%$search%");
                $query->orWhere('tiktok_warehouse_id', 'like', "%$search%");
                $query->orWhere('warehouse_status', 'like', "%$search%");
                $query->orWhere('warehouse_sub_type', 'like', "%$search%");
                $query->orWhere('warehouse_type', 'like', "%$search%");
                $query->orWhere('warehouse_city', 'like', "%$search%");
                $query->orWhere('warehouse_contact', 'like', "%$search%");
                $query->orWhere('warehouse_district', 'like', "%$search%");
                $query->orWhere('warehouse_address', 'like', "%$search%");
                $query->orWhere('warehouse_phone', 'like', "%$search%");
                $query->orWhere('warehouse_region', 'like', "%$search%");
                $query->orWhere('warehouse_region_code', 'like', "%$search%");
                $query->orWhere('warehouse_state', 'like', "%$search%");
                $query->orWhere('warehouse_town', 'like', "%$search%");
                $query->orWhere('warehouse_zipcode', 'like', "%$search%");
                $query->orWhere('status_mapping', 'like', "%$search%");
            });
        }

        $variants = $warehouse->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $variants,
            'message' => 'List Warehouse'
        ]);
    }


    public function detail($id)
    {
        $warehouse = WarehouseTiktok::where('id', $id)->first();

        return response()->json([
            'status' => 'success',
            'data' => $warehouse,
            'message' => 'Detail Warehouse'
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
        $sign = generateSHA256('/api/logistics/get_warehouse_list', $queries, $app_secret);
        $url = 'https://open-api.tiktokglobalshop.com/api/logistics/get_warehouse_list?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

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
        $data = $response['data']['warehouse_list'];
        // echo"<pre>";print_r($data);die();
        if (!empty($data)) {
            foreach ($data as $row) {
                $check = WarehouseTiktok::where('tiktok_warehouse_id', $row['warehouse_id'])->first();
                $warehouse = Warehouse::where('warehouse_tiktok_id', $row['warehouse_id'])->first();
                if (empty($check)) {
                    $insert = WarehouseTiktok::create([
                        'tiktok_warehouse_id'  => $row['warehouse_id'],
                        'warehouse_name' => $row['warehouse_name'],
                        'warehouse_status' => $row['warehouse_status'],
                        'warehouse_sub_type' => $row['warehouse_sub_type'],
                        'warehouse_type' => $row['warehouse_type'],
                        'is_default' => $row['is_default'],
                        'warehouse_city'  => $row['warehouse_address']['city'],
                        'warehouse_contact'  => $row['warehouse_address']['contact_person'],
                        'warehouse_district'  => $row['warehouse_address']['district'],
                        'warehouse_address'  => $row['warehouse_address']['full_address'],
                        'warehouse_phone'  => $row['warehouse_address']['phone'],
                        'warehouse_region'  => $row['warehouse_address']['region'],
                        'warehouse_region_code'  => $row['warehouse_address']['region_code'],
                        'warehouse_state'  => $row['warehouse_address']['state'],
                        'warehouse_town'  => $row['warehouse_address']['town'],
                        'warehouse_zipcode'  => $row['warehouse_address']['zipcode'],
                        'status_mapping' => ($warehouse) ? 'Mapped' : 'Not Mapped'
                    ]);
                } else {
                    $check->status_mapping = ($warehouse) ? 'Mapped' : 'Not Mapped';
                    $check->save();
                }
            }
        }

        return $response;
    }
}
