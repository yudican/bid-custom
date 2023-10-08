<?php

use App\Http\Controllers\SendEmailController;
use App\Jobs\PrintInvoice;
use App\Jobs\SendNotifications;
use App\Models\GeneralSetting;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Models\Role;
use App\Models\User;
use App\Models\Brand;
use App\Models\Cases;
use App\Models\LogError;
use App\Models\OrderLead;
use App\Models\OrderManual;
use App\Models\Product;
use App\Models\ProductConvert;
use App\Models\ProductConvertDetail;
use App\Models\ProductImportTemp;
use App\Models\ProductVariant;
use App\Models\RefundMaster;
use App\Models\ReturMaster;
use App\Models\Transaction;
use App\Models\TransactionAgent;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Pusher\Pusher;
use Telegram\Bot\Api;

use function Clue\StreamFilter\fun;

if (!function_exists('getTemplateNotification')) {
  /**
   * @param string $notification_code Notification code
   * @param array $notification_data Notification data
   */
  function getTemplateNotification($notification_code = null, $attr = [])
  {
    $data = [
      'title' => null,
      'name' => null,
      'body' => null,
    ];
    $template = NotificationTemplate::whereNotificationCode($notification_code)->first();
    if ($template) {
      $data['title'] = replaceNotification($template->notification_title, $attr);
      $data['name'] = $template->notification_subtitle;
      $data['body'] = replaceNotification($template->notification_body, $attr);
    }

    return $data;
  }
}

if (!function_exists('sendNotificationEmail')) {
  /**
   * @param string $notification_code Notification code
   * @param string $email_to Email Destination
   * @param array $notification_data Notification data
   * @param array $email_cc Notification email cc
   * @param string $path Notification email path
   */
  function sendNotificationEmail($notification_code, $email_to = 'yucanoke@gmail.com', $notification_data = [], $data = [], $path = 'email-template')
  {
    if (validate_email($email_to)) {
      $template = getTemplateNotification($notification_code, $notification_data);
      if (count($template) > 0) {
        $notificationEmail = [
          'view' => $path,
          'cc' => [],
          'body' => $template['body'],
          'date' => date('l, d F Y H:i:s'),
          'type' => $template['name'],
          'actionUrl' => isset($notification_data['actionUrl']) ? $notification_data['actionUrl'] : null,
          'actionTitle' => isset($notification_data['actionTitle']) ? $notification_data['actionTitle'] : null,
          'invoice' => isset($notification_data['invoice']) ? $notification_data['invoice'] : null,
          'price' => isset($notification_data['price']) ? $notification_data['price'] : null,
          'payment_method' => isset($notification_data['payment_method']) ? $notification_data['payment_method'] : null,
          'transaction_id' => isset($data['transaction_id']) ? $data['transaction_id'] : null,
          'brand_id' => isset($data['brand_id']) ? $data['brand_id'] : null,
          'email' => $email_to,
          'title' => $template['title'],
        ];

        SendNotifications::dispatch($notificationEmail)->onQueue('send-notification');
      }
    }

    return true;
  }
}

if (!function_exists('replaceNotification')) {
  function replaceNotification($string, $attr = [])
  {

    if ($attr) {
      $replace = [];
      foreach ($attr as $key => $attribute) {
        $replace['[' . $key . ']'] = $attribute;
      }
      $string = strtr($string, $replace);
    }

    return $string;
  }
}

// if (!function_exists('createNotification')) {
//   function createNotification($notification_code, $data = [], $notification_data = [])
//   {
//     $checkTemplate = NotificationTemplate::whereNotificationCode($notification_code)->first();
//     if ($checkTemplate) {
//       $template = getTemplateNotification($notification_code, $notification_data);
//       if (in_array($checkTemplate->notification_type, ['email', 'amail-alert'])) {
//         foreach ($checkTemplate->roles as $role) {
//           Notification::create([
//             'title' => $template['title'],
//             'body' => $template['body'],
//             'user_id' => isset($data['user_id']) ? $data['user_id'] : null,
//             'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
//             'type' => isset($data['type']) ? $data['type'] : null,
//             'role_id' => $role->id
//           ]);
//         }
//         if (isset($data['user_id'])) {
//           $user = User::find($data['user_id']);
//           if ($user) {
//             sendNotificationEmail($notification_code, $user->email, $notification_data);
//           }
//         }
//       }
//       if (in_array($checkTemplate->notification_type, ['alert'])) {
//         foreach ($checkTemplate->roles as $role) {
//           Notification::create([
//             'title' => $template['title'],
//             'body' => $template['body'],
//             'user_id' => isset($data['user_id']) ? $data['user_id'] : null,
//             'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
//             'type' => isset($data['type']) ? $data['type'] : null,
//             'role_id' => $role->id
//           ]);
//         }
//       }

//       return true;
//     }

//     return false;
//   }
// }

// send email public
if (!function_exists('sendEmailSingle')) {
  function sendEmailSingle($notification_code, $data = [], $notification_data = [], $other_data = [], $templateEmail = 'email-template')
  {
    if (isset($data['email'])) {
      if (validate_email($data['email'])) {
        return sendNotificationEmail($notification_code, $data['email'], $notification_data, $other_data, $templateEmail);
      }
    }

    return true;
  }
}

