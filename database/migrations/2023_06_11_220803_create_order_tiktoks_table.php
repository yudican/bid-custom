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
        Schema::create('order_tiktoks', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_order_id')->nullable();
            $table->string('buyer_uid')->nullable();
            $table->string('create_time')->nullable();
            $table->string('delivery_option')->nullable();
            $table->string('delivery_option_description')->nullable();
            $table->string('fulfillment_type')->nullable();
            $table->string('is_cod')->nullable();
            $table->string('paid_time')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_method_name')->nullable();
            $table->string('shipping_provider')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('warehouse_id')->nullable();
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
        Schema::dropIfExists('order_tiktoks');
    }
};
