<?php 
session_start();

if(isset($_SESSION['login'])){
  if($_SESSION['login']){
    $access = true;
    $nameuser = $_SESSION['nameuser'];
  } else {
    $access = false;
    $nameuser = '';
  }
} else {
  $access = false;
  $nameuser = '';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Publicaciones</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">

  <!-- jquery-ui -->
  <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui.min.css">
  <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui.theme.min.css">

  <!-- Sweet alert 2 -plugins -->
  <link rel="stylesheet" href="plugins/sweetalert2/sweetalert2.all.min.js">

  <!-- Toast -->
  <link rel="stylesheet" href="plugins/toastr/toastr.min.css">

  <!-- Theme style -->
  <link rel="stylesheet" href="dist/css/adminlte.css">
  <link rel="stylesheet" href="dist/css/user-account.css">
  <link rel="stylesheet" href="dist/css/switch-dark-mode.css">
  <link rel="stylesheet" href="dist/css/themes.css">

  <!-- videojs -->
  <link rel="stylesheet" href="plugins/video-js/video.min.css">
  <!-- Ekko Lightbox -->
  <link rel="stylesheet" href="plugins/ekko-lightbox/ekko-lightbox.css">

  <!-- loader -->
  <link rel="stylesheet" href="dist/css/loader.css">

  <!-- styles propios -->
  <link rel="stylesheet" href="dist/css/uploadFile.css">
  <link rel="stylesheet" href="dist/css/pages/publication.css" />
  <link rel="stylesheet" href="dist/css/pages/style-video.css">
</head>
<body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed">
<div class="wrapper">

  <!-- Preloader -->
  <div class="preloader flex-column justify-content-center align-items-center">
    <img class="animation__wobble" src="dist/img/logo.png" alt="AdminLTELogo" height="60" width="60">
  </div>

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-light text-sm">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <!-- Collapse Menu -->
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>

      <!-- Switch -->
      <li class="nav-item item-switch-darkmode ml-2">
        <div class="theme-switch-wrapper nav-link dropdown-toggle">
          <label class="theme-switch" for="checkbox-theme">
            <input type="checkbox" id="checkbox-theme" />
            <span class="slider round">
              <i class="fa fa-solid fa-sun"></i>
              <i class="fa fa-solid fa-moon"></i>
            </span>
          </label>
        </div>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">

      <?php 
        if(!$access){
          echo '
            <!-- loguear usuario -->
            <li class="nav-item user-quest">
              <a href="#" class="nav-link text-overflow" data-toggle="modal" data-target="#modal-login">
                <span>Iniciar sesión</span>
              </a>
            </li>
      
            <!-- Registrar usuario -->
            <li class="nav-item user-quest">
              <a href="#" class="nav-link text-overflow" data-toggle="modal" data-target="#modal-register">
                <span>Registrarse</span>
              </a>
            </li>        
          ';
        } else {
          echo '
            <!-- User Account: style can be found in dropdown.less -->
            <li class="nav-item dropdown user user-menu">
              <a href="#" class="nav-link text-overflow" data-toggle="dropdown">
                <img src="./dist/img/default_profile_avatar.svg" class="user-image user-image-top img-user-login" alt="User Image">
                <span class="hidden-xs ">'; echo $_SESSION['nameuser']; echo '</span>
              </a>
      
              <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-right user-menu">
                <a class="dropdown-item btn-redirect-profile" href="index.php?view=profile-view">Perfil</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="controllers/user.controller.php?op=logout">Cerrar sesión</a>
              </ul>
            </li>
          ';
        }
      ?>

      <!-- Config -->
      <li class="nav-item">
        <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
          <i class="fas fa-th-large"></i>
        </a>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="index.php" class="brand-link">
      <!-- <img src="dist/img/logo-editado-5.png" alt="" class="logo"> -->

      <img src="dist/img/AdminLTELogo.png" class="brand-image img-circle elevation-3" style="opacity: .8">
      <span class="brand-text font-weight-bold"> AdminLTE</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a href="#" class="d-block">Nombre del usuario</a>
        </div>
      </div>

      <!-- SidebarSearch Form -->

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar text-sm flex-column nav-child-indent nav-collapse-hide-child" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          
          <li class="nav-header">MENU</li>
          <li class="nav-item">
            <a href="#" class="nav-link active">
              <i class="nav-icon fas fa-bars"></i>
              <p>
                Navegación
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="index.php?view=profile-view" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Perfil</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="index.php?view=publication-view" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Publicaciones</p>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper text-sm" id="content-body">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">

      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid" id="content-data">
        <!-- Aqui se cargan los datos dinamicos -->        
      </div><!--/. container-fluid -->
    </section>
    <!-- /.content -->

    <!-- Subir al inicio -->
    <a id="back-to-top" href="#content-body" class="btn btn-dark back-to-top d-none" role="button" aria-label="Scroll to top">
      <i class="fas fa-chevron-up"></i>
    </a>
  </div>
  <!-- /.content-wrapper -->

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark" style="overflow: hidden;">
    <!-- Control sidebar content goes here -->
    <div class="p-3 control-sidebar-content text-sm" style="height: fit-content;">
      <h5>Configuración</h5>
      <hr class="mb-2"/>

      <h6>Barra lateral izquierdo</h6>

      <div class="mb-1">
        <input type="checkbox" class="mr-1" checked id="cbox-sidebar-mini">
        <span>Pequeño</span>
      </div>
      <div class="mb-1">
        <input type="checkbox" class="mr-1" id="cbox-sidebar-flat-style">
        <span>Estilo flat</span>
      </div>
      <div class="mb-4">
        <input type="checkbox" class="mr-1" id="cbox-sidebar-disable-focus">
        <span>Deshabilitar autoexpansión</span>
      </div>

      <h6>Reducir el tamaño del texto</h6>

      <div class="mb-1">
        <input type="checkbox" class="mr-1" checked id="cbox-small-text-content-wrapper">
        <span>Contenido</span>
      </div>
      <div class="mb-1">
        <input type="checkbox" class="mr-1" id="cbox-small-text-sidebar" checked>
        <span>Barra lateral (Izq, Der)</span>
      </div>
    </div>
  </aside>
  <!-- /.control-sidebar -->

  <!-- Main Footer -->
  <footer class="main-footer text-sm">
    <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
      <b>Version</b> 3.2.0
    </div>
  </footer>
</div>
<!-- ./wrapper -->

<!--Modal de login-->
<div class="modal fade" id="modal-login" data-backdrop="static">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">     
      <div class="modal-body">
        <h4 class="modal-title text-uppercase text-bold text-center">Iniciar sessión</h4>
        <hr>
        <form autocomplete='off'>
          <div class='form-group'>
            <label for="email">Correo electrónico:</label>
            <input type='email' class='form-control form-control-border' autofocus required id='email' placeholder='User@gmail.com' >
            <div class="valid-feedback">
              Muy bien!
            </div>
          </div>
          <div class='form-group'>
            <label for="password">Contraseña:</label>
            <input type='password' placeholder='password' class='form-control form-control-border' required id='password'>
            <div class="" style="position: relative;">
              <a href="javascript:void(0)" id="btn-see-password" data-type='text' style="position: absolute; right: 15px; top: -1.7em;"><i class="fas fa-eye"></i></a>
            </div>
            <div class="invalid-feedback">
              Muy mal!
            </div>
          </div>
         
          <div class="custom-control custom-checkbox mb-3">
            <input type="checkbox" class="custom-control-input" id="remember-account" required>
            <label class="custom-control-label" for="remember-account">Recordar cuenta</label>
          </div>

          <div class="form-group">
            <button type='button' class='btn btn-primary btn-block' id="btn-login">Acceder</button>
            <button type="button" class="btn btn-secondary btn-block" data-dismiss="modal">Cancelar</button>
          </div>
          <div class='form-group text-center'>
            <a href='#' data-toggle='modal' data-target='#modal-res-contra1'>¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<!--./Modal de registro-->

<!-- Modal registrarse -->
<!-- Modal -->
<div class="modal fade" id="modal-register" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-uppercase text-bold">Registrarse</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
        <form autocomplete="off" id="form-register-user">
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="firstname">Nombres</label>
              <input type="text" id="firstname" class="form-control form-control-border">
            </div>
            <div class="col-md-6 form-group">
              <label for="lastname">Apellidos</label>
              <input type="text" id="lastname" class="form-control form-control-border">
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 form-group">
              <label for="birthdate">Fecha nac.</label>
              <input type="date" id="birthdate" class="form-control form-control-border">
            </div>
            <div class="col-md-6 form-group">
              <label for="phone">Telefono</label>
              <input type="tel" id="phone" class="form-control form-control-border" maxlength="9">
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 form-group">
              <label for="department">Departamento</label>
              <select  id="department" class="form-control-border custom-select">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-md-4 form-group">
              <label for="province">Provincia</label>
              <select  id="province" class="form-control-border custom-select">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-md-4 form-group">
              <label for="district">Distrito</label>
              <select  id="district" class="form-control-border custom-select">
                <option value="">Seleccione</option>
              </select>
            </div>
          </div>          
          <div class="row">
            <div class="col-sm-12 form-group ">
              <label>Dirección</label>
              <div class="form-group row">
                <div class="col-md-2">
                  <Select class="custom-select form-control-border" id="streetType">
                    <option value="AV">AV</option>
                    <option value="CA">CA</option>
                    <option value="JR">JR</option>
                    <option value="PJ">PJ</option>
                    <option value="UR">UR</option>
                    <option value="LT">LT</option>
                  </Select>
                </div>
                <div class="col-md-6">
                  <input type="text" placeholder="Nombre de calle" class="form-control form-control-border" id="streetName" >
                </div>
                <div class="col-md-2">
                  <input type="number" class="form-control form-control-border" placeholder="N°" id="streetNumber" maxlength="5" min="1" max="99999" >
                </div>
                <div class="col-md-2">
                  <input type="number" class="form-control form-control-border" placeholder="Piso" id="floorNumber" maxlength="5" min="1" max="99999" >
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-12">
              <label for="emailUser">Correo electrónico:</label>
              <div class="form-group row">
                <div class="col-sm-8">
                  <input type="email" class="form-control form-control-border" id="emailUser" placeholder="Correo electrónico">
                </div>
                <div class="col-sm-4">
                  <select class="custom-select form-control-border" id="emailType">
                    <option value="@hotmail.com">@hotmail.com</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@senati.pe">@senati.pe</option>
                    <option value="@outlook.com">@outlook.com</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <label for="password1">Contraseña:</label>
              <input type="password" class="form-control form-control-border" id="password1" placeholder="Contraseña">
            </div>
            <div class="col-sm-6">
              <label for="password2">Repetir contraseña:</label>
              <input type="password" class="form-control form-control-border" id="password2" placeholder="Repetir Contraseña">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-sm btn-primary" id="btn-register-user">Registrarse</button>
      </div>
    </div>
  </div>
</div>

<!-- REQUIRED SCRIPTS -->
<!-- jQuery -->
<script src="plugins/jquery/jquery.min.js"></script>

<!-- jquery-ui -->
<script src="plugins/jquery-ui/jquery-ui.min.js"></script>

<!-- Bootstrap -->
<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="dist/js/adminlte.js"></script>

<!-- SweetAlert2 pluggins -->
<script src="plugins/sweetalert2/sweetalert2.all.min.js"></script>

<!-- Ekko Lightbox -->
<script src="plugins/ekko-lightbox/ekko-lightbox.min.js"></script>

<!-- Utilities -->
<script src="dist/js/utility.js"></script>
<script src="dist/js/sweet-alert-2.js"></script>

<!-- Cargar pagina incrustada -->
<script src="./dist/js/loadweb.js"></script>

<!-- Config theme -->
<script src="./dist/js/config.js"></script>

<!-- carga de archivos -->
<script src="dist/js/uploadFile.js"></script>

<!-- video js -->
<script src="plugins/video-js/video.min.js"></script>

<!-- Loader -->
<script src="dist/js/loader.js"></script>

<!-- Toast -->
<script src="plugins/toastr/toastr.min.js"></script>

<!-- Script personales -->
<script src="dist/js/pages/index.js"></script>
<script src="src/client.js"></script>

<script>
  $(document).ready(function (){
    // Almacenando el id del usuario en una variable del navegador
    localStorage.setItem("idusuarioSession", <?php echo isset($_SESSION['idusuario']) ? $_SESSION['idusuario']: -2; ?>);

    var view = getParam("view");

    if (view != false)
      $("#content-data").load(`views/${view}.php`);
    else
      $("#content-data").load(`views/welcome.php`);
      
  });
</script>
</body>
</html>
