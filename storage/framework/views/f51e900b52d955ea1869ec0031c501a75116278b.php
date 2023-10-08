<?php if (isset($component)) { $__componentOriginal1c033872f6702129cc9a9b857a6606a850d68107 = $component; } ?>
<?php $component = App\View\Components\UserLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('user-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(App\View\Components\UserLayout::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    <div class="container container-transparent animated fadeIn">
        <?php
if (! isset($_instance)) {
    $html = \Livewire\Livewire::mount('auth.register', [])->html();
} elseif ($_instance->childHasBeenRendered('eemNHlo')) {
    $componentId = $_instance->getRenderedChildComponentId('eemNHlo');
    $componentTag = $_instance->getRenderedChildComponentTagName('eemNHlo');
    $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
    $_instance->preserveRenderedChild('eemNHlo');
} else {
    $response = \Livewire\Livewire::mount('auth.register', []);
    $html = $response->html();
    $_instance->logRenderedChild('eemNHlo', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
}
echo $html;
?>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal1c033872f6702129cc9a9b857a6606a850d68107)): ?>
<?php $component = $__componentOriginal1c033872f6702129cc9a9b857a6606a850d68107; ?>
<?php unset($__componentOriginal1c033872f6702129cc9a9b857a6606a850d68107); ?>
<?php endif; ?><?php /**PATH /Users/danyarkham/aimi-crm-momsy/server/resources/views/auth/register.blade.php ENDPATH**/ ?>