<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Jobs\GetOrderTiktokDetail;
use App\Jobs\SendOrderTiktokGirafe;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class TiktokWebhookController extends Controller
{
        public function webhook(Request $request)
        {

                setSetting('tiktok response webhook request', json_encode($request->all()));
                GetOrderTiktokDetail::dispatch($request['data']['order_id'])->onQueue('send-notification');

                setSetting('webhook_status', 'oke');
                SendOrderTiktokGirafe::dispatch($request['data']['order_id'])->onQueue('send-notification');
                return response()->json([], 200);
        }
}
