<?php

namespace App\Exports;

use App\Models\Product;
// use Maatwebsite\Excel\Concerns\FromCollection;
// use Maatwebsite\Excel\Concerns\FromQuery;
// use Maatwebsite\Excel\Concerns\WithColumnFormatting;
// use Maatwebsite\Excel\Concerns\WithHeadings;
// use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

// class ProductMasterExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
// {
//     protected $params = [];
//     protected $title = null;

//     public function __construct($params = [], $title = 'Product List')
//     {
//         $this->params = $params;
//         $this->title = $title;
//     }

//     public function query()
//     {
//         return Product::query();
//     }

//     public function map($row): array
//     {
//         return [
//             $row->id,
//             $row->name,
//             $row->sku,
//             $row->weight,
//             $row->status,
//             $row->description,
//             $row->stock,
//         ];
//     }

//     public function headings(): array
//     {
//         return [
//             'ID',
//             'Product',
//             'SKU',
//             'Berat',
//             'Status',
//             'Deskripsi',
//             'Stock',
//         ];
//     }

//     public function title(): string
//     {
//         return $this->title;
//     }
// }

class ProductMasterExport implements FromView, ShouldAutoSize{
    protected $product_convert;
    protected $title;
    public function __construct($product_convert, $title = 'ExportConverData')
    {
        $this->product_convert = $product_convert;
        $this->title = $title;
    }

    public function view(): View
    {
        $productMaster = Product::get();

        $pm_data = [];

        foreach ($productMaster as $key => $value) {
            // merge value same value
            $pm_data[$key]['id']       = $value->id;
            $pm_data[$key]['name']     = $value?->name;
            $pm_data[$key]['sku']      = $value?->sku;
            $pm_data[$key]['weight']   = $value->weight;
            $pm_data[$key]['status']   = $value?->status;
            $pm_data[$key]['description']  = $value->description;
            $pm_data[$key]['stock_warehouse'] = $value->stock_warehouse;
        }
        return view('export.product-master', [
            'data' => $pm_data,
        ]);
    }

    public function title(): string
    {
        return $this->title;
    }
}

