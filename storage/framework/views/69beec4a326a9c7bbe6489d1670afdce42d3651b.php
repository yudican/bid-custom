<div class="">
  <div <?php if(isset($ignore)): ?> wire:ignore <?php endif; ?> class="form-group <?php echo e($errors->has($name) ? 'has-error has-feedback' : ''); ?>">
    <?php if(isset($label)): ?>
    <label for="<?php echo e($name); ?>" class="placeholder"><b><?php echo e($label); ?></b> <span style="color:red"><?php echo e($isreq ?? ''); ?></span></label>
    <?php endif; ?>

    <select name="<?php echo e($name); ?>" id="<?php echo e(isset($id) ? $id : $name); ?>" wire:model="<?php echo e($name); ?>" wire:change="<?php echo e(isset($handleChange) ? $handleChange.'($event.target.value)' : ''); ?>" class="form-control <?php echo e(isset($class) ? $class : ''); ?>" <?php echo e(isset($multiple) ? 'multiple' : ''); ?>>
      <?php echo e($slot); ?>

    </select>
  </div>
  <small id="helpId" class="text-danger ml-2"><?php echo e($errors->has($name) ? $errors->first($name) : ''); ?></small>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/components/select.blade.php ENDPATH**/ ?>