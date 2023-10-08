<?php

namespace App\Exports;

use App\Models\ProductConvertDetail;
use App\Models\ProductConvertHistory;
use App\Models\ProductImportTemp;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductSkuExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $product_convert;
    protected $title;
    public function __construct($product_convert, $title = 'ExportConverData')
    {
        $this->product_convert = $product_convert;
        $this->title = $title;
    }

    public function query()
    {
        return ProductConvertDetail::query()->where('product_convert_id', $this->product_convert->id);
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
