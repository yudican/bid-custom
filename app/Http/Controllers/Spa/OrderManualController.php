<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Exports\OrderManualExport;
use App\Exports\OrderManualDetailExport;
use App\Http\Controllers\Spa\Order\GpController;
use App\Jobs\SaveReminderActivity;
use App\Models\AddressUser;
use App\Models\Brand;
use App\Models\CompanyAccount;
use App\Models\InventoryItem;
use App\Models\LeadBilling;
use App\Models\LeadReminder;
use App\Models\OrderDeposit;
use App\Models\OrderManual;
use App\Models\OrderShipping;
use App\Models\Product;
use App\Models\ProductNeed;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductVariantStock;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class OrderManualController extends GpController
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
        $type = $request->type;
        $payment_term = $request->payment_term;
        $print_status = $request->print_status;
        $resi_status = $request->resi_status;

        $orderLead =  OrderManual::query();
        
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

        if ($type) {
            $orderLead->where('type', $type);
        }
        
        if ($print_status) {
            $orderLead->where('print_status', $print_status);
        }

        if ($resi_status) {
            $orderLead->where('resi_status', $resi_status);
        }
        
        if ($payment_term) {
            $orderLead->whereIn('payment_term', $payment_term);
        }

        if ($role == 'sales') {
            $orderLead->where('user_created', $user->id)->orWhere('sales', $user->id);
        }
        
        // cek switch account
        if ($account_id) {
            $orderLead->where('company_id', $account_id);
        }

        $orderLeads = $orderLead->orderBy('created_at', 'desc')->paginate($request->perpage);
        
        return response()->json([
            'status' => 'success',
            'data' => $orderLeads
        ]);
    }

    public function detailOrderLead($uid_lead)
    {
        $orderLead =  OrderManual::with([
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
                'si' => route('print.so', $uid_lead),
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
        try {
            DB::beginTransaction();
            $orderLead = OrderManual::where('uid_lead', $request->uid_lead)->first();
            $main = AddressUser::where('user_id', $orderLead->contact)->where('is_default', 1)->first();
            if (empty($main)) {
                $main = AddressUser::where('user_id', $orderLead->contact)->first();
            }

            $data = [
                'address_id'  => $main ? $main->id : null,
                'shipping_type'  => 1,
                'courier' => $request->courier
            ];

            $orderLead->update($data);
            $courier = User::find($request->courier);
            createNotification(
                'AGOD200',
                [
                    'user_id' => $orderLead->sales
                ],
                [
                    'user' => $orderLead->salesUser?->name ?? '-',
                    'order_number' => $orderLead->order_number,
                    'title_order' => $orderLead->title,
                    'created_on' => $orderLead->created_at,
                    'contact' => $orderLead->contactUser?->name ?? '-',
                    'assign_by' => auth()->user()->name,
                    'status' => 'Dikirim',
                    'courier_name' => $courier ? $courier->name : '-',
                    'receiver_name' => $main ? $main->nama : '-',
                    'shipping_address' => $main ? $main->alamat_detail : '-',
                    'detail_product' => detailProductOrder($orderLead->productNeeds),
                ],
                ['brand_id' => $orderLead->brand_id]
            );
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengubah kurir'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengubah kurir',
                'trace' => $th->getMessage()
            ], 400);
        }
    }

    public function assignWarehouse($uid_lead, $response = true)
    {
        DB::beginTransaction();
        try {
            $data = ['status'  => 2];

            $row = OrderManual::where('uid_lead', $uid_lead)->first();

            if ($row) {
                $due_date = Carbon::now()->format('Y-m-d');
                if ($row->paymentTerm) {
                    $due_date = Carbon::now()->addDays($row->paymentTerm->days_of)->format('Y-m-d');
                    $data['due_date'] = $due_date;
                }
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
                createNotification(
                    'NORD200',
                    [],
                    [],
                    ['brand_id' => $row->brand_id]
                );

                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Assign Warehouse Success',
                ]);
            }
            if ($response) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Assign Warehouse Gagal',
                ], 400);
            }
        } catch (\Throwable $th) {
            DB::rollback();
            if ($response) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Assign Warehouse Gagal',
                ], 400);
            }
        }
    }

    public function getListBilling($uid_lead)
    {
        $data = LeadBilling::where('uid_lead', $uid_lead)->get();
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
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


            $row = OrderManual::where('uid_lead', $request->uid_lead)->first();

            if ($row) {
                createNotification(
                    'BILL20',
                    [
                        // 'user_id' => $row->sales
                    ],
                    [
                        'order_number' => $row->order_number,
                        'name' => $row->salesUser?->name ?? '-',
                        'submit_by' => auth()->user()->name,
                        'account_name' => $request->account_name,
                        'account_bank' => $request->account_bank,
                        'total_transfer' => $request->total_transfer,
                        'transfer_date' => $request->transfer_date,
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

    public function setDelivery(Request $request)
    {
        DB::beginTransaction();
        try {
            $row = OrderManual::where('uid_lead', $request->uid_lead)->first();
            if ($row) {
                $data = ['status_pengiriman'  => $request->status];
                if ($request->status == 1) {
                    // $item = ProductNeed::where('uid_lead', $request->uid_lead)->get();
                    //pengurangan stock
                    // foreach ($item as $it) {
                    //     $prod = ProductStock::where('warehouse_id', $row->warehouse_id)->where('product_variant_id', $it->product_id)->first();
                    //     $prod->update(['stock' => $prod->stock - $it->qty]);
                    // }

                    $data = ['status_pengiriman'  => $request->status];
                }
                $row->update($data);

                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Set Delivery Success',
                ]);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Set Delivery Gagal',
            ], 400);
        } catch (\Throwable $th) {
            // throw $th;
            DB::rollback();
            return response()->json([
                'status' => 'success',
                'message' => 'Set Delivery Gagal',
            ], 400);
        }
    }

    public function billingVerify(Request $request)
    {
        try {
            DB::beginTransaction();

            $billing = LeadBilling::find($request->id);

            if ($billing) {
                $billing->update(['status' => $request->status, 'notes' => $request->notes, 'approved_by' => auth()->user()->id, 'approved_at' => date('Y-m-d H:i:s'), 'payment_number'  => $this->generatePaymentNumber($billing->uid_lead)]);

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
                                'order_type' => 'manual',
                                'contact' => $billing->orderManual->contact,
                            ]);
                        }
                    } else {
                        if ($request->billing_approved > 0) {
                            $amount_total = $request->billing_approved + $billing->total_transfer - $request->amount;
                            OrderDeposit::create([
                                'uid_lead' => $billing->uid_lead,
                                'amount' => $amount_total,
                                'order_type' => 'manual',
                                'contact' => $billing->orderLead->contact,
                            ]);
                        }
                    }
                }

                if ($billing->total_transfer > $request->amount) {
                    OrderDeposit::create([
                        'uid_lead' => $billing->uid_lead,
                        'amount' => $billing->total_transfer - $request->amount,
                        'order_type' => 'manual',
                        'contact' => $billing->orderManual->contact,
                    ]);
                }

                // send notification
                $row = OrderManual::where('uid_lead', $billing->uid_lead)->first();
                if ($row) {
                    $notification_code = $request->status == 1 ? 'AGOACC200' : 'AGODC200';
                    createNotification(
                        $notification_code,
                        [
                            'user_id' => $row->sales
                        ],
                        [
                            'user' => $row->salesUser?->name,
                            'order_number' => $row->order_number,
                            'title_order' => $row->title,
                            'created_on' => $row->created_at,
                            'contact' => $row->contactUser?->name,
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
            $row = OrderManual::where('uid_lead', $uid_lead)->first();
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

        $row = OrderManual::where('uid_lead', $uid_lead);
        $row->update($data);

        // $row2 = LeadBilling::where('uid_lead', $uid_lead)->where('status', null)->get();
        // foreach ($row2 as $key => $value) {
        //     $value->update(['payment_number'  => $this->generatePaymentNumber($key + 1)]);
        // }

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
            'message' => 'Reminder Berhasil Disimpan',
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


    public function saveOrderManual(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $role_type = $user->role->role_type;
            $role = 'SA';
            $brand = Brand::find($request->brand_id);
            $brand =  $brand ? strtoupper($brand->name) : 'FLIMTY';
            $sales = $request->sales;
            $account_id = $request->account_id;
            if (in_array($role_type, ['adminsales', 'superadmin'])) {
                $role = 'AD';
            }

            $company = CompanyAccount::where('status', 1)->first();
            $companyId = $company ? $company->id : null;

            if ($role_type == 'sales') {
                $sales = auth()->user()->id;
            }

            $data = [
                'brand_id'  => $request->brand_id,
                'contact'  => $request->contact,
                // 'title'  => $this->generateTitle($brand, $role),
                'sales'  => $sales,
                'payment_term'  => $request->payment_terms,
                'customer_need'  => $request->customer_need,
                'status'  => $request->status,
                'user_created' => auth()->user()->id,
                'warehouse_id' => $request->warehouse_id,
                'type_customer' => $request->type_customer,
                'type' => $request->type,
                'company_id' => $account_id ?? $companyId,
            ];

            $uid_lead = $request->uid_lead;
            $order = OrderManual::where('uid_lead', $uid_lead)->first();
            if ($order->status < 0) {
                $kode_unik = $request->kode_unik ?? $this->getUniqueCodeLead();
                //$uid_lead = hash('crc32', Carbon::now()->format('U'));
                //$data['uid_lead'] = hash('crc32', Carbon::now()->format('U'));
                $data['title'] = $this->generateTitle($brand, $role);
                $data['order_number'] = $this->generateOrderNo();
                $data['invoice_number'] = $this->generateInvoiceNo();
                $data['kode_unik'] = $kode_unik;
                $data['temp_kode_unik'] = $kode_unik;
            }

            if ($request->status == 2) {
                $warehouse = User::whereHas('roles', function ($q) {
                    return $q->where('role_type', 'warehouse');
                })->first();
                $main = AddressUser::where('user_id', $request->contact)->where('is_default', 1)->first();
                if (empty($main)) {
                    $main = AddressUser::where('user_id', $request->contact)->first();
                }
                $data['address_id'] = $main ? $main->id : null;
                $data['shipping_type'] = 1;
                $data['courier'] = $warehouse ? $warehouse->id : null;
            }

            // if ($request->product_items && is_array($request->product_items)) {
            //     foreach ($request->product_items as $key => $value) {
            //         ProductNeed::updateOrCreate(['id' => $value['id']], [
            //             'price' => $value['price_nego'],
            //             'user_updated' => Auth::user()->id,
            //         ]);
            //     }
            // }

            $order = OrderManual::updateOrCreate(['uid_lead'  => $uid_lead], $data);
            $user = User::find($sales);
            if ($request->status > 0) {
                createNotification(
                    'ANL200',
                    [
                        'user_id' => $sales
                    ],
                    [
                        'sales' => $user->name,
                        'assign_by' => auth()->user()->name,
                        'lead_title' => $this->generateTitle($brand, $role),
                        'date_assign' => $order->created_at,
                        'due_date' => $order->created_at->addDays(1),
                        'contact' => $order->contact_name_only,
                        'company' => $order->company_name,
                        'status_lead' => getStatusOrderLead($order->status),
                    ],
                    ['brand_id' => $request->brand_id]
                );
            }

            if ($request->status == 2) {
                $this->assignWarehouse($uid_lead, false);
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data berhasil disimpan',
                'data' => $order
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function selectProductItems(Request $request)
    {
        $data = ['uid_lead' => $request->uid_lead];

        if ($request->item_id) {
            $data['id'] = $request->item_id;
        }
        $price = $request->price_nego ?? $request->final_price;
        // $product = ProductVariant::where('id', $request->product_id)->first();
        // if ($product) {
        //     $price = $product->price['final_price'];
        // }
        ProductNeed::updateOrCreate($data, [
            'uid_lead' => $request->uid_lead,
            'product_id' => $request->product_id,
            'qty' => $request->qty,
            'price' => $request->discount_id ? 0 : $price,
            'discount_id' => $request->discount_id,
            'tax_id' => $request->tax_id,
            'user_updated' => Auth::user()->id,
            'status' => 9,
            'price_type' => 'product'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product berhasil ditambahkan',
            'product' => null
        ]);
    }

    public function addProductItem(Request $request)
    {
        $product_need = $request->all();
        $product_need['user_created'] = Auth::user()->id;
        $product_need['user_updated'] = Auth::user()->id;
        // $product_need['price_type'] = 'manual';
        ProductNeed::create($product_need);
        $retur = OrderManual::where('uid_lead', $request->uid_lead)->first();

        if ($request->newData) {
            OrderManual::updateOrCreate(['uid_lead' => $request->uid_lead], [
                'uid_lead' => $request->uid_lead,
                'status' => $retur ? $retur->status : -1,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Product berhasil ditambahkan'
        ]);
    }

    public function deleteProductItem(Request $request)
    {
        ProductNeed::find($request->item_id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product berhasil dihapus'
        ]);
    }

    public function addQty(Request $request)
    {
        $item = ProductNeed::find($request->item_id);
        if ($item->qty) {
            $item->increment('qty');
        }
        return response()->json([
            'status' => 'success',
            'data' => $item->product
        ]);
    }

    public function removeQty(Request $request)
    {
        $item = ProductNeed::find($request->item_id);
        if ($item->qty > 1) {
            $item->decrement('qty');
        }
        return response()->json([
            'status' => 'success',
        ]);
    }

    private function generateTitle($brand = 'FLIMTY', $role)
    {
        $date = date('m/Y');
        $brand = strtoupper(str_replace(' ', '-', $brand));
        $title = 'SO/' . $brand . '/' . $role . '-' . $date;
        $data = DB::select("SELECT * FROM `tbl_order_manuals` where title like '%$title%' order by id desc limit 0,1");
        $count_code = 8 + strlen($brand) + strlen($role) + strlen($date);
        $total = count($data);
        if ($total > 0) {
            foreach ($data as $rw) {
                $awal = substr($rw->title, $count_code);
                $next = sprintf("%03d", ((int)$awal + 1));
                $nomor = 'SO/' . $brand . '/' . $role . '-' . $date . '/' . $next;
            }
        } else {
            $nomor = 'SO/' . $brand . '/' . $role . '-' . $date . '/' . '001';
        }
        return $nomor;
    }

    private function generateOrderNo()
    {
        $year = date('Y');
        $order_number = 'SO/' . $year . '/';
        $data = DB::select("SELECT * FROM `tbl_order_manuals` where order_number like '%$order_number%' order by id desc limit 0,1");
        $count_code = 8 + strlen($year);
        $total = count($data);
        if ($total > 0) {
            foreach ($data as $rw) {
                $awal = substr($rw->order_number, $count_code);
                $next = sprintf("%09d", ((int)$awal + 1));
                $nomor = 'SO/' . $year . '/' . $next;
            }
        } else {
            $nomor = 'SO/' . $year . '/' . '000000001';
        }
        return $nomor;
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

    private function generateInvoiceNo()
    {
        $year = date('Y');
        $invoice_number = 'SI/' . $year . '/';
        $data = DB::select("SELECT * FROM `tbl_order_manuals` where invoice_number like '%$invoice_number%' order by id desc limit 0,1");
        $count_code = 8 + strlen($year);
        $total = count($data);
        if ($total > 0) {
            foreach ($data as $rw) {
                $awal = substr($rw->invoice_number, $count_code);
                $next = sprintf("%09d", ((int)$awal + 1));
                $nomor = 'SI/' . $year . '/' . $next;
            }
        } else {
            $nomor = 'SI/' . $year . '/' . '000000001';
        }
        return $nomor;
    }

    public function getUidLead()
    {
        $uid_lead = hash('crc32', Carbon::now()->format('U'));
        OrderManual::create([
            'uid_lead' => $uid_lead,
            'status' => -1,
        ]);
        return response()->json([
            'status' => 'success',
            'data' => $uid_lead
        ]);
    }

    public function getProductNeed($uid_lead)
    {
        $product_need = ProductNeed::with('product')->where('uid_lead', $uid_lead)->get();

        return response()->json([
            'status' => 'success',
            'data' => $product_need
        ]);
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
                'order_type' => 'manual',
                'created_by' => auth()->user()->id,
            ];

            $items = $request->items;
            if (is_array($items) && count($items) > 0) {
                $files = [];
                foreach ($items as $key => $item) {
                    $file = Storage::disk('s3')->put('upload/attachment', $item, 'public');
                    $files[] = $file;
                }

                $data['attachment'] = implode(',', $files);
            }

            OrderShipping::updateOrCreate(['uid_lead' => $request->uid_lead], $data);
            $row = OrderManual::where('uid_lead', $request->uid_lead)->first();
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
            $row = OrderManual::where('uid_lead', $request->uid_lead)->first();
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
            $row = OrderManual::where('uid_lead', $uid_lead)->first();
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

    // get unique code 3 digit max 500 with auto increment
    private function getUniqueCodeLead($field = 'temp_kode_unik', $prefix = null)
    {
        $data = OrderManual::whereDate('created_at', date('Y-m-d'))->select($field)->orderBy('id', 'desc')->limit(1)->first();
        if ($data) {
            if ($data->$field == 500) {
                $nomor = $prefix . '001';
            } else {
                $awal = substr($data->$field, 3);
                $next = sprintf("%03d", ((int)$awal + 1));
                $nomor = $prefix . $next;
            }
        } else {
            $nomor = $prefix . '001';
        }
        return $nomor;
    }

    public function export()
    {
        $company_account = CompanyAccount::whereStatus(1)->first();
        $account_id = $company_account->id;

        $orderManual = OrderManual::query();
        if ($account_id) {
            $orderManual->where('company_id', $account_id);
        }

        $file_name = 'convert/FIS-Order_Manual-' . date('d-m-Y') . '.xlsx';

        Excel::store(new OrderManualExport($account_id), $file_name, 's3', null, [
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
        $file_name = 'convert/FIS-Order_Manual-' . date('d-m-Y') . '.xlsx';

        Excel::store(new OrderManualDetailExport($uid), $file_name, 's3', null, [
            'visibility' => 'public',
        ]);
        return response()->json([
            'status' => 'success',
            'data' => Storage::disk('s3')->url($file_name),
            'message' => 'List Convert'
        ]);
    }
}
