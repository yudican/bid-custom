<div>
    <select class="appearance-none bg-white/50 text-white font-semibold rounded-md border border-white" wire:change="handleSwitch($event.target.value)">
        <?php $__currentLoopData = $accounts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <option value="<?php echo e($item->id); ?>" <?php if($item->status > 0): ?> selected <?php endif; ?>><?php echo e($item->account_name); ?></option>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </select>

    
    <script>
        document.addEventListener('livewire:load', function () {
            
            window.livewire.on('handleSwitch', (data) => {
                localStorage.setItem('account_id', data);
                window.location.reload();
            });
           
        })
    </script>
</div><?php /**PATH /Users/user/Documents/Projects/aimi-group/laravel/server/resources/views/livewire/components/switch-account.blade.php ENDPATH**/ ?>