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
        Schema::create('addon_tiktok_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->json('order_items');
            $table->string('pay_method');
            $table->string('pembeli');
            $table->json('price');
            $table->string('seller_id');
            $table->string('shipping_kabupaten');
            $table->string('shipping_provinsi');
            $table->string('tracking_logistic');
            $table->string('warehouse_id');
            $table->string('warehouse_name');
            $table->string('whatsapp');
            $table->string('tracking_number');
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
        Schema::dropIfExists('addon_tiktok_orders');
    }
};
