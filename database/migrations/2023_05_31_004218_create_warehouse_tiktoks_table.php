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
        Schema::create('warehouse_tiktoks', function (Blueprint $table) {
            $table->id();
            $table->string('tiktok_warehouse_id')->nullable();
            $table->string('warehouse_name')->nullable();
            $table->string('warehouse_status')->nullable();
            $table->string('warehouse_sub_type')->nullable();
            $table->string('warehouse_type')->nullable();
            $table->string('is_default')->nullable();
            $table->string('warehouse_city')->nullable();
            $table->string('warehouse_contact')->nullable();
            $table->string('warehouse_district')->nullable();
            $table->string('warehouse_address')->nullable();
            $table->string('warehouse_phone')->nullable();
            $table->string('warehouse_region')->nullable();
            $table->string('warehouse_region_code')->nullable();
            $table->string('warehouse_state')->nullable();
            $table->string('warehouse_town')->nullable();
            $table->string('warehouse_zipcode')->nullable();
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
        Schema::dropIfExists('warehouse_tiktoks');
    }
};
