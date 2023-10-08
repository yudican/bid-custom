<table border="1">
  <thead>
    <tr>
      <th>No.</th>
      <th>Title</th>
      <th>Contact</th>
      <th>Company</th>
      <th>Customer Need</th>
      <th>Sales</th>
      <th>Created On</th>
      <th>Created By</th>
      <th>Warehouse</th>
      <th>Order Number</th>
      <th>Invoice Number</th>
      <th>Payment Term</th>
      <th>Due Date</th>
      <th>Addres type</th>
      <th>Addres name</th>
      <th>Addres telp</th>
      <th>Addres street</th>
      <th>Tipe Pengiriman</th>
      <th>Nama Produk</th>
      <th>Harga Produk</th>
      <th>QTY</th>
      <th>Tax</th>
      <th>Discount</th>
      <th>Subtotal</th>
      <th>Total Dpp + PPN</th>
      <th>Total Price</th>
      <th>Notes</th>
      <th>Tipe Ekspedisi</th>
      <th>Ongkir</th>
    </tr>
  </thead>
  <tbody>
    <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <?php $__currentLoopData = $row['product']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <tr>
        <?php if($index == 0): ?>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($key +1); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['title']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['contact']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['company']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['customer_need']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['pic_sales']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['created_on']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['created_by']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['warehouse']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['order_number']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['invoice_number']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['payment_term']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['due_date']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['address_type']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['address_name']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['address_telp']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['address_street']); ?></td>
          <td rowspan="<?php echo e(count($row['product'])); ?>"><?php echo e($row['tipe_pengiriman']); ?></td>
        <?php endif; ?>
        <td><?php echo e($item['product_name']); ?></td>
        <td><?php echo e($item['price']); ?></td>
        <td><?php echo e($item['qty']); ?></td>
        <td><?php echo e($item['tax_amount']); ?></td>
        <td><?php echo e($item['discount_amount']); ?></td>
        <td><?php echo e($item['subtotal']); ?></td>
        <td><?php echo e($item['price_nego']); ?></td>
        <td><?php echo e($item['total_price']); ?></td>
        <td><?php echo e($row['notes']); ?></td>
        <td>Normal</td>
        <td><?php echo e(@$row['ongkir']); ?></td>
      </tr>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </tbody>
</table><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/export/lead-order-manual.blade.php ENDPATH**/ ?>