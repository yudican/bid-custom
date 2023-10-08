<div class="card">
  <?php if($loading): ?>
  <div wire:loading. wire:loading.flex class="flex justify-center items-center" style="background-color: #66626273;position:absolute;z-index:1;width: 98.5%;height: 100%;border-radius: 10px;">
    <img src=" <?php echo e(asset('assets/img/loader.gif')); ?>" alt="loader">
  </div>
  <?php endif; ?>
  <?php if($beforeTableSlot): ?>
  <div class="mt-8">
    <?php echo $__env->make($beforeTableSlot, \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
  </div>
  <?php endif; ?>
  <div class="card-body">
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <div class="flex justify-between items-center">
        <?php if($this->searchableColumns()->count()): ?>
        
        <div class="pb-2 bg-whites px-2 pt-2">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <input type="text" id="table-search" class="block pl-10 w-80 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-transparent" wire:model.debounce.500ms="search" placeholder="Cari Disini">
          </div>
        </div>
        
        <?php endif; ?>
        <div class="flex flex-row justify-center items-center">
          
          <?php if(isset($params['segment1']) || isset($params['segment2'])): ?>
          <div class="mx-2">

            <button id="optionsDropdown" data-dropdown-toggle="options-dropdown-bulk"
              class="<?php if(count($selected) <= 0): ?> hidden <?php endif; ?> text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center " type="button">
              <span class="flex flex-row">
                <span><?php echo e(count($selected)); ?> Selected</span>
                <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </button>

            <button class="<?php if(count($selected) > 0): ?> hidden <?php endif; ?> text-white bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center " type="button" disabled>
              <span class="flex flex-row">
                <span>Options</span>
                <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </button>


            <!-- Dropdown menu -->
            <div id="options-dropdown-bulk" class="hidden z-10 w-48 bg-whites rounded divide-y divide-gray-100 shadow ">
              <ul class="p-3 space-y-3 text-sm text-gray-700 <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>" aria-labelledby="optionsDropdown">
                
                <?php if(in_array($params['segment2'],['siap-dikirim','on-process','approve-finance'])): ?>
                <?php if(in_array($role->role_type,['warehouse','superadmin','adminsales'])): ?>
                <li>
                  <div class="flex items-center cursor-pointer" wire:click="bulkPrint">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 ">
                      <span class="cursor-pointer "> <?php echo e(__('Cetak Label')); ?> </span>
                    </label>
                  </div>
                </li>
                <?php endif; ?>
                <?php if(in_array($role->role_type,['warehouse','superadmin'])): ?>
                <li>
                  <div class="flex items-center cursor-pointer" wire:click="bulkPackingProcess">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 ">
                      <span class="cursor-pointer "> <?php echo e(__('Proses Pengemasan')); ?> </span>
                    </label>
                  </div>
                </li>
                <?php endif; ?>
                
                <?php elseif($params['segment2'] == 'admin-process'): ?>
                <?php if(in_array($role->role_type,['warehouse','superadmin'])): ?>
                <li>
                  <div class="flex items-center cursor-pointer" wire:click="readyToOrder">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 ">
                      <span class="cursor-pointer "> <?php echo e(__('Siap Dikirim')); ?> </span>
                    </label>
                  </div>
                </li>
                <?php endif; ?>
                <?php endif; ?>
                <li>
                  <div class="flex items-center cursor-pointer" wire:click="printInvoice">
                    <label for="checkbox-item-1" class="ml-2 text-sm font-medium text-gray-900 ">
                      <span class="cursor-pointer "> <?php echo e(__('Cetak Invoice')); ?> </span>
                    </label>
                  </div>
                </li>
                
              </ul>
            </div>
          </div>
          <?php endif; ?>
          
          <div>
            <?php if($hideable === 'select'): ?>
            <?php echo $__env->make('datatables::hide-column-multiselect', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <table class="w-full table table-auto text-sm text-left text-gray-500 ">
        <thead class="text-xs uppercase <?php echo e($is_dark_mode ? 'bg-black/95 text-white/95' : 'bg-white text-gray-700'); ?>">
          <tr>
            <?php $__currentLoopData = $this->columns; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $column): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($column['type'] == 'checkbox'): ?>
            <?php if (! ($column['hidden'])): ?>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input type="checkbox" wire:click="toggleSelectAll" <?php if(count($selected)===$this->results->total()): ?> checked <?php endif; ?> class="form-checkbox mt-1 text-blue-600" />
              </div>
            </th>
            <?php endif; ?>
            <?php else: ?>
            <?php if (! ($column['hidden'])): ?>
            <th scope="col" class="py-3 px-6">
              <?php echo e($column['label']); ?>

            </th>
            <?php endif; ?>
            <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </tr>
        </thead>
        <tbody>
          <?php $__empty_1 = true; $__currentLoopData = $this->results; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $result): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <tr class="border-b table-row <?php echo e($is_dark_mode ? 'bg-black/95 hover:bg-black/70' : 'bg-white/90 hover:bg-black/5'); ?>" wire:key="item-<?php echo e($index); ?>">
            <?php $__currentLoopData = $this->columns; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $keys => $column): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($column['hidden']): ?>
            <?php elseif($column['type'] == 'checkbox'): ?>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input type="checkbox" checked wire:model="selected.<?php echo e($result->checkbox_attribute); ?>" value="<?php echo e($result->checkbox_attribute); ?>" class="form-checkbox mt-1 text-blue-600" />
              </div>
            </th>
            <?php elseif($column['name'] == 'id'): ?>
            <td scope="col" class="py-3 px-6">
              <?php echo e($index+1); ?>

            </td>
            <?php elseif(in_array($column['name'],['image','photo','logo'])): ?>
            <td scope="col" class="py-3 px-6">
              <img src="<?php echo e(getImage($result->{$column['name']})); ?>" alt="" height="30px" style="height: 35px;" />
            </td>
            <?php elseif(in_array($column['label'],['Action','Action Contact'])): ?>
            <td scope="col" class="py-3 px-6">
              <?php if($column['label'] == 'Action Contact'): ?>
              <?php if (isset($component)) { $__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100 = $component; } ?>
