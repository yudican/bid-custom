<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Kecamatan extends Model
{
    use HasFactory;
    protected $table = 'addr_kecamatan';
    protected $appends = ['nama_kabupaten', 'nama_provinsi', 'result', 'result_id'];

    /**
     * Get all of the kelurahan for the Kecamatan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function agentAddress()
    {
        return $this->hasMany(AgentAddress::class, 'kecamatan_id', 'pid');
    }

    public function getNamaKabupatenAttribute()
    {
        $kabupaten = Kabupaten::where('pid', $this->kab_id)->first();
        return $kabupaten ? $kabupaten->nama : '-';
    }

    public function getNamaProvinsiAttribute()
    {
        $provinsi = Provinsi::where('pid', $this->prov_id)->first();
        return $provinsi ? $provinsi->nama : '-';
    }

    public function getResultAttribute()
    {
        return $this->nama . '/' . $this->nama_kabupaten . '/' . $this->nama_provinsi;
    }

    public function getResultIdAttribute()
    {
        $kelurahan = DB::table('addr_kelurahan')->where('kec_id', $this->id)->first();
        $kabupaten = DB::table('addr_kabupaten')->where('pid', $this->kab_id)->first();
        $provinsi = DB::table('addr_provinsi')->where('pid', $this->prov_id)->first();
        $kelurahan_id = $kelurahan ? $kelurahan->pid : null;
        $kabupaten_id = $kabupaten ? $kabupaten->pid : null;
        $provinsi_id = $provinsi ? $provinsi->pid : null;
        $kodepos = $kelurahan ? $kelurahan->zip : null;

        // format: kelurahan_id/kecamatan_id/kabupaten_id/provinsi_id/kodepos
        return  $kelurahan_id . '/' . $this->pid . '/' . $kabupaten_id . '/' . $provinsi_id . '/' . $kodepos;
    }
}
