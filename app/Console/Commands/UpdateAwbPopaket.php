<?php

namespace App\Console\Commands;

use App\Jobs\GetOrderResi;
use App\Jobs\RequestNewAwbNumber;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use Illuminate\Console\Command;

class UpdateAwbPopaket extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'popaket:awb';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Paket Awb';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $transactions = Transaction::whereIn('status', [3, 7])->whereNull('resi')->get();
        $transaction_agents = TransactionAgent::whereIn('status', [3, 7])->whereNull('resi')->get();

        $newTransactions = [];

        foreach ($transactions as $key => $transaction) {
            $newTransactions[$transaction->id_transaksi] = $transaction;
        }

        foreach ($transaction_agents as $key => $transaction_agent) {
            $newTransactions[$transaction_agent->id_transaksi] = $transaction_agent;
        }

        foreach ($newTransactions as $key => $transaction) {
            if ($transaction['awb_status'] == 2) {
                RequestNewAwbNumber::dispatch($transaction['id_transaksi'])->onQueue('send-notification');
            }
            GetOrderResi::dispatch($transaction['id_transaksi'])->onQueue('send-notification');
        }

        return 0;
    }
}
