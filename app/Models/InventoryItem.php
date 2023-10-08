<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'uid_inventory',
        'product_id',
        'price',
        'qty',
        'subtotal',
        'type',
        'ref',
        'notes',
        'case_return',
        'qty_diterima',
        'is_master',
        'received_number',
        'received_vendor'
    ];

    protected $appends = ['sku', 'u_of_m', 'product_name'];

    /**
     * Get the product that owns the InventoryItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(ProductVariant::class, 'product_id');
    }

    /**
     * Get the stock that owns the InventoryItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function inventoryStock()
    {
        return $this->belongsTo(InventoryProductStock::class, 'uid_inventory', 'uid_inventory');
    }


    /**
     * Get the stock that owns the InventoryItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function inventoryReturn()
    {
        return $this->belongsTo(InventoryProductReturn::class, 'uid_inventory', 'uid_inventory');
    }

    public function getSkuAttribute()
    {
        $product = ProductVariant::find($this->product_id);
        return $product->sku ?? '-';
    }

    public function getUOfMAttribute()
    {
        $sku_master = SkuMaster::where('sku', $this->sku)->first();
        return $sku_master?->package_name ?? '-';
    }

    public function getProductNameAttribute()
    {
        $product = ProductVariant::find($this->product_id);
        return $product?->name ?? '-';
    }
}
