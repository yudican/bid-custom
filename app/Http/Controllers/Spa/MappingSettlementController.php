<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\AuthTiktok;
use App\Models\SettlementTiktok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Str;

class MappingSettlementController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function list(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $settlement =  SettlementTiktok::query();
        if ($search) {
            $settlement->where(function ($query) use ($search) {
                $query->where('tiket', 'like', "%$search%");
            });
        }

        if ($status) {
            $settlement->where('status', $status);
        }


        $settlements = $settlement->orderBy('id', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $settlements,
            'message' => 'List Settlement'
        ]);
    }

    public function detail($id)
    {
        $settlement = SettlementTiktok::where('id', $id)->first();

        return response()->json([
            'status' => 'success',
            'data' => $settlement,
            'message' => 'Detail Settlement'
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
        $sign = generateSHA256('/api/finance/settlements/search', $queries, $app_secret);

        $data = array(
            'page_size' => 20
        );
        $url = 'https://open-api.tiktokglobalshop.com/api/finance/settlements/search?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

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
        $data = $response['data']['settlement_list'];
        // echo"<pre>";print_r($data);die();
        if (!empty($data)) {
            foreach ($data as $row) {
                $check = SettlementTiktok::where('tiktok_settlement_id', $row['unique_key'])->first();
                if (empty($check)) {
                    $insert = SettlementTiktok::create([
                        'tiktok_settlement_id'  => $row['unique_key'],
                        'order_id' => $row['order_id'],
                        'fee_type' => $row['fee_type'],
                        'currency' => $row['settlement_info']['currency'],
                        'flat_fee' => $row['settlement_info']['flat_fee'],
                        'platform_promotion' => @$row['settlement_info']['platform_promotion'],
                        'sales_fee'  => $row['settlement_info']['sales_fee'],
                        'settlement_amount'  => $row['settlement_info']['settlement_amount'],
                        'settlement_time'  => $row['settlement_info']['settlement_time'],
                        'sfp_service_fee'  => $row['settlement_info']['sfp_service_fee'],
                        'subtotal_after_seller_discounts'  => $row['settlement_info']['subtotal_after_seller_discounts'],
                        'user_pay'  => @$row['settlement_info']['user_pay'],
                        'vat'  => $row['settlement_info']['vat']
                    ]);
                }
            }
        }

        return $response;
    }
}
