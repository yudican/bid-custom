<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="user_id" content="<?php echo e(auth()->user()->id); ?>">
    <?php if (config('app.production')) : ?>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <?php endif; ?>
    <title>Bid Flow | Admin Portal</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap">
    <link rel="icon" href="<?php echo e(asset('assets/img/fis.jpg')); ?>" type="image/x-icon" />

    <!-- Fonts and icons -->
    <script src="<?php echo e(asset('assets/js/plugin/webfont/webfont.min.js')); ?>"></script>
    <script>
        WebFont.load({
            google: {
                "families": ["Lato:300,400,700,900"]
            },
            custom: {
                "families": ["Flaticon", "Font Awesome 5 Solid", "Font Awesome 5 Regular", "Font Awesome 5 Brands", "simple-line-icons"],
                urls: [`<?php echo e(request()->getSchemeAndHttpHost()); ?>/assets/css/fonts.min.css`]
            },
            active: function() {
                sessionStorage.fonts = true;
            }
        });
    </script>

    <script>
        global = globalThis
    </script>

    <!-- CSS Files -->
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/bootstrap.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/atlantis.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/style.css')); ?>">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
    <!-- Styles -->
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
    <?php echo $__env->yieldPushContent('styles'); ?>
    <?php echo \Livewire\Livewire::styles(); ?>

    <style>
        input[type=checkbox],
        input[type=radio] {
            box-sizing: border-box;
            padding: 7px;
        }

        /* Absolute Center Spinner */
        .loading {
            position: fixed;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: url('//upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Phi_fenomeni.gif/50px-Phi_fenomeni.gif') 50% 50% no-repeat rgb(249, 249, 249);
        }



        .form-control {
            display: block;
            width: 100%;
            height: calc(2.25rem + 2px);
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 20px;
            margin-left: 12px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 14px;
            left: 0px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked+.slider {
            background-color: #2196F3;
        }

        input:focus+.slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked+.slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    </style>
    <!-- Scripts -->

</head>

<body class="font-sans antialiased dark" id="body" data-background-color="<?php echo e($is_dark_mode ? 'dark' : ''); ?>">
    <div class="wrapper">
        <div class="main-header">
            <!-- Logo Header -->
            <div class="logo-header" id="logo" data-background-color="<?php echo e($is_dark_mode ? 'dark2' : 'blue3'); ?>">

                <a href="<?php echo e(route('dashboard')); ?>" class="logo">
                    <span class="text-white"><strong>FIS AIMI GROUP</strong></span>
                </a>
                <button class="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon">
                        <i class="icon-menu"></i>
                    </span>
                </button>
                <button class="topbar-toggler more"><i class="icon-options-vertical"></i></button>
                <div class="nav-toggle">
                    <button class="btn btn-toggle toggle-sidebar">
                        <i class="icon-menu"></i>
                    </button>
                </div>
            </div>
            <!-- End Logo Header -->

            <!-- Navbar Header -->
            <nav class="navbar navbar-header navbar-expand-lg" id="header" data-background-color="<?php echo e($is_dark_mode ? 'dark' : 'blue3'); ?>">

                <div class="container-fluid">

                    <ul class="navbar-nav topbar-nav ml-md-auto align-items-center">
                        <li class="nav-item dropdown hidden-caret submenu d-flex">

                            <?php
                            if (!isset($_instance)) {
                                $html = \Livewire\Livewire::mount('components.switch-account')->html();
                            } elseif ($_instance->childHasBeenRendered('4U7X3bl')) {
                                $componentId = $_instance->getRenderedChildComponentId('4U7X3bl');
                                $componentTag = $_instance->getRenderedChildComponentTagName('4U7X3bl');
                                $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
                                $_instance->preserveRenderedChild('4U7X3bl');
                            } else {
                                $response = \Livewire\Livewire::mount('components.switch-account');
                                $html = $response->html();
                                $_instance->logRenderedChild('4U7X3bl', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
                            }
                            echo $html;
                            ?>
                            <?php
                            if (!isset($_instance)) {
                                $html = \Livewire\Livewire::mount('components.toggle-dark-mode')->html();
                            } elseif ($_instance->childHasBeenRendered('RXyuSyD')) {
                                $componentId = $_instance->getRenderedChildComponentId('RXyuSyD');
                                $componentTag = $_instance->getRenderedChildComponentTagName('RXyuSyD');
                                $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
                                $_instance->preserveRenderedChild('RXyuSyD');
                            } else {
                                $response = \Livewire\Livewire::mount('components.toggle-dark-mode');
                                $html = $response->html();
                                $_instance->logRenderedChild('RXyuSyD', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
                            }
                            echo $html;
                            ?>
                            <?php if (in_array($role->role_type, ['mitra', 'subagent'])) : ?>
                                <?php
                                if (!isset($_instance)) {
                                    $html = \Livewire\Livewire::mount('components.cart-component')->html();
                                } elseif ($_instance->childHasBeenRendered('6ax7b2c')) {
                                    $componentId = $_instance->getRenderedChildComponentId('6ax7b2c');
                                    $componentTag = $_instance->getRenderedChildComponentTagName('6ax7b2c');
                                    $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
                                    $_instance->preserveRenderedChild('6ax7b2c');
                                } else {
                                    $response = \Livewire\Livewire::mount('components.cart-component');
                                    $html = $response->html();
                                    $_instance->logRenderedChild('6ax7b2c', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
                                }
                                echo $html;
                                ?>
                            <?php endif; ?>
                            <?php
                            if (!isset($_instance)) {
                                $html = \Livewire\Livewire::mount('components.notification-badge')->html();
                            } elseif ($_instance->childHasBeenRendered('nNyYlgA')) {
                                $componentId = $_instance->getRenderedChildComponentId('nNyYlgA');
                                $componentTag = $_instance->getRenderedChildComponentTagName('nNyYlgA');
                                $html = \Livewire\Livewire::dummyMount($componentId, $componentTag);
                                $_instance->preserveRenderedChild('nNyYlgA');
                            } else {
                                $response = \Livewire\Livewire::mount('components.notification-badge');
                                $html = $response->html();
                                $_instance->logRenderedChild('nNyYlgA', $response->id(), \Livewire\Livewire::getRootElementTagName($html));
                            }
                            echo $html;
                            ?>



                            <ul class="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown">
                                <li>
                                    <div class="dropdown-title">You have <?php echo e($notification_count_user); ?> new
                                        notification
                                    </div>
                                </li>
                                <li>
                                    <div class="scroll-wrapper notif-scroll scrollbar-outer" style="position: relative;">
                                        <div class="notif-scroll scrollbar-outer scroll-content" style="height: auto; margin-bottom: 0px; margin-right: 0px; max-height: 256px;">
                                            <div class="notif-center">
                                                <?php $__currentLoopData = $notification_user;
                                                $__env->addLoop($__currentLoopData);
                                                foreach ($__currentLoopData as $notif) : $__env->incrementLoopIndices();
                                                    $loop = $__env->getLastLoop(); ?>
                                                    <a href="#">
                                                        <div class="notif-icon notif-primary aspect-square"> <i class="fa fa-info"></i>
                                                        </div>
                                                        <div class="notif-content">
                                                            <span class="block">
                                                                <?php echo e($notif->title); ?>

                                                            </span>
                                                            <span class="time"><?php echo e($notif->created_at); ?></span>
                                                        </div>
                                                    </a>
                                                <?php endforeach;
                                                $__env->popLoop();
                                                $loop = $__env->getLastLoop(); ?>
                                            </div>
                                        </div>
                                        <div class="scroll-element scroll-x" style="">
                                            <div class="scroll-element_outer">
                                                <div class="scroll-element_size"></div>
                                                <div class="scroll-element_track"></div>
                                                <div class="scroll-bar ui-draggable ui-draggable-handle" style="width: 100px;"></div>
                                            </div>
                                        </div>
                                        <div class="scroll-element scroll-y" style="">
                                            <div class="scroll-element_outer">
                                                <div class="scroll-element_size"></div>
                                                <div class="scroll-element_track"></div>
                                                <div class="scroll-bar ui-draggable ui-draggable-handle" style="height: 100px;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="submenu">
                                    <a class="see-all" href="<?php echo e(route('notification')); ?>">See all notifications<i class="fa fa-angle-right"></i> </a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown hidden-caret">
                            <form method="POST" action="<?php echo e(route('logout')); ?>">
                                <?php echo csrf_field(); ?>
                                <a class="nav-link" id="notifDropdown" title="Logout" href="<?php echo e(route('logout')); ?>" onclick="event.preventDefault();
                                                                                                        this.closest('form').submit();">
                                    <i class="fas fa-power-off"></i>
                                </a>
                            </form>
                        </li>


                    </ul>
                </div>
            </nav>
            <!-- End Navbar -->
        </div>
        <!-- Sidebar -->
        <div class="sidebar sidebar-style-2" id="sidebar" data-background-color="<?php echo e($is_dark_mode ? 'dark' : ''); ?>">

            <div class="sidebar-wrapper scrollbar scrollbar-hide">
                <div class="sidebar-content">
                    <div class="user">
                        <div class="avatar-sm float-left mr-2">
                            <img src="<?php echo e(auth()->user()->profile_photo_url); ?>" alt="..." class="avatar-img rounded-circle">
                        </div>
                        <div class="info">
                            <a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
                                <span>
                                    <?php echo e(Auth::user()->name); ?>

                                    <span class="user-level"><?php echo e(Auth::user()->role->role_name); ?></span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div class="overflow-visible" id="sidebar-react"></div>

                </div>
            </div>
        </div>
        <div class="main-panel">
            <div class="container">
                <div class="page-inner">
                    <ul class="breadcrumbs">
                        <li class="nav-home">
                            <a href="<?php echo e(route('dashboard')); ?>">
                                <i class="flaticon-home"></i>
                            </a>
                        </li>

                        <?php $__currentLoopData = Request::segments();
                        $__env->addLoop($__currentLoopData);
                        foreach ($__currentLoopData as $segment) : $__env->incrementLoopIndices();
                            $loop = $__env->getLastLoop(); ?>
                            <li class="separator">
                                <i class="flaticon-right-arrow"></i>
                            </li>
                            <li class="nav-item">
                                <a href="<?php echo e(url()->current()); ?>" class="text-capitalize"><?php echo e(str_replace('-', ' ', $segment)); ?></a>
                            </li>
                        <?php endforeach;
                        $__env->popLoop();
                        $loop = $__env->getLastLoop(); ?>
                    </ul>
                </div>
                <?php echo e($slot); ?>

            </div>
            <footer class="footer">
                <div class="container-fluid">

                    <div class="copyright ml-auto">
                        AIMI FIS - BY IT DIVISION 2022
                        <!--<?php echo e(date('Y')); ?>, made with <i class="fa fa-heart heart text-danger"></i> by <a href="http://www.themekita.com">ThemeKita</a>-->
                    </div>
                </div>
            </footer>
        </div>

    </div>


    <script src="<?php echo e(asset('assets/js/core/jquery.3.2.1.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/core/popper.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/core/bootstrap.min.js')); ?>"></script>

    <!-- jQuery UI -->
    <script src="<?php echo e(asset('assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/plugin/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js')); ?>"></script>


    <!-- jQuery Scrollbar -->
    <script src="<?php echo e(asset('assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/js/atlantis.min.js')); ?>"></script>

    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>

    <script src="https://unpkg.com/flowbite@1.5.2/dist/flowbite.js"></script>
    <?php echo $__env->yieldPushContent('scripts'); ?>
    <?php if (Auth::check()) : ?>
        <?php if (in_array($role->role_type, ['warehouse', 'adminsales', 'superadmin', 'mitra', 'subagent'])) : ?>
            <script>
                function download(url, filename) {
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = filename;
                            link.click();
                        })
                        .catch(console.error);
                }

                $(document).ready(function() {
                    Pusher.logToConsole = false;
                    var pusherD = new window.Pusher("76334a6c3c519f5ee0c7", {
                        cluster: "ap1",
                    });
                    var channelBulk = pusherD.subscribe("aimi_maintasks");
                    channelBulk.bind("pdf_download", function(data) {
                        if (data.status === 'success') {
                            window.open(data?.file?.url, '_blank')
                        }
                    });

                    channelBulk.bind("pdf_invoice", function(data) {
                        if (data.status === 'success') {
                            window.open(data?.file?.url, '_blank')
                        }
                    });
                    channelBulk.bind("html_to_pdf", function(data) {
                        if (data.status === 'success') {
                            window.open(data?.file?.url, '_blank')
                        }
                    });
                });
            </script>
        <?php endif; ?>
    <?php endif; ?>
    <script>
        document.addEventListener('livewire:load', function() {

            window.livewire.on('showAlert', (data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.msg,
                    timer: 2000,
                    showCancelButton: false,
                    showConfirmButton: false
                })
            });

            window.livewire.on('showAlertError', (data) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.msg,
                    timer: 2000,
                    showCancelButton: false,
                    showConfirmButton: false
                })
            });

            window.livewire.on('showAlertWarning', (data) => {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    text: data.msg,
                    showCancelButton: true,
                    cancelButtonColor: "red",
                    showConfirmButton: true,
                    confirmButtonText: 'Check Contact'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location = "/contact";
                    }
                })
            });

            window.livewire.on('updateDarkMode', (status) => {
                const body = document.getElementById('body')
                const logo = document.getElementById('logo')
                const header = document.getElementById('header')
                const sidebar = document.getElementById('sidebar')

                localStorage.setItem('theme', status ? 'dark' : 'light')
                localStorage.setItem('text-style', status ? 'text-white' : 'text-black')
                localStorage.setItem('dashboard-color', status ? 'white' : 'black')
                localStorage.setItem('form-color', status ? 'bg-black' : 'bg-gray-100')
                window.location.reload(false)

                if (status) {
                    body.setAttribute('data-background-color', 'dark')
                    logo.setAttribute('data-background-color', 'dark2')
                    header.setAttribute('data-background-color', 'dark')
                    sidebar.setAttribute('data-background-color', 'dark2')
                } else {
                    body.setAttribute('data-background-color', '')
                    logo.setAttribute('data-background-color', 'blue3')
                    header.setAttribute('data-background-color', 'blue3')
                    sidebar.setAttribute('data-background-color', '')
                }
            });
        })
    </script>
    <?php echo \Livewire\Livewire::scripts(); ?>

    <script src="https://cdn.jsdelivr.net/gh/livewire/sortable@v0.x.x/dist/livewire-sortable.js"></script>
</body>

</html><?php /**PATH /Applications/MAMP/htdocs/laravel/server/resources/views/layouts/app.blade.php ENDPATH**/ ?>