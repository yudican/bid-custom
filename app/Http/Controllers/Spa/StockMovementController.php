<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Exports\StockMovementExport;
use App\Models\CompanyAccount;
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
use App\Models\Variant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Pagination\Paginator;

class StockMovementController extends Controller
{
    public function index($purchase_order_id = null)
    {
        return view('spa.spa-index');
    }

    public function listStockMovement(Request $request)
    {
        $search = $request->search;
        $warehouse_id = $request->warehouse_id;
        $sales_channel = $request->sales_channel;
        
        $account_id = $request->account_id;
        $order =  PurchaseOrder::query();

        if ($warehouse_id) {
            $where_warehouse = " and warehouse_id = ".$warehouse_id;
        } else {
            $where_warehouse = "";
        }

        if ($sales_channel) {
            $where_saleschannel = " where sales_channel like '%".$sales_channel."%'";
        } else {
            $where_saleschannel = "";
        }

        $data = DB::select(DB::raw("select v.product_id, pr.sku, v.name as product_name, p.`name` as package_name, b.`name` as brand,
                (SELECT SUM(po.qty) FROM tbl_purchase_order_items po WHERE po.product_id = v.product_id) as begin_stock,
                (SELECT SUM(poi.qty) FROM tbl_purchase_order_items poi LEFT JOIN tbl_purchase_orders po on po.id = poi.purchase_order_id 
                    WHERE po.status = 2 and poi.product_id = v.product_id) as purchase_delivered,
                (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id) as product_return,
                (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.type = 'return-received') as sales_return,
                (SELECT SUM(t.qty) FROM tbl_transaction_details t WHERE t.product_id = v.id) as stock,
                (SELECT SUM(i.qty) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.received_vendor = 1) as return_suplier,
                (SELECT SUM(i.qty) FROM tbl_product_needs i WHERE i.product_id = v.id) as sales,
                (SELECT SUM(i.qty) FROM tbl_inventory_items i LEFT JOIN tbl_inventory_product_stocks ips on i.uid_inventory = ips.uid_inventory 
                    WHERE ips.inventory_type = 'transfer' and i.product_id = v.id".$where_warehouse.") as transfer_out
                FROM tbl_product_variants v 
                left join tbl_packages p on v.package_id = p.id
                left join tbl_products pr on pr.id = v.product_id
                left join tbl_brands b on b.id = pr.brand_id".$where_saleschannel));
       
        if ($search) {
            $order->where(function ($query) use ($search) {
                $query->where('po_number', 'like', "%$search%");
                $query->orWhere('vendor_code', 'like', "%$search%");
                $query->orWhereHas('createdBy', function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%");
                });
            });
        }

        // cek switch account
        if ($account_id) {
            $order->where('company_id', $account_id);
        }

        // $orders = $order->orderBy('created_at', 'desc')->paginate($request->perpage);
        $stocks = new Paginator($data, 10);
        return response()->json([
            'status' => 'success',
            'data' => $stocks,
            'message' => 'List Stock Movement'
        ]);
    }


    public function detailPurchaseOrder($purchase_order_id)
    {
        $order = PurchaseOrder::with(['items', 'billings'])->find($purchase_order_id);

        return response()->json([
            'status' => 'success',
            'data' => $order,
            'message' => 'Detail Purchase Order'
        ]);
    }

    public function savePurchaseOrder(Request $request)
    {
        try {
            DB::beginTransaction();
            $account_id = $request->account_id;
            $company = CompanyAccount::where('status', 1)->first();
            $companyId = $company ? $company->id : null;
            if ($account_id) {
                $companyId = $account_id;
            }

            $data = [
                'po_number'  => $this->generatePoNumber(),
                'vendor_code'  => $request->vendor_code,
                'vendor_name'  => $request->vendor_name,
                'created_by'  => auth()->user()->id,
                'payment_term_id'  => $request->payment_term_id,
                'warehouse_id'  => $request->warehouse_id,
                'warehouse_user_id'  => $request->warehouse_user_id,
                'company_id'  => $request->company_id,
                'currency'  => $request->currency ? $request->currency : 'Rp',
                'notes'  => $request->notes,
                'status'  => $request->status,
                'type_po' => $request->type_po,
                'channel' => $request->channel,
                'company_id' => $companyId
            ];
            $order = PurchaseOrder::create($data);

            if ($request->items && is_array($request->items)) {
                foreach ($request->items as $key => $value) {
                    $datas = [
                        'product_id' => $value['product_id'],
                        'tax_id' => $value['tax_id'],
                        'qty' => $value['qty'],
                        'qty_diterima' => 0,
                        'is_master' => 1,
                    ];

                    if (isset($value['uom'])) {
                        $datas['uom'] = $value['uom'];
                    }

                    if (isset($value['price'])) {
                        $datas['price'] = $value['price'];
                    }

                    $order->items()->create($datas);
                }
            }

            if ($request->status == 5) {
                createNotification(
                    'POCP200',
                    [
                        'user_id' => auth()->user()->id
                    ],
                    [
                        'user' => $order->created_by_name,
                    ],
                    ['brand_id' => 1]
                );
                createNotification(
                    'PORA200',
                    [],
                    [
                        'user_created' => $order->created_by_name,
                        'po_number' => $order->po_number,

                    ],
                    ['brand_id' => 1]
                );
            }


            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Purchase Order Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Purchase Order Gagal Disimpan',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function updatePurchaseOrder(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'vendor_code'  => $request->vendor_code,
                'payment_term_id'  => $request->payment_term_id,
                'warehouse_id'  => $request->warehouse_id,
                'warehouse_user_id'  => $request->warehouse_user_id,
                'currency'  => $request->currency,
                'notes'  => $request->notes,
                'status'  => $request->status,
            ];
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            if ($request->items && is_array($request->items)) {
                foreach ($request->items as $key => $value) {
                    PurchaseOrderItem::updateOrCreate(['id' => $value['id']], [
                        'purchase_order_id' => $purchase_order_id,
                        'product_id' => $value['product_id'],
                        'tax_id' => $value['tax_id'],
                        'qty' => $value['qty'],
                    ]);
                }
            }

            if ($request->status == 5) {
                createNotification(
                    'POCP200',
                    [
                        'user_id' => auth()->user()->id
                    ],
                    [
                        'user' => $row->created_by_name,
                    ],
                    ['brand_id' => 1]
                );
                createNotification(
                    'PORA200',
                    [],
                    [
                        'user_created' => $row->created_by_name,
                        'po_number' => $row->po_number,

                    ],
                    ['brand_id' => 1]
                );
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Purchase Order Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Purchase Order Gagal Disimpan'
            ], 400);
        }
    }

    public function rejectPurchaseOrder(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status'  => 6,
                'rejected_reason'  => $request->reject_reason,
                'rejected_by'  => auth()->user()->id,
            ];
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            createNotification(
                'POA200',
                [
                    'user_id' => $row->user_created
                ],
                [
                    'user' => $row->created_by_name,
                    'user_rejected' => $row->rejected_by_name,
                    'po_number' => $row->po_number,
                    'rejected_reason'  => $request->reject_reason,
                ],
                ['brand_id' => 1]
            );

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

    public function approvePurchaseOrder(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status'  => 1,
                'approved_by'  => auth()->user()->id,
                'stock_opname' => $request->stock_opname ? 1 : 0
            ];
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            createNotification(
                'POA200',
                [
                    'user_id' => $row->user_created
                ],
                [
                    'user' => $row->created_by_name,
                    'user_approved' => $row->approved_by_name,
                    'po_number' => $row->po_number,
                ],
                ['brand_id' => 1]
            );

            createNotification(
                'PORP200',
                [],
                [
                    'po_number' => $row->po_number,
                ],
                ['brand_id' => 1]
            );

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Approve Berhasil'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Approve Gagal'
            ], 400);
        }
    }

    public function assignToWarehouse(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status'  => $request->status
            ];
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            if ($request->stock_opname) {
                foreach ($row->items as $key => $value) {
                    PurchaseOrderStockOpname::updateOrCreate(['purchase_order_id' => $row->id], [
                        'purchase_order_id' => $row->id,
                        'product_id' => $value->product_id,
                        'stock_opname_date' => date('Y-m-d'),
                        'stock_opname_qty' => $value->qty,
                    ]);
                }
            }

            createNotification(
                'PORP200',
                [],
                [
                    'po_number' => $row->po_number,
                ],
                ['brand_id' => 1]
            );

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

    public function addProductItem(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseOrder::find($purchase_order_id);
            $uid_inventory = hash('crc32', Carbon::now()->format('U'));
            if ($row->items()->where('status', 1)->count() == 0) {
                $row->update(['status' => 2, 'received_by' => auth()->user()->id]);
                PurchaseOrderItem::updateOrCreate([
                    'purchase_order_id' => $purchase_order_id,
                    'product_id' => $request->product_id,
                ], [
                    'qty_diterima' => $request->qty_diterima,
                    'status' => 1,
                    'notes' => $request->notes ?? null,
                    'received_number' => $this->generateReceiveNumber($purchase_order_id),
                    'ref' => $uid_inventory,
                ]);
            } else {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchase_order_id,
                    'product_id' => $request->product_id,
                    'qty' => $request->qty,
                    'price' => $request->prices,
                    'tax_id' => $request->tax_id,
                    'uom' => $request->uom,
                    'received_number' => $this->generateReceiveNumber($purchase_order_id),
                    'qty_diterima' => $request->qty_diterima,
                    'status' => 1,
                    'notes' => $request->notes ?? null,
                    'ref' => $uid_inventory,
                ]);
            }

            $data_inventory = [
                'reference_number'  => $row->po_number,
                'warehouse_id'  => $row->warehouse_id,
                'created_by'  => $row->created_by,
                'vendor'  => $row->vendor_code,
                'status'  => 'done',
                'received_date'  => date('Y-m-d'),
                'received_by'  => auth()->user()->id,
                'note'  => 'Penerimaan Barang dari Purchase Order',
                'company_id'  => $row->company_id,
            ];


            $data_inventory['uid_inventory'] = $uid_inventory;
            $inventory = InventoryProductStock::create($data_inventory);

            // stock
            $ref = md5($purchase_order_id . '_' . $request->product_id . '_' . $row->po_number);
            if ($row->type_po == 'product') {
                $data_inventory_item = [
                    'uid_inventory'  => $inventory->uid_inventory,
                    'product_id'  => $request->product_id,
                    'qty'  => $request->qty_diterima,
                    'price'  => $request->price,
                    'subtotal'  => $request->subtotal,
                    'type'  => 'stock',
                    'ref' => $ref
                ];
                InventoryItem::create($data_inventory_item);

                $data_stock = [
                    'uid_inventory'  => $inventory->uid_inventory,
                    'warehouse_id'  => $row->warehouse_id,
                    'product_id'  => $request->product_id,
                    'company_id'  => $row->company_id,
                    // 'product_variant_id'  => $request->product_id,
                    'stock'  => $request->qty_diterima,
                    'ref' => $ref
                ];
                ProductStock::create($data_stock);
            }


            createNotification(
                'PORPA200',
                [],
                [
                    'po_number' => $row->po_number,
                ],
                ['brand_id' => 1]
            );

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Berhasil Disimpan'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Data Gagal Disimpan',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function updateProductItem(Request $request, $purchase_order_items_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'qty_diterima' => $request->qty_diterima,
                'notes' => $request->notes ?? null,
            ];
            $row = PurchaseOrderItem::find($purchase_order_items_id);
            $row->update($data);

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

    public function deleteProductItem(Request $request, $purchase_order_items_id)
    {
        try {
            DB::beginTransaction();
            $row = PurchaseOrderItem::find($purchase_order_items_id);
            $purchase_order_item = PurchaseOrderItem::where('purchase_order_id', $row->purchase_order_id)->whereStatus(1)->count();
            if ($purchase_order_item == 1) {
                $po = PurchaseOrder::where('id', $row->purchase_order_id);
                $po->update(['status' => 1]);

                if ($po->type_po == 'product') {
                    $ref = md5($row->purchase_order_id . '_' . $row->product_id);
                    InventoryItem::whereRef($ref)->delete();
                    ProductStock::whereRef($ref)->delete();
                }
            }
            $row->update(['status' => 0]);

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

    public function invoiceProductItem(Request $request)
    {
        try {
            DB::beginTransaction();
            if ($request->invoice_entry == 1) {
                $due_date = Carbon::now()->addDays($request->item_id[0]);
                $data['vendor_doc_number'] = $request->vendor_doc_number;
                $data['due_date'] = $due_date;
                $data['invoice_entry'] = 1;
                $data['invoice_date'] = $request->invoice_date ?? Carbon::now();

                PurchaseOrderItem::where('uid_invoice', $request->uid_invoice)->update($data);
                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Data Berhasil Disimpan'
                ]);
            }

            $uid_invoice = hash('crc32', Carbon::now()->format('U'));
            foreach ($request->item_id as $key => $value) {

                $row = PurchaseOrderItem::find($value);
                $data = ['invoice_entry' => $request->invoice_entry];
                // insert invoice entry
                if ($request->invoice_entry == 2) {
                    $data['confirm_by'] = auth()->user()->id;
                    $data['invoice_date'] = $request->invoice_date ?? Carbon::now();
                    $data['uid_invoice'] = $uid_invoice;
                }

                // invoiced
                if ($request->invoice_entry == 1) {
                    $due_date = Carbon::now()->addDays($row->purchaseOrder->term_days);
                    $data['vendor_doc_number'] = $request->vendor_doc_number;
                    $data['due_date'] = $due_date;
                }

                // cancel invoice
                if ($request->invoice_entry == 0) {
                    $data['uid_invoice'] = null;
                    $data['invoice_date'] = null;
                }

                $row->update($data);
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

    public function updateStatusPurchaseOrder(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status'  => $request->status
            ];
            if ($request->status == 4) {
                $data['received_by'] = auth()->user()->id;
            }
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            if ($request->status == 4) {
                // update inventory
                $uid_inventory = hash('crc32', Carbon::now()->format('U'));
                $data_inventory = [
                    'uid_inventory'  => $uid_inventory,
                    'reference_number'  => $row->po_number,
                    'warehouse_id'  => $row->warehouse_id,
                    'created_by'  => $row->created_by,
                    'vendor'  => $row->vendor_code,
                    'status'  => 'done',
                    'received_date'  => date('Y-m-d'),
                    'received_by'  => auth()->user()->id,
                    'note'  => 'Penerimaan Barang dari Purchase Order',
                    'company_id'  => $row->company_id,
                ];

                $inventory = InventoryProductStock::create($data_inventory);
                foreach ($row->items as $key => $value) {
                    $price = $value->product->getPrice('member')['final_price'];
                    $data = [
                        'uid_inventory'  => $inventory->uid_inventory,
                        'product_id'  => $value->product_id,
                        'qty'  => $value->qty_diterima,
                        'price'  => $price,
                        'subtotal'  => $value->subtotal,
                        'type'  => 'stock',
                    ];
                    InventoryItem::create($data);
                }

                foreach ($row->items as $key => $value) {
                    $product = ProductVariant::find($value->product_id);
                    $data_stock = [
                        'uid_inventory'  => $inventory->uid_inventory,
                        'warehouse_id'  => $row->warehouse_id,
                        'product_id'  => $product ? $product->product_id : $value->product_id,
                        'product_variant_id'  => $value->product_id,
                        'stock'  => $value->qty_diterima,
                        'company_id'  => $row->company_id,
                    ];
                    ProductStock::create($data_stock);
                }

                createNotification(
                    'PORPA200',
                    [],
                    [
                        'po_number' => $row->po_number,
                    ],
                    ['brand_id' => 1]
                );
            }

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

    public function purchaseOrderComplete(Request $request, $purchase_order_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status'  => 7
            ];
            $row = PurchaseOrder::find($purchase_order_id);
            $row->update($data);

            createNotification(
                'PO200',
                [
                    'user_id' => $row->created_by,
                ],
                [
                    'po_number' => $row->po_number,
                    'user' => $row->created_by_name,
                ],
                ['brand_id' => 1]
            );
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

    public function cancelPurchaseOrder($purchase_order_id)
    {
        $order = PurchaseOrder::find($purchase_order_id);
        $order->update(['status' => 8]);
        return response()->json([
            'status' => 'success',
            'message' => 'Data Purchase Order berhasil dihapus'
        ]);
    }

    // generate po number auto increment with format PO-0001
    public function generatePoNumber()
    {
        $lastPo = PurchaseOrder::whereNotNull('po_number')->orderBy('id', 'desc')->first();
        $number = '0001';
        if ($lastPo) {
            $number = substr($lastPo->po_number, -4);
            $number = (int) $number + 1;
            $number = sprintf("%04d", ((int)$number));
        }
        return 'PO-' . $number;
    }

    // generate receive number auto increment with format PO-0001
    public function generateReceiveNumber($purchase_order_id = null)
    {
        $lastPo = PurchaseOrderItem::whereNotNull('received_number')->orderBy('id', 'desc')->first();
        if ($lastPo) {
            $number = substr($lastPo->received_number, -4);
            $number = (int) $number + 1;
            $number = str_pad($number, 4, '0', STR_PAD_LEFT);
        } else {
            $number = '0001';
        }
        return 'RCV/' . date('Y') . '/' . $number;
    }

    // save billing
    public function billingSave(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'purchase_order_id' => $request->purchase_order_id,
                'created_by' => auth()->user()->id,
                'nama_bank' => $request->nama_bank,
                'no_rekening' => $request->no_rekening,
                'nama_pengirim' => $request->nama_pengirim,
                'jumlah_transfer' => $request->jumlah_transfer,
                'tax_amount' => $request->tax_amount,
                'sumberdana' => $request->sumberdana,
                'no_rekening_sumberdana' => $request->no_rekening_sumberdana,
                'status' => 0
            ];

            if ($request->bukti_transfer) {
                $file = $this->uploadImage($request, 'bukti_transfer');
                $data['bukti_transfer'] = $file;
            }

            PurchaseBilling::create($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Billing Berhasil Disimpan',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Billing Gagal Disimpan',
            ]);
        }
    }

    // billing approve
    public function billingApprove(Request $request, $purchase_billing_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status' => 1,
                'approved_by' => auth()->user()->id,
            ];
            $row = PurchaseBilling::find($purchase_billing_id);
            $row->update($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Billing Berhasil Diapprove',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Billing Gagal Diapprove',
            ]);
        }
    }

    // billing reject
    public function billingReject(Request $request, $purchase_billing_id)
    {
        try {
            DB::beginTransaction();
            $data = [
                'status' => 2,
                'rejected_by' => auth()->user()->id,
            ];
            $row = PurchaseBilling::find($purchase_billing_id);
            $row->update($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Billing Berhasil Direject',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Billing Gagal Direject',
            ]);
        }
    }

    public function uploadImage($request, $path)
    {
        if (!$request->hasFile($path)) {
            return response()->json([
                'error' => true,
                'message' => 'File not found',
                'status_code' => 400,
            ], 400);
        }
        $file = $request->file($path);
        if (!$file->isValid()) {
            return response()->json([
                'error' => true,
                'message' => 'Image file not valid',
                'status_code' => 400,
            ], 400);
        }
        $file = Storage::disk('s3')->put('upload/purchase/billing', $request[$path], 'public');
        return $file;
    }

    public function exportPdf($purchase_order_id = null)
    {
        $purchase = PurchaseOrder::find($purchase_order_id);
        return view('print.po', ['data' =>  $purchase]);
    }

    public function export()
    {
        $data = DB::select(DB::raw("select v.product_id, pr.sku, v.name as product_name, p.`name` as package_name, b.`name` as brand,
        (SELECT SUM(po.qty) FROM tbl_purchase_order_items po WHERE po.product_id = v.product_id) as begin_stock,
        (SELECT SUM(poi.qty) FROM tbl_purchase_order_items poi LEFT JOIN tbl_purchase_orders po on po.id = poi.purchase_order_id 
            WHERE po.status = 2 and poi.product_id = v.product_id) as purchase_delivered,
        (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id) as product_return,
        (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.type = 'return-received') as sales_return,
        (SELECT SUM(t.qty) FROM tbl_transaction_details t WHERE t.product_id = v.id) as stock,
        (SELECT SUM(i.qty) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.received_vendor = 1) as return_suplier,
        (SELECT SUM(i.qty) FROM tbl_product_needs i WHERE i.product_id = v.id) as sales,
        (SELECT SUM(i.qty) FROM tbl_inventory_items i LEFT JOIN tbl_inventory_product_stocks ips on i.uid_inventory = ips.uid_inventory 
            WHERE ips.inventory_type = 'transfer' and i.product_id = v.id) as transfer_out
        FROM tbl_product_variants v 
        left join tbl_packages p on v.package_id = p.id
        left join tbl_products pr on pr.id = v.product_id
        left join tbl_brands b on b.id = pr.brand_id"));

        $product = new Paginator($data, 10);

        $file_name = 'convert/FIS-Stock_Movement-' . date('d-m-Y') . '.xlsx';

        Excel::store(new StockMovementExport($product), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
