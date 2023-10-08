<?php

namespace App\Jobs;

use App\Models\AuthTiktok;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class GetOrderTiktok implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $more;
    protected $cursor;
    protected $params;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($more = false, $cursor = null, $params = [])
    {
        $this->more = $more;
        $this->cursor = $cursor;
        $this->params = $params;
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
        $sign = generateSHA256('/api/orders/search', $queries, $app_secret);


        $url = 'https://open-api.tiktokglobalshop.com/api/orders/search?access_token=' . $access_token . '&app_key=' . $app_key . '&shop_id=&sign=' . $sign . '&timestamp=' . $timestamp;

        $options = array(
            'cluster' => 'ap1',
            'useTLS' => true
        );

        $pusher = new Pusher(
            '5c63a87e285d37186b78',
            'ad9f2609d879d1005fe4',
            '1638487',
            $options
        );

        $body = [
            'page_size' => 10,
        ];

        $params = $this->params;
        if (isset($params['create_time_from'])) {
            $body['create_time_from'] = $params['create_time_from'];
        }

        if (isset($params['create_time_to'])) {
            $body['create_time_to'] = $params['create_time_to'];
        }

        $body['cursor'] = $this->cursor;
        try {
            $response = $client->request('POST',  $url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($body),
            ]);

            $responseJSON = json_decode($response->getBody(), true);
            if ($responseJSON['code'] == 0) {
                setSetting('tiktok_order_total', $responseJSON['data']['total']);
                $success_total = getSetting('tiktok_sync_total') ?? 0;
                $total_data = getSetting('tiktok_order_total') ?? 0;
                $seller_id = '7494769230760545061'; // from tiktok
                if (count($responseJSON['data']['order_list']) > 0) {
                    $cursor = null;

                    foreach ($responseJSON['data']['order_list'] as $order) {
                        setSetting('tiktok_sync_total', count($responseJSON['data']['order_list']));
                        $cursor = $responseJSON['data']['next_cursor'];
                        GetOrderTiktokDetail::dispatch($order['order_id'], $success_total + count($responseJSON['data']['order_list']))->onQueue('send-notification');
                        //send to giraffe
                        SendOrderTiktokGirafe::dispatch($order['order_id'])->onQueue('send-notification');
                    }
                    $percentage = 0;
                    if ($success_total > 0) {
                        $percentage = getPercentage($success_total, $total_data);
                    }

                    $pusher->trigger('aimi-bidflow-production', 'progress', ['total' => $total_data, 'success' => $success_total, 'status' => 'sync', 'sync' => true, 'percentage' => $percentage]);
                    if ($responseJSON['data']['more']) {
                        GetOrderTiktok::dispatch($responseJSON['data']['more'], $cursor, $params)->onQueue('send-notification');
                    }
                } else {
                    $pusher->trigger('aimi-bidflow-production', 'progress', ['total' => $total_data, 'success' => getSetting('tiktok_sync_total'), 'status' => 'finish', 'sync' => false, 'percentage' => 100]);
                    setSetting('sync_tiktok', 'false');
                    removeSetting('tiktok_order_total');
                    removeSetting('tiktok_sync_total');
                }
            }
        } catch (ClientException $th) {
        }
    }
}