if (!function_exists('createNotification')) {
  function createNotification($notification_code, $data = [], $notification_data = [], $other_data = [], $templateEmail = 'email-template')
  {
    $checkTemplate = NotificationTemplate::whereNotificationCode($notification_code)->first();
    if ($checkTemplate) {
      $template = getTemplateNotification($notification_code, $notification_data);
      if (in_array($checkTemplate->notification_type, ['amail-alert'])) {
        if (isset($data['user_id'])) {
          $userData = User::find($data['user_id']);
          if ($userData) {
            setSetting('REFRESH_NOTIFICATION', 'true');
            $role = $userData->role;
            Notification::create([
              'title' => $template['title'],
              'body' => replaceNotification($template['body'], ['admin' => $role->role_name]),
              'user_id' => $userData->id,
              'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
              'type' => isset($data['type']) ? $data['type'] : null,
              'role_id' => $role->id
            ]);
            return sendNotificationEmail($notification_code, $userData->email, array_merge(['admin' => $role->role_name], $notification_data), $other_data, $templateEmail);
          }
        } else {
          setSetting('REFRESH_NOTIFICATION', 'true');
          foreach ($checkTemplate->roles as $role) {
            foreach ($role->users as $user) {
              Notification::create([
                'title' => $template['title'],
                'body' => replaceNotification($template['body'], ['admin' => $role->role_name]),
                'user_id' => $user->id,
                'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
                'type' => isset($data['type']) ? $data['type'] : null,
                'role_id' => $role->id
              ]);
              sendNotificationEmail($notification_code, $user->email, array_merge(['admin' => $role->role_name], $notification_data), $other_data, $templateEmail);
            }
          }
        }
      }

      if (in_array($checkTemplate->notification_type, ['email'])) {
        if (isset($data['user_id'])) {
          $userData = User::find($data['user_id']);
          $role = $userData->role;
          if ($userData) {
            return  sendNotificationEmail($notification_code, $userData->email, array_merge(['admin' => $role->role_name], $notification_data), $other_data, $templateEmail);
          }
        } else {
          foreach ($checkTemplate->roles as $role) {
            foreach ($role->users as $user) {
              sendNotificationEmail($notification_code, $user->email, array_merge(['admin' => $role->role_name], $notification_data), $other_data, $templateEmail);
            }
          }
        }
      }

      if (in_array($checkTemplate->notification_type, ['alert'])) {
        if (isset($data['user_id'])) {
          $user = User::find($data['user_id']);
          if ($user) {
            setSetting('REFRESH_NOTIFICATION', 'true');
            return  Notification::create([
              'title' => $template['title'],
              'body' => replaceNotification($template['body'], ['admin' => $user->role->role_name]),
              'user_id' => $user->id,
              'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
              'type' => isset($data['type']) ? $data['type'] : null,
              'role_id' => $user->role->id
            ]);
          }
        } else {
          setSetting('REFRESH_NOTIFICATION', 'true');
          foreach ($checkTemplate->roles as $role) {
            foreach ($role->users as $user) {
              Notification::create([
                'title' => $template['title'],
                'body' => replaceNotification($template['body'], ['admin' => $role->role_name]),
                'user_id' => $user->id,
                'other_id' => isset($data['other_id']) ? $data['other_id'] : null,
                'type' => isset($data['type']) ? $data['type'] : null,
                'role_id' => $role->id
              ]);
            }
          }
        }
      }
      return true;
    }
    return false;
  }
}


// get rincian bayar
if (!function_exists('getRincianBayar')) {
  function getRincianPembayaran($transaction = null)
  {
    if ($transaction) {
      $rincian_bayar = '
      <tr>
          <td colspan="2"><span style="color:#000;">Detail pembayaran :</span></td>
      </tr>';
      $rincian_bayar .= '
        <tr>
            <td width="40%">Metode Pembayaran</td>
            <td>: ' . $transaction->paymentMethod->nama_bank . '</td>
        </tr>';

      if ($transaction->paymentMethod) {
        $type = $transaction->paymentMethod->payment_type;
        $channel = $transaction->paymentMethod->payment_channel;
        if ($type == 'Otomatis' && $channel == 'bank_transfer') {
          $rincian_bayar .= '
                    <tr>
                        <td width="40%">Nomor Virtual Akun</td>
                        <td style="color:#000;">: <span style="color:#000;">' . $transaction->payment_va_number . '</span></td>
                    </tr>';
        } else if ($type == 'Manual' && $channel == 'bank_transfer') {
          $rincian_bayar .= '
                    <tr>
                        <td width="40%">Nama Rekening</td>
                        <td style="color:#000;">: <span style="color:#000;">' . $transaction->paymentMethod->nama_rekening_bank . '</span></td>
                    </tr>';
          $rincian_bayar .= '
                    <tr>
                        <td width="40%">Nomor Rekening</td>
                        <td style="color:#000;">: <span style="color:#000;">' . $transaction->paymentMethod->nomor_rekening_bank . '</span></td>
                    </tr>';
        }
      }
      $rincian_bayar .= '
        <tr>
            <td width="40%">Batas Pembayaran</td>
            <td style="color:#000;">: <span style="color:#000;">' . date('l,d F Y', strtotime($transaction->created_at->addDays(1))) . '</span></td>
        </tr>';

      $status_pembayaran = $transaction->status == 1 ? 'Belum Bayar' : 'Sudah Bayar';
      $rincian_bayar .= '
        <tr>
            <td width="40%">Status Pembayaran</td>
            <td style="color:#000;">: <span style="color:#000;">' . $status_pembayaran . '</span> </td>
        </tr>';



      $content = '<table class="table table-bordered"  width="100%">';
      $content .= '<tbody>';
      $content .= $rincian_bayar;
      $content .= '</tbody>';
      $content .= '</table>';


      return $content;
    }

    return '';
  }
}

