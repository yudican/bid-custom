<div class="list-group-item-figure" id="<?php echo e($trans->id); ?>" wire:key="item-<?php echo e($trans->id); ?>">
  <div class="dropdown">
    <button class="btn-dropdown" data-toggle="dropdown" aria-expanded="false">
      <i class="fas fa-ellipsis-h"></i>
    </button>
    <div class="dropdown-arrow"></div>
    <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-124px, 25px, 0px); top: 0px; left: 0px; will-change: transform;">
      <?php if (isset($role) && $trans) : ?>
        <?php if (in_array($role->role_type, ['admin', 'superadmin', 'finance', 'warehouse', 'adminsales'])) : ?>
          <a href="#" wire:click="getDataById(<?php echo e($trans->id); ?>)" class="dropdown-item">Detail Pesanan</a>
          <?php if ($role->role_type == 'finance' && $trans->status < 3) : ?> <?php if ($trans->confirmPayment) : ?>
              <a href="#" wire:click="showPaymentDetail(<?php echo e($trans->id); ?>)" class="dropdown-item">Verifikasi Manual</a>
            <?php endif; ?>
          <?php endif; ?>

          <?php if (in_array($role->role_type, ['warehouse', 'adminsales', 'superadmin']) && $trans->status_delivery == 1 && $trans->status == '7') : ?>
            <?php if (in_array($role->role_type, ['adminsales', 'superadmin']) && $trans->label) : ?>
              <a href="<?php echo e($trans->label->label_url); ?>" target="_blank" class="dropdown-item">Cetak Label</a>
            <?php endif; ?>
            <?php if (in_array($role->role_type, ['warehouse'])) : ?>
              <a href="#" wire:click="packingProcess(<?php echo e($trans->id); ?>)" class="dropdown-item">Proses Pengemasan</a>
            <?php endif; ?>

          <?php endif; ?>

          <?php if (in_array($role->role_type, ['warehouse', 'adminsales', 'superadmin']) && $trans->status_delivery == 21) : ?>
            <?php if (in_array($role->role_type, ['adminsales', 'superadmin']) && $trans->label) : ?>
              <a href="<?php echo e($trans->label->label_url); ?>" target="_blank" class="dropdown-item">Cetak Label</a>
            <?php endif; ?>

            <?php if (in_array($role->role_type, ['warehouse'])) : ?>
              <a href="#form-modal-resi" data-toggle="modal" wire:click="inputResi(<?php echo e($trans->id); ?>)" class="dropdown-item">Dikirim</a>
              <a href="#" wire:click="logTransaction(<?php echo e($trans->id); ?>)" class="dropdown-item">Log</a>
            <?php endif; ?>
          <?php endif; ?>

          <?php if ($role->role_type == 'warehouse' && $trans->status_delivery == 3) : ?>
            <!--<a href="<?php echo e(route('invoice.struct.print', $trans->id)); ?>" target="_blank" class="dropdown-item">Data Penerima</a>-->
            <a href="#" wire:click="productReceived(<?php echo e($trans->id); ?>)" class="dropdown-item">Diterima</a>
          <?php endif; ?>

          <?php if (in_array($role->role_type, ['admin', 'superadmin', 'finance', 'adminsales']) && $trans->status == 3) : ?>
            <a href="#" wire:click="assignWarehouse(<?php echo e($trans->id); ?>)" class="dropdown-item">Assign To Warehouse</a>
          <?php endif; ?>
        <?php elseif (in_array($role->role_type, ['mitra', 'subagent'])) : ?>
          <a href="<?php echo e(route('transaction.detail', $trans->id)); ?>" class="dropdown-item">Detail Pesanan</a>
          <?php if ($trans->status_delivery >= 3 && $trans->resi) : ?>
            <button wire:click="showTimeline('<?php echo e($trans->resi); ?>')" class="dropdown-item">Lacak</button>
          <?php endif; ?>
        <?php endif; ?>
      <?php endif; ?>

    </div>
  </div>
</div><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/livewire/components/transaction-action-button.blade.php ENDPATH**/ ?>