<?php
session_start();
//$_SESSION['imagedefault'] = 'default_profile_avatar.svg';

require_once '../models/User.php';
require_once '../models/Person.php';
require_once '../models/Album.php';
require_once '../models/Gallery.php';
require_once '../models/Mailer.php';

// Instancias de objetos
$user = new User();
$person  = new Person();
$mailer = new Mailer();
$album = new Album();

if (isset($_GET['op'])) {

  // Obtener imagen de perfil
  function getImageProfileUser($idusuario){

    $gallery = new Gallery();
    $images = $gallery->getProfilePicture(["idusuario" => $idusuario]);

    return isset($images[0]) ? $images[0]['archivo'] : '';
  }

  // Obtener nombres del usuario
  function getNameUser($idpersona){
    $person = new Person();
    $data = $person->getAPerson(["idpersona" => $idpersona]);
    return $data ? $data[0]['nombres'] . ' ' . $data[0]['apellidos']: '';
  }

  // Login
  if ($_GET['op'] == 'login') {
      $data = $user->loginUser(["email" => $_GET['email']]);
      if (count($data) <= 0) {
        echo 'error';
      } else {
        $password = $data[0]['clave']; // DB
        $sendpass = $_GET['password']; // View
        $login = password_verify($sendpass, $password);

        if ($login) {
          echo 'access';
          $_SESSION['login'] = true;
          $_SESSION['email'] = $data[0]['email'];
          $_SESSION['idusuario'] = $data[0]['idusuario'];
          $_SESSION['idpersona'] = $data[0]['idpersona'];
          $_SESSION['nameuser'] = getNameUser($data[0]['idpersona']);
          $_SESSION['rol'] = $data[0]['rol'];
        } else {
          echo 'no access';
          $_SESSION['login'] = false;
          $_SESSION['email'] = '';
          $_SESSION['idusuario'] = '';
          $_SESSION['idpersona'] = '';
          $_SESSION['nameuser'] = '';
          $_SESSION['rol'] = '';
        }
      }
  }

  // Logout
  if ($_GET['op'] == 'logout') {
    session_destroy(); // Elimninar la sesión
    session_unset(); // Eliminar todas las variables de session
    header('Location:../index.php');
  }

  // Obtener los datos de un usuario
  if($_GET['op'] == 'getAUser'){
    $data = [];

    if($_GET['idusuarioactivo'] != -1){
      $data = $user->getAUser(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $user->getAUser(["idusuario" => $_SESSION['idusuario']]);
    }
    
    if($data){
      echo json_encode($data);
    }
  }

  // Crear cuenta de usuario
  if($_GET['op'] == 'registerUser'){
    // persona
    $dataPerson = $person->registerPerson([
      "iddistrito"    => $_GET['iddistrito'],
      "apellidos"     => $_GET['apellidos'],
      "nombres"       => $_GET['nombres'],
      "fechanac"      => $_GET['fechanac'],
      "telefono"      => $_GET['telefono'],
      "tipocalle"     => $_GET['tipocalle'],
      "nombrecalle"   => $_GET['nombrecalle'],
      "numerocalle"   => $_GET['numerocalle'],
      "pisodepa"      => $_GET['pisodepa']
    ]); 

    // Usuario
    $dataUser = $user->registerUser([
      "idpersona"   => $dataPerson[0]['idpersona'],
      "email"       => $_GET['email'],
      "clave"       => password_hash($_GET['clave'], PASSWORD_BCRYPT)
    ]);

    // Albumes
    $dataAlbum = $album->registerAlbumDefault(["idusuario" => $dataUser[0]['idusuario']]);
  }

   // Actualizar correo
   if($_GET['op'] == 'updateEmailUser'){
    $row = $user->getAUser(["idusuario" => $_SESSION['idusuario']]);
    $data = $user->loginUser(["email" => $row[0]['email']]);
    $password = $data[0]['clave'];
    $sendpass = $_GET['password'];

    $login = password_verify($sendpass, $password);
    if($login){
      $user->updateEmailsUser([
        "idusuario"       => $_SESSION['idusuario'],
        "email"           => $_GET['email']
      ]);
    } else {
      echo "Contraseña actual incorrecta";      
    }
  }

  // Actualizar clave
  if($_GET['op'] == 'updatePasswordUser'){
    $row = $user->getAUser(["idusuario" => $_SESSION['idusuario']]);
    $data = $user->loginUser(["email" => $row[0]['email']]);

    $password = $data[0]['clave'];
    $sendpass = $_GET['password'];

    $login = password_verify($sendpass, $password);

    if($login){
      $user->updatePasswordUser([
        "idusuario" => $_SESSION['idusuario'],
        "clave"     => password_hash($_GET['newpassword'], PASSWORD_BCRYPT)
      ]);
    } else {
      echo "Contraseña actual incorrecta";    
    }
  }

  // Eliminar cuenta
  if($_GET['op'] == 'deleteUser'){
    $row = $user->getAUser(["idusuario" => $_SESSION['idusuario']]);
    $data = $user->loginUser(["email" => $row[0]['email']]);

    $password = $data[0]['clave'];
    $sendpass = $_GET['password'];

    $login = password_verify($sendpass, $password);

    if($login){
      $user->deleteUser(["idusuario" => $_SESSION['idusuario']]);
    } else {
      echo "Contraseña incorrecta";
    }
  }
}
