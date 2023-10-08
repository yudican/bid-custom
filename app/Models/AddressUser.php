<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AddressUser extends Model
{
    use HasFactory;
    // guarded
    protected $guarded = [];

    // appends alamat user
    protected $appends = ['alamat_detail', 'destination_code', 'kecamatan', 'kec_id'];

    /**
     * Get the user that owns the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getAlamatDetailAttribute()
    {
        $provinsi =  DB::table('addr_provinsi')->where('pid', $this->attributes['provinsi_id'])->first();
        $kabupaten =  DB::table('addr_kabupaten')->where('pid', $this->attributes['kabupaten_id'])->first();
        $kecamatan =  DB::table('addr_kecamatan')->where('pid', $this->attributes['kecamatan_id'])->first();
        $kelurahan =  DB::table('addr_kelurahan')->where('pid', $this->attributes['kelurahan_id'])->first();

        // 
        $prov = $provinsi ? $provinsi->nama : '';
        $kab = $kabupaten ? $kabupaten->nama : '';
        $kec = $kecamatan ? $kecamatan->nama : '';
        $kel = $kelurahan ? $kelurahan->nama : '';
        $kodepos = $kelurahan ? $kelurahan->zip : $this->attributes['kodepos'];
        $alamat = "{$this->attributes['alamat']} {$kel}, {$kec}, {$kab}, {$prov}  - {$kodepos}";

        return $alamat;
    }

    public function getDestinationCodeAttribute()
    {
        $kelurahan =  DB::table('addr_kelurahan')->where('pid', $this->kelurahan_id)->first();
        return $kelurahan ? $kelurahan->kodejne : '';
    }

    public function getKecamatanAttribute()
    {
        $kecamatan =  Kecamatan::where('pid', $this->kecamatan_id)->first();
        return $kecamatan ? $kecamatan->result : '-';
    }

    public function getKecIdAttribute()
    {
        $kecamatan =  Kecamatan::where('pid', $this->kecamatan_id)->first();
        return $kecamatan ? $kecamatan->id : null;
    }
}
