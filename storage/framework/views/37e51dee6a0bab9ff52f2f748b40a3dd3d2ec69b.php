<div class="flex overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded pagination">
    <!-- Previous Page Link -->
    <?php if($paginator->onFirstPage()): ?>
    <button class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 bg-white"
        disabled>
        <span>&laquo;</span>
    </button>
    <?php else: ?>
    <button wire:click="previousPage"
        id="pagination-desktop-page-previous"
        class="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-white hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500">
        <span>&laquo;</span>
    </button>
    <?php endif; ?>

    <div class="divide-x divide-gray-300">
        <?php $__currentLoopData = $elements; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $element): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php if(is_string($element)): ?>
        <button class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-700 bg-white" disabled>
            <span><?php echo e($element); ?></span>
        </button>
        <?php endif; ?>

        <!-- Array Of Links -->

        <?php if(is_array($element)): ?>
        <?php $__currentLoopData = $element; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <button wire:click="gotoPage(<?php echo e($page); ?>)"
                id="pagination-desktop-page-<?php echo e($page); ?>"
                class="-mx-1 relative inline-flex items-center px-4 py-2 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 <?php echo e($page === $paginator->currentPage() ? 'bg-gray-200' : 'bg-white'); ?>">
            <?php echo e($page); ?>

            </button>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php endif; ?>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>

    <!-- Next Page Link -->
    <?php if($paginator->hasMorePages()): ?>
    <button wire:click="nextPage"
        id="pagination-desktop-page-next"
        class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out bg-red hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500">
        <span>&raquo;</span>
    </button>
    <?php else: ?>
    <button
        class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 bg-white "
        disabled><span>&raquo;</span></button>
    <?php endif; ?>
</div>
<?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/livewire/datatables/tailwind-pagination.blade.php ENDPATH**/ ?>