<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Exports\ProductTransferExport;
use App\Exports\ProductReceivedExport;
use App\Exports\ProductReturnExport;
use App\Models\CompanyAccount;
use App\Models\InventoryDetailItem;
use App\Models\InventoryItem;
use App\Models\InventoryProductReturn;
use App\Models\InventoryProductStock;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductVariantStock;
use App\Models\PurchaseOrderItem;
use App\Models\StockAllocationHistory;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class InventoryController extends Controller
{
    public function index($inventory_id = null)
    {
        return view('spa.spa-index');
    }

    public function getProductCount()
    {
        $company_account = CompanyAccount::whereStatus(1)->first();
        $data = [
            [
                'title' => 'STOCK PRODUCT RECEIVED',
                'value' => InventoryProductStock::where('inventory_type', 'received')->where('company_id', $company_account->id)->count(),
                'path' => 'inventory-product-stock',
                'color' => '[#FFC120]',
            ],
            [
                'title' => 'STOCK PRODUCT TRANSFER',
                'value' => InventoryProductStock::where('inventory_type', 'transfer')->where('company_id', $company_account->id)->count(),
                'path' => 'inventory-product-transfer',
                'color' => 'blueColor',
            ],
            [
                'title' => 'PRODUK RETURN',
                'value' => InventoryProductReturn::where('company_id', $company_account->id)->count(),
                'path' => 'inventory-product-return',
                'color' => '[#FE8311]',
            ],
        ];
        return response()->json($data);
    }

    public function getInfoCreated()
    {
        return response()->json([
            'created_by_name' => auth()->user()->name,
            'created_on' => date('Y-m-d'),
            'nomor_sr' => $this->generatePrNumber(),
        ]);
    }

    public function inventoryStock(Request $request)
    {
        $search = $request->search;
        $warehouse_id = $request->warehouse_id;
        $status = $request->status;
        $account_id = $request->account_id;
        $inventory =  InventoryProductStock::query()->where('inventory_type', $request->inventory_type);
        if ($search) {
            $inventory->where('status', 'like', "%$search%");
            $inventory->orWhere('reference_number', 'like', "%$search%");
            $inventory->orWhere('vendor', 'like', "%$search%");
            $inventory->orWhereHas('userCreated', function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($warehouse_id) {
            $inventory->where('warehouse_id', $warehouse_id);
        }

        if ($status) {
            $inventory->where('inventory_status', $status);
        }

        // cek switch account
        if ($account_id) {
            $inventory->where('company_id', $account_id);
        }


        $inventories =  $inventory->orderBy('inventory_product_stocks.created_at', 'desc')->paginate($request->perpage);


        return response()->json([
            'status' => 'success',
            'data' => $inventories
        ]);
    }

    public function inventoryStockDetail($inventory_id)
    {
        $inventory = InventoryProductStock::with(['items', 'historyAllocations', 'detailItems'])->where('uid_inventory', $inventory_id)->first();
        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryStockCreate(Request $request)
    {

        $warehouse = Warehouse::find($request->warehouse_id);
        $warehouse_name = 'FLIMTY';
        if ($warehouse) {
            $warehouse_name = strtoupper(str_replace(' ', '-', $warehouse->name));
        }

        $companyId = '';
        if ($request->account_id) {
            $companyId = $request->account_id;
        }

        $inventory = InventoryProductStock::create([
            'uid_inventory' => hash('crc32', Carbon::now()->format('U')),
            'warehouse_id' => $request->warehouse_id,
            'reference_number' => $this->generateRefNumber($warehouse_name),
            'created_by' => auth()->user()->id,
            'vendor' => $request->vendor,
            'status' => $request->status ?? 'draft',
            'received_date' => $request->received_date,
            'note' => $request->note,
            'company_id' => $companyId
        ]);

        foreach ($request->items as $item) {
            $inventory->items()->create([
                'product_id' => $item['product_id'],
                'price' => $item['price'],
                'qty' => $item['qty'],
                'subtotal' => $item['sub_total'],
                'type' => 'stock'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryStockUpdate(Request $request, $inventory_id)
    {
        $inventory = InventoryProductStock::where('uid_inventory', $inventory_id)->first();

        $inventory->update([
            'warehouse_id' => $request->warehouse_id,
            'created_by' => auth()->user()->id,
            'vendor' => $request->vendor,
            'status' => $request->status ?? 'draft',
            'received_date' => $request->received_date,
            'note' => $request->note,
            'company_id'  => $request->account_id,
        ]);

        $inventory->items()->delete();
        foreach ($request->items as $item) {
            $inventory->items()->create([
                'product_id' => $item['product_id'],
                'price' => $item['price'],
                'qty' => $item['qty'],
                'subtotal' => $item['sub_total'],
                'type' => 'stock'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }


    public function inventoryStockCancel(Request $request, $inventory_id)
    {
        $inventory = InventoryProductStock::find($inventory_id);

        $inventory->update([
            'status' => 'ready',
            'inventory_status' => 'canceled',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryStockAllocated(Request $request, $inventory_id)
    {
        try {
            DB::beginTransaction();
            $inventory = InventoryProductStock::where('uid_inventory', $inventory_id)->first();

            foreach ($request->items as $item) {
                $purchase = PurchaseOrderItem::find($item['id']);
                $purchase->update(['is_allocated' => 1]);
                StockAllocationHistory::create([
                    'uid_inventory' => $inventory_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['qty_alocation'],
                    'from_warehouse_id' => $item['from_warehouse_id'],
                    'to_warehouse_id' => $item['to_warehouse_id'],
                    'sku' => $item['sku'],
                    'u_of_m' => $item['u_of_m'],
                    'transfer_date' => date('Y-m-d'),

                ]);

                // update stock variant
                $variants = ProductVariant::where('product_id', $item['product_id'])->get();
                foreach ($variants as $variant) {
                    $qty_bundling = $variant->qty_bundling > 0 ? $variant->qty_bundling : 1;

                    ProductVariantStock::create([
                        'product_variant_id' => $variant->id,
                        'qty' => $item['qty_alocation'],
                        'stock_of_market' => floor($item['qty_alocation'] / $qty_bundling) ?? 0,
                        'warehouse_id' => $item['to_warehouse_id'],
                        'company_id' => $inventory->company_id,
                    ]);
                }


                // update stock
                $currentStock = ProductStock::where([
                    'uid_inventory' => $inventory_id,
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $item['from_warehouse_id']
                ])->first();
                if ($currentStock) {
                    $stock = $currentStock->stock - $item['qty_alocation'];
                    $purchase->increment('qty_alocation', $item['qty_alocation']);
                    if ($stock > 0) {
                        $currentStock->update([
                            'stock' => $stock,
                            'is_allocated' => 1
                        ]);
                        ProductStock::create([
                            'uid_inventory' => $inventory_id,
                            'product_id' => $item['product_id'],
                            'warehouse_id' => $item['to_warehouse_id'],
                            'stock' => $item['qty_alocation'],
                            'is_allocated' => 1,
                            'company_id' => $inventory->company_id,
                        ]);
                    } else {
                        $currentStock->update([
                            'warehouse_id' => $item['to_warehouse_id'],
                            'is_allocated' => 1
                        ]);
                    }
                }
            }

            $inventory->update([
                'inventory_status' => 'alocated',
                'allocated_by' => auth()->user()->id,
            ]);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'data' => $inventory
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Proses Allokasi Gagal'
            ], 400);
        }
    }

    public function inventoryTransferCreate(Request $request)
    {
        try {
            DB::beginTransaction();
            $companyId = '';

            if ($request->account_id) {
                $companyId = $request->account_id;
            }

            $inventory =  InventoryProductStock::where('reference_number', $request->po_number)->first();
            $inventory = InventoryProductStock::create([
                'uid_inventory' => hash('crc32', Carbon::now()->format('U')),
                'allocated_by' => auth()->user()->id,
                'warehouse_id' => $request->warehouse_id,
                'destination_warehouse_id' => $request->to_warehouse_id,
                'product_id' => $request->product_id,
                'reference_number' => $request->po_number,
                'created_by' => $request->created_by,
                'vendor' => $request->vendor,
                'inventory_status' => 'alocated',
                'inventory_type' => 'transfer',
                'status' => 'done',
                'received_date' => date('Y-m-d'),
                'note' => $request->note,
                'company_id' => $companyId
            ]);

            // update stock

            foreach ($request->items as $item) {
                InventoryDetailItem::create([
                    'uid_inventory' => $inventory->uid_inventory,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'qty_alocation' => $item['qty_alocation'],
                    'from_warehouse_id' => $item['from_warehouse_id'],
                    'to_warehouse_id' => $item['to_warehouse_id'],
                    'sku' => $item['sku'],
                    'u_of_m' => $item['u_of_m'],
                ]);


                $qty_alocation = $item['qty_alocation'];
                ProductStock::create([
                    'uid_inventory' => $inventory->uid_inventory,
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $item['to_warehouse_id'],
                    'stock' => $qty_alocation,
                    'is_allocated' => 1,
                    'company_id' => $inventory->company_id,
                ]);

                ProductStock::create([
                    'uid_inventory' => $inventory->uid_inventory,
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $item['from_warehouse_id'],
                    'stock' => -$qty_alocation,
                    'is_allocated' => 1,
                    'company_id' => $inventory->company_id,
                ]);

                // update stock variant
                $variants = ProductVariant::where('product_id', $item['product_id'])->get();
                foreach ($variants as $variant) {
                    ProductVariantStock::where('product_variant_id', $variant->id)->delete();
                    $master_stock = $variant->product->final_stock; // 50
                    $current_stock = $master_stock - $item['qty_alocation']; // 50 - 10 = 40
                    $qty_bundling = $variant->qty_bundling > 0 ? $variant->qty_bundling : 1;

                    ProductVariantStock::updateOrCreate([
                        'product_variant_id' => $variant->id,
                        'warehouse_id' => $item['from_warehouse_id'],
                    ], [
                        'product_variant_id' => $variant->id,
                        'qty' => $current_stock,
                        'warehouse_id' => $item['from_warehouse_id'],
                        'stock_of_market' => floor($current_stock / $qty_bundling) ?? 0,
                        'company_id' => $inventory->company_id,
                    ]);

                    ProductVariantStock::updateOrCreate([
                        'product_variant_id' => $variant->id,
                        'warehouse_id' => $item['to_warehouse_id'],
                    ], [
                        'product_variant_id' => $variant->id,
                        'qty' => $item['qty_alocation'],
                        'warehouse_id' => $item['to_warehouse_id'],
                        'stock_of_market' => floor($item['qty_alocation'] / $qty_bundling) ?? 0,
                        'company_id' => $inventory->company_id,
                    ]);
                }

                $purchase = PurchaseOrderItem::where([
                    'ref' => $inventory->uid_inventory,
                    'product_id' => $item['product_id']
                ])->first();
                if ($purchase) {
                    $purchase->update(['is_allocated' => 1]);
                }
                StockAllocationHistory::create([
                    'uid_inventory' => $inventory->uid_inventory,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['qty_alocation'],
                    'from_warehouse_id' => $item['from_warehouse_id'],
                    'to_warehouse_id' => $item['to_warehouse_id'],
                    'sku' => $item['sku'],
                    'u_of_m' => $item['u_of_m'],
                    'transfer_date' => date('Y-m-d'),
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'data' => $inventory
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Proses alokasi gagal',
                'data' => $th->getMessage()
            ], 400);
        }
    }

    public function inventoryTransferUpdate(Request $request, $inventory_id)
    {
        $inventory = InventoryProductStock::find($inventory_id);
        $inventory->update([
            'uid_inventory' => hash('crc32', Carbon::now()->format('U')),
            'allocated_by' => auth()->user()->id,
            'warehouse_id' => $request->from_warehouse_id,
            'destination_warehouse_id' => $request->to_warehouse_id,
            'reference_number' => $request->po_number,
            'created_by' => $request->created_by,
            'vendor' => $request->vendor,
            'inventory_status' => 'alocated',
            'inventory_type' => 'transfer',
            'status' => 'done',
            'received_date' => date('Y-m-d'),
            'note' => $request->note,
        ]);

        foreach ($request->items as $item) {
            StockAllocationHistory::create([
                'uid_inventory' => $inventory->uid_inventory,
                'product_id' => $item['product_id'],
                'quantity' => $item['qty'],
                'from_warehouse_id' => $item['from_warehouse_id'],
                'to_warehouse_id' => $item['to_warehouse_id'],
                'sku' => $item['sku'],
                'u_of_m' => $item['u_of_m'],
                'transfer_date' => date('Y-m-d'),
            ]);

            ProductStock::where([
                'uid_inventory' => $inventory->uid_inventory,
                'product_variant_id' => $item['product_id']
            ])->update([
                'warehouse_id' => $request['to_warehouse_id'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryStockDelete($inventory_id)
    {
        $inventory = InventoryProductStock::where('uid_inventory', $inventory_id)->first();
        $inventory->items()->delete();
        $inventory->delete();

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }


    // inventory return
    public function inventoryReturn(Request $request)
    {
        $search = $request->search;
        $date = $request->date;
        $account_id = $request->account_id;
        $inventory =  InventoryProductReturn::with(['items', 'warehouse', 'userCreated']);
        if ($search) {
            $inventory->where('status', 'like', "%$search%");
            $inventory->orWhere('vendor', 'like', "%$search%");
            $inventory->orWhereHas('userCreated', function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($date) {
            $inventory->whereBetween('received_date', $date);
        }

        // cek switch account
        if ($account_id) {
            $inventory->where('company_id', $account_id);
        }

        $inventories =  $inventory->orderBy('inventory_product_returns.created_at', 'desc')->paginate($request->perpage);


        return response()->json([
            'status' => 'success',
            'data' => $inventories
        ]);
    }

    public function inventoryReturnDetail($inventory_id)
    {
        $inventory = InventoryProductReturn::with(['items', 'itemPreReceived', 'itemReceived'])->where('uid_inventory', $inventory_id)->first();
        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryReturnCreate(Request $request)
    {
        $companyId = '';
        if ($request->account_id) {
            $companyId = $request->account_id;
        }

        $inventory = InventoryProductReturn::create([
            'uid_inventory' => hash('crc32', Carbon::now()->format('U')),
            'warehouse_id' => $request->warehouse_id,
            'nomor_sr' => $request->nomor_sr,
            'transaction_channel' => $request->transaction_channel,
            'barcode' => $request->barcode,
            'expired_date' => $request->expired_date,
            'company_account_id' => $request->company_account_id,
            'created_by' => auth()->user()->id,
            'vendor' => $request->vendor,
            'status' => 2,
            'received_date' => $request->received_date,
            'note' => $request->note,
            'company_id' => $companyId,
            'case_type' => $request->case_type,
            'case_title' => $request->case_title,
        ]);

        foreach ($request->items as $item) {
            $inventory->items()->create([
                'product_id' => $item['product_id'],
                'price' => 0,
                'qty' => $item['qty_alocation'],
                'subtotal' => 0,
                'type' => 'return',
                'sku' => $item['sku'],
                'u_of_m' => $item['u_of_m'],
                'notes' => $item['notes'] ?? null,
                'is_master' => 1,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryReturnPreReceived(Request $request, $uid_inventory)
    {
        try {
            DB::beginTransaction();
            $inventory = InventoryProductReturn::where('uid_inventory', $uid_inventory)->first();
            // $item = $inventory->items()->where('product_id', $request->product_id)->first();
            $product = ProductVariant::find($request->product_id);
            $inventory->items()->create([
                'product_id' => $request->product_id,
                'price' => 0,
                'qty' => $request->qty,
                'qty_diterima' => $request->qty_diterima,
                'subtotal' => 0,
                'type' => 'return-prcved',
                'sku' => $product->sku,
                'u_of_m' => $product->u_of_m,
                'case_return' => null,
                'notes' => $request->notes ?? null,
                'is_master' => 0,
            ]);


            // $data_stock = [
            //     'uid_inventory'  => $inventory->uid_inventory,
            //     'warehouse_id'  => $inventory->warehouse_id,
            //     'product_id'  => $product->product_id,
            //     'stock'  => -$item->qty,
            //     'ref' => $inventory->uid_inventory,
            //     'company_id' => $inventory->company_id,
            // ];
            // ProductStock::create($data_stock);

            // $variants = ProductVariant::where('product_id', $product->product_id)->get();
            // foreach ($variants as $variant) {
            //     $stock = $variant->stock_of_market - $request->qty_diterima;
            //     if ($stock > 0) {
            //         $data_stock = [
            //             'product_variant_id'  => $variant->id,
            //             'warehouse_id'  => $variant->warehouse_id,
            //             'qty'  => $variant->qty,
            //             'stock_of_market'  => -$stock,
            //             'company_id' => $inventory->company_id,
            //         ];
            //         ProductVariantStock::create($data_stock);
            //     }
            // }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'data' => $inventory
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ]);
        }
    }

    public function updateStatusReceivedVendor(Request $request, $inventory_item_id)
    {
        try {
            DB::beginTransaction();
            $item = InventoryItem::find($inventory_item_id);
            if ($request->received_vendor == 2) {
                $variant = ProductVariant::find($item->product_id);
                $inventory = InventoryProductReturn::where('uid_inventory', $item->uid_inventory)->first();

                $data_stock_1 = [
                    'uid_inventory'  => $item->uid_inventory,
                    'warehouse_id'  => $inventory->warehouse_id,
                    'product_id'  => $variant ? $variant->product_id : $request->product_id,
                    // 'product_variant_id'  => $request->product_id,
                    'stock'  => $request->qty_diterima,
                    'ref' => $item->uid_inventory,
                    'is_allocated' => 1,
                    'company_id' => $inventory->company_id,
                ];
                ProductStock::create($data_stock_1);

                $variants = ProductVariant::where('product_id', $variant->product_id)->get();
                foreach ($variants as $row_variant) {
                    $stock = ProductVariantStock::where('product_variant_id', $row_variant->id)->where('warehouse_id', $inventory->warehouse_id)->first();
                    $qty_bundling = $row_variant->qty_bundling > 0 ? $row_variant->qty_bundling : 1;
                    if ($stock) {
                        $current_qty = $stock->qty + $request->qty_diterima;
                        $data_stock = [
                            'product_variant_id'  => $row_variant->id,
                            'warehouse_id'  => $inventory->warehouse_id,
                            'qty'  =>  $current_qty,
                            'stock_of_market'  => floor($current_qty / $qty_bundling),
                            'company_id' => $inventory->company_id,
                        ];

                        ProductVariantStock::updateOrCreate([
                            'product_variant_id'  => $row_variant->id,
                            'warehouse_id'  => $inventory->warehouse_id,
                            'company_id' => $inventory->company_id,
                        ], $data_stock);
                    }
                }
            }

            $item->update([
                'received_vendor' => $request->received_vendor,
            ]);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Success update status received vendor',

            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed update status received vendor',
                'data' => $th->getMessage()
            ]);
        }
    }

    public function inventoryReturnReceived(Request $request, $uid_inventory)
    {
        try {
            DB::beginTransaction();
            $row = InventoryProductReturn::where('uid_inventory', $uid_inventory)->first();

            $detail = InventoryItem::where('uid_inventory', $uid_inventory)->where('product_id', $request->product_id)->first();
            $variant = ProductVariant::find($request->product_id);

            InventoryItem::create([
                'uid_inventory' => $uid_inventory,
                'product_id' => $request->product_id,
                'qty' => $detail->qty,
                'price' => 0,
                'sku' => $request->sku,
                'u_of_m' => $request->u_of_m,
                'type' => 'return-received',
                'case_return' => $detail->case_return,
                'qty_diterima' => $request->qty_diterima,
                'notes' => $request->notes ?? null,
                'ref' => $uid_inventory,
                'received_number' => $this->generateRecNumber($uid_inventory),
            ]);

            $data_stock_1 = [
                'uid_inventory'  => $uid_inventory,
                'warehouse_id'  => $row->warehouse_id,
                'product_id'  => $variant->product_id,
                'stock'  => -$request->qty_diterima,
                'ref' => $uid_inventory,
                'company_id' => $row->company_id,
                'is_allocated' => 1,
            ];
            ProductStock::create($data_stock_1);

            $variants = ProductVariant::where('product_id', $variant->product_id)->get();
            foreach ($variants as $variant) {
                $stock_variant = ProductVariantStock::where('product_variant_id', $variant->id)->where('warehouse_id', $row->warehouse_id)->first();
                $current_stock = $stock_variant->qty - $request->qty_diterima;
                $qty_bundling = $variant->qty_bundling > 0 ? $variant->qty_bundling : 1;
                $data_stock = [
                    'product_variant_id'  => $variant->id,
                    'warehouse_id'  => $row->warehouse_id,
                    'qty'  => $current_stock,
                    'stock_of_market'  => floor($current_stock / $qty_bundling),
                    'company_id' => $row->company_id,
                ];
                ProductVariantStock::updateOrCreate([
                    'product_variant_id'  => $variant->id,
                    'warehouse_id'  => $row->warehouse_id,
                    'company_id' => $row->company_id,
                ], $data_stock);
            }

            $row->update(['status' => 3]);
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

    public function inventoryReturnUpdate(Request $request, $inventory_id)
    {
        $inventory = InventoryProductReturn::where('uid_inventory', $inventory_id)->first();
        $inventory->update([
            'warehouse_id' => $request->warehouse_id,
            'nomor_sr' => $request->nomor_sr,
            'transaction_channel' => $request->transaction_channel,
            'barcode' => $request->barcode,
            'expired_date' => $request->expired_date,
            'created_by' => auth()->user()->id,
            'vendor' => $request->vendor,
            'status' => $request->status ?? 'draft',
            'received_date' => $request->received_date,
            'note' => $request->note,
        ]);

        $inventory->items()->delete();
        foreach ($request->items as $item) {
            $inventory->items()->create([
                'product_id' => $item['product_id'],
                'price' => $item['price'],
                'qty' => $item['qty'],
                'subtotal' => $item['sub_total'],
                'type' => 'return'
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryReturnDelete($inventory_id)
    {
        $inventory = InventoryProductReturn::where('uid_inventory', $inventory_id)->first();
        $inventory->items()->delete();
        $inventory->delete();

        return response()->json([
            'status' => 'success',
            'data' => $inventory
        ]);
    }

    public function inventoryReturnVerify(Request $request, $inventory_id)
    {
        $inventory = InventoryProductReturn::where('uid_inventory', $inventory_id)->first();
        $inventory->update([
            'status' => $request->status,
            'rejected_reason' => $request->rejected_reason,
        ]);

        if ($request->status == 2) {
            foreach ($inventory->items as $item) {
                // product stock
                $product = ProductVariant::find($item->product_id);
                $data_stock = [
                    'uid_inventory'  => $inventory->uid_inventory,
                    'warehouse_id'  => $inventory->warehouse_id,
                    'product_id'  => $product->product_id,
                    'stock'  => -$item->qty,
                    'ref' => $inventory->uid_inventory,
                    'company_id' => $inventory->company_id,
                    'is_allocated' => 1
                ];
                ProductStock::create($data_stock);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => $request->status == 2 ? 'Inventory Return has been approved' : 'Inventory Return has been rejected',
            'data' => $inventory
        ]);
    }


    public function inventoryReturnComplete(Request $request, $uid_inventory)
    {
        try {
            DB::beginTransaction();
            $row = InventoryProductReturn::where('uid_inventory', $uid_inventory)->first();
            $row->update(['status' => 1]);


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

    private function generateRefNumber($warehouse = 'FLIMTY')
    {
        $data = DB::select("SELECT * FROM `tbl_inventory_product_stocks` order by id desc limit 0,1");
        $count_code = 8;
        $total = count($data);
        if ($total > 0) {
            foreach ($data as $rw) {
                $awal = substr($rw->reference_number, $count_code);
                $next = sprintf("%09d", ((int)$awal + 1));
                $nomor = 'WH/' . $warehouse . '/' . $next;
            }
        } else {
            $nomor = 'WH/' . $warehouse . '/' . '00000001';
        }
        return $nomor;
    }

    private function generateRecNumber($uid_inventory)
    {
        $data = InventoryItem::where('uid_inventory', $uid_inventory)->orderBy('id', 'desc')->first();
        $count_code = 8;
        $nomor = 'REC/' . date('Y') . '/00000001';
        if ($data) {
            $awal = substr($data->received_number, -$count_code);
            $next = sprintf("%08d", ((int)$awal + 1));
            $nomor = 'REC/' . date('Y') . '/' . $next;
        }

        return $nomor;
    }

    private function generatePrNumber()
    {
        $rw = InventoryProductReturn::orderBy('id', 'desc')->limit(1)->first();
        $date = date('m/Y');
        $nomor = 'STCKRTRN/' . $date . '/' . '00001';
        $count_code = 5;
        if ($rw) {
            $awal = substr($rw->nomor_sr, -$count_code);
            $next = sprintf("%05d", ((int)$awal + 1));
            $nomor = 'STCKRTRN/' . $date . '/' . $next;
        }
        return $nomor;
    }

    public function export_transfer()
    {
        $product = InventoryItem::query()->leftjoin('products', 'products.id', 'inventory_items.product_id');

        $file_name = 'convert/FIS-Product_Transfer-' . date('d-m-Y') . '.xlsx';

        Excel::store(new ProductTransferExport($product), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }

    public function export_received()
    {
        $product = InventoryProductStock::query();
        // echo"<pre>";print_r($product->get());die();
        $file_name = 'convert/FIS-Product_Received-' . date('d-m-Y') . '.xlsx';

        Excel::store(new ProductReceivedExport($product), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }

    public function export_return()
    {
        $product = InventoryProductStock::query();

        $file_name = 'convert/FIS-Product_Return-' . date('d-m-Y') . '.xlsx';

        Excel::store(new ProductReturnExport($product), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
