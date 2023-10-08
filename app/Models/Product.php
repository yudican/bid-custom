<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //use Uuid;
    use HasFactory;
    protected $appends = ['price', 'final_stock', 'variant_stock', 'image_url', 'variant_id', 'category_name', 'category_ids', 'brand_name', 'u_of_m', 'stock_warehouse', 'sales_channels'];
    //public $incrementing = false;

    protected $fillable = ['category_id', 'code', 'brand_id', 'name', 'slug', 'description', 'image', 'agent_price', 'customer_price', 'discount_price', 'discount_percent', 'stock', 'weight', 'is_varian', 'status', 'product_like', 'deleted_at', 'sku'];

    protected $dates = [];

    /**
     * Get the category that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the category that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    /**
     * Get all of the prices for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function prices()
    {
        return $this->hasMany(Price::class);
    }

    /**
     * Get the brand that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get all of the productImages for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get all of the variant for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getVariantStockAttribute()
    {
        $stock = 0;
        foreach ($this->variants as $variant) {
            $stock += $variant->stock;
        }
        return $stock;
    }

    // get costummer_price attribute
    public function getPriceAttribute()
    {
        $variant = $this->variants()->first();
        if ($variant) {
            return $variant->price;
        }
        return [
            'basic_price' => 0,
            'final_price' => 0,
        ];
    }
    // get costummer_price attribute
    public function getPriceLevelAttribute()
    {
        $variant = $this->variants()->first();
        if ($variant) {
            return $variant->price_level;
        }

        return [
            'level_name' => 'Retail',
            'basic_price' => 0,
            'final_price' => 0,
        ];
    }

    public function getUOfMAttribute()
    {
        return 'Box';
    }

    /**
     * Get all of the productStocks for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productStocks()
    {
        $company_account = CompanyAccount::whereStatus(1)->first();
        return $this->hasMany(ProductStock::class)->where('is_allocated', 1)->where('company_id', $company_account->id);
    }


    /**
     * Get all of the productStocks for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */

    public function getFinalStockAttribute()
    {

        return $this->productStocks()->sum('stock');
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? getImage($this->image) : asset('assets/img/card.svg');
    }

    public function getVariantIdAttribute()
    {
        $variant = $this->variants()->first();
        if ($variant) {
            return $variant->id;
        }
        return null;
    }

    public function getBrandNameAttribute()
    {
        return $this->brand->name ?? '-';
    }

    public function getCategoryNameAttribute()
    {
        return $this->categories()->pluck('categories.name')->implode(', ');
    }

    public function getCategoryIdsAttribute()
    {
        return $this->categories()->pluck('categories.id')->toArray();
    }

    public function getStockWarehouseAttribute()
    {
        $warehouses = [];
        $products = $this->productStocks()->groupBy('warehouse_id')->select('*')->selectRaw("SUM(stock) as stock_total")->get();
        foreach ($products as $productStock) {
            $warehouses[] = [
                'id' => $productStock->id,
                'warehouse_name' => $productStock->warehouse_name,
                'stock' => $productStock->stock_total,
            ];
        }

        return $warehouses;
    }

    public function getSalesChannelsAttribute()
    {
        $salesChannels = [];
        foreach ($this->variants as $key => $value) {
            foreach ($value->sales_channels as $key => $item) {
                $salesChannels[$item] = $item;
            }
        }

        $newSales = [];
        foreach ($salesChannels as $key => $sales) {
            $newSales[] = $sales;
        }
        return $newSales;
    }
}
