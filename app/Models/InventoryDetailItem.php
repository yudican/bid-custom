<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryDetailItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid_inventory',
        'product_id',
        'from_warehouse_id',
        'to_warehouse_id',
        'sku',
        'u_of_m',
        'qty',
        'qty_alocation',
        'notes',
        'case_return'
    ];

    protected $appends = ['product_name'];

    /**
     * Get the stock that owns the InventoryItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function inventoryStock()
    {
        return $this->belongsTo(InventoryProductStock::class, 'uid_inventory', 'uid_inventory');
    }

    public function getProductNameAttribute()
    {
        $product = Product::find($this->product_id);
        return $product?->name ?? '-';
    }
}
