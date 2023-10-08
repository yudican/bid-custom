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

class GetOrderTiktokUpdatePackege implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
  protected $package_id;
  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct($package_id)
  {
    $this->package_id = $package_id;
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
    $queries = array('app_key' => $app_key, 'timestamp' => $timestamp);
    $sign = generateSHA256('/api/fulfillment/rts', $queries, $app_secret);
    $url = 'https://open-api.tiktokglobalshop.com/api/fulfillment/rts?access_token=' . $access_token . '&app_key=' . $app_key . '&sign=' . $sign . '&timestamp=' . $timestamp;
    setSetting('params_order', json_encode([
      'package_id' => $this->package_id
    ]));
    try {
      $response = $client->request('POST',  $url, [
        'headers' => [
          'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
          'package_id' => $this->package_id
        ])
      ]);

      $responseJSON = json_decode($response->getBody(), true);

      if ($responseJSON['code'] == 0) {
        setSetting('update shipment success', $responseJSON['message']);
      }
    } catch (ClientException $th) {
      setSetting('update shipment error', $th->getMessage());
    }
  }
}
