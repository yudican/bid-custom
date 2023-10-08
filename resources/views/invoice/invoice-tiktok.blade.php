<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <title>Invoice</title>
  
  <style>
    @font-face {
      font-family: 'Poppins';
      font-weight: normal;
      font-style: normal;
      font-variant: normal;
      /* src: url("font url"); */
    }

    * {
      font-family: 'Poppins', sans-serif;
      font-size: 10px;
    }

    footer {
      position: fixed;
      bottom: -30px;
      left: 0px;
      right: 0px;
      height: 50px;

      /** Extra personal styles **/
      color: #000;
      padding-left: 10px;
    }

    table tr td,
    table tr th {
      font-size: 10px;
    }
  </style>
</head>

<body>
  <table width="100%">
    <tr>
      <td width="100%"><img src="{{asset('assets/img/logo-flimty.png')}}" style="height:80px;" alt=""></td>
      <td width="100%"></td>
    </tr>
    <tr>
      <td width="80%"></td>
      <td width="20%" align="right">
        <h2>INVOICE</h2>
      </td>
    </tr>
  </table>
  <hr>
  <table width="60%" style="margin-top:20px;">
    <tr>
      <td width="40%">No. Invoice</td>
      <td width="60%">: {{$data->tiktok_order_id}}</td>
    </tr>
    <!-- <tr>
      <td width="40%">Email</td>
      <td width="60%">: {{$data->user ? $data->user->email : '-'}}</td>
    </tr> -->
    <tr>
      <td width="40%">Date</td>
      <td width="60%">: {{date('l, d F Y', strtotime($data->created_at))}}</td>
    </tr>
   
    <tr>
      <td width="40%">Metode Pembayaran</td>
      <td width="60%">: {{$data->payment_method_name}}</td>
    </tr>
  
  </table>

  <table width="100%" style="margin-top:20px;border-bottom: 1px solid #000;">
    <tr style="background-color: #3D4043;">
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;border:0px solid #3D4043;" bgcolor="#3D4043">No</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Item</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Qty</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Price</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Subtotal</th>
    </tr>
    @php $total = 0; @endphp
    @foreach ($detail as $key => $item)
    @php $total += ($item->quantity * $item->sku_original_price); @endphp
    <tr>
      <td align="center">
        {{$key+1}}
      </td>
      <td align="center">
        {{$item->product_name}}
      </td>
      <td align="center">
        {{$item->quantity}}
      </td>
      <td align="center">
        <strong>
          Rp {{number_format($item->sku_original_price)}}
        </strong>
      </td>
      <td align="center">
        <strong>
          
          Rp {{number_format($item->quantity * $item->sku_original_price)}}
        </strong>
      </td>
    </tr>
    @endforeach
  </table>
  <table width="100%" style="margin-top: 20px;border-bottom: 1px solid #000;padding-bottom: 20px;">
    <tr>
      <td width="40%">Metode Pengiriman </td>
      <td width="60%">: {{@$data->shipping_provider}}</td>
    </tr>
    <tr>
      <td width="40%">Tracking Number </td>
      <td width="60%">: {{@$data->tracking_number}}</td>
    </tr>
    @if (@$data->shippingType->shipping_discount > 0)
    <tr>
      <td width="40%">Diskon Pengiriman </td>
      <td width="60%">: Rp. {{@number_format($data->shippingType->shipping_discount)}}</td>
    </tr>
    @endif

    @if ($data->diskon > 0)
    <tr>
      <td width="40%">Discount</td>
      <td width="60%">: Rp {{number_format(@$data->diskon)}}
        @if ($data->voucher)
        <span> | {{@$data->voucher->voucher_code}}</span>
        @endif
      </td>
    </tr>
    @endif
    @if ($data->payment_unique_code > 0)
    <tr>
      <td width="40%">Unique Code</td>
      <td width="60%">: {{$data->payment_unique_code}}</td>
    </tr>
    @endif

    <tr>
      <td width="40%"><strong>Total Payment</strong></td>
      <td width="60%">: <strong>Rp {{number_format($total)}}</strong></td>
    </tr>
  </table>

  
  <footer>
    <p style="font-size: 10px;width:50%;bottom:0;">
      {{@$data->brand->alamat}}
    </p>
  </footer>
</body>

</html>