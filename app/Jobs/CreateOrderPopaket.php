<?php

namespace App\Jobs;

use App\Models\LogError;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CreateOrderPopaket implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $transaction;
    protected $cod = false;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($transaction, $cod = false)
    {
        $this->transaction = $transaction;
        $this->cod = $cod;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $client = new Client();
        $transaction = $this->transaction;
        if ($transaction) {
            $durations = explode('-', str_replace(' ', '-', $transaction->shippingType->shipping_duration));
            $min_duration = 1;
            $max_duration = 2;
            if (is_array($durations)) {
                $min_duration = isset($durations[0]) ? $durations[0] : 1;
                $max_duration = isset($durations[1]) ? $durations[1] : 2;
            }
            $products = [];

            foreach ($transaction->transactionDetail as $key => $product) {
                $products[] = $product->product->name;
            }

            $token = getSetting('POPAKET_TOKEN');
            $data = [
                "client_order_no" => $transaction->id_transaksi,
                "cod_price" => 0,
                "height" => 10,
                "insurance_price" => 0,
                "is_cod" => false,
                "is_use_insurance" => false,
                "length" => 10,
                "max_duration" => intval($min_duration),
                "min_duration" => intval($max_duration),
                "package_price" => 0,
                "package_type_id" => 1,
                "rate_code" => $transaction->shippingType->shipping_type_code,
                "receiver_address" => $transaction->addressUser->alamat_detail,
                "receiver_address_note" => $transaction->addressUser->catatan ?? '',
                "receiver_email" => $transaction->user->email,
                "receiver_name" => $transaction->addressUser->nama,
                "receiver_phone" => formatPhone($transaction->addressUser->telepon),
                "receiver_postal_code" => $transaction->shippingType->shipping_destination,
                "shipment_price" => intval($transaction->shippingType->shipping_price),
                "shipment_type" => "DROP",
                "shipper_address" => $transaction->shipperWarehouse ? $transaction->shipperWarehouse->alamat : $transaction->brand->alamat,
                "shipper_email" => $transaction->brand->email,
                "shipper_name" => $transaction->shipperWarehouse ? $transaction->shipperWarehouse->name : $transaction->brand->name,
                "shipper_phone" => $transaction->shipperWarehouse ? $transaction->shipperWarehouse->telepon : formatPhone($transaction->brand->phone),
                "shipper_postal_code" => $transaction->shippingType->shipping_origin,
                "shipping_note" => 'Kode Produk 52',
                "weight" => intval($transaction->shippingType->shipping_weight) ?? 1,
                "width" => 12
            ];

            if (is_array($products)) {
                $data['package_desc'] = implode(',', $products);
            }

            DB::beginTransaction();
            try {
                $response = $client->request('POST', getSetting('POPAKET_BASE_URL') . '/shipment/v1/orders', [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer ' . $token
                    ],
                    'body' => json_encode($data)
                ]);
                $responseJSON = json_decode($response->getBody(), true);
                if (isset($responseJSON['status']) && $responseJSON['status'] == 'success') {
                    LogError::updateOrCreate(['id' => 1], [
                        'message' => 'Succes Create Order',
                        'trace' => json_encode($responseJSON['data']),
                        'action' => 'Create Order Success',
                    ]);
                    $transaction->update(['awb_status' => 2]);
                    GetOrderResi::dispatch($transaction->id_transaksi)->onQueue('send-notification');
                }

                DB::commit();
            } catch (ClientException $th) {
                $response = $th->getResponse();
                LogError::updateOrCreate(['id' => 1], [
                    'message' => $th->getMessage(),
                    'trace' => $response->getBody()->getContents(),
                    'action' => 'Create Order Po Paket queue (createShippingOrder)',
                ]);
                DB::rollBack();
            }
        }
    }
}
