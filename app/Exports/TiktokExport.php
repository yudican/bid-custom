<?php

namespace App\Exports;

use App\Models\PurchaseOrder;
use App\Models\InventoryItem;
use App\Models\AddonTiktokOrder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TiktokExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $params = [];
    protected $title = null;

    public function __construct($params = [], $title = 'Tiktok Order List')
    {
        $this->params = $params;
        $this->title = $title;
    }

    public function query()
    {
        return AddonTiktokOrder::query();
    }

    public function map($row): array
    {
        foreach ($row as $item) {
            return [
                $row->id,
                $row->order_id,
                $row->pembeli,
                $row->seller_id,
                $row->pay_method,
                $row->whatsapp,
                $row->shipping_kabupaten,
                $row->shipping_provinsi,
                $row->tracking_logistic,
                $row->warehouse_name
            ];
        }
        
    }

    public function headings(): array
    {
        return [
            'ID',
            'Order ID',
            'Pembeli',
            'Seller ID',
            'Metode Pembayaran',
            'Whatsapp',
            'Kabupaten',
            'Provinsi',
            'Tracking Logistic',
            'Warehouse'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->title;
    }
}
