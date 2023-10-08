<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Jobs\CreateOrderPopaket;
use App\Jobs\GetOrderResi;
use App\Models\Transaction;
use App\Models\OrderTiktok;
use App\Models\OrderItemTiktok;
use App\Models\AddressUser;
use App\Models\LogApproveFinance;
use App\Models\LogError;
use App\Models\TransactionAgent;
use App\Models\TransactionDeliveryStatus;
use Illuminate\Http\Request;
use PDF;
use DNS1D;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Response;
use Livewire\ComponentConcerns\ReceivesEvents;
use Picqer\Barcode\BarcodeGeneratorPNG;

class InvoiceController extends Controller
{
    // use ReceivesEvents;
    // print invoice untuk front end
    public function printInvoice($transaction_id = null)
    {
        $transaction = Transaction::find($transaction_id);
        $address = AddressUser::find($transaction->address_user_id);
        // $pdf = PDF::loadView('invoice.invoice', ['data' => $transaction, 'address' => $address]);
        // $this->emit('refreshTable');
        //return $pdf->stream($transaction->id_transaksi . 'invoice.pdf');

        return view('invoice.invoice', ['data' =>  $transaction, 'address' => $address]);
    }

    public function printInvoiceTiktok($transaction_id = null)
    {
        $transaction = OrderTiktok::find($transaction_id);
        $detail = OrderItemTiktok::where('tiktok_order_id', $transaction->tiktok_order_id)->get();

        return view('invoice.invoice-tiktok', ['data' =>  $transaction, 'detail' => $detail]);
    }

    public function printLabelTiktok($transaction_id = null)
    {
        $transaction = OrderTiktok::find($transaction_id);
        $detail = OrderItemTiktok::where('tiktok_order_id', $transaction->tiktok_order_id)->get();

        $barcode = new BarcodeGeneratorPNG();
        $barcodeText = $transaction->tracking_number ?? '1234';
        // Membuat barcode dengan kode yang diberikan
        $barcodeData = $barcode->getBarcode($barcodeText, $barcode::TYPE_CODE_128);

        // Menentukan tipe respon sebagai image/png
        return view('invoice.label-tiktok', ['data' =>  $transaction, 'detail' => $detail, 'barcode' => $barcodeData, 'barcodeText' => $barcodeText]);
    }

    public function printInvoiceAgent($transaction_id = null)
    {
        $transaction = TransactionAgent::find($transaction_id);
        $address = AddressUser::find($transaction->address_user_id);
        // $pdf = PDF::loadView('invoice.invoice', ['data' => $transaction, 'address' => $address]);
        // $this->emit('refreshTable');
        //return $pdf->stream($transaction->id_transaksi . 'invoice.pdf');

        return view('invoice.invoice', ['data' =>  $transaction, 'address' => $address]);
    }

    public function printStructInvoice($transaction_id = null)
    {
        $client = new Client();
        $transaction = Transaction::find($transaction_id);
        if (request()->segment(1) == 'invoice-agent') {
            $transaction = TransactionAgent::find($transaction_id);
        }

        if ($transaction && $transaction->status_delivery == 1) {
            $transaction->update(['status_delivery' => 21]);
            TransactionDeliveryStatus::create([
                'id_transaksi' => $transaction->id_transaksi,
                'delivery_status' => 21,
            ]);
            //log approval
            LogApproveFinance::create(['user_id' => auth()->user()->id, 'transaction_id' => $transaction_id, 'keterangan' => 'Cetak Label']);
        }
        $address = AddressUser::find($transaction->address_user_id);
        // $this->emit('refreshTable');
        try {
            $response = $client->request('GET', getSetting('POPAKET_BASE_URL') . '/shipment/v1/orders/' . $transaction->resi . '/label', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . getSetting('POPAKET_TOKEN')
                ],
            ]);
            $responseJSON = json_decode($response->getBody(), true);
            if (isset($responseJSON['status']) && $responseJSON['status'] == 'success') {
                GetOrderResi::dispatch($transaction->id_transaksi)->onQueue('send-notification');
                return redirect($responseJSON['data']['url_label_pdf']);
            }
            return view('invoice.struct-invoice', ['data' =>  $transaction, 'address' => $address]);
        } catch (ClientException $th) {
            return view('invoice.struct-invoice', ['data' =>  $transaction, 'address' => $address]);
        }
    }

    public function printBulkStructInvoice($transaction_id = null)
    {
        $transaction_ids = explode(',', $transaction_id);
        $transactions = Transaction::whereIn('id', $transaction_ids)->get();
        $pdf = PDF::loadView('invoice.struct-invoice-bulk', ['transactions' => $transactions]);
        // return $pdf->stream($transaction->id_transaksi . 'invoice.pdf');
        // $this->emit('refreshTable');
        return $pdf->download('pdfview.pdf');

        // return view('invoice.struct-invoice', ['transactions' =>  $transactions]);
    }

    public function printPdf($id)
    {
        $data = array(
            'token' => 'sdfvgsw48rty3s4o98tye43o5897yt4o9esw7yt',
            'id' => $id,
            'endpoint' => getSetting('APP_ROOT_URL')
        );

        $payload = json_encode($data);

        // Prepare new cURL resource
        $ch = curl_init('https://us-south.functions.appdomain.cloud/api/v1/web/amandacarolineze_aimi2022/default/pdfss.json');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        // Set HTTP Header for POST request
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload)
            )
        );

        // Submit the POST request
        $result = curl_exec($ch);
        // Close cURL session handle
        curl_close($ch);

        $final = json_decode($result);

        if (empty($final->success)) {
            return "ID Tidak di temukan pada endpoint " . getSetting('APP_ROOT_URL');
        } else {
            // $this->emit('refreshTable');
            return redirect($final->url);
        }
    }
}