// rincian transaksi
if (!function_exists('getRincianTransaksi')) {
  function getRincianTransaksi($transaction = null)
  {
    if ($transaction) {
      $rincian_transaksi = '
        <tr>
            <td colspan="2"><span style="color:#000;">Detail Pesanan :</span></td>
        </tr>';
      $rincian_transaksi .= '
        <tr>
            <td width="40%">Nomor Transaksi</td>
            <td><span style="color:#000;">: ' . $transaction->id_transaksi . '</span></td>
        </tr>';
      $rincian_transaksi .= '
        <tr>
            <td width="40%">Tanggal Transaksi</td>
            <td><span style="color:#000;">: ' . $transaction->created_at . '</span></td>
        </tr>';
      $rincian_transaksi .= '
        <tr>
            <td width="40%">Nominal Transaksi</td>
            <td><span style="color:#000;">: Rp ' . number_format($transaction->nominal) . '</span></td>
        </tr>';
      $rincian_transaksi .= '
        <tr>
            <td width="40%">Metode Pengiriman</td>
            <td><span style="color:#000;">: JNE REG (Bebas Ongkir)</span></td>
        </tr>';



      $rincian_transaksi .= '
        <tr>
            <td>Produk</td>
            <td>' . getProductName($transaction->transactionDetail) . '</td>
        </tr>';

      $rincian_transaksi .= '
        <tr>
            <td width="40%">Total Produk</td>
            <td><span style="color:#000;">: ' . $transaction->transactionDetail->count() . ' Pcs</span></td>
        </tr>';

      if ($transaction->diskon > 0) {
        $rincian_transaksi .= '
            <tr>
                <td width="40%">Diskon</td>
                <td><span style="color:#000;">: - Rp ' . number_format($transaction->diskon) . '</span></td>
            </tr>';
      }

      if ($transaction->payment_unique_code > 0) {
        $rincian_transaksi .= '
            <tr>
                <td width="40%">Kode Unik</td>
                <td><span style="color:#000;">: ' . $transaction->payment_unique_code . '</span></td>
            </tr>';
      }

      $rincian_transaksi .= '
        <tr>
            <td width="40%">Total Harga (' . $transaction->transactionDetail->count() . ')</td>
            <td><span style="color:#000;">: Rp ' . number_format(sumValue($transaction->transactionDetail, 'subtotal')) . '</span></td>
        </tr>';

      $rincian_transaksi .= '
        <tr>
            <td width="40%">Total Bayar</td>
            <td><span style="color:#000;">: Rp ' . number_format($transaction->nominal) . '</span></td>
        </tr>';




      $content = '<table width="100%;">';
      $content .= '<tbody>';
      $content .= $rincian_transaksi;
      $content .= '</tbody>';
      $content .= '</table>';

      return $content;
    }

    return '';
  }
}

// detail product order
if (!function_exists('detailProductOrder')) {
  function detailProductOrder($product_needs = null)
  {
    if ($product_needs && is_array($product_needs)) {
      $content = '<table class="table table-bordered"  width="100%">';
      $content .= '<thead>';
      $content .= '<tr>';
      $content .= '<th>No</th>';
      $content .= '<th>Nama Produk</th>';
      $content .= '<th>Harga</th>';
      $content .= '<th>Jumlah</th>';
      $content .= '<th>Subtotal</th>';
      $content .= '</tr>';
      $content .= '</thead>';
      $content .= '<tbody>';
      $no = 1;
      foreach ($product_needs as $product_need) {
        if ($product_need->product) {
          $content .= '<tr>';
          $content .= '<td>' . $no . '</td>';
          $content .= '<td>' . $product_need->product->name . '</td>';
          $content .= '<td>Rp ' . number_format($product_need->price) . '</td>';
          $content .= '<td>' . $product_need->qty . '</td>';
          $content .= '<td>Rp ' . number_format($product_need->qty * $product_need->price) . '</td>';
          $content .= '</tr>';
          $no++;
        }
      }
      $content .= '</tbody>';
      $content .= '</table>';
      return $content;
    }
    return '';
  }
}

// get image url
if (!function_exists('getImageUrl')) {
  function getImageUrl($image = null)
  {
    if ($image) {
      return getImage($image);
    }

    return asset('assets/img/no-image.jpeg');
  }
}

// get status retur
if (!function_exists('getStatusRetur')) {
  function getStatusRetur($status = null)
  {
    switch ($status) {
      case 0:
        return 'Waiting Approval';
        break;
      case 1:
        return 'Approved';
        break;
      case 2:
        return 'Rejected';
        break;
      case 3:
        return 'Barang Diterima';
        break;
      default:
        return 'Waiting Approval';
        break;
    }
  }
}

// get status lead
if (!function_exists('getStatusLead')) {
  function getStatusLead($status = null)
  {
    switch ($status) {
      case 0:
        return 'Created';
        break;
      case 1:
        return 'Qualified';
        break;
      case 2:
        return 'Waiting Approval';
        break;
      case 3:
        return 'Unqualified';
        break;
      case 4:
        return 'Cancel By User';
        break;
      case 5:
        return 'Other';
        break;
      case 6:
        return 'Lead Rejected';
        break;
      default:
        return 'Created';
        break;
    }
  }
}

// get status order lead
if (!function_exists('getStatusOrderLead')) {
  function getStatusOrderLead($status = null)
  {
    switch ($status) {
      case 0:
        return 'Created';
        break;
      case 1:
        return 'New';
        break;
      case 2:
        return 'Open';
        break;
      case 3:
        return 'Closed';
        break;
      case 4:
        return 'Canceled';
        break;
      default:
        return 'New';
        break;
    }
  }
}

// get status case
if (!function_exists('getStatusCase')) {
  function getStatusCase($status = null)
  {
    switch ($status) {
      case 1:
        return 'New';
        break;
      case 2:
        return 'Open';
        break;
      case 3:
        return 'Solved';
        break;
      case 4:
        return 'Reopen';
        break;
      case 5:
        return 'Canceled';
        break;
      default:
        return 'New';
        break;
    }
  }
}

