<?php

namespace App\Exports;

use App\Models\LeadMaster;
use App\Models\Brand;
use App\Models\InventoryItem;
use App\Models\LeadActivity;
use App\Models\LeadHistory;
use App\Models\LeadNegotiation;
use App\Models\OrderLead;
use App\Models\ProductNeed;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrderLeadExport implements FromView, ShouldAutoSize
{
    protected $product_convert;
    protected $title;
    public function __construct($product_convert, $title = 'ExportConverData')
    {
        $this->product_convert = $product_convert;
        $this->title = $title;
    }

    public function view(): View
    {
        $leads = OrderLead::whereHas('productNeeds');
        if (is_array($this->uid_lead)) {
            $leads->whereIn('uid_lead', $this->uid_lead);
        }
        $new_leads = $leads->get();
        $lead_data = [];

        foreach ($new_leads as $key => $value) {
            // merge value same value
            $lead_data[$key]['title']       = $value->title;
            $lead_data[$key]['contact']     = $value?->contactUser?->name;
            $lead_data[$key]['company']     = $value?->contactUser?->company?->name ?? '-';
            $lead_data[$key]['customer_need'] = $value->customer_need;
            $lead_data[$key]['pic_sales']   = $value?->salesUser?->name;
            $lead_data[$key]['created_on']  = $value->created_at;
            $lead_data[$key]['created_by']  = $value?->createUser?->name;
            $lead_data[$key]['warehouse']   = $value?->courierUser?->name;
            $lead_data[$key]['order_number'] = $value->order_number;
            $lead_data[$key]['invoice_number'] = $value->invoice_number;
            $lead_data[$key]['payment_term'] = $value?->paymentTerm?->name;
            $lead_data[$key]['due_date']    = $value->due_date;
            $lead_data[$key]['address_type'] = $value->type;
            $lead_data[$key]['address_name'] = $value->nama;
            $lead_data[$key]['address_telp'] = $value->telepon;
            $lead_data[$key]['address_street'] = $value->alamat_detail;
            $lead_data[$key]['tipe_pengiriman'] = 'Normal';
            $lead_data[$key]['notes'] = $value->notes;
            $lead_data[$key]['product'] = $value->productNeeds()->get()->map(function ($item) {
                return [
                    'product_name' => $item->product_name,
                    'price' => $item->prices['final_price'],
                    'qty' => $item->qty,
                    'tax_amount' => $item->tax_amount,
                    'discount_amount' => $item->discount_amount,
                    'subtotal' => $item->subtotal,
                    'price_nego' => $item->price_nego,
                    'total_price' => $item->total,
                ];
            });

        }
        return view('export.lead-order-manual', [
            'data' => $lead_data,
        ]);
    }

    // public function query()
    // {
    //     return OrderLead::query();
    // }

    // public function map($row): array
    // {
    //     if($row->status == '1'){
    //         $stat = 'New';
    //     }else if($row->status == '2'){
    //         $stat = 'Open';
    //     }else if($row->status == '3'){
    //         $stat = 'Closed';
    //     }else if($row->status == '4'){
    //         $stat = 'Canceled';
    //     }else{
    //         $stat = 'New';
    //     }
    //     return [
    //         $row->order_number,
    //         $row->contactUser->name,
    //         $row->salesUser->name,
    //         $row->user->name,
    //         $row->created_at,
    //         $row->harga_awal,
    //         $row->payment_term,
    //         $row->invoice_number,
    //         $stat,
    //     ];
    // }

    // public function headings(): array
    // {
    //     return [
    //         'Order Number',
    //         'Contact',
    //         'Sales',
    //         'Created By',
    //         'Created On',
    //         'Nominal',
    //         'Payment Term',
    //         'Invoice Number',
    //         'Status',
    //     ];
    // }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->title;
    }
}
