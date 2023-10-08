<?php

namespace App\Exports;

use App\Models\OrderListByGenie;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;

class GenieOrderExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $title;
    public function __construct($title = 'ExportConverData')
    {
        $this->title = $title;
    }

    public function query()
    {
        return OrderListByGenie::query();
    }

    public function map($row): array
    {
        return [
            $row->sku,
            $row->produk_nama,
            $row->qty,
            $row->ongkir,
            $row->subtotal,
            $row->harga_awal,
            $row->harga_satuan,
            $row->harga_promo,
            $row->tanggal_transaksi,
        ];
    }

    public function headings(): array
    {
        return [
            'SKU',
            'Nama Produk',
            'QTY',
            'Ongkir',
            'Subtotal',
            'Harga Produk',
            'Harga Satuan',
            'Harga Promsi',
            'Trans date',
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
