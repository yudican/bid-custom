<?php

namespace App\Console\Commands;

use App\Models\AuthTiktok;
use Illuminate\Console\Command;

class getTokenTiktok extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tiktok:token';

    /**
     * The console Get Token Tiktok.
     *
     * @var string
     */
    protected $description = 'Get Token Tiktok';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $access = AuthTiktok::find(1);
        $data = array(
            'grant_type' => 'refresh_token',
            'app_key' => getSetting('TIKTOK_APP_KEY'),
            'app_secret' => getSetting('TIKTOK_SECRET_KEY'),
            'refresh_token' => $access->refresh_token
        );
        $url = "https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=" . $data['app_key'] . "&app_secret=" . $data['app_secret'] . "&refresh_token=" . $data['refresh_token'] . "&grant_type=" . $data['grant_type'];

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array("Content-type: application/json")
        );
        $json_response = curl_exec($curl);


        curl_close($curl);

        $response = json_decode($json_response, true);
        $data = $response['data'];
        AuthTiktok::updateOrCreate(['id' => 1], [
            'access_token' => $data['access_token'],
            'access_token_expire_in' => $data['access_token_expire_in'],
            'refresh_token' => $data['refresh_token'],
            'refresh_token_expire_in' => $data['refresh_token_expire_in'],
            'open_id' => $data['open_id'],
            'seller_name' => $data['seller_name'],
            'seller_base_region' => $data['seller_base_region'],
            'user_type' => $data['user_type'],
        ]);


        return Command::SUCCESS;
    }
}
