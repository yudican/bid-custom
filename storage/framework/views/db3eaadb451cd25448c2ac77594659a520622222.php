<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>" />

    <title>Bid Flow | Admin Portal</title>

    <!-- Fonts -->
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
    />
    <!-- <link rel="icon" href="https://aimidev.s3.us-west-004.backblazeb2.com/upload/user/vRjRT1hSkFsQybE2DxYJHV4maRdirfcuOg1ENONH.ico" type="image/x-icon" /> -->
    <link
      rel="icon"
      href="<?php echo e(asset('assets/img/fis.jpg')); ?>"
      type="image/x-icon"
    />

    <!-- Fonts and icons -->
    <script src="<?php echo e(asset('assets/js/plugin/webfont/webfont.min.js')); ?>"></script>
    <script>
      WebFont.load({
        google: { families: ["Lato:300,400,700,900"] },
        custom: {
          families: [
            "Flaticon",
            "Font Awesome 5 Solid",
            "Font Awesome 5 Regular",
            "Font Awesome 5 Brands",
            "simple-line-icons",
          ],
          urls: [`<?php echo e(asset('assets/css/fonts.min.css')); ?>`],
        },
        active: function () {
          sessionStorage.fonts = true
        },
      })
    </script>

    <!-- CSS Files -->
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/bootstrap.min.css')); ?>" />
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/atlantis2.css')); ?>" />

    <!-- Styles -->
     <?php echo $__env->yieldPushContent('styles'); ?> <?php echo \Livewire\Livewire::styles(); ?>

    <style>
      .cursor-pointer {
        cursor: pointer;
      }

      .cursor-default {
        cursor: default;
      }

      .absolute {
        position: absolute;
        bottom: 5px;
        left: 5px;
      }

      .table td,
      .table th {
        font-size: 14px;
        border-top-width: 0px;
        border-bottom: 1px solid;
        border-color: #ebedf2 !important;
        padding: 0 10px !important;
        height: 60px;
        vertical-align: middle !important;
      }

      .navbar .navbar-nav .nav-item .nav-link:hover {
        background-color: #fff !important;
        color: black border-radius:5px
      }

      .navbar .navbar-nav .nav-item {
        margin-right: 0;
      }

      .navbar .navbar-nav .nav-item:hover {
        background-color: #fff !important;
      }

      .btn-default {
        background-color: #fff;
      }

      .main-header[data-background-color="white"] .navbar-nav .nav-item .nav-link:hover,
      .main-header[data-background-color="white"] .navbar-nav .nav-item .nav-link:focus,
      .main-header.fixed[data-background-color="transparent"] .navbar-nav .nav-item .nav-link:hover,
      .main-header.fixed[data-background-color="transparent"] .navbar-nav .nav-item .nav-link:focus {
        background: #fff !important;
      }
    </style>
    <!-- Scripts -->
    
  </head>

  <body class="font-sans antialiased" style="background-color: #fff">
    <div class="wrapper">
      <div class="main-header shadow-sm" data-background-color="white">
        <div class="nav-top">
          <!-- Just an image -->
          <nav class="navbar navbar-light" data-background-color="white">
            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <div class="flex">
                <a href="/login/dashboard" class="text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                  >
                    <title>ionicons-v5-a</title>
                    <polyline
                      points="244 400 100 256 244 112"
                      style="
                        fill: none;
                        stroke: #000;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 48px;
                      "
                    />
                    <line
                      x1="120"
                      y1="256"
                      x2="412"
                      y2="256"
                      style="
                        fill: none;
                        stroke: #000;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 48px;
                      "
                    />
                  </svg>
                </a>
              </div>

              <div class="mt-2 ml-2">
                <h3>Sign Up</h3>
              </div>
            </div>
            <a class="navbar-brand" href="#">
              
              
            </a>
          </nav>
        </div>
      </div>

      <div class="main-panel">
        <div class="container"><?php echo e($slot); ?></div>
      </div>
      
    </div>

    <script src="<?php echo e(asset('assets/js/core/jquery.3.2.1.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/core/popper.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/core/bootstrap.min.js')); ?>"></script>

    <!-- jQuery UI -->
    <script src="<?php echo e(asset('assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js')); ?>"></script>
    <script src="<?php echo e(asset(
          'assets/js/plugin/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js'
        )); ?>"></script>

    <!-- jQuery Scrollbar -->
    <script src="<?php echo e(asset('assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/atlantis2.min.js')); ?>"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <?php echo $__env->yieldPushContent('scripts'); ?>
    <script>
      $(document).ready(function (value) {
        window.livewire.on(
          "showAlert",
          ({ msg, redirect = false, path = "/" }) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: msg,
              timer: 2000,
              showCancelButton: false,
              showConfirmButton: false,
            })

            if (redirect) {
              setTimeout(() => {
                window.location.href = path
              }, 3000)
            }
          }
        )

        window.livewire.on("showAlertError", (data) => {
          console.log(data, "data")
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.msg,
            timer: 2000,
            showCancelButton: false,
            showConfirmButton: false,
          })
        })
      })
    </script>
    <?php echo \Livewire\Livewire::scripts(); ?>

  </body>
</html>
<?php /**PATH /Users/danyarkham/aimi-crm-momsy/server/resources/views/layouts/user.blade.php ENDPATH**/ ?>