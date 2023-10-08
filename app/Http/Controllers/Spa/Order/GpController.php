<?php

namespace App\Http\Controllers\Spa\Order;

use App\Http\Controllers\Controller;
use App\Jobs\SubmitSIGpQueue;
use App\Jobs\TestQueue;
use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\OrderSubmitLog;
use App\Models\OrderSubmitLogDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GpController extends Controller
{
    public function submitIndex($submit_id = null)
    {
        return view('spa.spa-index');
    }

    public function submitGp(Request $request)
    {
        $orders = null;

        switch ($request->type) {
            case 'order-lead':
                $orders = OrderLead::query()->whereIn('uid_lead', $request->ids);
                break;
            case 'order-manual':
                $orders = OrderManual::query()->whereIn('uid_lead', $request->ids)->where('type', 'manual');
                break;

            default:
                $orders = OrderManual::query()->whereIn('uid_lead', $request->ids)->where('type', 'freebies');
                break;
        }

        $data_submit = [];

        foreach ($orders->get() as $key => $value) {
            $data_submit[$value->id]['headers'][] = [
                "SOPTYPE" => 3,
                "DOCDATE" => date('Y-m-d'),
                "CUSTNMBR" => $value->contact_uid,
                "BACHNUMB" => time(),
                "CSTPONBR" => $value->invoice_number,
                "TRDISAMT" => round($value->discount_amount),
                "FREIGHT" => round($value->ongkir),
                "MISCAMNT" => 0
            ];

            foreach ($value->productNeeds as $key => $product) {
                $unit_cost = $product->price_product;
                if ($request->vat_value > 0) {
                    $unit_cost = $product->price_product / $request->vat_value;
                }

                if ($request->tax_value > 0) {
                    $tax = $request->tax_value / 100;
                    $cost = $product->price_product * $tax;
                    $unit_cost += $cost;
                }

                $data_submit[$value->id]['body'][] = [
                    "ITEMNMBR" => $this->convertSku($product->product->sku),
                    "CUSTNMBR" => $value->contact_uid,
                    "SOPTYPE" => 3,
                    "QUANTITY" => $product->qty,
                    "UOFM" => $product->u_of_m,
                    "UNITCOST" => round($unit_cost),
                    "MRKDNAMT" => 0
                ];
            }
        }


        $orderSi = OrderSubmitLog::create([
            'submited_by' => auth()->user()->id,
            'type_si' => $request->type,
            'vat' => $request->vat_value,
            'tax' => $request->tax_value,
        ]);

        $body = [];
        foreach ($data_submit as $key => $value) {
            $body[] = json_encode([
                'header' => $value['headers'],
                'line' => $value['body'],
            ]);
        }

        foreach ($body as $key => $value) {
            TestQueue::dispatch()->onQueue('send-notification');
            SubmitSIGpQueue::dispatch($request->type, $orderSi->id, $value, $request->ids)->onQueue('send-notification');
        }

        return response()->json([
            'message' => 'Data sedang dalam proses submit',
            'status' => 'success'
        ]);
    }

    public function listSubmitGp(Request $request)
    {
        $search = $request->search;
        $type_si = $request->type;

        $orderLead =  OrderSubmitLog::query();
        if ($search) {
            $orderLead->where('type_si', 'like', "%$search%");
            $orderLead->orWhereHas('submitedBy', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
        }
        if ($type_si) {
            $orderLead->whereIn('type_si', $type_si);
        }

        $orderLeads = $orderLead->orderBy('created_at', 'desc')->paginate($request->perpage);

        return response()->json([
            'status' => 'success',
            'data' => $orderLeads
        ]);
    }

    public function listSubmitGpDetail(Request $request, $submit_id)
    {
        $search = $request->search;

        $orderLead =  OrderSubmitLogDetail::query()->where('order_submit_log_id', $submit_id);
        if ($search) {
            $orderLead->where('error_message', 'like', "%$search%");
            $orderLead->orWhereHas('order', function ($query) use ($search) {
                $query->where('invoice_number', 'like', "%$search%");
            });
        }

        $orderLeads = $orderLead->orderBy('created_at', 'desc')->paginate($request->perpage);

        return response()->json([
            'status' => 'success',
            'data' => $orderLeads
        ]);
    }

    public function convertSku($curentSku)
    {
        $skus  = [
            '8997230500863' => '19996230523',
            '8997230500344' => '19996230582',
            '8996293052050' => '8997230500924',
            '8997230500917' => '8997230500917',
            '6293512' => '6293512',
            '89962932831201' => '8996293283120',
            'S0001' => 'S0001',
            '8996293218449' => '8996293218449',
            '8997236237312' => '8997236237312',
            '8997236236834' => '8997236236834',
            '8997236237077' => '8997236237077',
            '8997236237084' => '8997236237084',
            '8996293283126' => '8996293283120',
        ];

        if ($curentSku) {
            if (isset($skus[$curentSku])) {
                return $skus[$curentSku];
            }
            return $curentSku;
        }

        return null;
    }
}
