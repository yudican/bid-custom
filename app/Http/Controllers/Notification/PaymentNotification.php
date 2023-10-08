<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Jobs\CreateOrderPopaket;
use App\Models\InventoryItem;
use App\Models\LogError;
use App\Models\LogThirdPayment;
use App\Models\MasterPoint;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductVariantStock;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use App\Models\TransactionStatus;
use App\Models\UserPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentNotification extends Controller
{
    // midtrans payment notification
    public function notifications(Request $notif)
    {
        $transaction = $notif->transaction_status;
        $fraud = $notif->fraud_status;
        $transaction_data = Transaction::where('id_transaksi', $notif->order_id)->first();
        $transaction_data_agent = TransactionAgent::where('id_transaksi', $notif->order_id)->first();
        if ($transaction_data_agent) {
            $transaction_data = $transaction_data_agent;
        }
        $resi = null;
        if (in_array($transaction, ['capture', 'settlement'])) {
            if ($fraud == 'challenge') {
                try {
                    DB::beginTransaction();
                    $this->logPayment($notif, $transaction_data->id);
                    // TODO Set payment status in merchant's database to 'challenge'
                    if ($transaction_data) {
                        $transaction_data->update(['status' => 3]);
                        $notification_data = [
                            'name' => $transaction_data->user->name,
                            'rincian_bayar' => getRincianPembayaran($transaction_data),
                            'rincian_transaksi' => getRincianTransaksi($transaction_data),
                        ];
                        TransactionStatus::create([
                            'id_transaksi' => $notif->order_id,
                            'status' => 3,
                        ]);
                        CreateOrderPopaket::dispatch($transaction_data)->onQueue('send-notification');
                        createNotification('TRS200', ['user_id' => $transaction_data->user->id, 'other_id' => $transaction_data->id], $notification_data, ['transaction_id' => $transaction_data->id]);
                        $masterPoint = MasterPoint::limit(1)->get();

                        foreach ($masterPoint as $point) {
                            if ($point->type == 'transaction') {
                                if ($transaction_data->nominal >= $point->min_trans && $transaction_data->nominal <= $point->max_trans) {
                                    UserPoint::create([
                                        'user_id' => $transaction_data->user_id,
                                        'point' => $point->point
                                    ]);
                                }
                            } else {
                                UserPoint::create([
                                    'user_id' => $transaction_data->user_id,
                                    'point' => $transaction_data->transactionDetail->count() * $point->point
                                ]);
                            }
                        }

                        foreach ($transaction_data->transactionDetail as $trans) {
                            if ($trans->product) {
                                // $trans->product()->update(['stock' => $trans->product->stock - $trans->qty]);

                                $this->updateStock($trans, $transaction_data->warehouse_id);
                                // $stock = ProductStock::where('product_id', $trans->product_id);
                                // if ($trans->product_variant_id) {
                                //     $stock = ProductStock::where('product_variant_id', $trans->product_variant_id);
                                // }

                                // $product_stock = $stock->where('warehouse_id', $transaction_data->warehouse_id)->first();
                                // if ($product_stock) {
                                //     $product_stock->update(['stock' => $product_stock->stock - $trans->qty]);
                                // }
                            }
                        }
                    }
                    DB::commit();
                    $respon = [
                        'status' => true,
                        'status_code' => 200,
                        'data' => $resi
                    ];
                    return response()->json($respon, 200);
                } catch (\Throwable $th) {
                    DB::rollback();
                    $respon = [
                        'status' => true,
                        'status_code' => 400,
                        'message' => $th->getMessage(),
                    ];
                    LogError::updateOrCreate(['id' => 1], [
                        'message' => $th->getMessage(),
                        'trace' => $th->getTraceAsString(),
                        'action' => 'transactionNotificationaccept',
                    ]);
                    return response()->json($respon, 200);
                }
            } else if ($fraud == 'accept') {
                try {
                    DB::beginTransaction();
                    $this->logPayment($notif, $transaction_data->id);
                    if ($transaction_data) {
                        $transaction_data->update(['status' => 3]);
                        TransactionStatus::create([
                            'id_transaksi' => $notif->order_id,
                            'status' => 3,
                        ]);
                        CreateOrderPopaket::dispatch($transaction_data)->onQueue('send-notification');
                        $notification_data = [
                            'name' => $transaction_data->user->name,
                            'rincian_bayar' => getRincianPembayaran($transaction_data),
                            'rincian_transaksi' => getRincianTransaksi($transaction_data),
                        ];
                        // $resi = $this->generateCode($transaction_data);
                        // $shipping->createShippingOrderValidateToken($transaction_data);
                        createNotification('TRS200', ['user_id' => $transaction_data->user->id, 'other_id' => $transaction_data->id], $notification_data, ['transaction_id' => $transaction_data->id]);
                        $masterPoint = MasterPoint::limit(1)->get();

                        foreach ($masterPoint as $point) {
                            if ($point->type == 'transaction') {
                                if ($transaction_data->nominal >= $point->min_trans && $transaction_data->nominal <= $point->max_trans) {
                                    UserPoint::create([
                                        'user_id' => $transaction_data->user_id,
                                        'point' => $point->point
                                    ]);
                                }
                            } else {
                                UserPoint::create([
                                    'user_id' => $transaction_data->user_id,
                                    'point' => $transaction_data->transactionDetail->count() * $point->point
                                ]);
                            }
                        }
                        foreach ($transaction_data->transactionDetail as $trans) {
                            if ($trans->product) {
                                $this->updateStock($trans, $transaction_data->warehouse_id);
                                // $trans->product()->update(['stock' => $trans->product->stock - $trans->qty]);
                                // $stock = ProductStock::where('product_id', $trans->product_id);
                                // if ($trans->product_variant_id) {
                                //     $stock = ProductStock::where('product_variant_id', $trans->product_variant_id);
                                // }

                                // $product_stock = $stock->where('warehouse_id', $transaction_data->warehouse_id)->first();
                                // if ($product_stock) {
                                //     $product_stock->update(['stock' => $product_stock->stock - $trans->qty]);
                                // }
                            }
                        }

                        DB::commit();

                        $respon = [
                            'status' => true,
                            'status_code' => 200,
                            'data' => $resi
                        ];
                        return response()->json($respon, 200);
                    }
                } catch (\Throwable $th) {
                    DB::rollBack();
                    $respon = [
                        'status' => true,
                        'status_code' => 400,
                        'message' => $th->getMessage(),
                    ];
                    LogError::updateOrCreate(['id' => 1], [
                        'message' => $th->getMessage(),
                        'trace' => $th->getTraceAsString(),
                        'action' => 'transactionNotificationaccept',
                    ]);
                    return response()->json($respon, 200);
                }
            }
        } else if ($transaction == 'cancel') {
            if ($fraud == 'challenge') {
                $this->logPayment($notif, $transaction_data->id);
                // TODO Set payment status in merchant's database to 'failure'
                if ($transaction_data) {
                    $transaction_data->update(['status' => 4]);
                    TransactionStatus::create([
                        'id_transaksi' => $notif->order_id,
                        'status' => 4,
                    ]);
                }
            } else if ($fraud == 'accept') {
                $this->logPayment($notif, $transaction_data->id);
                // TODO Set payment status in merchant's database to 'failure'
                if ($transaction_data) {
                    $transaction_data->update(['status' => 4]);
                    TransactionStatus::create([
                        'id_transaksi' => $notif->order_id,
                        'status' => 4,
                    ]);
                }
            }
        } else if ($transaction == 'deny') {
            $this->logPayment($notif, $transaction_data->id);
            // TODO Set payment status in merchant's database to 'failure'
            if ($transaction_data) {
                createNotification('ORC400', ['user_id' => $transaction_data->user->id, 'other_id' => $transaction_data->id], ['brand' => $transaction_data->brand->name], ['transaction_id' => $transaction_data->id]);
                $transaction_data->update(['status' => 6]);
                TransactionStatus::create([
                    'id_transaksi' => $notif->order_id,
                    'status' => 6,
                ]);
            }
        } else if ($transaction == 'expire') {
            if ($fraud == 'challenge') {
                $this->logPayment($notif, $transaction_data->id);
                // TODO Set payment status in merchant's database to 'failure'
                if ($transaction_data) {
                    createNotification('ORC400', ['user_id' => $transaction_data->user->id, 'other_id' => $transaction_data->id], ['brand' => $transaction_data->brand->name], ['transaction_id' => $transaction_data->id]);
                    $transaction_data->update(['status' => 6]);
                    TransactionStatus::create([
                        'id_transaksi' => $notif->order_id,
                        'status' => 6,
                    ]);
                }
            } else if ($fraud == 'accept') {
                $this->logPayment($notif, $transaction_data->id);
                // TODO Set payment status in merchant's database to 'failure'
                if ($transaction_data) {
                    createNotification('ORC400', ['user_id' => $transaction_data->user->id, 'other_id' => $transaction_data->id], ['brand' => $transaction_data->brand->name], ['transaction_id' => $transaction_data->id]);
                    $transaction_data->update(['status' => 6]);
                    TransactionStatus::create([
                        'id_transaksi' => $notif->order_id,
                        'status' => 6,
                    ]);
                }
            }
        }
    }

    public function logPayment($response_payment, $transaction_id)
    {
        try {
            LogThirdPayment::create([
                'transaction_id' => $transaction_id,
                'third_transaction_id' => $response_payment->transaction_id,
                'third_transaction_status' => $response_payment->transaction_status,
                'third_transaction_message' => $response_payment->status_message,
                'third_transaction_payment_type' => $response_payment->payment_type,
                'third_transaction_gross_amount' => $response_payment->gross_amount,
                'third_transaction_fraud_status' => $response_payment->fraud_status,
            ]);
        } catch (\Throwable $th) {
            //throw $th;
        }
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
                        break;
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
                    break;
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
}
