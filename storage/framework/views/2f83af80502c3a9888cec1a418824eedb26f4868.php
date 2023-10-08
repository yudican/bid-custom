<table border="1">
    <thead>
        <tr>
            <th>No.</th>
            <th>Product Name</th>
            <th>Package</th>
            <th>Brand</th>
            <th>Begin Stock</th>
            <th>In. Purchase Delivered</th>
            <th>In. Product Return</th>
            <th>In. Sales Return</th>
            <th>Out. Stock Order</th>
            <th>Out. Return To Suplier</th>
            <th>Out. Sales</th>
            <th>Out. Transfer Out</th>
            <th>End Stock</th>
            <th>End Forecast</th>
        </tr>
    </thead>
  <tbody>
  <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <tr>
        <th><?php echo e($key+1); ?></th>
        <th><?php echo e($row->product_name); ?></th>
        <th><?php echo e($row->package_name); ?></th>
        <th><?php echo e($row->brand); ?></th>
        <th><?php echo e($row->begin_stock); ?></th>
        <th><?php echo e($row->purchase_delivered); ?></th>
        <th><?php echo e($row->product_return); ?></th>
        <th><?php echo e($row->sales_return); ?></th>
        <th><?php echo e($row->stock); ?></th>
        <th><?php echo e($row->return_suplier); ?></th>
        <th><?php echo e($row->sales); ?></th>
        <th><?php echo e($row->transfer_out); ?></th>
        <th><?php echo e($row->begin_stock + ($row->purchase_delivered + $row->product_return + $row->sales_return) - ($row->stock + $row->return_suplier + $row->sales + $row->transfer_out)); ?></th>
        <th><?php echo e($row->stock + $row->sales); ?></th>
    </tr>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</tbody>
</table><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/export/stock-movement.blade.php ENDPATH**/ ?>