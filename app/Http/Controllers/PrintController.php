<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\AddressUser;
use App\Models\InventoryProductReturn;
use App\Models\ProductNeed;
use App\Models\SalesReturn;
use App\Models\SalesReturnItem;
use App\Models\LogApproveFinance;
use App\Models\LogPrintOrder;
use Illuminate\Http\Request;
use PDF;
use DNS1D;
use Livewire\ComponentConcerns\ReceivesEvents;

class PrintController extends Controller
{
    use ReceivesEvents;

    public function printSo($uid_lead = null)
    {
        $lead = OrderLead::where('uid_lead', $uid_lead)->first();
        if (empty($lead)) {
            $lead = OrderManual::where('uid_lead', $uid_lead)->first();
        }
        $main = AddressUser::where('user_id', $lead->contact)->where('is_default', 1)->first();
        if (empty($main)) {
            $main = AddressUser::where('user_id', $lead->contact)->first();
        }
        $productneeds = ProductNeed::where('uid_lead', $uid_lead)->get();
        // echo"<pre>";print_r($lead);die();
        $lead->update(['print_status' => 'printed']);
        LogPrintOrder::create([
            'uid_lead' => $uid_lead,
            'user_id' => auth()->user()->id
        ]);
        return view('print.so', ['lead' =>  $lead, 'mainaddress' => $main, 'productneeds' => $productneeds]);
    }
    public function printSi($uid_lead = null)
    {
        $lead = OrderLead::where('uid_lead', $uid_lead)->first();
        if (empty($lead)) {
            $lead = OrderManual::where('uid_lead', $uid_lead)->first();
        }
        $main = AddressUser::where('user_id', $lead->contact)->where('is_default', 1)->first();
        if (empty($main)) {
            $main = AddressUser::where('user_id', $lead->contact)->first();
        }
        $productneeds = ProductNeed::where('uid_lead', $uid_lead)->get();
        // echo"<pre>";print_r($lead);die();
        $lead->update(['print_status' => 'printed']);
        LogPrintOrder::create([
            'uid_lead' => $uid_lead,
            'user_id' => auth()->user()->id
        ]);
        return view('print.si', ['lead' =>  $lead, 'mainaddress' => $main, 'productneeds' => $productneeds]);
    }

    public function printSj($uid_lead = null)
    {
        $lead = OrderLead::where('uid_lead', $uid_lead)->first();
        if (empty($lead)) {
            $lead = OrderManual::where('uid_lead', $uid_lead)->first();
        }
        $main = AddressUser::where('user_id', $lead->contact)->where('is_default', 1)->first();
        if (empty($main)) {
            $main = AddressUser::where('user_id', $lead->contact)->first();
        }
        $productneeds = ProductNeed::where('uid_lead', $uid_lead)->get();
        $lead->update(['print_status' => 'printed']);
        LogPrintOrder::create([
            'uid_lead' => $uid_lead,
            'user_id' => auth()->user()->id
        ]);
        return view('print.sj', ['lead' =>  $lead, 'mainaddress' => $main, 'productneeds' => $productneeds]);
    }

    public function printSr($uid_retur = null)
    {
        $lead = SalesReturn::where('uid_retur', $uid_retur)->first();
        $main = AddressUser::where('user_id', $lead->contact)->where('is_default', 1)->first();
        if (empty($main)) {
            $main = AddressUser::where('user_id', $lead->contact)->first();
        }
        $productneeds = SalesReturnItem::where('uid_retur', $uid_retur)->get();


        return view('print.sr', ['lead' =>  $lead, 'mainaddress' => $main, 'productneeds' => $productneeds]);
    }

    public function printSpr($uid_inventory = null)
    {
        $inventory = InventoryProductReturn::where('uid_inventory', $uid_inventory)->first();

        return view('print.spr', ['data' =>  $inventory]);
    }

    public function printInvoice($uid_retur = null)
    {
        $lead = SalesReturn::where('uid_retur', $uid_retur)->first();
        $main = AddressUser::where('user_id', $lead->contact)->where('is_default', 1)->first();
        if (empty($main)) {
            $main = AddressUser::where('user_id', $lead->contact)->first();
        }
        $productneeds = SalesReturnItem::where('uid_retur', $uid_retur)->get();


        return view('print.sj', ['lead' =>  $lead, 'mainaddress' => $main, 'productneeds' => $productneeds]);
    }

    public function printPdf($id)
    {
        $data = array(
            'token' => 'sdfvgsw48rty3s4o98tye43o5897yt4o9esw7yt',
            'id' => $id,
            'endpoint' => 'dev.daftar-agen.com'
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
            return "ID Tidak di temukan pada endpoint dev.daftar-agen.com";
        } else {

            return redirect($final->url);
        }
    }
}
