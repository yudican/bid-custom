<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    //use Uuid;
    use HasFactory;

    //public $incrementing = false;

    protected $fillable = ['product_id', 'sku', 'sku_tiktok', 'package_id', 'variant_id', 'name', 'slug', 'description', 'image', 'agent_price', 'customer_price', 'discount_price', 'discount_percent', 'stock', 'weight', 'status', 'sku_variant', 'qty_bundling', 'deleted_at', 'sales_channel'];

    protected $dates = [];
    protected $appends = ['price', 'price_level', 'image_url', 'margin_price', 'package_name', 'variant_name', 'u_of_m', 'stock_off_market', 'final_stock', 'sales_channels', 'stock_warehouse', 'sales_channels_name', 'sales_channel_uid'];
    /**
     * Get the product that owns the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the package that owns the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Get the variant that owns the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    /**
     * Get the productMarginBottom that owns the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function productMarginBottom()
    {
        return $this->hasOne(MarginBottom::class, 'product_variant_id');
    }

    /**
     * Get all of the prices for the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function prices()
    {
        return $this->hasMany(Price::class);
    }

    /**
     * The salesChannels that belong to the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function salesChannels()
    {
        return $this->belongsToMany(SalesChannel::class, 'product_variant_channel', 'product_variant_id', 'channel_uid');
    }

    // salesChannelsName
    public function getSalesChannelsNameAttribute()
    {
        $salesChannels = $this->salesChannels()->pluck('sales_channels.channel_name')->toArray();
        return $salesChannels;
    }

    // salesChannelsUid
    public function getSalesChannelUidAttribute()
    {
        $salesChannels = $this->salesChannels()->pluck('sales_channels.channel_uid')->toArray();
        return $salesChannels;
    }

    /**
     * Get all of the inventoryStock for the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function inventoryStock()
    {
        return $this->hasMany(InventoryItem::class, 'product_id')->whereHas('inventoryStock', function ($query) {
            return $query->whereIn('status', ['ready', 'done']);
        })->where('type', 'stock');
    }

    /**
     * Get all of the productVariantStock for the ProductVariant
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productVariantStock()
    {
        $company_account = CompanyAccount::whereStatus(1)->first();
        return $this->hasMany(ProductVariantStock::class)->where('company_id', $company_account->id);
    }

    public function getFinalStockAttribute()
    {
        $stock = $this->productVariantStock()->sum('qty');
        return $stock > 0 ? $stock : 0;
    }

    public function getStockOffMarketAttribute()
    {
        $stock = $this->productVariantStock()->sum('stock_of_market');
        return $stock > 0 ? $stock : 0;
    }

    public function getPriceAttribute()
    {
        $role = auth()->user()->role;
        $level  = Level::whereHas('roles', function ($query) use ($role) {
            $query->where('role_id', $role->id);
        })->first();
        $price = $this->prices()->whereHas('level', function ($query) use ($level) {
            return $query->where('name', $level ? $level->name : 'Retail');
        })->first();
        if ($price) {
            return [
                'basic_price' => $price->basic_price,
                'final_price' => $price->final_price,
            ];
        }
        return [
            'basic_price' => 0,
            'final_price' => 0,
        ];
    }

    public function getPrice($role_user)
    {
        $role = Role::where('role_type', $role_user)->first();
        $level  = Level::whereHas('roles', function ($query) use ($role) {
            $query->where('role_id', $role->id);
        })->first();
        $price = $this->prices()->whereHas('level', function ($query) use ($level) {
            return $query->where('name', $level ? $level->name : 'Retail');
        })->first();
        if ($price) {
            return [
                'basic_price' => $price->basic_price,
                'final_price' => $price->final_price,
            ];
        }
        return [
            'basic_price' => 0,
            'final_price' => 0,
        ];
    }

    // get costummer_price attribute
    public function getPriceLevelAttribute()
    {
        $levels = Level::all()->map(function ($level) {
            $price = $this->prices()->whereHas('level', function ($query) use ($level) {
                return $query->where('name', $level->name);
            })->first();
            if ($price) {
                return [
                    'level_name' => $level->name,
                    'basic_price' => $price->basic_price,
                    'final_price' => $price->final_price,
                ];
            }
            return [
                'level_name' => $level->name,
                'basic_price' => 0,
                'final_price' => 0,
            ];
        });

        return $levels;
    }

    /**
     * Get all of the productStocks for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productStocks()
    {
        return $this->hasMany(ProductStock::class, 'product_id', 'product_id')->where('is_allocated', 1);
    }

    // /**
    //  * Get all of the productStocks for the Product
    //  *
    //  * @return \Illuminate\Database\Eloquent\Relations\HasMany
    //  */

    // public function getFinalStockAttribute()
    // {
    //     $stock = $this->productStocks()->sum('stock');
    //     return $stock ?? 0;
    // }

    public function getImageUrlAttribute()
    {
        return $this->image ? getImage($this->image) : asset('assets/img/card.svg');
    }

    public function getMarginPriceAttribute()
    {
        $margin = $this->productMarginBottom()->first();
        if ($margin) {
            return $margin->margin;
        }
        return 0;
    }

    public function getVariantNameAttribute()
    {
        return $this->variant?->name ?? '-';
    }

    public function getPackageNameAttribute()
    {
        return $this->package?->name ?? '-';
    }

    public function getUOfMAttribute()
    {
        $sku = SkuMaster::where('sku', $this->sku)->first();
        return $sku?->package_name ?? '-';
    }

    public function getSalesChannelsAttribute()
    {
        $sales_channels = $this->sales_channel;
        if ($sales_channels) {
            $sales_channels = explode(',', $sales_channels);

            return $sales_channels;
        }

        return [];
    }

    // get stock_warehouse
    public function getStockWarehouseAttribute()
    {
        $warehouses = [];
        $products = $this->productVariantStock()->groupBy('warehouse_id')->select('*')->selectRaw("SUM(stock_of_market) as stock_total")->get();
        foreach ($products as $productStock) {
            $warehouses[] = [
                'id' => $productStock->warehouse_id,
                'warehouse_name' => $productStock->warehouse_name,
                'stock' => $productStock->stock_total,
            ];
        }

        return $warehouses;
    }
}