// get status pengiriman order lead
if (!function_exists('getStatusPengiriman')) {
  function getStatusPengiriman($status = null)
  {
    switch ($status) {
      case 0:
        return 'Dikemas';
        break;
      case 1:
        return 'Sedang Dikirim';
        break;
      case 2:
        return 'Terkirim';
        break;
      case 3:
        return 'Retur';
        break;
      default:
        return 'Dikemas';
        break;
    }
  }
}

// get status activity lead
if (!function_exists('getStatusActivity')) {
  function getStatusActivity($status = null)
  {
    switch ($status) {
      case 1:
        return 'In Progress';
        break;
      case 2:
        return 'Open';
        break;
      case 3:
        return 'Completed';
        break;
      case 4:
        return 'Cancel';
        break;
      default:
        return 'In Progress';
        break;
    }
  }
}

// get name
if (!function_exists('getName')) {
  function getName($user_id = null)
  {
    $user = User::find($user_id);
    return $user->name;
  }
}

// get brand
if (!function_exists('getBrand')) {
  function getBrand($brand_id = null)
  {
    $brand = Brand::find($brand_id);
    return $brand->name;
  }
}

// sum value in array object
if (!function_exists('sumValue')) {
  function sumValue($array = null, $key = null)
  {
    if ($array) {
      $sum = 0;
      foreach ($array as $value) {
        $sum += $value->$key;
      }
      return $sum;
    }

    return 0;
  }
}

// get product name
if (!function_exists('getProductName')) {
  function getProductName($transactions = [])
  {
    $product = '';
    foreach ($transactions as $key => $detail) {
      $price = number_format($detail->subtotal);
      $product_name = $detail->product->name;
      $qty = $detail->qty;
      if ($key < 1) {
        $product .= ' <span style="color:#000;">: ' . "$product_name ($qty} PCS):IDR {$price}" . '</span><br />';
      } else {
        $product .= '  <span style="color:#000;">: ' . "$product_name ($qty} PCS):IDR {$price}" . '</span><br />';
      }
    }
    return $product;
  }
}

// get setting
if (!function_exists('getSetting')) {
  function getSetting($key)
  {
    $setting = GeneralSetting::where('setting_code', $key)->first();

    if ($setting) {
      if ($setting->setting_value == 'true') {
        return true;
      } else if ($setting->setting_value == 'false') {
        return false;
      } else if ($setting->setting_value == 1) {
        return true;
      } else if ($setting->setting_value == 0) {
        return true;
      } else {
        return $setting->setting_value;
      }
    }

    return null;
  }
}

// set setting
// get setting
if (!function_exists('setSetting')) {
  function setSetting($code, $value)
  {
    $setting = GeneralSetting::updateOrCreate(['setting_code' => $code,], [
      'setting_code' => $code,
      'setting_value' => $value
    ]);

    return $setting;
  }
}
// get setting
if (!function_exists('removeSetting')) {
  function removeSetting($code)
  {
    $setting = GeneralSetting::where('setting_code', $code)->first();
    if ($setting) {
      $setting->delete();
    }

    return $setting;
  }
}

// get subtotal from carts
if (!function_exists('getSubtotal')) {
  function getSubtotal($carts = [])
  {
    $subtotal = 0;
    foreach ($carts as $cart) {
      if ($cart->selected > 0) {
        $subtotal += $cart->product->priceData['final_price'] * $cart->qty;
      }
    }
    return $subtotal;
  }
}

// get subtotal from carts
if (!function_exists('getTotalQty')) {
  function getTotalQty($carts = [])
  {
    $subtotal = 0;
    foreach ($carts as $cart) {
      if ($cart->selected > 0) {
        $subtotal += $cart->qty;
      }
    }
    return $subtotal;
  }
}

if (!function_exists('getTotalWeight')) {
  function getTotalWeight($carts = [])
  {
    $subtotal = 0;
    foreach ($carts as $cart) {
      if ($cart->selected > 0) {
        $subtotal = $cart->product->weight;
      }
    }
    return $subtotal;
  }
}

