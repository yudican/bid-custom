<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class StockMovementExport implements FromView, ShouldAutoSize
{
    protected $params = [];
    protected $title = null;

    public function __construct($params = [], $title = 'Stock Movement List')
    {
        $this->params = $params;
        $this->title = $title;
    }

    public function view(): View
    {
        //test
        $data = collect(DB::select(DB::raw("select v.product_id, v.sku, v.name as product_name, p.`name` as package_name, b.`name` as brand,
                (SELECT SUM(po.qty) FROM tbl_purchase_order_items po WHERE po.product_id = v.product_id) as begin_stock,
                (SELECT SUM(poi.qty) FROM tbl_purchase_order_items poi LEFT JOIN tbl_purchase_orders po on po.id = poi.purchase_order_id 
                    WHERE po.status = 2 and poi.product_id = v.product_id) as purchase_delivered,
                (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id) as product_return,
                (SELECT SUM(i.qty_diterima) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.type = 'return-received') as sales_return,
                (SELECT SUM(t.qty) FROM tbl_transaction_details t WHERE t.product_id = v.id) as stock,
                (SELECT SUM(i.qty) FROM tbl_inventory_items i WHERE i.product_id = v.id and i.received_vendor = 1) as return_suplier,
                (SELECT SUM(i.qty) FROM tbl_product_needs i WHERE i.product_id = v.id) as sales,
                (SELECT SUM(i.qty) FROM tbl_inventory_items i LEFT JOIN tbl_inventory_product_stocks ips on i.uid_inventory = ips.uid_inventory 
                    WHERE ips.inventory_type = 'transfer' and i.product_id = v.id) as transfer_out
                FROM tbl_product_variants v 
                left join tbl_packages p on v.package_id = p.id
                left join tbl_products pr on pr.id = v.product_id
                left join tbl_brands b on b.id = pr.brand_id order by product_id")));
        
        return view('export.stock-movement', [
            'data' => $data,
        ]);
    }

    

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->title;
    }
}
