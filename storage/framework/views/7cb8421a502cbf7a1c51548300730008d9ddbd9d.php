<table border="1">
  <thead>
    <tr>
      <th>No.</th>
      <th>ID</th>
      <th>Product</th>
      <th>SKU</th>
      <th>Berat</th>
      <th>Status</th>
      <th>Deskripsi</th>
      <th>Warehouse</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php $__currentLoopData = $row['stock_warehouse']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <tr>
      <?php if($index == 0): ?>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($key +1); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($row['id']); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($row['name']); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($row['sku']); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($row['weight']); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo e($row['status']); ?></td>
      <td rowspan="<?php echo e(count($row['stock_warehouse'])); ?>"><?php echo $row['description']; ?></td>
      <?php endif; ?>
      <td><?php echo e($item['warehouse_name']); ?></td>
      <td><?php echo e($item['stock']); ?></td>
    </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </tbody>
</table><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/export/product-master.blade.php ENDPATH**/ ?>