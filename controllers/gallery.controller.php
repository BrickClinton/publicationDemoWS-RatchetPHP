<?php 
session_start();
date_default_timezone_set("America/Lima");

require_once '../models/Gallery.php';
require_once '../models/Album.php';

$album = new Album();
$gallery = new Gallery();

if(isset($_GET['op'])){

  // Imagen de perfil
  if($_GET['op'] == 'getProfilePicture'){
    $data = [];
    if(isset($_GET['idusuarioactivo']) && $_GET['idusuarioactivo'] != -1){
      $data = $gallery->getProfilePicture(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $gallery->getProfilePicture(["idusuario" => $_SESSION['idusuario']]);
    }

    if($data){
      echo json_encode($data);
    }
  }

  // Imagen de portada
  if($_GET['op'] == 'getPortPicture'){
    $data = [];

    if($_GET['idusuarioactivo'] != -1){      
      $data = $gallery->getPortPicture(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $gallery->getPortPicture(["idusuario" => $_SESSION['idusuario']]);
    }

    if($data){
      echo json_encode($data);
    }
  }

  // Listar iamganes por idalbum
  if($_GET['op'] == 'getGalleriesByAlbum'){
    $data = $gallery->getGalleriesByAlbum(["idalbum" => $_GET['idalbum']]);
    if($data){
      echo json_encode($data);
    }
  }

  // Actualizar foto como perfil o portada
  if($_GET['op'] == 'updateGallery'){
    $gallery->updateGallery(["idgaleria" => $_GET['idgaleria'], "idalbum" => $_GET['idalbum']]);
  }

  // Eliminar imagen
  if($_GET['op'] == 'deleteGallery'){
    if(unlink('../dist/img/user/' . $_GET['archivo'])){
      $gallery->deleteGallery(["idgaleria" => $_GET['idgaleria']]);
    } else {
      echo "Error";
    }
  }

  // Obtener ultimas fotos de los albumes
  if($_GET['op'] == 'getLastImageByAlbum'){
    $data = $gallery->getLastImageByAlbum(["idusuario" => $_SESSION['idusuario'], "nombrealbum" => "Perfil"]);
  }

  // Opbtener todas las imagenes del usuario
  if($_GET['op'] == 'getGalleriesByUser'){
    $data = [];

    if($_GET['idusuarioactivo'] != -1){
      $data = $gallery->getGalleriesByUser(["idusuario" => $_GET['idusuarioactivo']]);
    } else {
      $data = $gallery->getGalleriesByUser(["idusuario" => $_SESSION['idusuario']]);
    }
    
    if($data){
      echo json_encode($data);
    }
  }

  // Obtener archivos de una publicación
  if($_GET['op'] == 'getGalleriesByPublication'){
    $data = $gallery->getGalleriesByPublication(["idpublicacion" => $_GET['idpublicacion']]);
    if($data){
      echo json_encode($data);
    }
  }
}

if (isset($_POST['op'])){
  
  // Registrar perfil o portada
  if($_POST['op'] == "registerPortProfileImg"){
    $data = $album->getAnAlbumByNameAndUser(["idusuario" => $_SESSION['idusuario'], "nombrealbum" => $_POST['nombrealbum']]);
    $idalbum = $data[0]['idalbum']; 
    $estado = $_POST['nombrealbum'] == 'perfil'? 2: 3;

    // Si existe imagenes
    if (isset($_FILES['archivo'])){
      $ext = explode('.', $_FILES['archivo']['name']);   // Separar la extension de la imagen
      $image = date('Ymdhis') . '.' . $ext[1];          // Renombrar cada imagen

      $gallery->registerGallery([   
        'idalbum'       => $idalbum,
        'idusuario'     => $_SESSION['idusuario'],
        'idpublicacion' => '',
        'tipo'          => 'F',
        'archivo'       => $image,
        'estado'        => $estado
      ]);
  
      // Mover a la carpeta img indicada
      if(move_uploaded_file($_FILES['archivo']['tmp_name'], '../dist/img/user/' . $image)){

      };
    }
  }

  // Regisdtrar imagenes
  if($_POST['op'] == 'registerSeveralImages'){

    $countImg = 0;
    $result = "error";

    // Si existe imagenes
    if (isset($_FILES['images'])){
      // Validar el array de archivos
      if(is_array(($_FILES))){
        foreach($_FILES['images']['name'] as $key => $value){
          $ext = explode('.', $_FILES['images']['name'][$key]);   // Separar la extension de la imagen
          $image = date('Ymdhis') . $countImg . '.' . end($ext);    // Renombrar cada imagen
  
          $gallery->registerGallery([   
            'idalbum'       => $_POST['idalbum'],
            'idusuario'     => $_SESSION['idusuario'],
            'idpublicacion' => '',
            'tipo'          => 'F',
            'archivo'       => $image,
            'estado'        => '1'
          ]);
      
          // Mover a la carpeta img indicada
          if(move_uploaded_file($_FILES['images']['tmp_name'][$key], '../dist/img/user/' . $image)){
            $countImg++;
          };
        }
      }

      $result = 'success';
    }
    
    echo $result;
  }
}
?>