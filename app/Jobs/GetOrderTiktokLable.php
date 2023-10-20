<?php

namespace App\Jobs;

use App\Models\AuthTiktok;
use App\Models\OrderTiktok;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetOrderTiktokLable implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $order_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($order_id)
    {
        $this->order_id = $order_id;
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
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'order_id' => $this->order_id, 'document_type' => 'SHIPPING_LABEL', 'shop_id' => '');
        $sign = generateSHA256('/api/logistics/shipping_document', $queries, $app_secret);
        $url = 'https://open-api.tiktokglobalshop.com/api/logistics/shipping_document?access_token=' . $access_token . '&app_key=' . $app_key . '&order_id=' . $this->order_id . '&document_type=SHIPPING_LABEL&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;
        try {
            $response = $client->request('GET',  $url);

            $responseJSON = json_decode($response->getBody(), true);
            if ($responseJSON['code'] == 0) {
                if (isset($responseJSON['data']['doc_url'])) {
                    $order = OrderTiktok::where('tiktok_order_id', $this->order_id)->first();
                    $order->update(['label_url' => $responseJSON['data']['doc_url']]);
                    //Send To Giraffe Label
                    SendOrderTiktokGirafe::dispatch($order['order_id'], $responseJSON['data']['doc_url'])->onQueue('send-notification');
                }
            }
        } catch (ClientException $th) {
        }
    }
}
