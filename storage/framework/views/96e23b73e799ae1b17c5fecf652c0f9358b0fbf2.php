<div class="form-group <?php echo e($errors->has($name) ? 'has-error has-feedback' : ''); ?>">
    <?php if(isset($label)): ?>
    <?php if(in_array($type, ['text', 'password', 'date', 'email','number'])): ?>
    <label for="<?php echo e($name); ?>" class="placeholder"><b><?php echo e($label); ?></b> <span style="color:red"><?php echo e($isreq ?? ''); ?></span></label>
    <?php endif; ?>
    <?php endif; ?>

    <input id="<?php echo e($name); ?>" value="<?php echo e($value ?? ''); ?>" name="<?php echo e($name); ?>" wire:model="<?php echo e($name); ?>" type="<?php echo e($type ?? 'text'); ?>" class="form-control  w-100" <?php echo e(isset($readonly) ? 'readonly' : ''); ?> placeholder="<?php echo e(isset($placeholder) ? $placeholder : ''); ?>">
    <small id="helpId" class="text-danger"><?php echo e($errors->has($name) ? $errors->first($name) : ''); ?></small>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/components/text-field.blade.php ENDPATH**/ ?>