<table border="1">
  <thead>
    <tr>
      <th>No.</th>
      <th>Title</th>
      <th>Contact</th>
      <th>Sales</th>
      <th>Created By</th>
      <th>Brand</th>
      <th>Nama Produk</th>
      <th>Harga Produk</th>
      <th>QTY</th>
      <th>Tax</th>
      <th>Discount</th>
      <th>Subtotal</th>
      <th>Total Dpp + PPN</th>
      <th>Total Price</th>
      <th>Created Date</th>
      <th>DD</th>
      <th>MM</th>
      <th>YY</th>
    </tr>
  </thead>
  <tbody>
    <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php $__currentLoopData = $row['product_needs']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <tr>
      <?php if($index == 0): ?>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($key +1); ?></td>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($row['title']); ?></td>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($row['contact_name']); ?></td>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($row['sales_name']); ?></td>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($row['created_by_name']); ?></td>
      <td rowspan="<?php echo e(count($row['product_needs'])); ?>"><?php echo e($row['brand_name']); ?></td>
      <?php endif; ?>
      <td><?php echo e($item['product_name']); ?></td>
      <td><?php echo e($item['price']); ?></td>
      <td><?php echo e($item['qty']); ?></td>
      <td><?php echo e($item['tax_amount']); ?></td>
      <td><?php echo e($item['discount_amount']); ?></td>
      <td><?php echo e($item['subtotal']); ?></td>
      <td><?php echo e($item['price_nego']); ?></td>
      <td><?php echo e($item['total_price']); ?></td>
      <td><?php echo e($row['created_at']); ?></td>
      <td><?php echo e(date("l d", strtotime($row['created_at']))); ?></td>
      <td><?php echo e(date("m", strtotime($row['created_at']))); ?></td>
      <td><?php echo e(date("Y", strtotime($row['created_at']))); ?></td>
    </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </tbody>
</table><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/export/lead-master.blade.php ENDPATH**/ ?>