// payment guide
if (!function_exists('paymentguide')) {
  function paymentguide($key = null)
  {
    if (!$key) return [];

    $data = [
      'bca' => [
        [
          'id' => 1,
          'name' => "ATM BCA",
          'details' => [
            [
              'id' => 1,
              'title' => "Pada menu utama, pilih <strong>Transaksi Lainnya.</strong>",
            ],
            [
              'id' => 2,
              'title' => "Pilih <strong>Transfer.</strong>",
            ],
            [
              'id' => 3,
              'title' => "Pilih Ke Rek <strong>BCA Virtual Account.</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Masukkan Nomor <strong>Rekening pembayaran</strong> (11 digit) Anda lalu tekan <strong>Benar.</strong>",
            ],
            [
              'id' => 5,
              'title' => "Masukkan jumlah tagihan yang akan anda bayar.",
            ],
            [
              'id' => 6,
              'title' =>
              "Pada halaman konfirmasi transfer akan muncul detail pembayaran Anda. Jika informasi telah sesuai tekan <strong>Ya.</strong>",
            ],
          ],
        ],
        [
          'id' => 2,
          'name' => "Klik BCA",
          'details' => [
            [
              'id' => 1,
              'title' => "Pilih menu <strong>Transfer Dana.</strong>",
            ],
            [
              'id' => 2,
              'title' => "Pilih <strong>Transfer ke BCA Virtual Account.</strong>",
            ],
            [
              'id' => 3,
              'title' =>
              "<strong>Masukkan nomor BCA Virtual Account,</strong> atau <strong>pilih Dari Daftar Transfer.</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Jumlah yang akan ditransfer, nomor rekening dan nama merchant akan muncul di halaman konfirmasi pembayaran, jika informasi benar klik <strong>Lanjutkan.</strong>",
            ],
            [
              'id' => 5,
              'title' =>
              "Ambil <strong>BCA Token</strong> Anda dan masukkan KEYBCA Response <strong>APPLI 1</strong> dan Klik <strong>Submit.</strong>",
            ],
            [
              'id' => 6,
              'title' => "Transaksi Anda selesai.",
            ],
          ],
        ],
        [
          'id' => 3,
          'name' => "m-BCA",
          'details' => [
            [
              'id' => 1,
              'title' => "Lakukan log in pada aplikasi <strong>BCA Mobile.</strong>",
            ],
            [
              'id' => 2,
              'title' =>
              "Pilih menu <strong>m-BCA</strong>, kemudian masukkan <strong>kode akses m-BCA.</strong>",
            ],
            [
              'id' => 3,
              'title' => "	Pilih <strong>m-Transfer > BCA Virtual Account.</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Pilih dari <strong>Daftar Transfer</strong>, atau masukkan <strong>Nomor Virtual Account</strong> tujuan.",
            ],
            [
              'id' => 5,
              'title' => "Masukkan <strong>jumlah yang ingin dibayarkan.</strong>",
            ],
            [
              'id' => 6,
              'title' => "Masukkan <strong>pin m-BCA.</strong>",
            ],
            [
              'id' => 7,
              'title' =>
              "Pembayaran selesai. Simpan notifikasi yang muncul sebagai bukti pembayaran.",
            ],
          ],
        ],
      ],

      'mandiri' => [
        [
          'id' => 1,
          'name' => "ATM Mandiri",
          'details' => [
            [
              'id' => 1,
              'title' => "Pada menu utama, pilih <strong>Bayar/Beli.</strong>",
            ],
            [
              'id' => 2,
              'title' => "Pilih <strong>Lainnya</strong>",
            ],
            [
              'id' => 3,
              'title' => "Pilih <strong>Multi Payment</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Masukkan 70012 (kode perusahaan Midtrans) lalu tekan <strong>Benar.</strong>",
            ],
            [
              'id' => 5,
              'title' =>
              "Masukkan <strong>Kode Pembayaran</strong> Anda lalu tekan <strong>Benar.</strong>",
            ],
            [
              'id' => 6,
              'title' =>
              "Pada halaman konfirmasi akan muncul detail pembayaran Anda. Jika informasi telah sesuai tekan <strong>Ya.</strong>",
            ],
          ],
        ],
        [
          'id' => 1,
          'name' => "Internet Banking",
          'details' => [
            [
              'id' => 1,
              'title' =>
              'Login ke Internet Banking Mandiri (<a href="https://ibank.bankmandiri.co.id/">https://ibank.bankmandiri.co.id/</a>).',
            ],
            [
              'id' => 2,
              'title' =>
              "Pada menu utama, pilih <strong>Bayar,</strong> lalu pilih <strong>Multi Payment.</strong>",
            ],
            [
              'id' => 3,
              'title' =>
              "Pilih akun Anda di <strong>Dari Rekening,</strong> kemudian di Penyedia Jasa pilih <strong>Midtrans.</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Masukkan <strong>Kode Pembayaran</strong> Anda dan klik <strong>Lanjutkan.</strong>",
            ],
            [
              'id' => 5,
              'title' => "Konfirmasi pembayaran Anda menggunakan Mandiri Token.",
            ],
          ],
        ],
      ],

      'bni' => [
        [
          'id' => 1,
          'name' => "ATM BNI",
          'details' => [
            [
              'id' => 1,
              'title' => "Pada menu utama, pilih <strong>Menu Lainnya.</strong>",
            ],
            [
              'id' => 2,
              'title' => "Pilih <strong>Transfer.</strong>",
            ],
            [
              'id' => 3,
              'title' => "Pilih <strong>Rekening Tabungan.</strong>",
            ],
            [
              'id' => 4,
              'title' => "Pilih <strong>Ke Rekening BNI.</strong>",
            ],
            [
              'id' => 5,
              'title' =>
              "Masukkan nomor virtual account dan pilih <strong>Tekan Jika Benar.</strong>",
            ],
            [
              'id' => 6,
              'title' =>
              "Masukkan jumlah tagihan yang akan anda bayar secara lengkap. Pembayaran dengan jumlah tidak sesuai akan otomatis ditolak.",
            ],
            [
              'id' => 7,
              'title' =>
              "Jumlah yang dibayarkan, nomor rekening dan nama Merchant akan ditampilkan. Jika informasi telah sesuai, tekan <strong>Ya.</strong>",
            ],
            [
              'id' => 8,
              'title' => "Transaksi Anda sudah selesai.",
            ],
          ],
        ],
        [
          'id' => 1,
          'name' => "Internet Banking",
          'details' => [
            [
              'id' => 1,
              'title' =>
              "Buka alamat <a href='https://ibank.bni.co.id'>https://ibank.bni.co.id</a> kemudian klik <strong>Masuk.</strong>",
            ],
            [
              'id' => 2,
              'title' =>
              "Silakan masukkan <strong>User ID</strong> dan <strong>Password.</strong>",
            ],
            [
              'id' => 3,
              'title' =>
              "Klik menu Transfer kemudian pilih <strong>Tambah Rekening Favorit.</strong>",
            ],
            [
              'id' => 4,
              'title' =>
              "Masukkan nama, nomor rekening, dan email, lalu klik <strong>Lanjut.</strong>",
            ],
            [
              'id' => 5,
              'title' =>
              "Masukkan <strong>Kode Otentikasi</strong> dari token Anda dan klik <strong>Lanjut.</strong>",
            ],
            [
              'id' => 6,
              'title' =>
              "Kembali ke menu utama dan pilih <strong>Transfer</strong> lalu <strong>Transfer Antar Rekening BNI.</strong>",
            ],
            [
              'id' => 7,
              'title' =>
              "Pilih rekening yang telah Anda favoritkan sebelumnya di <strong>Rekening Tujuan</strong> lalu lanjutkan pengisian, dan tekan <strong>Lanjut.</strong>",
            ],
            [
              'id' => 8,
              'title' =>
              "Pastikan detail transaksi Anda benar, lalu masukkan <strong>Kode Otentikasi</strong> dan tekan <strong>Lanjut.</strong>",
            ],
            [
              'id' => 9,
              'title' => "Transaksi Anda sudah selesai.",
            ],
          ],
        ],
        [
          'id' => 1,
          'name' => "Mobile Banking",
          'details' => [
            [
              'id' => 1,
              'title' => "Buka aplikasi BNI Mobile Banking dan login",
            ],
            [
              'id' => 2,
              'title' => "Pilih menu Transfer",
            ],
            [
              'id' => 3,
              'title' => "Pilih menu Virtual Account Billing",
            ],
            [
              'id' => 4,
              'title' => "Pilih rekening debit yang akan digunakan",
            ],
            [
              'id' => 5,
              'title' =>
              "Pilih menu Input Baru dan masukkan 16 digit nomor Virtual Account",
            ],
            [
              'id' => 6,
              'title' => "Informasi tagihan akan muncul pada halaman validasi",
            ],
            [
              'id' => 7,
              'title' =>
              "Jika informasi telah sesuai, masukkan Password Transaksi dan klik Lanjut",
            ],
            [
              'id' => 8,
              'title' => "Transaksi Anda akan diproses",
            ],
          ],
        ],
      ],
    ];

    return isset($data[$key]) ? $data[$key] : [];
  }
}