<?php $component = App\View\Components\Table\ActionButton::resolve(['id' => ''.e($result->id).'','segment' => 'contact'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('table.action-button'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\Table\ActionButton::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100)): ?>
<?php $component = $__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100; ?>
<?php unset($__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100); ?>
<?php endif; ?>
              <?php else: ?>
              <?php if (isset($component)) { $__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100 = $component; } ?>
<?php $component = App\View\Components\Table\ActionButton::resolve(['id' => ''.e($result->id).'','segment' => ''.e($params).''] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('table.action-button'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\Table\ActionButton::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100)): ?>
<?php $component = $__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100; ?>
<?php unset($__componentOriginal8550539a7462e9ff494950f0254a38bc2eab7100); ?>
<?php endif; ?>
              <?php endif; ?>

            </td>
            <?php else: ?>
            <td scope="col" class="py-3 px-6">
              <?php echo $result->{$column['name']}; ?>

            </td>
            <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </tr>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
          <tr>
            <td colspan="<?php echo e(count($this->columns)); ?>">
              <div class="flex flex-col justify-center items-center mt-8 mb-8">
                <img src="<?php echo e(asset('assets/img/empty.svg')); ?>" alt="">
                <span>Tidak Ada Data</span>
              </div>
            </td>
          </tr>
          <?php endif; ?>

        </tbody>
      </table>
      <?php if (! ($this->hidePagination)): ?>
      <div class="rounded-lg rounded-t-none max-w-screen border-b border-gray-200 bg-whites <?php echo e(count($this->results)); ?>">
        <div class="p-2 sm:flex items-center justify-between mx-4">
          
          <?php if(count($this->results)): ?>
          <div class="my-2 sm:my-0 flex items-center">
            <select name="perPage" class="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" wire:model="perPage">
              <?php $__currentLoopData = config('livewire-datatables.per_page_options', [ 10, 25, 50, 100 ]); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $per_page_option): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <option value="<?php echo e($per_page_option); ?>"><?php echo e($per_page_option); ?></option>
              <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
              <option value="99999999"><?php echo e(__('All')); ?></option>
            </select>
          </div>

          <div class="my-4 sm:my-0">
            

            <div class="hidden lg:flex justify-end">
              <span><?php echo e($this->results->links('datatables::tailwind-pagination')); ?></span>
            </div>
          </div>

          <div class="flex justify-end text-gray-600">
            <?php echo e(__('')); ?> <?php echo e($this->results->firstItem()); ?> - <?php echo e($this->results->lastItem()); ?> <?php echo e(__('of')); ?>

            <?php echo e($this->results->total()); ?>

          </div>
          <?php endif; ?>
        </div>
      </div>
      <?php endif; ?>
    </div>
  </div>
  <?php if($afterTableSlot): ?>
  <div class="mt-8">
    <?php echo $__env->make($afterTableSlot, \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
  </div>
  <?php endif; ?>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/livewire/datatables/datatable.blade.php ENDPATH**/ ?>