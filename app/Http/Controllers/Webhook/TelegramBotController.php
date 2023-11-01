<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Telegram\Bot\Api;

class TelegramBotController extends Controller
{
    public function handle(Request $request)
    {
        $telegram = new Api('6762912533:AAEfGBz90ytaVvh9Va2ZnWESI1qwa3vZHvE');

        try {
            $message = $request->input('message');
            $chatId = $message['chat']['id'];
            $text = $message['text'];
            setSetting('telegram$chatId', $chatId);
            // Process the incoming message or command
            // You can add your custom logic here
            $user = User::where('uid', $text)->first();
            if ($user) {
                if ($user->telegram_chat_id) {
                    return $telegram->sendMessage([
                        'chat_id' => $chatId,
                        'text' => "Akun notifikasi kamu sudah aktif ya, untuk menonaktifkannya bisa melalui menu ubah contact"
                    ]);
                }
                $user->update(['telegram_chat_id' => $chatId]);
                // Send a response back to the user
                $telegram->sendMessage([
                    'chat_id' => $chatId,
                    'text' => "Halo *{$user->name}*, Selamat Akun Anda Sudah Terhubung Untuk Notifikasi."
                ]);
            }
        } catch (\Throwable $th) {
            setSetting('telegram_error', $th->getMessage());
        }
    }
}
