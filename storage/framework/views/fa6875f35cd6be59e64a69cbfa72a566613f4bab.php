<div class="list-group-item-figure" id="action-<?php echo e($id); ?>" wire:key="item-<?php echo e($id); ?>">
    <div class="dropdown">
        <button class="btn-dropdown" data-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-ellipsis-h"></i>
            <?php if($badge === true): ?>
            <span class="badge badge-danger ml-2">New</span>
            <?php endif; ?>
        </button>
        <div class="dropdown-arrow"></div>
        <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-124px, 25px, 0px); top: 0px; left: 0px; will-change: transform;">
            <?php if($canUpdate): ?>
            <button wire:click="getDataById('<?php echo e($id); ?>')" class="dropdown-item">Ubah</button>
            <?php endif; ?>
            <?php if($canDelete): ?>
            <a wire:click="getId('<?php echo e($id); ?>')" href="#confirm-modal" data-toggle="modal" class="dropdown-item">Hapus</a>
            <?php endif; ?>

            <?php $__currentLoopData = $extraActions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $extra): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($extra['type'] == 'link'): ?>
            <a href="<?php echo e(route($extra['route'],$extra['params'])); ?>" class="dropdown-item"><?php echo e($extra['label']); ?></a>
            <?php elseif($extra['type'] == 'modal'): ?>
            <a wire:click="<?php echo e($extra['route']); ?>" href="#<?php echo e($extra['id']); ?>" data-toggle="modal" class="dropdown-item"><?php echo e($extra['label']); ?></a>
            <?php else: ?>
            <button wire:click="<?php echo e($extra['route']); ?>" class="dropdown-item"><?php echo e($extra['label']); ?></button>
            <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    </div>
    
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/components/table/action-button.blade.php ENDPATH**/ ?>