<div>
    <button id="dropdownCheckboxButton" data-dropdown-toggle="dropdownDefaultCheckbox" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center " type="button">
        <span class="flex flex-row">
            <span>Lainnya</span>
            <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </span>
    </button>

    <!-- Dropdown menu -->
    <div id="dropdownDefaultCheckbox" class="hidden z-10 w-48 <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?> rounded divide-y divide-gray-100 shadow ">
        <ul class="p-3 space-y-3 text-sm text-gray-700" aria-labelledby="dropdownCheckboxButton">
            <?php $__currentLoopData = $this->columns; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $column): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if(!in_array($column['label'], ['id','No.','Aksi'])): ?>
            <?php if($column['hidden']): ?>
            <li class="cursor-pointer">
                <div class="flex items-center cursor-pointer">
                    <input id="checkbox-item-1" type="checkbox" wire:click="toggle(<?php echo e($index); ?>)" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 cursor-pointer">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 "><?php echo e($column['label']); ?></label>
                </div>
            </li>
            <?php endif; ?>
            <?php if (! ($column['hidden'])): ?>
            <li class="cursor-pointer">
                <div class="flex items-center cursor-pointer">
                    <input checked id="checkbox-item-1" wire:click="toggle(<?php echo e($index); ?>)" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 cursor-pointer">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 "><?php echo e($column['label']); ?></label>
                </div>
            </li>

            <?php endif; ?>
            <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
    </div>
</div><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/livewire/datatables/hide-column-multiselect.blade.php ENDPATH**/ ?>