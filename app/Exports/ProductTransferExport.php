<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductTransferExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $params = [];
    protected $title = null;

    public function __construct($params = [], $title = 'Product Transfer List')
    {
        $this->params = $params;
        $this->title = $title;
    }

    public function query()
    {
        return InventoryItem::query()->whereHas('inventoryStock', function ($query) {
            return $query->where('inventory_type', 'transfer');
        });
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->product_name,
            $row->qty_diterima,
            $row->qty,
            $row->inventoryStock->warehouse_name,
            $row->inventoryStock->allocated_by_name,
            $row->inventoryStock->created_on,
            $row->inventoryStock->notes,
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Product',
            'QTY Diterima',
            'Qty (Transfered)',
            'Warehouse',
            'Allocated by',
            'Created on',
            'Notes'
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
