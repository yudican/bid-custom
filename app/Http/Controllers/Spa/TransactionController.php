<?php

namespace App\Http\Controllers\Spa;

use App\Http\Controllers\Controller;
use App\Models\AddressUser;
use App\Models\Kecamatan;
use App\Models\LogApproveFinance;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use App\Models\TransactionDeliveryStatus;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TransactionController extends Controller
{
    public function index($transaction_id = null)
    {
        return view('spa.spa-index');
    }

    public function listTransaction(Request $request)
    {
        $search = $request->search;
        $created_at = $request->created_at;
        $status = $request->status;
        $status_delivery = $request->status_delivery;
        $payment_method = $request->payment_method;
        $type = $request->type;
        $user = auth()->user();
        $role = $user->role;
        $stage = $request->stage;
        $transaction = $this->getTransaction($type);
        if ($search) {
            $transaction->where('order_number', 'like', "%$search%");
            $transaction->orWhereHas('contactUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
            $transaction->orWhereHas('salesUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
            $transaction->orWhereHas('createUser', function ($query) use ($search) {
                $query->where('users.name', 'like', "%$search%");
            });
        }

        // stage
        // stage 1 - Waiting for payment
        if ($stage === 'waiting-payment') {
            $transaction->where('status', 1);
        }

        // stage 2 - Waiting for confirmation
        if ($stage === 'waiting-confirmation') {
            $transaction->where('status', 2);
        }

        // stage 3 - Payment confirmed
        if ($stage === 'confirm-payment') {
            $transaction->where('status', 3);
        }

        // stage 4 - On Process
        if ($stage === 'on-process') {
            $transaction->where('status', 7)->where('status_delivery', 1);
        }

        // stage 5 - Ready to ship
        if ($stage === 'ready-to-ship') {
            $transaction->whereIn('status', [3, 7])->where('status_delivery', 21);
        }

        // stage 6 - On Delivery
        if ($stage === 'on-delivery') {
            $transaction->where('status_delivery', 3);
        }

        // stage 7 - Delivered
        if ($stage === 'delivered') {
            $transaction->where('status_delivery', 4)->where('status', 7);
        }

        // stage 8 - Cancelled
        if ($stage === 'cancelled') {
            $transaction->where('status', 4);
        }

        // end stage
        if (in_array($role->role_type, ['mitra', 'subagent'])) {
            $transaction->where('user_id', $user->id);
        }

        if ($payment_method) {
            $transaction->whereIn('payment_method_id', $payment_method);
        }

        if ($status) {
            $transaction->whereIn('status', $status);
        }

        if ($status_delivery) {
            $transaction->whereIn('status_delivery', $status_delivery);
        }

        if ($created_at) {
            $transaction->whereBetween('created_at', $created_at);
        }

        $transactions = $transaction->orderBy('created_at', 'desc')->paginate($request->perpage);

        return response()->json([
            'status' => 'success',
            'data' => $transactions
        ]);
    }

    public function getTransactionDetail($transaction_id)
    {

        $transaction = Transaction::with([
            'confirmPayment',
            'transactionDetail',
            'transactionDetail.productVariant',
            'addressUser',
            'logs',
            'shippingType',
            'shipperWarehouse',
        ])->find($transaction_id);

        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ]);
    }

    public function getTransactionDetailAgent($transaction_id)
    {
        $transaction = TransactionAgent::with([
            'confirmPayment',
            'transactionDetail',
            'addressUser',
            'logs',
            'shippingType',
            'shipperWarehouse'
        ])->find($transaction_id);

        return response()->json([
            'status' => 'success',
            'data' => $transaction
        ]);
    }

    public function printInvoice(Request $request)
    {
        $selected =  $request->transaction_id;
        $urls = [];
        $segment = $request->type == 'mitra' ? '.agent' : '';
        foreach ($selected as $value) {
            $urls[] = route('invoice.print' . $segment, $value);
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
        $transactions = $this->getTransaction($request->type)->whereIn('id', $request->transaction_id)->get();
        $labels = [];
        foreach ($transactions as $key => $transaction) {
            if ($transaction->label) {
                LogApproveFinance::create(['user_id' => auth()->user()->id, 'transaction_id' => $transaction->id, 'keterangan' => 'Cetak Label']);
                $transaction->label->update(['status' => 1]);
                $labels[] = [
                    'filename' => 'LABEL-' . $transaction->id_transaksi . '.pdf',
                    'url' => $transaction->label->label_url,
                ];
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mencetak label',
            'data' => $labels
        ]);
    }

    public function readyToShip(Request $request)
    {
        if (count($request->transaction_id) > 0) {
            $transactions = $this->getTransaction($request->type)->whereIn('id', $request->transaction_id)->get();
            $data = [];
            foreach ($transactions as $key => $transaction) {
                $data[] = [
                    'client_order_no' => $transaction->id_transaksi,
                    'pickup_time' => strtotime(Carbon::now()->addDays(1)),
                ];
                $transaction->update(['status_delivery' => 21]);
                TransactionDeliveryStatus::create([
                    'id_transaksi' => $transaction->id_transaksi,
                    'delivery_status' => 21,
                ]);
            }

            $client = new Client();
            try {
                $response = $client->request('POST', getSetting('POPAKET_BASE_URL') . '/shipment/v1/orders/generate-bulk-awb', [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer ' . getSetting('POPAKET_TOKEN')
                    ],
                    'body' => json_encode($data)
                ]);

                $responseJSON = json_decode($response->getBody(), true);
                if (isset($responseJSON['status']) && $responseJSON['status'] == 'success') {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Berhasil mengubah status menjadi siap dikirim',
                        'data' => $responseJSON
                    ]);
                }
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal mengubah status menjadi siap dikirim',
                    'data' => []
                ], 400);
            }
        }
    }

    public function trackOrder(Request $request)
    {
        $client = new Client();
        $token = getSetting('POPAKET_TOKEN');
        try {
            $response = $client->request('GET', getSetting('POPAKET_BASE_URL') . "/shipment/v1/orders/{$request->id_transaksi}/track", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token
                ],
            ]);
            $responseJSON = json_decode($response->getBody(), true);
            if (isset($responseJSON['status']) && $responseJSON['status'] == 'success') {
                return response()->json([
                    'status' => 'success',
                    'data' => $responseJSON['tracking_history']
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Data tidak ditemukan',
                'data' => []
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data',
            ], 400);
        }
    }

    static function getTransaction($type)
    {
        if ($type === 'mitra') {
            return TransactionAgent::query();
        }

        return Transaction::query();
    }

    public function createNewOrder(Request $request)
    {
        $trans_id = 'INV-1-' . rand(1323, 9999) . date('-dmY-') . date('Hi');

        try {
            DB::beginTransaction();

            $user_id = $request->user_id;
            if (!$user_id) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'telepon' => $request->phone,
                    'password' => Hash::make('admin123'),
                    'created_by' => auth()->user()->id,
                    'sales_channel' => 'e-store',
                    'uid' => $this->generateCustomerCode(),
                ]);

                $user_id = $user->id;
                $role = Role::find('0feb7d3a-90c0-42b9-be3f-63757088cb9a');
                $user->brands()->sync($request->brand_id);
                $user->teams()->sync(1, ['role' => $role->role_type]);
                $user->roles()->sync('0feb7d3a-90c0-42b9-be3f-63757088cb9a');
            }

            $transaction_data = [
                'user_id' => $user_id,
                'id_transaksi' => $trans_id,
                'amount_to_pay' => $request->total_harga,
                'nominal' => $request->total_harga,
                'brand_id' => 1,
                'product_id' => 18,
                'note' => 18,
                'company_id' => $request->company_id,
                'status' => 0,
                'status_delivery' => 0,
                'user_create' => auth()->user()->id,
                'expire_payment' => Carbon::now()->addDays(1),
            ];

            // create address
            $kecamatan = Kecamatan::find($request->kecamatan_id);
            $result_id = explode('/', $kecamatan->result_id);

            AddressUser::where('user_id', $user_id)->update(['is_default' => 0]);
            $address = AddressUser::create([
                'type' => '-',
                'nama' => $request->name,
                'telepon' => $request->phone,
                'user_id' => $user_id,
                'alamat' => null,
                'kelurahan_id' => isset($result_id[0]) ? $result_id[0] : 0,
                'kecamatan_id' => isset($result_id[1]) ? $result_id[1] : 0,
                'kabupaten_id' => isset($result_id[2]) ? $result_id[2] : 0,
                'provinsi_id' => isset($result_id[3]) ? $result_id[3] : 0,
                'kodepos' => isset($result_id[4]) ? $result_id[4] : 0,
                'is_default' => 1,
            ]);

            $transaction_data['address_user_id'] = $address->id;

            $transaction = Transaction::create($transaction_data);

            foreach ($request->products as $key => $product) {
                $transaction->transactionDetail()->create([
                    'transaction_id' => $transaction->id,
                    'invoice_id' => $trans_id,
                    'product_id' => $product['product_id'],
                    'product_variant_id' => $product['id'],
                    'qty' => $product['qty'],
                    'price' => $product['price']['final_price'],
                    'subtotal' => $product['price']['final_price'] * $product['qty'],
                    'status' => 1,
                ]);
            }

            // send notification
            if ($transaction) {
                createNotification(
                    'TRANS20',
                    [
                        'user_id' => $transaction->user_id
                    ],
                    [
                        'user' => $transaction->salesUser?->name ?? '-',
                        'invoice' => $transaction->id_transaksi,
                    ],
                    ['brand_id' => $transaction->brand_id]
                );
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil membuat order',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat order',
            ], 400);
        }
    }

    public function confirmation(Request $request)
    {
        $transaction = Transaction::find($request->id_transaksi);
        $data = ['status' => 1];

        $transaction->update($data);

        // send notification
        if ($transaction) {
            createNotification(
                'TRANS21',
                [
                    'user_id' => $transaction->user_id
                ],
                [
                    'user' => $transaction->salesUser?->name ?? '-',
                    'invoice' => $transaction->id_transaksi,
                ],
                ['brand_id' => $transaction->brand_id]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mengubah status link',
        ]);
    }

    public function updateStatusLink(Request $request)
    {
        $transaction = Transaction::find($request->id_transaksi);
        $expired = $request->status_link == 1 ? Carbon::now()->addDays(1) : $request->expire_payment;
        $data = ['status_link' => $request->status_link, 'expire_payment' => $expired];

        if ($request->status_link == 1) {
            $data['status'] = 0;
            $data['status_delivery'] = 0;
        } else {
            $data['status'] = 4;
        }

        $transaction->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil mengubah status link',
        ]);
    }

    // generate invoice MAG-001 auto increment
    public function generateCustomerCode()
    {
        $lastInvoice = User::orderBy('id', 'desc')->whereNotNull('uid')->where('uid', 'like', "%MAG%")->first();
        $lastInvoice = $lastInvoice ? $lastInvoice->invoice_id : 'MAG-000';
        $lastInvoice = explode('-', $lastInvoice);
        $lastInvoice = (int) $lastInvoice[1];
        $lastInvoice = $lastInvoice + 1;
        $lastInvoice = str_pad($lastInvoice, 3, '0', STR_PAD_LEFT);
        $lastInvoice = 'MAG-' . $lastInvoice;

        return $lastInvoice;
    }
}
