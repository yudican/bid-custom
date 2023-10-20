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

class PrintInvoice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data = [];
    protected $task;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data, $task)
    {
        $this->data = $data;
        $this->task = $task;
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
        $data = $this->data;
        try {
            $response = $client->request('POST', 'https://giraffe-v2.aimi.dev/api/tektok/label/merge?apikey=' . $apiKey, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'seller_id' => $seller_id,
                    'data' => $data,
                ]),
            ]);
            $responseJSON = json_decode($response->getBody(), true);
        } catch (ClientException $th) {
            LogError::updateOrCreate(['id' => 1], [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
                'action' => 'Bulk Print',
            ]);
        }
    }
}
