<?php
session_start();

require_once '../models/Follower.php';
require_once '../models/Gallery.php';

$follower = new Follower();

if (isset($_GET['op'])){

  // Obtener imagen de perfil
  function getImageProfileUser($idusuario){
    $gallery = new Gallery();
    $images = $gallery->getProfilePicture(["idusuario" => $idusuario]);

    return isset($images[0]) ? $images[0]['archivo'] : 'default_profile_avatar.svg';
  }

  // Validar usuario seguido
  function followedUser($idusuario, $idusuariologin){
    $follower = new Follower();
    $data = $follower->validateFollower(["idusuario" => $idusuario, "idfollower" => $idusuariologin]);
    $value = $data[0]['estado'];

    return $value;
  }
  
  // Operacion Seguidores
  if ($_GET['op'] == 'getFollowersByUser'){
    $data = [];
    $array = [];
    $idusuario = 0;
    $follow = "Seguir";
    
    if($_GET['idusuarioactivo'] != -1){
      $idusuario = $_GET['idusuarioactivo'];
    } else {
      $idusuario = $_SESSION['idusuario'];
    }
    
    $data = $follower->getFollowersByUser([
      "idusuario"   => $idusuario,
      "idfollower"  => $_GET['idfollower'],
      "limit"       => 15
    ]);
  
    if($data){
      foreach($data as $row){
        if(isset($_SESSION['idusuario'])){
          $status = followedUser($row['idfollower'], $_SESSION['idusuario']);
          $follow = $status? "Seguido": "Seguir";
        }

        $array[] = [
          "idusuario"     => $row['idfollower'],
          "idpersona"     => $row['idpersona'],
          "nombres"       => $row['nombres'],
          "apellidos"     => $row['apellidos'],
          "fechaseguido"  => $row['fechaseguido'],
          "email"         => $row['email'],
          "imagenperfil"  => getImageProfileUser($row['idfollower']),
          "follow"        => $follow
        ];
      }

      echo json_encode($array);
    }
  }

  // Operación Seguidos
  if ($_GET['op'] == 'getFollowedByUser'){
    $data = [];
    $array = [];
    $idusuario = 0;
    $follow = "Seguir";
    
    if($_GET['idusuarioactivo'] != -1){
      $idusuario = $_GET['idusuarioactivo'];
    } else {
      $idusuario = $_SESSION['idusuario'];
    }

    $data = $follower->getFollowedByUser([
      "idusuario"   => $idusuario,
      "idfollowing" => $_GET['idfollowing'],
      "limit"       => 15
    ]);
    
    if($data){
      foreach($data as $row){
        if(isset($_SESSION['idusuario'])){
          $status = followedUser($row['idfollowing'], $_SESSION['idusuario']);
          $follow = $status? "Seguido": "Seguir";
        }

        $array[] = [
          "idusuario"     => $row['idfollowing'],
          "idpersona"     => $row['idpersona'],
          "nombres"       => $row['nombres'],
          "apellidos"     => $row['apellidos'],
          "fechaseguido"  => $row['fechaseguido'],
          "email"         => $row['email'],
          "imagenperfil"  => getImageProfileUser($row['idfollowing']),
          "follow"        => $follow
        ];
      }

      echo json_encode($array);
    }
  }

  //Conteo de seguidores
  if ($_GET['op'] == 'getCountFollowersByUser'){
    $data = [];

    if($_GET['idusuarioactivo'] != -1){
      $data = $follower->getCountFollowersByUser(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $follower->getCountFollowersByUser(["idusuario" => $_SESSION['idusuario']]);
    }

    if($data){
      echo json_encode($data);
    }
    
  }

  //Conteo de seguidos
  if ($_GET['op'] == 'getCountFollowedByUser'){
    $data;
    
    if($_GET['idusuarioactivo'] != -1){
      $data = $follower->getCountFollowedByUser(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $follower->getCountFollowedByUser(["idusuario" => $_SESSION['idusuario']]);
    }

    if($data){
      echo json_encode($data);
    }

  }

  // Registrar seguidor
  if ($_GET['op'] == 'registerFollower'){
    if(isset($_SESSION['idusuario'])){
      // Following == A quien sigues - Follower == Quien lo sigue
      $follower->registerFollower(["idfollowing" => $_GET['idusuarioactivo'], "idfollower" => $_SESSION['idusuario']]);
    } else {
      echo "Iniciar sesión";
    }
  }

  // validar si ya esta seguido por el usuario que inicio sesion
  if($_GET['op'] == 'validateFollower'){
    $data = [];
    $value = 0;
    
    if(isset($_SESSION['idusuario'])){
      $data = $follower->validateFollower([
        "idusuario"  => $_GET['idusuarioactivo'], 
        "idfollower" => $_SESSION['idusuario']
      ]);

      $value = $data[0]['estado'];
    }

    echo $value;
  }

  // Dejar de Seguir
  if ($_GET['op'] == 'deleteFollower'){

    $datosEnviar = [
      "idfollower"       =>  $_SESSION['idusuario'],
      "idfollowing"      =>  $_GET["idfollowing"]
    ];

    $follower->deleteFollower($datosEnviar);
}

}

?>