<div class="form-group <?php echo e($errors->has($name) ? 'has-error has-feedback' : ''); ?>">
    <label for="<?php echo e($name); ?>" class="placeholder"><b><?php echo e($label); ?></b> <span style="color:red"><?php echo e($isreq ?? ''); ?></span></label>
    <textarea id="<?php echo e($name); ?>" name="<?php echo e($name); ?>" wire:model="<?php echo e($name); ?>" type="text" class="form-control" rows="3"></textarea>
    <small id="helpId" class="text-danger"><?php echo e($errors->has($name) ? $errors->first($name) : ''); ?></small>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/components/textarea.blade.php ENDPATH**/ ?>