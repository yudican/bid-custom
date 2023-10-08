<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Exports\OrderLeadExport;
use App\Exports\OrderLeadDetailExport;
use App\Http\Controllers\Spa\Order\GpController;
use App\Jobs\SaveReminderActivity;
use App\Models\InventoryItem;
use App\Models\LeadBilling;
use App\Models\LeadReminder;
use App\Models\OrderDeposit;
use App\Models\OrderLead;
use App\Models\OrderShipping;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductVariantStock;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class OrderLeadController extends GpController
{
    public function index($uid_lead = null)
    {
        return view('spa.spa-index');
    }

    public function listOrderLead(Request $request)
    {
        $search = $request->search;
        $contact = $request->contact;
        $sales = $request->sales;
        $created_at = $request->created_at;
        $status = $request->status;
        $user = auth()->user();
        $role = $user->role->role_type;
        $account_id = $request->account_id;
        $payment_term = $request->payment_term;
        $print_status = $request->print_status;
        $resi_status = $request->resi_status;
        $orderLead =  OrderLead::query();
        if ($search) {
            $orderLead->where('order_number', 'like', "%$search%");
            $orderLead->orWhereHas('contactUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
            $orderLead->orWhereHas('salesUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
            $orderLead->orWhereHas('createUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
        }
        if ($contact) {
            $orderLead->whereIn('contact', $contact);
        }

        if ($sales) {
            $orderLead->whereIn('sales', $sales);
        }

        if ($status) {
            $orderLead->whereIn('status', $status);
        }

        if ($created_at) {
            $orderLead->whereBetween('created_at', $created_at);
        }

        if ($payment_term) {
            $orderLead->whereIn('payment_term', $payment_term);
        }

        // cek switch account
        if ($account_id) {
            $orderLead->where('company_id', $account_id);
        }

        if ($print_status) {
            $orderLead->where('print_status', $print_status);
        }

        if ($resi_status) {
            $orderLead->where('resi_status', $resi_status);
        }

        if ($role == 'sales') {
            $orderLead->where('user_created', $user->id)->orWhere('sales', $user->id);
        }


        $orderLeads = $orderLead->orderBy('created_at', 'desc')->paginate($request->perpage);
        return response()->json([
            'status' => 'success',
            'data' => $orderLeads
        ]);
    }

    public function detailOrderLead($uid_lead)
    {
        $orderLead =  OrderLead::with([
            'billings',
            'reminders',
            // 'reminders.userContact',
            'contactUser',
            'salesUser',
            'addressUser',
            'createUser',
            'courierUser',
            'brand',
            'leadActivities',
            'negotiations',
            'warehouse',
            'paymentTerm',
            'productNeeds',
            'productNeeds.product',
            'contactUser.company',
            'contactUser.addressUsers',
            'orderShipping'
        ])->where('uid_lead', $uid_lead)->first();

        return response()->json([
            'status' => 'success',
            'data' => $orderLead,
            'print' => [
                'si' => route('print.si', $uid_lead),
                'so' => route('print.so', $uid_lead),
                'sj' => route('print.sj', $uid_lead),
            ]
        ]);
    }

    // service
    public function getUserContact(Request $request)
    {
        $user = User::where('name', 'like', '%' . $request->search . '%')->whereHas('roles', function ($query) {
            return $query->where('role_type', '!=', 'superadmin');
        })->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }



    public function getUserSales(Request $request)
    {
        $user = User::where('name', 'like', '%' . $request->search . '%')->whereHas('roles', function ($query) {
            return $query->where('role_type', 'sales');
        })->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function changeCourier(Request $request)
    {
        $orderLead = OrderLead::where('uid_lead', $request->uid_lead)->first();
        $orderLead->courier = $request->courier;
        $orderLead->save();

        return response()->json([
            'status' => 'success',
            'data' => $orderLead
        ]);
    }

    public function assignWarehouse($uid_lead)
    {
        DB::beginTransaction();
        try {
            $data = ['status'  => 2];

            $row = OrderLead::where('uid_lead', $uid_lead)->first();
            if ($row) {
                $row->update($data);
                foreach ($row->productNeeds as $key => $value) {
                    $this->updateStock($value, $row->warehouse_id);
                }
                createNotification(
                    'AGOP200',
                    [
                        'user_id' => $row->sales
                    ],
                    [
                        'user' => $row->salesUser->name,
                        'order_number' => $row->order_number,
                        'title_order' => $row->title,
                        'created_on' => $row->created_at,
                        'contact' => $row->contactUser->name,
                        'assign_by' => auth()->user()->name,
                        'status' => 'Diproses Gudang',
                        'courier_name' => '-',
                        'receiver_name' => '-',
                        'shipping_address' => '-',
                        'detail_product' => detailProductOrder($row->productNeeds),
                    ],
                    ['brand_id' => $row->brand_id]
                );
                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Assign Warehouse Success',
                ]);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Assign Warehouse Gagal',
            ], 400);
        } catch (\Throwable $th) {
            throw $th;
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Assign Warehouse Gagal',
            ], 400);
        }
    }

    public function billing(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'uid_lead' => $request->uid_lead,
                'account_name' => $request->account_name,
                'account_bank' => $request->account_bank,
                'total_transfer' => $request->total_transfer,
                'transfer_date' => $request->transfer_date,
                'status' => 0,
            ];
            if ($request->upload_billing_photo) {
                $file = $this->uploadImage($request, 'upload_billing_photo');
                $data['upload_billing_photo'] = $file;
            }

            if ($request->upload_transfer_photo) {
                $file = $this->uploadImage($request, 'upload_transfer_photo');
                $data['upload_transfer_photo'] = $file;
            }

            LeadBilling::create($data);

            // send notification
            $row = OrderLead::where('uid_lead', $request->uid_lead)->first();
            if ($row) {
                createNotification(
                    'BILL21',
                    [
                        'user_id' => $row->sales
                    ],
                    [
                        'user' => $row->salesUser?->name ?? '-',
                        'order_number' => $order_number,
                        'title_order' => $row->title,
                        'created_on' => $row->created_at,
                        'contact' => $row->contactUser?->name ?? '-',
                        'assign_by' => auth()->user()->name,
                        'status' => 'Qualified',
                        'courier_name' => '-',
                        'receiver_name' => '-',
                        'shipping_address' => '-',
                    ],
                    ['brand_id' => $row->brand_id]
                );
            }

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

    public function billingVerify(Request $request)
    {
        try {
            DB::beginTransaction();

            $billing = LeadBilling::find($request->id);

            if ($billing) {

                $billing->update(['status' => $request->status, 'notes' => $request->notes, 'approved_by' => auth()->user()->id, 'approved_at' => date('Y-m-d H:i:s'), 'payment_number' => $this->generatePaymentNumber($billing->uid_lead)]);

                if ($request->status == 1) {
                    if ($billing->total_transfer < $request->amount) {
                        if ($request->deposite > 0) {
                            $amount = $request->deposite + $billing->total_transfer;
                            $final_amount = $amount - $request->amount;
                            $amount_total  = $final_amount - $request->deposite;
                            LeadBilling::create([
                                'uid_lead' => $billing->uid_lead,
                                'account_name' => '-',
                                'account_bank' => '-',
                                'total_transfer' => $amount_total > 0 ? $amount_total : $request->deposite,
                                'transfer_date' => date('Y-m-d'),
                                'status' => 1,
                                'upload_billing_photo' => null,
                                'upload_transfer_photo' => null,
                                'notes' => 'Deposite',
                                'approved_by' => $billing->approved_by,
                                'approved_at' => date('Y-m-d H:i:s'),
                            ]);

                            OrderDeposit::create([
                                'uid_lead' => $billing->uid_lead,
                                'amount' => $amount_total > 0 ? -$amount_total : -$request->deposite,
                                'order_type' => 'lead',
                                'contact' => $billing->orderLead->contact,
                            ]);
                        } else {
                            if ($request->billing_approved > 0) {
                                $amount_total = $request->billing_approved + $billing->total_transfer - $request->amount;
                                OrderDeposit::create([
                                    'uid_lead' => $billing->uid_lead,
                                    'amount' => $amount_total,
                                    'order_type' => 'lead',
                                    'contact' => $billing->orderLead->contact,
                                ]);
                            }
                        }
                    }



                    if ($billing->total_transfer > $request->amount) {
                        OrderDeposit::create([
                            'uid_lead' => $billing->uid_lead,
                            'amount' => $billing->total_transfer - $request->amount,
                            'order_type' => 'lead',
                            'contact' => $billing->orderLead->contact,
                        ]);
                    }
                }

                // send notification
                $row = OrderLead::where('uid_lead', $billing->uid_lead)->first();
                if ($row) {
                    $notification_code = $request->status == 1 ? 'AGOACC200' : 'AGODC200';
                    createNotification(
                        $notification_code,
                        [
                            'user_id' => $row->sales
                        ],
                        [
                            'user' => $row->salesUser->name,
                            'order_number' => $row->order_number,
                            'title_order' => $row->title,
                            'created_on' => $row->created_at,
                            'contact' => $row->contactUser->name,
                            'assign_by' => auth()->user()->name,
                            'status' => 'Dikirim',
                            'courier_name' => $row->courierUser ? $row->courierUser->name : '-',
                            'receiver_name' => $row->addressUser ? $row->addressUser->nama : '-',
                            'shipping_address' => $row->addressUser ? $row->addressUser->alamat_detail : '-',
                            'detail_product' => detailProductOrder($row->productNeeds),
                        ],
                        ['brand_id' => $row->brand_id]
                    );
                }

                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Billing Berhasil Diupdate',
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Billing Gagal Diupdate',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Billing Gagal Diupdate',
            ], 400);
        }
    }

    public function cancel($uid_lead)
    {
        try {
            DB::beginTransaction();
            $row = OrderLead::where('uid_lead', $uid_lead)->first();
            $row->update(['status' => 4]);
            createNotification(
                'AGOC200',
                [
                    'user_id' => $row->sales
                ],
                [
                    'user' => $row->salesUser->name,
                    'order_number' => $row->order_number,
                    'title_order' => $row->title,
                    'created_on' => $row->created_at,
                    'contact' => $row->contactUser->name,
                    'assign_by' => auth()->user()->name,
                    'status' => 'Order Dibatalkan',
                    'courier_name' => $row->courierUser ? $row->courierUser->name : '-',
                    'receiver_name' => $row->addressUser ? $row->addressUser->nama : '-',
                    'shipping_address' => $row->addressUser ? $row->addressUser->alamat_detail : '-',
                    'detail_product' => detailProductOrder($row->productNeeds),
                ],
                ['brand_id' => $row->brand_id]
            );
            DB::commit();
            return response()->json([
                'status' => 'error',
                'message' => 'Order Berhasil Dibatalkan',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Order Gagal Dibatalkan',
            ]);
        }
    }

    public function setClosed($uid_lead)
    {
        $data = ['status'  => 3];

        $row = OrderLead::where('uid_lead', $uid_lead);
        $row->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Order Berhasil Ditutup',
        ]);
    }

    // reminders
    public function saveReminder(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'uid_lead' => $request->uid_lead,
                'contact' => $request->contact,
                'before_7_day' => false,
                'before_3_day' => false,
                'before_1_day' => false,
                'after_7_day' => false,
            ];
            LeadReminder::create($data);
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Reminder Berhasil Disimpan',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Reminder Gagal Disimpan',
            ]);
        }
    }

    public function updateReminder(Request $request)
    {
        SaveReminderActivity::dispatch($request->all())->onQueue('send-notification');
        return response()->json([
            'status' => 'success',
            'message' => 'Reminder Berhasil Diupdate',
        ]);
    }

    public function deleteReminder($reminder_id)
    {
        try {
            DB::beginTransaction();
            LeadReminder::find($reminder_id)->delete();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Reminder Berhasil Dihapus',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Reminder Gagal Dihapus',
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
        $file = Storage::disk('s3')->put('upload/user', $request[$path], 'public');
        return $file;
    }

    public function updateStock($trans, $warehouse_id)
    {
        try {
            DB::beginTransaction();
            $product = ProductVariant::find($trans->product_id);
            $stockInventories = ProductStock::where('warehouse_id', $warehouse_id)->where('product_id', $product->product_id)->where('stock', '>', 0)->orderBy('created_at', 'asc')->get();
            $product_variants = ProductVariant::where('product_id', $product->product_id)->get();
            foreach ($product_variants as $key => $variant) {
                $variant_stocks = ProductVariantStock::where('warehouse_id', $warehouse_id)->where('product_variant_id', $variant->id)->where('qty', '>', 0)->orderBy('created_at', 'asc')->get();
                $qty = $variant->qty_bundling * $trans->qty;
                foreach ($variant_stocks as $key => $stock) {
                    $stok = $stock->qty;
                    $temp = $stok - $qty;
                    $temp = $temp < 0 ? 0 : $temp;
                    $stock_of_market = $stock->stock_of_market - $trans->qty;
                    $stock_of_market = $stock_of_market < 0 ? 0 : $stock_of_market;
                    if ($temp >= 0) {
                        $stock->update(['qty' => $temp, 'stock_of_market' => $stock_of_market]);
                    } else {
                        $stock->update(['qty' => 0, 'stock_of_market' => 0]);
                        $qty = $qty - $stok;
                    }
                }
            }

            $qty_master = $trans->qty;
            foreach ($stockInventories as $key => $stock_master) {
                $stok_master = $stock_master->stock;
                $temp_master = $stok_master - $qty_master;
                if ($temp_master >= 0) {
                    $stock_master->update(['stock' => $temp_master]);
                } else {
                    $stock_master->update(['stock' => 0]);
                    $qty_master = $qty_master - $stok_master;
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
        }
    }

    public function saveOrderShipping(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = [
                'uid_lead' => $request->uid_lead,
                'sender_name' => $request->sender_name,
                'sender_phone' => $request->sender_phone,
                'resi' => $request->resi,
                'expedition_name' => $request->expedition_name,
                'order_type' => 'lead',
                'created_by' => auth()->user()->id,
            ];

            $items = $request->items;
            $files = [];
            foreach ($items as $key => $item) {
                $file = Storage::disk('s3')->put('upload/attachment', $item, 'public');
                $files[] = $file;
            }

            $data['attachment'] = implode(',', $files);

            OrderShipping::updateOrCreate(['uid_lead' => $request->uid_lead], $data);
            $row = OrderLead::where('uid_lead', $request->uid_lead)->first();
            $row->update(['resi_status' => 'done']);
            if ($row) {
                createNotification(
                    'SOR200',
                    [
                        'user_id' => $row->sales
                    ],
                    [
                        'name' => $row->salesUser?->name ?? '-',
                        'submit_by' => auth()->user()->name,
                        'sender_name' => $request->sender_name,
                        'sender_phone' => $request->sender_phone,
                        'resi' => $request->resi,
                        'expedition_name' => $request->expedition_name,
                    ],
                    ['brand_id' => $row->brand_id]
                );
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Pengiriman Berhasil Disimpan',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Pengiriman Gagal Disimpan',
                'error' => $th->getMessage()
            ], 400);
        }
    }

    public function deleteUniqueCode(Request $request)
    {
        try {
            DB::beginTransaction();
            $row = OrderLead::where('uid_lead', $request->uid_lead)->first();
            if ($row) {
                $row->update(['kode_unik' => $request->kode_unik]);
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Kode Unik Berhasil Di',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Kode Unik Gagal Di',
            ]);
        }
    }

    // update ongkos kirim
    public function updateOngkosKirim(Request $request, $uid_lead)
    {
        try {
            DB::beginTransaction();
            $row = OrderLead::where('uid_lead', $uid_lead)->first();
            if ($row) {
                $row->update(['ongkir' => $request->ongkir]);
            }
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Ongkos Kirim Berhasil Diupdate',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Ongkos Kirim Gagal Diupdate',
            ]);
        }
    }

    private function generatePaymentNumber($uid_lead)
    {
        $lastPo = LeadBilling::whereNotNull('payment_number')->orderBy('id', 'desc')->first();
        $number = '0001';
        if ($lastPo) {
            $number = substr($lastPo->payment_number, -4);
            $number = sprintf("%04d", ((int)$number + 1));
        }
        return 'PAY/' . date('Y') . '/' . $number;
    }

    public function export()
    {
        $orderLead = OrderLead::query();

        $file_name = 'convert/FIS-Order_Lead-' . date('d-m-Y') . '.xlsx';

        Excel::store(new OrderLeadExport($orderLead), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }

    public function exportDetail($uid)
    {
        $orderLead = OrderLead::query();

        $file_name = 'convert/FIS-Order_Lead-' . date('d-m-Y') . '.xlsx';

        Excel::store(new OrderLeadDetailExport($uid), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
