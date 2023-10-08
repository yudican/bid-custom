<div class="page-inner">
    <?php if($transaction): ?>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-capitalize">
                        <a href="<?php echo e(route('dashboard')); ?>">
                            <span> <i class="fas fa-arrow-left"></i> Detail Transaksi</span>
                        </a>
                    </h4>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mx-auto">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <img src="<?php echo e(asset('assets/img/OnlineShopeGirl.svg')); ?>" alt="">
                                <h2 class="text-center text-bold"><b>Transaksi Berhasil</b></h2>
                                <p class="text-center">Terimakasih sudah berbelanja di <?php echo e(auth()->user()->brand->name); ?>

                                    Segera lakukan pembayaran pesananmu agar dapat kami proses ke langkah selanjutnya. </p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <table>
                                <tr>
                                    <td width="50%">ID Transaksi</td>
                                    <td>: <?php echo e($transaction->id_transaksi); ?></td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <?php if($transaction->status == 1): ?>
                                    <td>: Menunggu Pembayaran</td>
                                    <?php elseif(in_array($transaction->status,[2])): ?>
                                    <td>: Pengecekan Pembayaran</td>
                                    <?php elseif(in_array($transaction->status,[4,5,6])): ?>
                                    <td>: Transaksi Dibatalkan</td>
                                    <?php else: ?>
                                    <td>: Pembayaran Diterima</td>
                                    <?php endif; ?>

                                </tr>
                                <tr>
                                    <td>Batas Pembayaran</td>
                                    <td>: <?php echo e(Carbon\Carbon::parse($transaction->created_at)->addDays(1)->diffForHumans()); ?></td>
                                </tr>
                            </table>
                            <br>
                            <div class="card">
                                <div class="card-header">
                                    <?php echo e($transaction->paymentMethod->nama_bank); ?>

                                    <img src="<?php echo e(getImage($transaction->paymentMethod->logo_bank)); ?>" style="float:right;height:20px">
                                </div>
                                <div class="card-body">
                                    <?php if(in_array($transaction->paymentMethod->payment_channel, ['bank_transfer','echannel']) && $transaction->paymentMethod->payment_type == 'Otomatis'): ?>

                                    <div>
                                        <?php if($transaction->paymentMethod->payment_channel == 'echannel'): ?>

                                        <p style="font-size:10px">Kode Perusahaan</p>
                                        <p style="font-size:14px;font-weight:600"><?php echo e($transaction->paymentMethod->payment_va_number); ?></p>
                                        <br>
                                        <?php endif; ?>
                                        <p style="font-size:10px">Nomor Virtual Account</p>
                                        <p style="font-size:14px;font-weight:600"><?php echo e($transaction->payment_va_number); ?></p>
                                    </div>

                                    <?php elseif(in_array($transaction->paymentMethod->payment_channel,['gopay','qris'])): ?>
                                    <div>
                                        <img src="<?php echo e($transaction->payment_qr_url); ?>" alt="">
                                        <p class="text-center">Scan kode QR diatas untuk melakukan pembayaran</p>
                                    </div>
                                    <?php else: ?>
                                    <div>
                                        <p style="font-size:10px">Nama Rekening Bank</p>
                                        <p style="font-size:14px;font-weight:600"><?php echo e($transaction->paymentMethod->nama_rekening_bank); ?></p> <br>
                                        <p style="font-size:10px">Nomor Rekening Bank</p>
                                        <p style="font-size:14px;font-weight:600"><?php echo e($transaction->paymentMethod->nomor_rekening_bank); ?></p>
                                    </div>
                                    <?php endif; ?>

                                    <br>
                                    <p style="font-size:10px">Total Pembayaran</p>
                                    <p style="font-size:14px;font-weight:600;color:red">Rp <?php echo e(number_format($transaction->nominal)); ?></p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    Rincian Produk
                                </div>
                                <div class="card-body">
                                    <?php $__currentLoopData = $transaction->transactionDetail; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $detail): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <article class="mb-3 pb-3">
                                        <div class="d-flex justify-content-start align-items-center flex-row">
                                            <div class="aside"> <img src="<?php echo e(getImage($detail->product->image)); ?>" height="85" width="85" class="img-thumbnail img-sm"> </div>
                                            <div class="info ml-2">
                                                <span class="title" style="font-size: 12px;"><?php echo e($detail->product->name); ?> </span> <br>
                                                <?php if($detail->variant): ?>
                                                <span class="title" style="font-size: 12px;">Variant: <?php echo e($detail->variant->name); ?> </span>
                                                <?php endif; ?>
                                                <br>
                                                <span class="text-muted" style="font-size: 10px;"><?php echo e($detail->product->weight); ?> gr</span> <br>
                                                <strong class="price" style="font-size: 12px;color:red;"> Rp. <?php echo e(number_format($detail->product->price['final_price'])); ?> x <?php echo e($detail->qty); ?> </strong>
                                            </div>
                                        </div> <!-- row.// -->
                                    </article>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <span>Metode Pengiriman - <?php echo e($transaction->shippingType->shipping_type_name); ?></span>
                                    <img src="<?php echo e($transaction->shippingType->shipping_logo); ?>" style="float:right;height:20px">
                                </div>
                                <div class="card-body">
                                    <div class="d-flex flex-row justify-between">
                                        <div>
                                            <p style="font-size:10px">Nama Penerima</p>
                                            <p style="font-size:14px;font-weight:600"><?php echo e($transaction->addressUser->name); ?></p>
                                        </div>
                                        <div>
                                            <span class="badge badge-success"><?php echo e($transaction->addressUser->type); ?></span>
                                        </div>
                                    </div>
                                    <p style="font-size:14px" class="pt-2"><?php echo e($transaction->addressUser->telepon); ?></p>
                                    <p style="font-size:14px"><?php echo e($transaction->addressUser->alamat_detail); ?></p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body row">
                                    <div class="col-6">
                                        <a href="<?php echo e(route('invoice.print', $transaction->id)); ?>" target="_blank"><button class="btn btn-outline-primary w-100">Lihat Invoice</button></a>
                                    </div>
                                    <?php if($transaction->paymentMethod->payment_type == 'Manual'): ?>

                                    <div class="col-6">
                                        <?php if($hasConfirm): ?>
                                        <button class="btn btn-primary w-100" disabled>Upload Bukti Bayar</button>
                                        <?php else: ?>
                                        <button class="btn btn-primary w-100" wire:click="confirmPayment">Upload Bukti Bayar</button>
                                        <?php endif; ?>

                                    </div>
                                    <?php else: ?>
                                    <div class="col-6">
                                        <a href="<?php echo e(route('product-agent')); ?>">
                                            <button class="btn btn-outline-primary w-100">Transaksi Lainnya</button>
                                        </a>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <?php if(is_array($transaction->payment_proof) && count($transaction->payment_proof) > 0): ?>
                            <p><b>Cara Pembayaran</b></p>
                            <?php endif; ?>
                            <div class="tab-content" id="v-pills-tabContent">
                                <div class="tab-pane fade active show" id="v-pills-home-icons" role="tabpanel" aria-labelledby="v-pills-home-tab-icons">
                                    <div class="accordion accordion-primary">
                                        <?php $__currentLoopData = paymentguide($transaction->paymentMethod->payment_code); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="card mb-0">
                                            <div class="card-header" id="headingFour-<?php echo e($item['id']); ?>" data-toggle="collapse" data-target="#collapseFour-<?php echo e($item['id']); ?>" aria-controls="collapseFour-<?php echo e($item['id']); ?>" role="button">
                                                
                                                <div class="span-title">
                                                    <?php echo e($item['name']); ?>

                                                </div>
                                                <div class="span-mode"></div>
                                            </div>

                                            <div id="collapseFour-<?php echo e($item['id']); ?>" class="collapse" aria-labelledby="headingFour-<?php echo e($item['id']); ?>" data-parent="#accordion" role="button">
                                                <div class="card-body">
                                                    <ul>
                                                        <?php $__currentLoopData = $item['details']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $detail): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                        <li><?php echo e($detail['id']); ?>. <?php echo $detail['title']; ?></li>
                                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div id="confirm-payment-modal" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog" permission="document">
                <div class="modal-content <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                    <div class="modal-header <?php echo e($is_dark_mode ? 'bg-black' : 'bg-white'); ?>">
                        <h5 class="modal-title text-capitalize" id="my-modal-title">Upload Bukti Bayar</h5>
                        <button style="float:right;" class="btn btn-danger btn-xs" wire:click='_reset'><i class="fa fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'text','name' => 'nama_rekening','label' => 'Nama Rekening','placeholder' => 'Contoh : Yudi Candra']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'text','name' => 'nama_rekening','label' => 'Nama Rekening','placeholder' => 'Contoh : Yudi Candra']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.select','data' => ['name' => 'bank_tujuan','label' => 'Bank Tujuan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('select'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'bank_tujuan','label' => 'Bank Tujuan']); ?>
                            <option value="">Pilih Bank Tujuan</option>
                            <option value="BCA">BCA</option>
                            <option value="MANDIRI">MANDIRI</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                         <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.select','data' => ['name' => 'bank_dari','label' => 'Bank Asal']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('select'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'bank_dari','label' => 'Bank Asal']); ?>
                            <option value="">Pilih Bank Tujuan</option>
                            <option value="BCA">BCA</option>
                            <option value="MANDIRI">MANDIRI</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                         <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.text-field','data' => ['type' => 'number','name' => 'jumlah_bayar','label' => 'Jumlah Bayar','placeholder' => 'Contoh : 100000']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('text-field'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'number','name' => 'jumlah_bayar','label' => 'Jumlah Bayar','placeholder' => 'Contoh : 100000']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                        <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.input-photo','data' => ['foto' => ''.e($foto_struk).'','path' => ''.e(optional($foto_struk_path)->temporaryUrl()).'','name' => 'foto_struk_path','label' => 'Foto Struk']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('input-photo'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['foto' => ''.e($foto_struk).'','path' => ''.e(optional($foto_struk_path)->temporaryUrl()).'','name' => 'foto_struk_path','label' => 'Foto Struk']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success btn-sm" wire:click="saveConfirmPayment"><i class="fa fa-check pr-2"></i>Upload Bukti Bayar</button>

                    </div>
                </div>
            </div>
        </div>

        <?php $__env->startPush('scripts'); ?>
        <script src="<?php echo e(asset('assets/js/plugin/summernote/summernote-bs4.min.js')); ?>"></script>
        <script src="<?php echo e(asset('assets/js/plugin/datatables/datatables.min.js')); ?>"></script>
        <script>
            $(document).ready(function(value) {
                $('input[type="file"]').on("change", function() {
                    let filenames = [];
                    let files = document.getElementById("customFile").files;
                    if (files.length > 1) {
                    filenames.push("Total Files (" + files.length + ")");
                    } else {
                    for (let i in files) {
                        if (files.hasOwnProperty(i)) {
                        filenames.push(files[i].name);
                        }
                    }
                    }
                    $(this)
                    .next(".custom-file-label")
                    .html(filenames.join(","));
                });

            window.livewire.on('loadForm', (data) => {
                $('#basic-datatables').DataTable({});
                $('#description').summernote({
                    placeholder: 'description',
                    fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'],
                    tabsize: 2,
                    height: 300,
                    callbacks: {
                                onChange: function(contents, $editable) {
                                    window.livewire.find('<?php echo e($_instance->id); ?>').set('description', contents);
                                }
                            }
                    });
                });

            window.livewire.on('closeModal', (data) => {
                $('#confirm-payment-modal').modal('hide')
            });

            window.livewire.on('showModalConfirm', (data) => {
                $('#confirm-payment-modal').modal('show')
            });
        })
        </script>

        <?php $__env->stopPush(); ?>
    </div>
    <?php endif; ?>
</div><?php /**PATH /Users/yudicandra/Documents/Projects/Laravel/laravel/server/resources/views/livewire/agent/transaction-success.blade.php ENDPATH**/ ?>