// validate email address 
if (!function_exists('validate_email')) {
  function validate_email($email)
  {

    $exp = "^[a-z\'0-9]+([._-][a-z\'0-9]+)*@([a-z0-9]+([._-][a-z0-9]+))+$^";

    if (preg_match($exp, $email)) {
      $emails = explode("@", $email);
      $hostname = array_pop($emails);
      $domains = explode(".", $hostname);

      if (is_array($domains)) {
        if (in_array($domains[0], ['gmail', 'yahoo', 'hotmail'])) {
          return true;
        }
        return false;
      }
      return false;
    } else {

      return false;
    }
  }
}

if (!function_exists('bulk_print')) {
  function bulk_print($data = [], $task = 'pdf_download')
  {
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://giraffe.daftar-agen.com/task',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => '{
          "task": "' . $task . '",
          "data": {
              "endpoint": "' . getSetting('APP_ROOT_URL') . '",
              "ids": ' . json_encode($data, true) . '
          }
      }',
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json'
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return $response;
  }
}
if (!function_exists('print_invoice')) {
  function print_invoice($data = [], $task = 'pdf_download')
  {
    PrintInvoice::dispatch($data, $task)->onQueue('send-notification');
    return true;
  }
}

// get phone whatsapp number
if (!function_exists('formatPhone')) {
  function formatPhone($phone = null)
  {
    if ($phone) {
      if (substr($phone, 0, 2) == '08') {
        $phone = substr($phone, 2);
        return "628{$phone}";
      } else if (substr($phone, 0, 3) == '+62') {
        $phone = substr($phone, 3);
        return "62{$phone}";
      }
    }

    return $phone;
  }
}
// get phone whatsapp number
if (!function_exists('getImage')) {
  function getImage($image = null)
  {
    if ($image) {
      return Storage::disk('s3')->url($image);
    }

    return asset('assets/img/card.svg');
  }
}


// get price shipping
if (!function_exists('getShippingPrice')) {
  function getShippingPrice($shippingInfo = [])
  {
    $price = 0;
    if (isset($shippingInfo)) {


      return intval($shippingInfo['shipping_price']);
    }
    return $price;
  }
}

// get price shipping
if (!function_exists('getShippingDiscount')) {
  function getShippingDiscount($shippingInfo = [])
  {
    $price = 0;
    if (isset($shippingInfo)) {
      if (intval($shippingInfo['shipping_discount']) > 0) {
        if (intval($shippingInfo['shipping_discount']) > $shippingInfo['shipping_price']) {
          return intval($shippingInfo['shipping_discount']) - intval($shippingInfo['shipping_price']);
        }
        return intval($shippingInfo['shipping_discount']) ?? 0;
      }

      return 0;
    }
    return $price;
  }
}



if (!function_exists('getCurrentDataImport')) {
  function getCurrentDataImport()
  {
    return ProductImportTemp::count();
  }
}


if (!function_exists('getTotalDataImport')) {
  function getTotalDataImport()
  {
    return getSetting('product_import_count_' . auth()->user()->id) ?? 0;
  }
}

// get percentage from two number
if (!function_exists('getPercentage')) {
  function getPercentage($number1 = 0, $number2 = 0)
  {
    if ($number2 > 0) {
      return round(($number1 / $number2) * 100, 2);
    }
    return 0;
  }
}



// lead status
if (!function_exists('leadStatusLabel')) {
  function leadStatusLabel($lead = null)
  {
    if ($lead) {
      switch ($lead->status) {
        case '0':
          return '<button class="btn btn-warning btn-xs" style="font-size:13px;">' . getStatusLead($lead->status) . '</button>';
        case '1':
          return ' <button class="btn btn-success btn-xs" style="font-size:13px;">' . getStatusLead($lead->status) . '</button>';
        case '2':
          return '<button class="btn btn-secondary btn-xs" style="font-size:13px;">' . getStatusLead($lead->status) . '</button>';
        case '3':
          return '<button class="btn btn-danger btn-xs" style="font-size:13px;">' . getStatusLead($lead->status) . '</button>';
        case '6':
          return '<button class="btn btn-xs" style="font-size:13px;background-color:#f74f1d;color:white">' . getStatusLead($lead->status) . '</button>';

        default:
          return '<button class="btn btn-primary btn-xs" style="font-size:13px;">' . getStatusLead($lead->status) . '</button>';
      }
    }
  }
}

