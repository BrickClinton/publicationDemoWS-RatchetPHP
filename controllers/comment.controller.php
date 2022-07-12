<?php
session_start();

require_once '../models/Comment.php';
require_once '../models/Gallery.php';

$comment = new Comment();

if(isset($_GET['op'])){

  // Palabras inapropiadas
  $inappropriate = ["negro", "gordo", "pelele", "moro", "obeso", "mediocre", "babosada", "borrico", "cretino", "lerdo"];

  // Encontrar contenido inapropiado
  function findInappropriateContent($comment, $phrases){
    $comments = explode(" ", strtolower($comment)); // Convertir en array
    $found = false;
    $i = 0;

    do{
      $found = in_array($comments[$i], $phrases);
      $i++;
      
    } while($i < count($comments) && !$found);

    return $found;
  }

  // Obtener imagen de perfil
  function getImageProfileUser($idusuario){
    $gallery = new Gallery();
    $images = $gallery->getProfilePicture(["idusuario" => $idusuario]);

    return isset($images[0]) ? $images[0]['archivo']: 'default_profile_avatar.svg';
  }

  // Registrar
  if($_GET['op'] == 'registerComment'){
    if(isset($_SESSION['idusuario'])){
      $data = $comment->registerComment([
        "idpublicacion" => $_GET['idpublicacion'],
        "idusuario"     => $_SESSION['idusuario'],
        "comentario"    => $_GET['comentario']
      ]); 

      echo json_encode($data);
    } else {
      echo json_encode("error_access");
    }
  }
  
  // Actualizar
  if($_GET['op'] == 'updateComment'){
    $comment->updateComment([
      "idcomentario" => $_GET['idcomentario'],
      "comentario"   => $_GET['comentario']
    ]);

    $isInappropriate = findInappropriateContent($_GET['comentario'], $inappropriate);
    if($isInappropriate){
      generateReportUser($_GET['idcomentario']);
    }
  }

  // Listar comentarios por publicación
  if($_GET['op'] == 'getCommentsByPublication'){
    $data = $comment->getCommentsByPublication(["idpublicacion" => $_GET['idpublicacion']]);
    $dataOutput = [];
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idcomentario"    => $row['idcomentario'],
          "idpublicacion"   => $row['idpublicacion'],
          "comentario"      => $row['comentario'],
          "fechacomentado"  => $row['fechacomentado'],
          "fechamodificado" => $row['fechamodificado'],
          "idusuario"       => $row['idusuario'],
          "nombres"         => $row['nombres'],
          "apellidos"       => $row['apellidos'],
          "fotoperfil"      => getImageProfileUser($row['idusuario'])
        ];
      }
      echo json_encode($dataOutput);
    }
  }

  // Listar comentarios por publicación
  if($_GET['op'] == 'getCommentsByPublicationLimit'){
    $data = $comment->getCommentsByPublicationLimit([
      "idpublicacion" => $_GET['idpublicacion'],
      "idcomentario"  => $_GET['idcomentario'],
      "limit"         => 5
    ]);

    $dataOutput = [];
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idcomentario"    => $row['idcomentario'],
          "idpublicacion"   => $row['idpublicacion'],
          "comentario"      => $row['comentario'],
          "fechacomentado"  => $row['fechacomentado'],
          "fechamodificado" => $row['fechamodificado'],
          "idusuario"       => $row['idusuario'],
          "nombres"         => $row['nombres'],
          "apellidos"       => $row['apellidos'],
          "fotoperfil"      => getImageProfileUser($row['idusuario'])
        ];
      }
      echo json_encode($dataOutput);
    }
  }

  // Total de comentarios por publicación
  if($_GET['op'] == 'countCommentsByPublication'){
    $data = $comment->countCommentsByPublication(["idpublicacion" => $_GET['idpublicacion']]);
    if($data){
      echo json_encode($data);
    }
  }

  // Obtner un registro
  if($_GET['op'] == 'getAComment'){
    $data = $comment->getAComment(["idcomentario" => $_GET['idcomentario']]);
    $dataOutput = [];

    if($data){
      $dataOutput[] = [
        "idcomentario"    => $data[0]['idcomentario'],
        "idpublicacion"   => $data[0]['idpublicacion'],
        "comentario"      => $data[0]['comentario'],
        "fechacomentado"  => $data[0]['fechacomentado'],
        "fechamodificado" => $data[0]['fechamodificado'],
        "idusuario"       => $data[0]['idusuario'],
        "nombres"         => $data[0]['nombres'],
        "apellidos"       => $data[0]['apellidos'],
        "fotoperfil"      => getImageProfileUser($data[0]['idusuario'])
      ];

      echo json_encode($dataOutput);
    }
  }
  
  // Eliminar
  if($_GET['op'] == 'deleteComment'){
    $comment->deleteComment(["idcomentario" => $_GET['idcomentario']]);
  }

}
?>
