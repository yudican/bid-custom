<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_item_tiktoks', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_order_id')->nullable();
            $table->string('product_id')->nullable();
            $table->string('product_name')->nullable();
            $table->string('quantity')->nullable();
            $table->string('seller_sku')->nullable();
            $table->string('sku_id')->nullable();
            $table->string('sku_original_price')->nullable();
            $table->string('sku_platform_discount')->nullable();
            $table->string('sku_platform_discount_total')->nullable();
            $table->string('sku_sale_price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_item_tiktoks');
    }
};