// // lead status
// if (!function_exists('getMenu')) {
//   function getMenu($menu, $user_menu_id, $menu_id)
//   {
//     // $expire = Carbon::now()->addMinutes(30);
//     // $menus = Cache::remember('menu_list_' . $menu_id, $expire, function ()  use ($menu, $user_menu_id) {
//     //   return $menu->children()->where('show_menu', 1)->whereIn('id', $user_menu_id)->get();
//     // });
//     // return $menus;
//     return true;
//   }
// }

if (!function_exists('getNumberFromString')) {
  function getNumberFromString($string)
  {
    $int_var = preg_match_all('!\d+!', $string, $matches);
    return max($int_var);
  }
}

if (!function_exists('getBadge')) {
  function getBadge($code = null)
  {
    $ip_address = getIp();
    $expire = Carbon::now()->addMinutes(10);
    $user = Cache::remember('auth_user_' . $ip_address, $expire, function () {
      return auth()->user();
    });

    $role = $user->role ?? null;

    $total_agent_all_transaction =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->count();
    $total_agent_waiting_payment =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->whereIn('status', [1])->count();
    $total_agent_perlu_konfirmasi =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->whereIn('status', [2])->count();
    $total_agent_siap_dikirim =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->whereIn('status', [3, 7])->where('status_delivery', 21)->count();
    $total_agent_approve_finance =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status', 3)->count();
    $total_agent_admin_process =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status', 7)->where('status_delivery', 1)->count();
    $total_agent_product_master =  Product::where('status', 1)->count();
    $total_agent_product_variant =  ProductVariant::where('status', 1)->count();
    $total_agent_warehouse_waiting_process =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status', 7)->where('status_delivery', 1)->count();
    $total_agent_warehouse_onprocess =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status_delivery', 2)->count();
    $total_agent_warehouse_delivery =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status_delivery', 3)->count();
    $total_agent_delivered =  TransactionAgent::whereHas('user', function ($query) use ($role) {
      $query->whereHas('roles', function ($query) {
        $query->whereIn('role_type', ['mitra', 'subagent']);
      });
      if (auth()->check() && in_array($role->role_type, ['mitra', 'subagent'])) {
        $query->where('user_id', auth()->user()->id);
      }
    })->where('status_delivery', 4)->count();

    // custommer
    $total_all_transaction =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->count();
    $total_waiting_payment =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->whereIn('status', [1])->count();
    $total_waiting_payment_approve =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->whereIn('status', [2])->count();
    $total_siap_dikirim =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->whereIn('status', [3, 7])->where('status_delivery', 21)->count();
    $total_approve_finance =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status', 3)->count();
    $total_admin_process =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status', 7)->where('status_delivery', 1)->count();
    $total_product_master =  Product::where('status', 1)->whereNull('deleted_at')->count();
    $total_product_variant =  ProductVariant::where('status', 1)->count();
    $total_warehouse_waiting_process =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status', 7)->where('status_delivery', 1)->count();
    $total_warehouse_onprocess =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status_delivery', 2)->count();
    $total_warehouse_delivery =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status_delivery', 3)->count();
    $total_delivered =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status_delivery', 4)->count();
    $total_waiting_agent =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status', 1)->count();
    $total_approve_agent =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->whereIn('status', [3, 7])->count();
    $total_agent_process =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->whereIn('status', [3, 7])->whereIn('status_delivery', [123])->count();
    $total_perlu_konfirmasi =  Transaction::whereHas('user', function ($query) {
      $query->whereHas('roles', function ($query) {
        $query->where('role_type', '!=', 'mitra');
      });
    })->where('status', 2)->count();
    $total_monitoring_transaksi =  Transaction::where('status', 7)->count();
    //order
    $total_order_lead =  OrderLead::count();
    $total_order_manual =  OrderManual::count();

    $badge = [
      'total_agent_all_transaction' => $total_agent_all_transaction,
      'total_agent_waiting_payment' => $total_agent_waiting_payment,
      'total_agent_perlu_konfirmasi' => $total_agent_perlu_konfirmasi,
      'total_agent_siap_dikirim' => $total_agent_siap_dikirim,
      'total_agent_approve_finance' => $total_agent_approve_finance,
      'total_agent_admin_process' => $total_agent_admin_process,
      'total_agent_product_master' => $total_agent_product_master,
      'total_agent_product_variant' => $total_agent_product_variant,
      'total_agent_warehouse_waiting_process' => $total_agent_warehouse_waiting_process,
      'total_agent_warehouse_onprocess' => $total_agent_warehouse_onprocess,
      'total_agent_warehouse_delivery' => $total_agent_warehouse_delivery,
      'total_agent_delivered' => $total_agent_delivered,

      // custommer
      'total_all_transaction' => $total_all_transaction,
      'total_waiting_payment' => $total_waiting_payment,
      'total_waiting_payment_approve' => $total_waiting_payment_approve,
      'total_siap_dikirim' => $total_siap_dikirim,
      'total_approve_finance' => $total_approve_finance,
      'total_admin_process' => $total_admin_process,
      'total_product_master' => $total_product_master,
      'total_product_variant' => $total_product_variant,
      'total_warehouse_waiting_process' => $total_warehouse_waiting_process,
      'total_warehouse_onprocess' => $total_warehouse_onprocess,
      'total_warehouse_delivery' => $total_warehouse_delivery,
      'total_delivered' => $total_delivered,
      'total_waiting_agent' => $total_waiting_agent,
      'total_approve_agent' => $total_approve_agent,
      'total_agent_process' => $total_agent_process,

      //Finance
      'total_perlu_konfirmasi' => $total_perlu_konfirmasi,
      'total_monitoring_transaksi' => $total_monitoring_transaksi,

      //Order
      'total_order_lead' => $total_order_lead,
      'total_order_manual' => $total_order_manual,

      // case
      'total_case_manual' => Cases::whereNull('status_approval')->count(),
      'total_return' => ReturMaster::where('status', 0)->count(),
      'total_refund' => RefundMaster::where('status', 0)->count(),

    ];

    if ($code) {
      if (isset($badge[$code])) {
        return $badge[$code];
      }

      return 0;
    }
    return 0;
  }
}

