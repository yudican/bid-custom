<div class="page-inner">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-capitalize">
                        <span>Notifications</span>

                        <div class="pull-right">
                            <?php if($notification_count < 1): ?> <button class="btn btn-secondary btn-sm" disabled> Read All</button>
                                <?php else: ?>
                                <?php if($form_active): ?>
                                <button class="btn btn-danger btn-sm" wire:click="toggleForm(false)"> Close</button>
                                <?php else: ?>
                                <button class="btn btn-primary btn-sm" wire:click="seeAllNotifications"> Read All</button>
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
                <div class="card-header">
                    <h5 class="card-header-title"><b><?php echo e($title); ?></b><span class="pull-right"><?php echo e($created_at); ?></span></h5>
                </div>
                <div class="card-body overflow-x-scroll">
                    <?php echo $body; ?>

                </div>
            </div>
            <?php else: ?>
            
            <div class="list-group list-group-messages list-group-flush">
                <?php if(count($notification_user) > 0): ?>
                <?php $__currentLoopData = $notification_user; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="list-group-item unread cursor-pointer" style="border-left: 5px solid <?php echo e($item->status > 0 ? '#f5f5f5' : '#003E8B;'); ?>" wire:click="getDataNotificationById(<?php echo e($item->id); ?>)">
                    <div class="list-group-item-body pl-3 pl-md-4">
                        <div class="row">
                            <div class="col-12 col-lg-10">
                                <h4 class="list-group-item-title">
                                    <b><?php echo e($item->title); ?></b>
                                </h4>
                                <p class="list-group-item-text text-truncate"> <?php echo substr(strip_tags($item->body),0,90); ?>... </p>
                            </div>
                            <div class="col-12 col-lg-2 text-lg-right">
                                <p class="list-group-item-text"> <?php echo e($item->created_at->diffForHumans()); ?> </p>
                            </div>
                        </div>
                    </div>

                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <?php else: ?>
                <div class="card min-h-fit flex justify-center items-center">
                    <img src="<?php echo e(asset('assets/img/NoNotifications.svg')); ?>" width="100" height="100" />
                    <p>No notification</p>
                </div>
                <?php endif; ?>
            </div>
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
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/livewire/tbl-notifications.blade.php ENDPATH**/ ?>