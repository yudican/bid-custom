<?php

namespace App\Exports;

use App\Models\ProductVariant as ModelsProductVariant;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductVariantExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $title;
    public function __construct($title = 'Product Variant')
    {
        $this->title = $title;
    }

    public function query()
    {
        return ModelsProductVariant::query()->whereNull('deleted_at');
    }

    public function map($row): array
    {
        return [
            $row->product->name,
            $row->name,
            $row->package_name,
            $row->variant_name,
            "$row->sku",
            $row->sku_variant,
        ];
    }

    public function headings(): array
    {
        return [
            'Product master',
            'Nama product',
            'Package',
            'variant',
            'SKU Master',
            'SKU variant',
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
