<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\AddonTiktokOrder;
use App\Models\AgentAddress;
use App\Exports\TiktokExport;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;

class TiktokController extends Controller
{
    public function index($id = null)
    {
        return view('spa.spa-index');
    }

    public function listTiktok(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $addon =  AddonTiktokOrder::query();
        if ($search) {
            $addon->where(function ($query) use ($search) {
                $query->where('order_id', 'like', "%$order_id%");
            });
        }


        $data = $addon->orderBy('id', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $data,
            'message' => 'List Order'
        ]);
    }

    public function getTektokOrder(Request $request)
    {
        $apiKey = 'MJGEFLIUYEGLIEUF3487LKIHO';
        $client = new Client();
        $response = $client->request('POST',  'https://giraffe-v2.aimi.dev/api/tektok/orders?apikey=' . $apiKey, [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode([
                'seller_id' => $request->seller_id,
                'order_id' => $request->order_id,
            ]),
        ]);

        $responseJSON =  json_decode($response->getBody(), true);
        return response()->json($responseJSON);
    }

    public function storeTiktokOrder(Request $request)
    {
        $data = $request->all();
        $addon = AddonTiktokOrder::where('order_id', $data['order_id'])->first();
        if (empty($addon)) {
            $order = new AddonTiktokOrder($data);
            $order->save();
            return response()->json(['message' => 'Order saved successfully'], 201);
        } else {
            return response()->json(['message' => 'Order already exist'], 201);
        }
    }

    public function followUp($id) {
        $addon = AddonTiktokOrder::find($id);
        $addon->status_fu = 1;
        $addon->save();
        return response()->json(['message' => 'Status has been updated'], 201);
    }

    public function export()
    {
        $product = AddonTiktokOrder::query();
        $file_name = 'convert/Tiktok_order-' . date('d-m-Y') . '.xlsx';
        Excel::store(new TiktokExport($product), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Data'
        ]);
    }
}
