<?php

namespace App\Jobs;

use App\Models\Brand;
use App\Models\LogError;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $request;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $request = $this->request;
        if ($request) {
            $view = isset($request['view']) ? $request['view'] : 'email-template';
            $transaction = null;
            $brand = null;
            if (isset($request['transaction_id'])) {
                $transaction = Transaction::find($request['transaction_id']);
            } else if (isset($request['brand_id'])) {
                $brand = Brand::find($request['brand_id']);
            }
            $cc = isset($request['cc']) ? $request['cc'] : [];
            $body = isset($request['body']) ? $request['body'] : '';
            $date = isset($request['date']) ? $request['date'] : '';
            $type = isset($request['type']) ? $request['type'] : '';
            $email = isset($request['email']) ? $request['email'] : null;
            $actionUrl = isset($request['actionUrl']) ? $request['actionUrl'] : '#';
            $actionTitle = isset($request['actionTitle']) ? $request['actionTitle'] : 'Ganti Sekarang';
            $invoiceId  = isset($request['invoice']) ? $request['invoice'] : '';
            $price = isset($request['price']) ? $request['price'] : '';
            $payment_method = isset($request['payment_method']) ? $request['payment_method'] : '';
            $title = isset($request['title']) ? $request['title'] : '';
            $invoice = $transaction ? $transaction->id_transaksi : $invoiceId;

            $brand_name = $transaction ? $transaction->brand->name : '';
            $brand_email = $transaction ? $transaction->brand->email : '';
            $brand_alamat = $transaction ? $transaction->brand->alamat : '';
            $brand_phone = $transaction ? $transaction->brand->phone : '';
            $brand_logo = $transaction ? getImage($transaction->brand->logo) : '';
            if ($brand) {
                $brand_name = $brand->name;
                $brand_email = $brand->email;
                $brand_alamat = $brand->alamat;
                $brand_phone = $brand->phone;
                $brand_logo = getImage($brand->logo);
            }


            if ($email) {
                try {
                    Mail::send('email.crm.' . $view, [
                        'body' => $body,
                        'date' => $date,
                        'type' => $type,
                        'actionUrl' => $actionUrl,
                        'actionTitle' => $actionTitle,
                        'url' => $actionUrl,
                        'invoice' => $invoice,
                        'price' => $price,
                        'payment_method' => $payment_method,
                        'transaction' => $transaction,
                        'brand_name' => $brand_name,
                        'brand_email' => $brand_email,
                        'brand_phone' => $brand_phone,
                        'brand_logo' => $brand_logo,
                        'brand_alamat' => $brand_alamat,
                    ], function ($message) use ($request, $cc, $title, $email) {
                        $message->from(getSetting('MAIL_FROM_ADDRESS'), getSetting('MAIL_FROM_NAME'));
                        $message->to($email);
                        if (count($cc) > 0) {
                            $message->cc($cc);
                        }
                        $message->subject($title);
                    });
                } catch (\Throwable $th) {
                    LogError::updateOrCreate(['id' => 1], [
                        'message' => "Send Notification Error: $title TO: $email ",
                        'trace' => $th->getMessage(),
                        'action' => 'Send Notification Error',
                    ]);
                }
            }
        }
    }
}
