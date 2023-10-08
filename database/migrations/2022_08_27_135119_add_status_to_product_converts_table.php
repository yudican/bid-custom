<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToProductConvertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_converts', function (Blueprint $table) {
            $table->enum('status', ['failed', 'success'])->default('failed')->after('convert_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_converts', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
