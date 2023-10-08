<?php

namespace App\Jobs;

use App\Models\AuthTiktok;
use App\Models\LogError;
use App\Models\OrderItemTiktok;
use App\Models\OrderTiktok;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\ProductVariant;
use App\Models\ProductVariantStock;
use App\Models\User;
use App\Models\Warehouse;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class GetOrderTiktokDetail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $order_id;
    protected $success_total;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($order_id, $success_total = null)
    {
        $this->order_id = $order_id;
        $this->success_total = $success_total;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $client = new Client();
        $app_secret = getSetting('TIKTOK_SECRET_KEY');
        $app_key = getSetting('TIKTOK_APP_KEY');
        $timestamp = time();
        $access = AuthTiktok::find(1);
        $access_token = $access->access_token;
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'shop_id' => '');
        $sign = generateSHA256('/api/orders/detail/query', $queries, $app_secret);

        $data = array(
            'order_id_list' => $this->order_id
        );
        $url = 'https://open-api.tiktokglobalshop.com/api/orders/detail/query?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

        try {
            $response = $client->request('POST',  $url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'order_id_list' =>  [$this->order_id]
                ]),
            ]);

            $responseJSON = json_decode($response->getBody(), true);
            foreach ($responseJSON['data']['order_list'] as $key => $detail) {
                $convert_time = date('Y-m-d h:i:s', $detail['create_time'] / 1000);
                $paid_time = (@$detail['paid_time']) ? date('Y-m-d h:i:s', $detail['paid_time'] / 1000) : '';
                $paymentInfo = isset($detail['payment_info']) ? $detail['payment_info'] : null;

                $buyer_name = isset($detail['recipient_address']['name']) ? $detail['recipient_address']['name'] : null;
                $payment_method_name = isset($detail['payment_method_name']) ? $detail['payment_method_name'] : null;
                $shipping_provider = isset($detail['shipping_provider']) ? $detail['shipping_provider'] : null;
                $tracking_number = isset($detail['tracking_number']) ? $detail['tracking_number'] : null;



                OrderTiktok::updateOrCreate(['tiktok_order_id'  => $this->order_id], [
                    'tiktok_order_id'  => $this->order_id,
                    'buyer_uid' => isset($detail['buyer_uid']) ? $detail['buyer_uid'] : null,
                    'create_time' => $convert_time,
                    'delivery_option' => isset($detail['delivery_option']) ? $detail['delivery_option'] : null,
                    'delivery_option_description' => isset($detail['delivery_option_description']) ? $detail['delivery_option_description'] : null,
                    'fulfillment_type' => isset($detail['fulfillment_type']) ? $detail['fulfillment_type'] : null,
                    'is_cod'  => isset($detail['is_cod']) ? $detail['is_cod'] : null,
                    'paid_time'  => $paid_time,
                    'payment_method'  => isset($detail['payment_method']) ? $detail['payment_method'] : null,
                    'payment_method_name'  => isset($detail['payment_method_name']) ? $detail['payment_method_name'] : null,
                    'shipping_provider'  => isset($detail['shipping_provider']) ? $detail['shipping_provider'] : null,
                    'tracking_number'  => isset($detail['tracking_number']) ? $detail['tracking_number'] : null,
                    'warehouse_id'  => isset($detail['warehouse_id']) ? $detail['warehouse_id'] : null,
                    'total_amount' => isset($paymentInfo['total_amount']) ? $paymentInfo['total_amount'] : null,
                    'shipping_fee' => isset($paymentInfo['shipping_fee']) ? $paymentInfo['shipping_fee'] : null,
                    'order_status' => $this->getOrderStatus($detail['order_status']),
                    'full_address' => @$detail['recipient_address']['full_address'] . ', ' . isset($paymentInfo['shipping_fee']) ? $paymentInfo['shipping_fee'] : null,
                    'city' => isset($detail['recipient_address']['city']) ? $detail['recipient_address']['city'] : null,
                    'district' => isset($detail['recipient_address']['district']) ? $detail['recipient_address']['district'] : null,
                    'region' => isset($detail['recipient_address']['region']) ? $detail['recipient_address']['region'] : null,
                    'state' => isset($detail['recipient_address']['state']) ? $detail['recipient_address']['state'] : null,
                    'town' => isset($detail['recipient_address']['town']) ? $detail['recipient_address']['town'] : null,
                    'zipcode' => isset($detail['recipient_address']['zipcode']) ? $detail['recipient_address']['zipcode'] : null,
                    'buyer_name' => $buyer_name,
                    'buyer_phone' => isset($detail['recipient_address']['phone']) ? $detail['recipient_address']['phone'] : null,
                ]);

                $warehouse = Warehouse::where('warehouse_tiktok_id', $detail['warehouse_id'])->first();
                $product_names = [];
                foreach ($detail['item_list'] as $item) {
                    // $product_names[] = [
                    //     'name' => $item['product_name'],
                    //     'qty' => $item['quantity'],
                    //     'sku' => isset($item['seller_sku']) ? $item['seller_sku'] : null,
                    // ];
                    // OrderItemTiktok::updateOrCreate([
                    //     'tiktok_order_id'  => $this->order_id,
                    //     'product_id' => $item['product_id']
                    // ], [
                    //     'tiktok_order_id'  => $this->order_id,
                    //     'product_id' => $item['product_id'],
                    //     'product_name' => $item['product_name'],
                    //     'quantity' => $item['quantity'],
                    //     'seller_sku' => isset($item['seller_sku']) ? $item['seller_sku'] : null,
                    //     'sku_id' => $item['sku_id'],
                    //     'sku_original_price'  => $item['sku_original_price'],
                    //     'sku_platform_discount'  => $item['sku_platform_discount'],
                    //     'sku_platform_discount_total'  => $item['sku_platform_discount_total'],
                    //     'sku_sale_price'  => $item['sku_sale_price'],
                    // ]);

                    if ($detail['order_status'] == 112) {
                        if ($warehouse) {
                            setSetting('warehouse_' . $warehouse->id, json_encode($item));
                            $this->updateStock($item, $warehouse->id);
                        }
                    }
                }


                if ($detail['order_status'] == 112) {
                    GetOrderTiktokLable::dispatch($this->order_id)->onQueue('send-notification');
                }

                // update status to WAITING_COLLECTION
                if (getSetting('TIKTOK_LABEL_AUTO_PROCCESS')) {
                    if ($detail['order_status'] == 111) {
                        $warehouse_check = Warehouse::where('warehouse_tiktok_id', $detail['warehouse_id'])->first();
                        if ($warehouse_check) {
                            $package_id = isset($detail['package_list'][0]['package_id']) ? $detail['package_list'][0]['package_id'] : null;
                            if ($package_id) {
                                GetOrderTiktokUpdatePackege::dispatch($package_id)->onQueue('send-notification');
                            }
                        }
                    }
                }

                // GetOrderTiktokTrack::dispatch($this->order_id)->onQueue('send-notification');

                if (in_array($detail['order_status'], [100, 111])) {
                    if ($warehouse) {
                        foreach ($warehouse->users as $key => $user) {
                            try {
                                if ($user->telegram_chat_id) {
                                    $trx = "ORDER ID: " .  $this->order_id . "\n";
                                    $trx .= "Nama Customer: " . $buyer_name . "\n";
                                    $trx .= "Metode Pembayaran: " . $payment_method_name . "\n";
                                    $trx .= "Metode Pengiriman: " . $shipping_provider . "\n";
                                    $trx .= "Nomor Resi: " . $tracking_number . "\n";
                                    $trx .= "Tanggal Transaksi: " . $convert_time . "\n";
                                    $trx .= "Status: " . $this->getOrderStatus($detail['order_status']) . "\n\n";
                                    $trx .= "Detail Produk: \n";

                                    foreach ($product_names as $index => $name) {
                                        if ($index > 0) {
                                            $trx .= "----------------------------------------------------------------------\n";
                                        }
                                        $trx .= "Produk: " . $name['name'] . "\n";
                                        $trx .= "Qty   : " . $name['qty'] . "\n";
                                        $trx .= "SKU  : " . $name['sku'] . "\n\n";
                                    }

                                    sendNotifTelegram("Halo {$user->name} ada transaksi baru ditiktok \n\n" . $trx, $user->telegram_chat_id);
                                } else {
                                    createNotification(
                                        'NEWORDERT',
                                        [
                                            'user_id' => $user->id
                                        ],
                                        [
                                            'admin' => $user->name,
                                            'order_id' => $this->order_id,
                                            'payment_method' => $payment_method_name,
                                            'shipping_method' => isset($detail['shipping_provider']) ? $detail['shipping_provider'] : null,
                                            'tracking_number' => isset($detail['tracking_number']) ? $detail['tracking_number'] : null,
                                            'transaction_date' => isset($detail['create_time']) ? $detail['create_time'] : null,
                                            'items_detail' => getTiktokItemsDetail($detail['item_list']),

                                        ],
                                        ['brand_id' => 8]
                                    );
                                }
                            } catch (\Throwable $th) {
                                //throw $th;
                                setSetting('send email error', $th->getMessage());
                            }
                        }
                    }
                }
            }
        } catch (ClientException $th) {
            setSetting('error', $th->getMessage());
        }
    }

    public function getOrderStatus($status)
    {
        switch ($status) {
            case 100:
                return 'UNPAID';
                break;
            case 105:
                return 'ON_HOLD';
                break;
            case 111:
                return 'AWAITING_SHIPMENT';
                break;
            case 112:
                return 'AWAITING_COLLECTION';
                break;
            case 114:
                return 'PARTIALLY_SHIPPING';
                break;
            case 121:
                return 'IN_TRANSIT';
                break;
            case 122:
                return 'DELIVERED';
                break;
            case 130:
                return 'COMPLETED';
                break;
            case 140:
                return 'CANCELLED';
                break;
            default:
                return '-';
                break;
        }
    }

    public function updateStock($trans, $warehouse_id)
    {
        try {
            DB::beginTransaction();
            $product = ProductVariant::where('sku_tiktok', $trans['sku_id'])->first();
            $stockInventories = ProductStock::where('warehouse_id', $warehouse_id)->where('product_id', $product['product_id'])->where('stock', '>', 0)->orderBy('created_at', 'asc')->get();
            $product_variants = ProductVariant::where('product_id', $product['product_id'])->get();
            foreach ($product_variants as $key => $variant) {
                $variant_stocks = ProductVariantStock::where('warehouse_id', $warehouse_id)->where('product_variant_id', $variant->id)->where('qty', '>', 0)->orderBy('created_at', 'asc')->get();
                $qty = $variant->qty_bundling * $trans['quantity'];
                foreach ($variant_stocks as $key => $stock) {
                    $stok = $stock->qty;
                    $temp = $stok - $qty;
                    $temp = $temp < 0 ? 0 : $temp;

                    // tampilkan stock kosong alert
                    if ($stock->stock_of_market < $trans['quantity']) {
                        LogError::updateOrCreate(['action' => 'CEKSTOCK-' . $stock->product_variant_id], [
                            'message' => 'Data Stock Di Produk Variant' . $stock->name . ' Tidak Mencukupi, Tersisa ' . $stock->stock_of_market,
                            'action' => 'CEKSTOCK-' . $stock->product_variant_id
                        ]);
                    }

                    if ($stock->stock_of_market > $trans['quantity']) {
                        $stock_of_market = $stock->stock_of_market - $trans['quantity'];
                        $stock_of_market = $stock_of_market < 0 ? 0 : $stock_of_market;
                        if ($temp >= 0) {
                            $stock->update(['qty' => $temp, 'stock_of_market' => $stock_of_market]);
                        } else {

                            $stock->update(['qty' => 0, 'stock_of_market' => 0]);
                            $qty = $qty - $stok;
                        }
                    } else {
                        OrderTiktok::where('tiktok_order_id', $trans['tiktok_order_id'])->update(['status_stock', 'out_of_stock']);
                    }
                }
            }
            $qty_master = $trans['quantity'];
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
            setSetting('update-stock-error', $th->getMessage());
            DB::rollback();
        }
    }
}
