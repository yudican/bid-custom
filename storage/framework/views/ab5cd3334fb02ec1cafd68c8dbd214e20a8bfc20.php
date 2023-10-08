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
      <td width="100%"><img src="<?php echo e(asset('assets/img/logo-flimty.png')); ?>" style="height:80px;" alt=""></td>
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
      <td width="60%">: <?php echo e($data->id_transaksi); ?></td>
    </tr>
    <tr>
      <td width="40%">Email</td>
      <td width="60%">: <?php echo e($data->user ? $data->user->email : '-'); ?></td>
    </tr>
    <tr>
      <td width="40%">Date</td>
      <td width="60%">: <?php echo e(date('l, d F Y', strtotime($data->created_at))); ?></td>
    </tr>
    <tr>
      <td width="30%">Status</td>
      <?php if(in_array($data->status, [1])): ?>
      <td width="70%">: <span style="color: #FBBC05;">Unpaid</span></td>
      <?php elseif(in_array($data->status, [2])): ?>
      <td width="70%">: <span style="color: #FBBC05;">Checking</span></td>
      <?php elseif(in_array($data->status, [3,7])): ?>
      <td width="70%">: <span style="color: #2E8E60;">Paid</span></td>
      <?php elseif(in_array($data->status, [4,5,6])): ?>
      <td width="70%">: <span style="color: #F85640;">Canceled</span></td>
      <?php endif; ?>
    </tr>
    <?php if($data->paymentMethod): ?>
    <tr>
      <td width="40%">Metode Pembayaran</td>
      <td width="60%">: <?php echo e($data->paymentMethod->nama_bank); ?></td>
    </tr>
    <?php if($data->paymentMethod->payment_type == 'Otomatis'): ?>
    <?php if($data->paymentMethod->payment_channel == 'bank_transfer'): ?>
    <tr>
      <td width="40%">Nomor Virtual Akun</td>
      <td width="60%">: <?php echo e($data->payment_va_number); ?></td>
    </tr>
    <?php endif; ?>

    <?php else: ?>
    <tr>
      <td width="40%">Nomor Rekening</td>
      <td width="60%">: <?php echo e($data->paymentMethod->nomor_rekening_bank); ?> (<?php echo e($data->paymentMethod->nama_rekening_bank); ?>)</td>
    </tr>
    <?php endif; ?>
    <?php endif; ?>
  </table>

  <table width="100%" style="margin-top:20px;border-bottom: 1px solid #000;">
    <tr style="background-color: #3D4043;">
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;border:0px solid #3D4043;" bgcolor="#3D4043">No</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Item</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Qty</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Price</th>
      <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Subtotal</th>
    </tr>
    <?php $__currentLoopData = $data->transactionDetail; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <tr>
      <td align="center">
        <?php echo e($key+1); ?>

      </td>
      <td align="center">
        <?php echo e($item->product->name); ?>

        <?php if($item->variant): ?>
        <span>Variant: <?php echo e($item->variant->name); ?></span>
        <?php endif; ?>
      </td>
      <td align="center">
        <?php echo e($item->qty); ?>

      </td>
      <td align="center">
        <strong>
          Rp <?php echo e(number_format($item->price)); ?>

        </strong>
      </td>
      <td align="center">
        <strong>
          Rp <?php echo e(number_format($item->subtotal)); ?>

        </strong>
      </td>
    </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </table>
  <table width="100%" style="margin-top: 20px;border-bottom: 1px solid #000;padding-bottom: 20px;">
    <tr>
      <td width="40%">Metode Pengiriman </td>
      <td width="60%">: <?php echo e($data->shippingType->shipping_type_name); ?> (<?php echo e($data->shippingType->shipping_duration); ?>)</td>
    </tr>
    <tr>
      <td width="40%">Biaya Pengiriman </td>
      <td width="60%">: Rp. <?php echo e(number_format($data->shippingType->shipping_price)); ?></td>
    </tr>
    <?php if($data->shippingType->shipping_discount > 0): ?>
    <tr>
      <td width="40%">Diskon Pengiriman </td>
      <td width="60%">: Rp. <?php echo e(number_format($data->shippingType->shipping_discount)); ?></td>
    </tr>
    <?php endif; ?>

    <?php if($data->diskon > 0): ?>
    <tr>
      <td width="40%">Discount</td>
      <td width="60%">: Rp <?php echo e(number_format($data->diskon)); ?>

        <?php if($data->voucher): ?>
        <span> | <?php echo e($data->voucher->voucher_code); ?></span>
        <?php endif; ?>
      </td>
    </tr>
    <?php endif; ?>
    <?php if($data->payment_unique_code > 0): ?>
    <tr>
      <td width="40%">Unique Code</td>
      <td width="60%">: <?php echo e($data->payment_unique_code); ?></td>
    </tr>
    <?php endif; ?>

    <tr>
      <td width="40%"><strong>Total Payment</strong></td>
      <td width="60%">: <strong>Rp <?php echo e(number_format($data->amount_to_pay)); ?></strong></td>
    </tr>
  </table>

  <p style="font-size: 10px;">
    If you have any queustions concerning this invoice, use the following <br> contact information in below : <br>
    <?php echo e($data->brand->email); ?> | www.flimty.co
  </p>
  <footer>
    <p style="font-size: 10px;width:50%;bottom:0;">
      <?php echo e($data->brand->alamat); ?>

    </p>
  </footer>
</body>

</html><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/invoice/invoice.blade.php ENDPATH**/ ?>