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
        Schema::table('retur_masters', function (Blueprint $table) {
            $table->enum('type', ['customer', 'distributor', 'mitra'])->default('customer')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('retur_masters', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
