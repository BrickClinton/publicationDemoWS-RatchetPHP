<?php
session_start();
require_once '../models/Qualify.php';

$qualify = new Qualify();

if(isset($_GET['op'])){

  // Obtener la calificación del usuario (Estrellas)
  function getScoreUser($idusuario){
    $qualify = new Qualify();
    $score = $qualify->getScoreUser(["idusuario" => $idusuario]);
    return isset($score[0]) ? $score[0]['estrellas'] : 0;
  }

  // Obtener el puntaje realizado por el usuario
  function getpublicationScoreByUser($idpublicacion, $idusuario){
    $qualify = new Qualify();
    $data = $qualify->getScorePublicationByUser(["idpublicacion" => $idpublicacion, "idusuario" => $idusuario]);

    return isset($data[0]) ? $data[0]: ["idcalificacion" => 0, "puntuacion" => 0];
  }

  // Registrar
  if($_GET['op'] == 'registerQualify'){
    if(isset($_SESSION['idusuario'])){
      $qualify->registerQualify([
        "idpublicacion" => $_GET['idpublicacion'],
        "idusuario"     => $_SESSION['idusuario'],
        "puntuacion"    => $_GET['puntuacion']
      ]);
    } else {
      echo "Iniciar sesión";
    }
  }
  
  // Actualizar puntuación
  if($_GET['op'] == 'updateQualify'){
    if(isset($_SESSION['idusuario'])){
      $qualify->updateQualify([
        "idcalificacion"  => $_GET['idcalificacion'],
        "puntuacion"      => $_GET['puntuacion']
      ]);
    } else {
      echo "Iniciar sesión";
    }
  }

  // Puntuación del usuario
  if($_GET['op'] == 'getScoreUser'){
    $idusuario;

    if($_GET['idusuarioactivo'] == -1 && isset($_SESSION['idusuario'])){
      $idusuario = $_SESSION['idusuario'];
    } else {
      $idusuario = $_GET['idusuarioactivo'];
    }

    $scoreUser = getScoreUser($idusuario);
    // Ceil == Redondear al entero proximo
    $scoreUser = ceil($scoreUser);

    echo "<div class='stars'>";

    /* con estrellas */
    for ($i = 0; $i < $scoreUser; $i++) {
      echo " <i class='fas fa-star active'></i>";
    }

    /* sin estrellas */
    for ($j = 0; $j < 5 - $scoreUser; $j++) {
      // <i class="fas fa-star-half-alt"></i>
      echo "<i class='fas fa-star'></i>";
    }

    echo "</div>";
  }

  // Obtener puntuación de una publicacion
  if($_GET['op'] == 'getScorePublication'){
    $data = $qualify->getScorePublication(["idpublicacion" => $_GET['idpublicacion']]);
    if($data){
      echo json_encode($data);
    }
  }

  // Obtener puntuación del usuario de una publicación
  if($_GET['op'] == 'getScorePublicationByUser'){
    $data = [];

    if(isset($_SESSION['idusuario'])){
      $data = $qualify->getScorePublicationByUser(["idpublicacion" => $_GET['idpublicacion'], "idusuario" => $_SESSION['idusuario']]);
    } else {
      $data = [["idcalificacion" => 0, "puntuacion" => 0]];
    }
    
    if($data){
      echo json_encode($data);
    } 
  }

  // Obtener la cantidad de usuario que calificarón una publicación
  if($_GET['op'] == 'getTotalUsersReactedToAPost'){
    $data = $qualify->getTotalUsersReactedToAPost(["idpublicacion" => $_GET['idpublicacion']]);
    if($data){
      echo json_encode($data);
    }
  }

}


?>