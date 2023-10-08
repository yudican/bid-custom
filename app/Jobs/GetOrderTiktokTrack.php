<?php

namespace App\Jobs;

use App\Models\AuthTiktok;
use App\Models\OrderTracker;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetOrderTiktokTrack implements ShouldQueue
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
        $queries = array('app_key' => $app_key, 'timestamp' => $timestamp, 'order_id' => $this->order_id, 'shop_id' => '');
        $sign = generateSHA256('/api/logistics/ship/get', $queries, $app_secret);
        $url = 'https://open-api.tiktokglobalshop.com/api/logistics/ship/get?access_token=' . $access_token . '&app_key=' . $app_key . '&order_id=' . $this->order_id . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;
        try {
            $response = $client->request('GET',  $url);

            $responseJSON = json_decode($response->getBody(), true);

            if (isset($responseJSON['data']['tracking_info_list'])) {
                foreach ($responseJSON['data']['tracking_info_list'] as $item) {
                    foreach ($item['tracking_info'] as $trc) {
                        OrderTracker::create([
                            'tiktok_order_id'  => $this->order_id,
                            'description' => $trc['description'],
                            'update_time' => $trc['update_time']
                        ]);
                    }
                }
            }
        } catch (ClientException $th) {
        }
    }
}
