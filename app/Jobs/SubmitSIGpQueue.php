<?php

namespace App\Jobs;

use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\OrderSubmitLogDetail;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SubmitSIGpQueue implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $type;
    protected $order_log_id;
    protected $body = [];
    protected $ids = [];
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($type, $order_log_id, $body = [], $ids = [])
    {
        $this->type = $type;
        $this->order_log_id = $order_log_id;
        $this->body = $body;
        $this->ids = $ids;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $client = new \GuzzleHttp\Client();

        $ids = $this->ids;
        $type = $this->type;
        $order_log_id = $this->order_log_id;
        $body = $this->body;

        $orders = null;

        switch ($type) {
            case 'order-lead':
                $orders = OrderLead::query()->whereIn('uid_lead', $ids);
                break;
            case 'order-manual':
                $orders = OrderManual::query()->whereIn('uid_lead', $ids)->where('type', 'manual');
                break;

            default:
                $orders = OrderManual::query()->whereIn('uid_lead', $ids)->where('type', 'freebies');
                break;
        }
        setSetting('GP_BODY_' . $order_log_id, $body);
        try {
            $response = $client->request('POST', getSetting('GP_URL') . '/SI/SIEntry', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'ArthaKey' => getSetting('GP_ARTAKEY'),
                    'Authorization' => 'Bearer ' . getSetting('GP_TOKEN'),
                ],
                'body' => $body
            ]);
            $responseJSON = json_decode($response->getBody(), true);
            setSetting('GP_RESPONSE_' . $order_log_id, json_encode($responseJSON));
            if (isset($responseJSON['code'])) {
                if ($responseJSON['code'] == 201) {
                    foreach ($orders->get() as $key => $order) {
                        $order->update(['status_submit' => 'submited']);

                        OrderSubmitLogDetail::updateOrCreate([
                            'order_submit_log_id' => $order_log_id,
                            'order_id' => $order->id
                        ], [
                            'order_submit_log_id' => $order_log_id,
                            'order_id' => $order->id,
                            'status' => 'success',
                            'error_message' => null
                        ]);
                    }


                    return true;
                }
            }

            if (isset($responseJSON['desc'])) {
                foreach ($orders->get() as $key => $ginee) {
                    OrderSubmitLogDetail::updateOrCreate([
                        'order_submit_log_id' => $order_log_id,
                        'order_id' => $ginee->id
                    ], [
                        'order_submit_log_id' => $order_log_id,
                        'order_id' => $ginee->id,
                        'status' => 'failed',
                        'error_message' => $responseJSON['desc']
                    ]);
                }
            }
        } catch (ClientException $e) {
            $response = $e->getResponse();
            $responseBodyAsString = $response->getBody()->getContents();
            setSetting('GP_RESPONSE_ERROR_' . $order_log_id, $responseBodyAsString);
            foreach ($orders->get() as $key => $ginee) {
                OrderSubmitLogDetail::updateOrCreate([
                    'order_submit_log_id' => $order_log_id,
                    'order_id' => $ginee->id
                ], [
                    'order_submit_log_id' => $order_log_id,
                    'order_id' => $ginee->id,
                    'status' => 'failed',
                    'error_message' => $responseBodyAsString
                ]);
            }
        }
    }
}
