<?php

namespace App\Jobs;

use App\Models\LogError;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetOrderResi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $transaction_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($transaction_id)
    {
        $this->transaction_id = $transaction_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $transaction = Transaction::where('id_transaksi', $this->transaction_id)->whereNull('resi')->first();

        if (!$transaction) {
            $transaction = TransactionAgent::where('id_transaksi', $this->transaction_id)->whereNull('resi')->first();
        }

        if ($transaction) {
            $client = new Client();
            $transaction_id = $this->transaction_id;
            $token = getSetting('POPAKET_TOKEN');
            try {
                $response = $client->request('GET', getSetting('POPAKET_BASE_URL') . "/shipment/v1/orders/$transaction_id/awb", [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $token
                    ],
                ]);
                $responseJSON = json_decode($response->getBody(), true);
                if (isset($responseJSON['status']) && $responseJSON['status'] == 'success') {
                    LogError::updateOrCreate(['id' => 1], [
                        'message' => 'Get Awb Number Success',
                        'trace' => json_encode($responseJSON['data']),
                        'action' => 'Get Awb Number Queue (getAwbNumber)',
                    ]);
                    $resi = $responseJSON['data']['awb_number'];
                    $resi = $resi ? $resi : null;
                    $transaction->update(['resi' => $resi, 'awb_status' => $resi ? 1 : 2]);
                    if ($resi) {
                        PrintLabelPopaket::dispatch($resi, $transaction['id_transaksi'])->onQueue('send-notification');
                    }
                }
            } catch (\Throwable $th) {
                LogError::updateOrCreate(['id' => 1], [
                    'message' => $th->getMessage(),
                    'trace' => $th->getTraceAsString(),
                    'action' => 'Get Awb Number Queue (getAwbNumber)',
                ]);
            }
        } else {
            LogError::updateOrCreate(['id' => 1], [
                'message' => 'Transaksi Tidak Ditemukan',
                'trace' => null,
                'action' => 'Get Awb Number Queue (getAwbNumber)',
            ]);
        }
    }
}
