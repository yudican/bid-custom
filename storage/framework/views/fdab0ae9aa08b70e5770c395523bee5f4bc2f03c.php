<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>" />

    <title>Bid Flow | LOGIN</title>

    <!-- Fonts -->
    <!-- <link rel="icon" href="https://aimidev.s3.us-west-004.backblazeb2.com/upload/user/vRjRT1hSkFsQybE2DxYJHV4maRdirfcuOg1ENONH.ico" type="image/x-icon" /> -->
    <link
      rel="icon"
      href="<?php echo e(asset('assets/img/bidflowlogo.jpg')); ?>"
      type="image/x-icon"
    />
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/style.css')); ?>" />
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?> <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
  </head>

  <body>
    <div id="spa-index"></div>
    <script>
      const global = globalThis
    </script>
  </body>
</html>
<?php /**PATH /Users/yudicandra/Documents/Projects/aimigroup/fis-momsy/server/resources/views/layouts/client.blade.php ENDPATH**/ ?>