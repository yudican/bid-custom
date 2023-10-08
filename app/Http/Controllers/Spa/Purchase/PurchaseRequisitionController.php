<?php

namespace App\Http\Controllers\Spa\Purchase;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryProductStock;
use App\Models\LeadMaster;
use App\Models\ProductNeed;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\PurchaseBilling;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\PurchaseOrderStockOpname;
use App\Models\PurchaseRequitition;
use App\Models\PurchaseRequititionApproval;
use App\Models\PurchaseRequititionItem;
use App\Models\Variant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PurchaseRequisitionController extends Controller
{
    public function index($purchase_requitition_id = null)
    {
        return view('spa.spa-index');
    }

    public function listPurchaseRequitition(Request $request)
    {
        $search = $request->search;
        $status = $request->status;

        $order =  PurchaseRequitition::query();
        if ($search) {
            $order->where(function ($query) use ($search) {
                $query->where('pr_number', 'like', "%$search%");
                $query->orWhere('vendor_code', 'like', "%$search%");
                $query->orWhere('vendor_name', 'like', "%$search%");
                $query->orWhere('project_name', 'like', "%$search%");
                $query->orWhere('request_by_name', 'like', "%$search%");
                $query->orWhere('request_by_email', 'like', "%$search%");
                $query->orWhere('request_by_division', 'like', "%$search%");
            });
        }

        if ($status) {
            $order->whereIn('request_status', $status);
        }


        $orders = $order->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $orders,
            'message' => 'List Purchase Requitition'
        ]);
    }


    public function detailPurchaseRequitition($purchase_requitition_id)
    {
        $order = PurchaseRequitition::with(['items', 'approvalLeads'])->where('uid_requitition', $purchase_requitition_id)->first();

        return response()->json([
            'status' => 'success',
            'data' => $order,
            'message' => 'Detail Purchase Requitition'
        ]);
    }

    public function savePurchaseRequitition(Request $request)
    {
    }

    public function updatePurchaseRequitition(Request $request, $purchase_requitition_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseRequitition::where('uid_requitition', $purchase_requitition_id)->first();
            $row->update([
                'uid_requitition' => hash('crc32', Carbon::now()->format('U')),
                'pr_number' => $this->generatePrNumber(),
                'vendor_code' => $request->vendor_code ?? null,
                'vendor_name' => $request->vendor_name ?? null,
                'brand_id' => $request->brand_id,
                'payment_term_id' => $request->payment_term_id,
                'company_account_id' => $request->company_account_id,
                'received_by' => $request->received_by,
                'received_address' => $request->received_address,
                'project_name' => $request->project_name,
                'request_by_name' => $request->request_by_name,
                'request_by_email' => $request->request_by_email,
                'request_by_division' => $request->request_by_division,
                'request_date' => date('Y-m-d', strtotime($request->request_date)),
                'request_note' => $request->request_note ?? null,
                'request_status' => $request->status ?? 0,
            ]);

            foreach ($request->items as $key => $item) {
                PurchaseRequititionItem::updateOrCreate(['id' => $item['id']], [
                    'purchase_requitition_id' => $row->id,
                    'item_name' => isset($item['item_name']) ? $item['item_name'] : null,
                    'item_qty' => isset($item['item_qty']) ? $item['item_qty'] : null,
                    'item_unit' => isset($item['item_unit']) ? $item['item_unit'] : null,
                    'item_price' => isset($item['item_price']) ? $item['item_price'] : null,
                    'item_tax' => isset($item['item_tax']) ? $item['item_tax'] : null,
                    'item_note' => isset($item['item_note']) ? $item['item_note'] : null,
                ]);
            }

            if ($request->approvals) {
                foreach ($request->approvals as $key => $item) {
                    PurchaseRequititionApproval::updateOrCreate(['purchase_requitition_id' => $row->id], [
                        'purchase_requitition_id' => $row->id,
                        'user_id' => isset($item['user_id']) ? $item['user_id'] : null,
                        'role_id' => isset($item['role_id']) ? $item['role_id'] : null,
                        'status' => 0,
                        'label' => isset($item['label']) ? $item['label'] : null,
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Requisition created successfully',

            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Requisition failed to create',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function rejectPurchaseRequitition(Request $request, $purchase_requitition_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseRequitition::where('uid_requitition', $purchase_requitition_id)->first();
            $row->update([
                'request_status' => $request->status,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Requisition reject successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Requisition failed to reject',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function approvePurchaseRequitition(Request $request, $purchase_requitition_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseRequitition::where('uid_requitition', $purchase_requitition_id)->first();
            $row->update([
                'request_status' => $request->status,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Requisition approve successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Requisition failed to approve',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function purchaseOrderComplete(Request $request, $purchase_requitition_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'request_status'  => 2
            ];
            $row = PurchaseRequitition::find($purchase_requitition_id);
            $row->update($data);


            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Status Berhasil Diupdate'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Status Gagal Diupdate'
            ], 400);
        }
    }

    public function cancelPurchaseRequitition($purchase_requitition_id)
    {
        $order = PurchaseOrder::find($purchase_requitition_id);
        $order->update(['status' => 8]);
        return response()->json([
            'status' => 'success',
            'message' => 'Data Purchase Requitition berhasil dihapus'
        ]);
    }

    // generate receive number auto increment with format PO-0001
    public function generateReceiveNumber($purchase_requitition_id = null)
    {
        $lastPo = PurchaseOrderItem::where('purchase_requitition_id', $purchase_requitition_id)->whereNotNull('received_number')->orderBy('id', 'desc')->first();
        if ($lastPo) {
            $number = substr($lastPo->received_number, -4);
            $number = (int) $number + 1;
            $number = str_pad($number, 4, '0', STR_PAD_LEFT);
        } else {
            $number = '0001';
        }
        return 'RCV/' . date('Y') . '/' . $number;
    }

    public function approvalVerification(Request $request, $approval_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseRequititionApproval::find($approval_id);
            if ($request->status == 1) {
                $row->update(['status' => 1]);
                $purchase_requisiition = PurchaseRequitition::where('uid_requitition', $request->purchase_requisition_id)->where('request_status', 1)->count();
                if ($purchase_requisiition > 1) {
                    sendEmailSingle(
                        'PRAPR200',
                        [
                            'email' => $purchase_requisiition->request_by_email
                        ],
                        [
                            'name' => $purchase_requisiition->request_by_name,
                        ],
                        [
                            'brand_id' => $purchase_requisiition->brand_id
                        ]
                    );
                }
            } else if ($request->status == 2) {
                $row->update(['status' => 2]);
                $purchase_requisiition = PurchaseRequitition::where('uid_requitition', $request->purchase_requisition_id)->first();
                $purchase_requisiition->update(['request_status' => 3]);
                sendEmailSingle(
                    'PRRJCT200',
                    [
                        'email' => $purchase_requisiition->request_by_email
                    ],
                    [
                        'name' => $purchase_requisiition->request_by_name,
                    ],
                    [
                        'brand_id' => $purchase_requisiition->brand_id
                    ]
                );
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Gagal Disimpan'
            ], 400);
        }
    }

    public function exportPdf($purchase_requitition_id = null)
    {
        $purchase = PurchaseRequitition::find($purchase_requitition_id);
        return view('print.pr', ['data' =>  $purchase]);
    }


    // create requisition
    public function createRequitition(Request $request)
    {
        try {
            DB::beginTransaction();

            $requisition = PurchaseRequitition::create([
                'uid_requitition' => hash('crc32', Carbon::now()->format('U')),
                'pr_number' => $this->generatePrNumber(),
                'vendor_code' => $request->vendor_code ?? null,
                'vendor_name' => $request->vendor_name ?? null,
                'brand_id' => $request->brand_id,
                'payment_term_id' => $request->payment_term_id,
                'company_account_id' => $request->company_account_id,
                'received_by' => $request->received_by,
                'received_address' => $request->received_address,
                'project_name' => $request->project_name,
                'request_by_name' => $request->request_by_name,
                'request_by_email' => $request->request_by_email,
                'request_by_division' => $request->request_by_division,
                'request_date' => date('Y-m-d', strtotime($request->request_date)),
                'request_note' => $request->request_note ?? null,
                'request_status' => $request->status ?? 0,
            ]);

            foreach ($request->items as $key => $item) {
                $requisition->items()->create([
                    'item_name' => isset($item['item_name']) ? $item['item_name'] : null,
                    'item_qty' => isset($item['item_qty']) ? $item['item_qty'] : null,
                    'item_unit' => isset($item['item_unit']) ? $item['item_unit'] : null,
                    'item_price' => isset($item['item_price']) ? $item['item_price'] : null,
                    'item_tax' => isset($item['item_tax']) ? $item['item_tax'] : null,
                    'item_note' => isset($item['item_note']) ? $item['item_note'] : null,
                ]);
            }

            if ($request->approvals) {
                foreach ($request->approvals as $key => $item) {
                    $requisition->approvalLeads()->create([
                        'user_id' => isset($item['user_id']) ? $item['user_id'] : null,
                        'role_id' => isset($item['role_id']) ? $item['role_id'] : null,
                        'status' => 0,
                        'label' => isset($item['label']) ? $item['label'] : null,
                    ]);

                    if (isset($item['user_id'])) {
                        createNotification(
                            'PRA200',
                            [
                                'user_id' => $item['user_id']
                            ],
                            [
                                'pr_number' => $requisition->pr_number,
                            ],
                            ['brand_id' => $requisition->brand_id ?? 1]
                        );
                    }
                }
            }

            if ($request->request_by_email) {
                sendEmailSingle(
                    'PR201',
                    [
                        'email' => $request->request_by_email
                    ],
                    [
                        'name' => $request->request_by_name
                    ],
                    [
                        'brand_id' => $request->brand_id
                    ]
                );
            }


            DB::commit();
            return response()->json([
                'message' => 'Requisition created successfully',
                'data' => $requisition
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Requisition failed to create',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    // generate po number auto increment with format PO-0001
    public function generatePrNumber()
    {
        $lastPo = PurchaseRequitition::orderBy('id', 'desc')->first();
        $number = '0001';
        if ($lastPo) {
            $number = substr($lastPo->pr_number, -4);
            $number = (int) $number + 1;
            $number = sprintf("%04d", ((int)$number));
        }
        return 'PR-' . $number;
    }
}