// get ip address
if (!function_exists('getIp')) {
  function getIp()
  {
    foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
      if (array_key_exists($key, $_SERVER) === true) {
        foreach (explode(',', $_SERVER[$key]) as $ip) {
          $ip = trim($ip); // just to be safe
          if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
            return $ip;
          }
        }
      }
    }
    return request()->ip();
  }


  function getCount($user_id, $status_convert = 'success')
  {
    $total = ProductImportTemp::where('status_import', 0)->where('status_convert', $status_convert)->where('user_id', $user_id)->count();

    return $total;
  }

  // progress import
  if (!function_exists('importProgress')) {
    function importProgress($user_id, $success, $type = 'Import')
    {
      $options = array(
        'cluster' => 'ap1',
        'useTLS' => true
      );
      $pusher = new Pusher(
        'eafb4c1c4f906c90399e',
        '01d9b57c3818c1644cb0',
        '1472093',
        $options
      );
      $total = getSetting('product_import_count_' . $user_id);
      $success = getSetting('product_import_success_' . $user_id);

      $progress = $total == $success ? false : true;

      $pusher->trigger('aimi', 'progress-import-convert-' . $user_id, ['type' => $type, 'total' => $total, 'success' => getCount($user_id), 'progress' => $progress, 'percentage' => getPercentage($success, $total)]);
    }
  }

  // progress convert
  if (!function_exists('convertProgress')) {
    function convertProgress($user_id, $success, $type = 'Convert', $convert_id = null)
    {
      $options = array(
        'cluster' => 'ap1',
        'useTLS' => true
      );
      $pusher = new Pusher(
        'eafb4c1c4f906c90399e',
        '01d9b57c3818c1644cb0',
        '1472093',
        $options
      );
      $total = getSetting('product_convert_count_' . $user_id);
      $success = getSetting('product_convert_success_' . $user_id);

      $progress = $total == $success ? false : true;
      $convert = ProductConvert::find($convert_id);
      if (!$progress) {
        ProductImportTemp::where('user_id', $user_id)->where('status_import', 0)->update(['status_import' => 1]);
        $convert->update(['status' => 'success']);
        removeSetting('product_convert_id_' . $user_id);
        removeSetting('product_import_count_' . $user_id);
        removeSetting('product_import_success_' . $user_id);
        removeSetting('product_convert_count_' . $user_id);
        removeSetting('product_convert_success_' . $user_id);
      }

      $pusher->trigger('aimi', 'progress-import-convert-' . $user_id, [
        'convert_id' => $convert_id,
        'type' => $type,
        'total' => $total,
        'success' => getSetting('product_convert_success_' . $user_id),
        'failed' => $convert->failed,
        'progress' => $progress,
        'percentage' => getPercentage($success, $total)
      ]);
    }
  }

  /**
   ** path: API path, for example /api/orders
   ** queries: Extract all query param EXCEPT 'sign','access_token',query param,not body
   ** secret: App secret
   **/
  function generateSHA256($path, $queries, $secret)
  {
    // Reorder the params based on alphabetical order.
    $keys = array_keys($queries);
    sort($keys);
    // Concat all the params in the format of {key}{value} and append the request path to the beginning
    $input = $path;
    foreach ($keys as $key) {
      $input .= $key . $queries[$key];
    }
    // Wrap string generated in up with app_secret.
    $input = $secret . $input . $secret;
    // Use HMAC-SHA256 to generate the sign with the secret key
    $sign = hash_hmac('sha256', $input, $secret);
    return $sign;
  }
}



function getTiktokItemsDetail($items)
{
  $detail = '';

  $no = 1;
  foreach ($items as $key => $item) {
    $detail .= " <tr style='height: 18px;'>
    <td style='height: 18px;'>{$no}</td>
    <td style='height: 18px;'>{$item['product_name']}</td>
    <td style='height: 18px;'>{$item['seller_sku']}</td>
    <td style='height: 18px;'>{$item['quantity']}</td>
  </tr>";

    $no++;
  }

  $item = "
  <table style='border-collapse: collapse; width: 100%; height: 18px;' border='1'><colgroup><col style='width: 2.74784%;'><col style='width: 47.2522%;'><col style='width: 25%;'><col style='width: 25%;'></colgroup>
    <tbody>
      <tr style='height: 18px;'>
        <td style='height: 18px;'>No.</td>
        <td style='height: 18px;'>Nama Produk</td>
        <td style='height: 18px;'>SKU</td>
        <td style='height: 18px;'>QTY</td>
      </tr>
     $detail
    </tbody>
  </table>
  ";

  return $item;
}

if (!function_exists('sendNotifTelegram')) {
  function sendNotifTelegram($message = null, $chatId = null)
  {
    try {
      $telegram = new Api('6361554669:AAFQmHeVDWOJeiOmTgkHfFqujaIitOUR04I');

      // Kirim pesan ke ID chat tertentu

      // Mengirim pesan
      $telegram->sendMessage([
        'chat_id' => $chatId,
        'text' => $message ?? 'Halo, ini contoh pesan dari Laravel ke Telegram!',
      ]);
    } catch (\Throwable $th) {
    }
  }
}
