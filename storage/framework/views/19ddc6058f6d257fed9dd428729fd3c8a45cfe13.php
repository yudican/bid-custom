<div class="page-inner">
    <div class="row">

        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-capitalize">
                        <a href="<?php echo e(route('dashboard')); ?>">
                            <span>List Data Transaksi</span>
                        </a>
                        <div class="pull-right">
                            <button class="btn btn-success btn-sm" wire:click="export"><i class="fas fa-excel"></i> Export</button>
                        </div>
                    </h4>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'reportrange','label' => 'Tanggal','id' => 'reportrange']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'reportrange','label' => 'Tanggal','id' => 'reportrange']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                </div>
            </div>
        </div>
        <div class="col-md-12">

            
            <?php
if (! isset($_instance)) {
    $html = \Livewire\Livewire::mount('table.transaction-table', ['params'=> ['route_name'=> $route_name, 'status' => $status_transaksi,'segment1' => $segment1, 'segment2' => $segment2,'segment' => $segment]])->html();
} elseif ($_instance->childHasBeenRendered('l1916137793-0')) {
    $componentId = $_instance->getRenderedChildComponentId('l1916137793-0');
    $componentTag = $_instance->getRenderedChildComponentTagName('l1916137793-0');
    $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
    $_instance->preserveRenderedChild('l1916137793-0');
} else {
    $response = \Livewire\Livewire::mount('table.transaction-table', ['params'=> ['route_name'=> $route_name, 'status' => $status_transaksi,'segment1' => $segment1, 'segment2' => $segment2,'segment' => $segment]]);
    $html = $response->html();
    $_instance->logRenderedChild('l1916137793-0', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
}
echo $html;
?>
        </div>

        
        <div id="form-modal" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog  modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Rincian Transaksi</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($order): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            ID Transaksi
                            <span>#<?php echo e($order->id_transaksi); ?></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Nama Pelanggan
                            <span><?php echo e(@$order->user->name); ?></span>
                        </li>
                        <?php if($order->brand): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Brand
                            <span><?php echo e($order->brand->name); ?></span>
                        </li>
                        <?php endif; ?>

                        <?php if($order->product && $order->product->category): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Kategori
                            <span><?php echo e($order->product->category->name); ?></span>
                        </li>
                        <?php endif; ?>

                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Kode Voucher
                            <span><?php echo e(@$order->voucher); ?></span>
                        </li>



                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Tanggal Transaksi
                            <span><?php echo e(date('l, d F Y H:i', strtotime($order->created_at))); ?></span>
                        </li>
                        <?php if($order->shippingType): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Metode Pengiriman
                            <span><?php echo e($order->shippingType->shipping_type_name); ?></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Ongkos Kirim
                            <span>Rp. <?php echo e(number_format($order->shippingType->shipping_price)); ?></span>
                        </li>
                        <?php if($order->shippingType->shipping_discount > 0): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Diskon Ongkos Kirim
                            <span class="text-green-600">Rp. -<?php echo e(number_format($order->shippingType->shipping_discount)); ?></span>
                        </li>
                        <?php endif; ?>
                        <?php endif; ?>
                        <?php if($order->diskon > 0): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Diskon
                            <span>Rp. -<?php echo e(number_format($order->diskon)); ?></span>
                        </li>
                        <?php endif; ?>

                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Kode Unik
                            <span><?php echo e(@$order->payment_unique_code); ?></span>
                        </li>

                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Total Harga
                            <span>Rp. <?php echo e(number_format($order->nominal)); ?></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Hubungi Pembeli
                            <a href="http://wa.me/<?php echo e(@$order->user->telepon); ?>" target="_blank"><span class="badge badge-success"><i class="fas fa-whatsapp"></i> Hubungi</span></a>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Status
                            <?php switch($order->status):
                            case (1): ?>
                            <span class="badge badge-warning">Belum Bayar</span>
                            <?php break; ?>
                            <?php case (2): ?>
                            <span class="badge badge-info">Sudah Upload Bukti Bayar</span>
                            <?php break; ?>
                            <?php case (3): ?>
                            <span class="badge badge-success">Pembayaran Diterima</span>
                            <?php break; ?>
                            <?php case (4): ?>
                            <span class="badge badge-danger">Pembayaran Ditolak</span>
                            <?php break; ?>
                            <?php case (5): ?>
                            <span class="badge badge-danger">Transaksi Dibatalkan</span>
                            <?php break; ?>
                            <?php case (7): ?>
                            <?php switch($order->status_delivery):
                            case (1): ?>
                            <span class="badge badge-info">Waiting Proses Packing</span>
                            <?php break; ?>
                            <?php case (2): ?>
                            <span class="badge badge-info">Proses Packing</span>
                            <?php break; ?>
                            <?php case (3): ?>
                            <span class="badge badge-warning">Proses Delivery</span>
                            <?php break; ?>
                            <?php case (4): ?>
                            <span class="badge badge-success">Delivered</span>
                            <?php break; ?>
                            <?php case (21): ?>
                            <span class="badge badge-success">Siap Dikirim</span>
                            <?php break; ?>
                            <?php default: ?>
                            <?php endswitch; ?>
                            <?php break; ?>
                            <?php default: ?>

                            <?php endswitch; ?>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            By User
                            <span class="badge badge-info">
                                <?php if(!empty($logdata->name)): ?>
                                <?php echo e(@$logdata->name); ?>

                                <?php else: ?>
                                -
                                <?php endif; ?>
                            </span>
                        </li>
                        <?php endif; ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            <table class="table table-bordered">
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Harga (satuan)</th>
                                    <th>Total Harga</th>
                                </tr>
                                <?php if(!empty($order->transactionDetail)): ?>
                                <?php $__currentLoopData = $order->transactionDetail; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $det): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td>
                                        <span><?php echo e($det->product->name); ?></span> <br>
                                        <?php if($det->variant): ?>
                                        <span>Variant: <?php echo e($det->variant->name); ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo e($det->qty); ?></td>
                                    <td>Rp <?php echo e(number_format($det->price,0,',','.')); ?></td>
                                    <td>Rp <?php echo e(number_format($det->price*$det->qty,0,',','.')); ?></td>
                                </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                <?php endif; ?>
                            </table>
                        </li>
                    </div>
                    <div class="modal-footer">
                        

                    </div>
                </div>
            </div>
        </div>

        
        <div id="form-modal-payment" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog  modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Detail Pembayaran</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($payment): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            ID Transaksi
                            <span>#<?php echo e(@$payment->transaction->id_transaksi); ?></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Nama Rekening
                            <span><?php echo e(@$payment->nama_rekening); ?></span>
                        </li>


                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Jumlah Transfer
                            <span>Rp. <?php echo e(@number_format($payment->jumlah_bayar)); ?></span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Tanggal Transfer
                            <span><?php echo e(@date('l, d F Y', strtotime($payment->tanggal_bayar))); ?></span>
                        </li>

                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Ref ID
                            <span><?php echo e(@number_format($payment->ref_id)); ?></span>
                        </li>

                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Status
                            <?php switch(@$payment->status):
                            case (0): ?>
                            <span class="badge badge-warning">Diproses</span>
                            <?php break; ?>
                            <?php case (1): ?>
                            <span class="badge badge-success">Diverifikasi</span>
                            <?php break; ?>
                            <?php case (2): ?>
                            <span class="badge badge-danger">Ditolak</span>
                            <?php break; ?>
                            <?php default: ?>

                            <?php endswitch; ?>
                        </li>
                        <?php if(@$payment->foto_struk): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Foto
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            <img src="<?php echo e(getImage(@$payment->foto_struk)); ?>" alt="" style="height: 200px;">
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            <button class="btn btn-primary btn-sm" wire:click="showPhoto(<?php echo e(@$trans->id); ?>)">Show Image</button>
                        </li>
                        <?php endif; ?>
                        <?php if(!@$payment->ref_id): ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'ref_id','label' => 'Ref Id','placeholder' => 'Input Ref Id']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'ref_id','label' => 'Ref Id','placeholder' => 'Input Ref Id']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php endif; ?>
                        <?php else: ?>
                        <?php if(!@$payment->ref_id): ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'jumlah_bayar','label' => 'Nominal Transfer','placeholder' => 'Nominal Transfer']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'jumlah_bayar','label' => 'Nominal Transfer','placeholder' => 'Nominal Transfer']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'bank_dari','label' => 'Bank Transfer','placeholder' => 'Bank Transfer']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'bank_dari','label' => 'Bank Transfer','placeholder' => 'Bank Transfer']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'nama_rekening','label' => 'Nama Akun Bank','placeholder' => 'Nama Akun Bank']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'nama_rekening','label' => 'Nama Akun Bank','placeholder' => 'Nama Akun Bank']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'date','name' => 'tanggal_bayar','label' => 'Tanggal Transfer','placeholder' => 'Tanggal Transfer']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'date','name' => 'tanggal_bayar','label' => 'Tanggal Transfer','placeholder' => 'Tanggal Transfer']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'ref_id','label' => 'Ref Id','placeholder' => 'Input Ref Id']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'ref_id','label' => 'Ref Id','placeholder' => 'Input Ref Id']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php endif; ?>
                        <?php endif; ?>

                    </div>
                    <div class="modal-footer">
                        <?php if(@$payment->status == 0): ?>
                        <button class="btn btn-success btn-sm" wire:click='approvePayment'><i class="fa fa-check pr-2"></i>Terima</button>
                        <button class="btn btn-danger btn-sm" wire:click='declinePayment'><i class="fa fa-times pr-2"></i>Tolak</button>
                        <?php endif; ?>

                        <!--<button class="btn btn-warning btn-sm" wire:click='_reset'><i class="fa fa-times pr-2"></i>Tutup</button>-->
                    </div>
                </div>
            </div>
        </div>

        
        <div id="form-modal-photo" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Bukti Pembayaran</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if(@$payment->foto_struk): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            Foto
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center border-0">
                            <img src="<?php echo e(getImage(@$payment->foto_struk)); ?>" alt="" style="height: 800px;">
                        </li>
                        <?php endif; ?>


                    </div>
                </div>
            </div>
        </div>

        
        <div id="form-modal-resi" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog  modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">No. Resi</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'resi','label' => 'Resi','placeholder' => 'Input No. Resi','readonly' => true]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'resi','label' => 'Resi','placeholder' => 'Input No. Resi','readonly' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success btn-sm" wire:click='saveResi'><i class="fa fa-check pr-2"></i>Update Status</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="form-modal-log" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog  modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Log Proccess</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-lightss">
                            <thead class="thead-lightss">
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Keterangan</th>
                                    <th>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $__currentLoopData = $logs; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $log): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td><?php echo e($key +1); ?></td>
                                    <td>
                                        <span><?php echo e($log->user->name); ?></span>
                                        <span class="badge badge-success"><?php echo e($log->user->role->role_name); ?></span>
                                    </td>
                                    <td><?php echo e($log->keterangan); ?></td>
                                    <td><?php echo e($log->created_at); ?></td>
                                </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">

                    </div>
                </div>
            </div>
        </div>

        
        <div id="timeline-modal" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog  modal-lg" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Informasi Pengiriman</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($history_shipping): ?>
                        <ul class="timeline">
                            <?php $__currentLoopData = $history_shipping; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <li>
                                <a target="_blank" href="https://www.totoprayogo.com/#" class="ml-4">New Web Design</a>
                                <a href="#" class="float-right"><?php echo e(date('l, d F Y', strtotime($item['date']))); ?></a>
                                <p class="ml-6"><?php echo e($item['description']); ?></p>
                            </li>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </ul>
                        <?php else: ?>
                        <div style="height: 200px;">
                            <div class="table-row p-1 divide-x divide-gray-100 flex justify-center items-center" style="position: absolute;left: 0;right: 0;height: 200px;" id="row-">
                                <div class="flex flex-col justify-center items-center mt-8">
                                    <img src="<?php echo e(asset('assets/img/empty.svg')); ?>" alt="">
                                    <span>Tidak Ada Data</span>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                        <!-- Section: Timeline -->
                    </div>
                    <div class="modal-footer">

                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php $__env->startPush('styles'); ?>
    <style>
        ul.timeline {
            list-style-type: none;
            position: relative;
        }

        ul.timeline:before {
            content: ' ';
            background: #d4d9df;
            display: inline-block;
            position: absolute;
            left: 29px;
            width: 2px;
            height: 100%;
            z-index: 400;
        }

        ul.timeline>li {
            margin: 20px 0;
            padding-left: 20px;
        }

        ul.timeline>li:before {
            content: ' ';
            background: white;
            display: inline-block;
            position: absolute;
            border-radius: 50%;
            border: 3px solid #22c0e8;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 400;
        }
    </style>
    <?php $__env->stopPush(); ?>
    <?php $__env->startPush('scripts'); ?>



    <script>
        $(document).ready(function(value) {
            $('#reportrange').daterangepicker({
                startDate: moment().subtract(29, 'days'),
                endDate: moment(),
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }).on('change',e=>{
                // window.livewire.find('<?php echo e($_instance->id); ?>').set('reportrange', e.target.value)
                window.livewire.find('<?php echo e($_instance->id); ?>').call('applyFilterDate', e.target.value)
            });

            
            window.livewire.on('showModal', (data) => {
                $('#form-modal').modal('show')
            });
            var key=0
            window.livewire.on('printInvoice', (url) => {
                window.open(url,'_blank')
            });
            window.livewire.on('downloadFile', (data) => {
                window.open(data?.url,'_blank')
            });
            window.livewire.on('showModalPayment', (data) => {
                $('#form-modal-payment').modal('show')
            });
            window.livewire.on('showModalPhoto', (data) => {
                $('#form-modal-photo').modal('show')
            });
            window.livewire.on('showModalResi', (data) => {
                $('#form-modal-resi').modal('show')
            });
            window.livewire.on('showModalLog', (data) => {
                $('#form-modal-log').modal('show')
            });
            window.livewire.on('timelineModal', (data) => {
                $('#timeline-modal').modal(data)
            });
            window.livewire.on('getSelected', (data) => {
                $('#reportrange').daterangepicker({
                startDate: moment().subtract(29, 'days'),
                endDate: moment(),
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }).on('change',e=>{
                // window.livewire.find('<?php echo e($_instance->id); ?>').set('reportrange', e.target.value)
                window.livewire.find('<?php echo e($_instance->id); ?>').call('applyFilterDate', e.target.value)
            });
            });
            window.livewire.on('closeModal', (data) => {
                $('#confirm-modal').modal('hide')
                $('#form-modal').modal('hide')
                $('#form-modal-payment').modal('hide')
                $('#form-modal-resi').modal('hide')
                $('#form-modal-log').modal('hide')
                $('#timeline-modal').modal('hide')
            });
        })
    </script>
    <?php $__env->stopPush(); ?>
</div><?php /**PATH /Applications/MAMP/htdocs/aimi-crm-momsy/server/resources/views/livewire/transaction/tbl-transactions.blade.php ENDPATH**/ ?>