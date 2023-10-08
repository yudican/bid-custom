<div class="page-inner">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-capitalize">
                        <a href="<?php echo e(route('dashboard')); ?>">
                            <span><?php echo e(($form_active)?'Form Pengisian Data Faq Submenu':'List Data Faq Submenu'); ?></span>
                        </a>
                        <div class="pull-right">
                            <?php if($form_active): ?>
                            <button class="btn btn-danger btn-sm" wire:click="toggleForm(false)"><i class="fas fa-times"></i> Cancel</button>
                            <?php else: ?>
                            <?php if(auth()->user()->hasTeamPermission($curteam, $route_name.':create')): ?>
                            <button class="btn btn-primary btn-sm" wire:click="<?php echo e($modal ? 'showModal' : 'toggleForm(true)'); ?>"><i class="fas fa-plus"></i> Tambah Data</button>
                            <?php endif; ?>
                            <?php endif; ?>
                        </div>
                    </h4>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <?php if($form_active): ?>
            <div class="card">
                <div class="card-body">
                    <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'sub_menu','label' => 'Sub Menu','isreq' => '*']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'sub_menu','label' => 'Sub Menu','isreq' => '*']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                    <div class="form-group">
                        <label class="form-check-label" style="margin-left:20px!important">
                            <input class="form-check-input" type="checkbox" wire:model="is_like" value="1">
                            Is Like ?
                        </label>

                        <label class="form-check-label" style="margin-left:20px">
                            <input class="form-check-input" type="checkbox" wire:model="is_comment" value="1">
                            Is Comment ?
                        </label>
                    </div>
                    <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.select','data' => ['name' => 'status','label' => 'Status','ignore' => true]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('select'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'status','label' => 'Status','ignore' => true]); ?>
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Not Active</option>
                     <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>

                    <div class="form-group">
                        <button class="btn btn-primary pull-right" wire:click="<?php echo e($update_mode ? 'update' : 'store'); ?>">Simpan</button>
                    </div>
                </div>
            </div>
            <?php else: ?>
            <?php
if (! isset($_instance)) {
    $html = \Livewire\Livewire::mount('table.faq-submenu-table', ['params' => ''.e($route_name).''])->html();
} elseif ($_instance->childHasBeenRendered('l320788309-0')) {
    $componentId = $_instance->getRenderedChildComponentId('l320788309-0');
    $componentTag = $_instance->getRenderedChildComponentTagName('l320788309-0');
    $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
    $_instance->preserveRenderedChild('l320788309-0');
} else {
    $response = \Livewire\Livewire::mount('table.faq-submenu-table', ['params' => ''.e($route_name).'']);
    $html = $response->html();
    $_instance->logRenderedChild('l320788309-0', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
}
echo $html;
?>
            <?php endif; ?>

        </div>

        
        <div id="confirm-modal" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title" id="my-modal-title">Konfirmasi Hapus</h5>
                    </div>
                    <div class="modal-body">
                        <p>Apakah anda yakin hapus data ini.?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" wire:click='delete' class="btn btn-danger btn-sm"><i class="fa fa-check pr-2"></i>Ya, Hapus</button>
                        <button class="btn btn-primary btn-sm" wire:click='_reset'><i class="fa fa-times pr-2"></i>Batal</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php $__env->startPush('scripts'); ?>



    <script>
        $(document).ready(function(value) {
            window.livewire.on('loadForm', (data) => {
                
                
            });

            window.livewire.on('closeModal', (data) => {
                $('#confirm-modal').modal('hide')
            });
        })
    </script>
    <?php $__env->stopPush(); ?>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/livewire/tbl-faq-sub-menus.blade.php ENDPATH**/ ?>