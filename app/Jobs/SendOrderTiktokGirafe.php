<?php

namespace App\Jobs;

use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderTiktokGirafe implements ShouldQueue
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
        $seller_id = '7494769230760545061'; // from tiktok
        $apiKey = 'MJGEFLIUYEGLIEUF3487LKIHO';
        $client = new Client();
        try {
            $response = $client->request('POST',  'https://giraffe-v2.aimi.dev/api/tektok/orders?apikey=' . $apiKey, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'seller_id' => $seller_id,
                    'order_id' => $this->order_id,
                ]),
            ]);

            $responseJSON = json_decode($response->getBody(), true);
            setSetting('response_giraffe', json_encode($responseJSON));
        } catch (\Throwable $th) {
            setSetting('response_giraffe_error', $th->getMessage());
        }
    }
}
