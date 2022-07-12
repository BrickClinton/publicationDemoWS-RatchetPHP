<?php
session_start();
date_default_timezone_set("America/Lima");

require_once '../models/Publication.php';
require_once '../models/Album.php';
require_once '../models/Gallery.php';
require_once '../models/Comment.php';
require_once '../models/Qualify.php';

$publication = new Publication();
$album = new Album();
$gallery = new Gallery();

if(isset($_GET['op'])){

  // Obtener el puntaje realizado por el usuario
  function getpublicationScoreByUser($idpublicacion, $idusuario){
    $qualify = new Qualify();
    $data = $qualify->getScorePublicationByUser(["idpublicacion" => $idpublicacion, "idusuario" => $idusuario]);

    return isset($data[0]) ? $data[0]: ["idcalificacion" => 0, "puntuacion" => 0];
  }

  // Obtener calificación de la publicación
  function getpublicationQualification($idtrabajo){
    $publication = new publication();
    $data = $publication->publicationQualification(["idtrabajo" => $idtrabajo]);

    return isset($data[0]) ? $data[0]['estrellas']: 0;
  }

  // Obtener el id mayor de publicaciones
  function getMaxIdpublication(){
    $publication = new Publication();
    $data = $publication->getMaxIdpublicationFinded();
    return  isset($data) ? $data[0]->idpublicacion: 0;
  }

  // Obtener imagen de perfil
  function getImageProfileUser($idusuario){
    $gallery = new Gallery();
    $images = $gallery->getProfilePicture(["idusuario" => $idusuario]);

    return isset($images[0]) ? $images[0]['archivo'] : 'default_profile_avatar.svg';
  }

  // Listar todas las publicaciones
  if($_GET['op'] == 'listPublications'){
    $data = $publication->listPublications([
      "offset" => 0,
      "limit"  => 5
    ]);

    $dataOutput = [];    

    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idpublicacion"     => $row['idpublicacion'],
          "idusuario"         => $row['idusuario'],
          "idpersona"         => $row['idpersona'],
          "apellidos"         => $row['apellidos'],
          "nombres"           => $row['nombres'],
          "fotoperfil"        => getImageProfileUser($row['idusuario']),
          "titulo"            => $row['titulo'],
          "descripcion"       => $row['descripcion'],
          "fechapublicado"    => $row['fechapublicado'],
          "fechamodificado"   => $row['fechamodificado']
        ];

      }
      
      echo json_encode($dataOutput);
    }
  }

  // Listar publicaciones por limites
  if($_GET['op'] == 'listPublicationsLimit'){
    $data = $publication->listPublicationsLimit([
      "idpublicacion" => $_GET['idpublicacion'], 
      "limit"         => 6
    ]);
    
    $dataOutput = [];
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idpublicacion"     => $row['idpublicacion'],
          "idusuario"         => $row['idusuario'],
          "idpersona"         => $row['idpersona'],
          "apellidos"         => $row['apellidos'],
          "nombres"           => $row['nombres'],
          "fotoperfil"        => getImageProfileUser($row['idusuario']),
          "titulo"            => $row['titulo'],
          "descripcion"       => $row['descripcion'],
          "fechapublicado"    => $row['fechapublicado'],
          "fechamodificado"   => $row['fechamodificado']
        ];

      }
      
      echo json_encode($dataOutput);
    }
  }

  // Listar publicaciones por idusuario
  if($_GET['op'] == 'getPublicationsByUser'){
    $idusuario = 0;
    $idpublicacion = 0;
    $dataOutput = [];
  
    // Validar idusuario e idpublicacion
    $idusuario = $_GET['idusuarioactivo'] != -1? $_GET['idusuarioactivo']: $_SESSION['idusuario'];
    $idpublicacion = $_GET['idpublicacion'] == -1? getMaxIdpublication() + 1: $_GET['idpublicacion'];

    $data = $publication->getPublicationsByUser([
      'idusuario'       => $idusuario,
      'idpublicacion'   => $idpublicacion,
      'limit'           => 6
    ]);
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idpublicacion"     => $row['idpublicacion'],
          "idusuario"         => $row['idusuario'],
          "idpersona"         => $row['idpersona'],
          "apellidos"         => $row['apellidos'],
          "nombres"           => $row['nombres'],
          "fotoperfil"        => getImageProfileUser($row['idusuario']),
          "titulo"            => $row['titulo'],
          "descripcion"       => $row['descripcion'],
          "fechapublicado"    => $row['fechapublicado'],
          "fechamodificado"   => $row['fechamodificado']
        ];

      }
      
      echo json_encode($dataOutput);
    }

  }

  // Obtener un registro de trabajo
  if($_GET['op'] == 'getAtpublication'){
    $data = $publication->getAtpublication(["idpublicacion" => $_GET['idpublicacion']]);
    $dataOutput = [];

    if($data){
      $dataOutput[] = [
        "idpublicacion"     => $data[0]['idpublicacion'],
        "idusuario"         => $data[0]['idusuario'],
        "idpersona"         => $data[0]['idpersona'],
        "apellidos"         => $data[0]['apellidos'],
        "nombres"           => $data[0]['nombres'],
        "fotoperfil"        => getImageProfileUser($data[0]['idusuario']),
        "titulo"            => $data[0]['titulo'],
        "descripcion"       => $data[0]['descripcion'],
        "fechapublicado"    => $data[0]['fechapublicado'],
        "fechamodificado"   => $data[0]['fechamodificado']
      ];
      
      echo json_encode($dataOutput[0]);
    }
  }

  // Generar autocompletado de titulo - general
  if($_GET['op'] == 'listPublicationsAutocomplete'){
    $data = $publication->listPublicationsAutocomplete(["titulo" => $_GET['titulo']]);
    $output = [];
    
    if($data){
      foreach( $data as $row){
        $output[] = $row['titulo'];
      }
      echo json_encode($output);
    }
  }

  // Generar autocompletado de titulo - usuario
  if($_GET['op'] == 'listPublicationsAutocompleteByUser'){
    $idusuario = 0;

    if($_GET['idusuarioactivo'] != -1){
      $idusuario = $_GET['idusuarioactivo'];
    } else {
      $idusuario = $_SESSION['idusuario'];
    }

    $data = $publication->listPublicationsAutocompleteByUser(["titulo" => $_GET['titulo'], "idusuario" => $idusuario]);
    $output = [];
    
    if($data){
      foreach( $data as $row){
        $output[] = $row['titulo'];
      }
      echo json_encode($output);
    }
  }

  // Filtrados por titulos y limites
  if($_GET['op'] == 'listFilteredPublications'){
    $idpublicacion = 0;

    if($_GET['idpublicacion'] == -1){
      $idpublicacion = getMaxIdpublication() + 1; // Sumado en 1, para validar en DB
    } else {
      $idpublicacion = $_GET['idpublicacion'];
    }

    $data = $publication->listFilteredPublications([
      "titulo"          => $_GET['titulo'],
      "idpublicacion"   => $idpublicacion,
      "limit"           => 6
    ]);

    
    $dataOutput = [];
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idpublicacion"     => $row['idpublicacion'],
          "idusuario"         => $row['idusuario'],
          "idpersona"         => $row['idpersona'],
          "apellidos"         => $row['apellidos'],
          "nombres"           => $row['nombres'],
          "fotoperfil"        => getImageProfileUser($row['idusuario']),
          "titulo"            => $row['titulo'],
          "descripcion"       => $row['descripcion'],
          "fechapublicado"    => $row['fechapublicado'],
          "fechamodificado"   => $row['fechamodificado']
        ];

      }
      
      echo json_encode($dataOutput);
    }
  }

  // Filtrados por idusuario, titulos y limites
  if($_GET['op'] == 'listFilteredPublicationByUser'){
    $idpublicacion = 0;
    $idusuario = 0;
    $dataOutput = [];

    $idusuario = $_GET['idusuario'] != -1? $_GET['idusuario']: $_SESSION['idusuario'];
    $idpublicacion = $_GET['idpublicacion'] == -1? getMaxIdpublication() + 1: $_GET['idpublicacion'];

    $data = $publication->listFilteredPublicationByUser([
      "titulo"          => $_GET['titulo'],
      "idusuario"       => $idusuario,
      "idpublicacion"   => $idpublicacion,
      "limit"           => 6
    ]); 
    
    if($data){
      foreach ($data as $row){
        $dataOutput[] = [
          "idpublicacion"     => $row['idpublicacion'],
          "idusuario"         => $row['idusuario'],
          "idpersona"         => $row['idpersona'],
          "apellidos"         => $row['apellidos'],
          "nombres"           => $row['nombres'],
          "fotoperfil"        => getImageProfileUser($row['idusuario']),
          "titulo"            => $row['titulo'],
          "descripcion"       => $row['descripcion'],
          "fechapublicado"    => $row['fechapublicado'],
          "fechamodificado"   => $row['fechamodificado']
        ];

      }
      
      echo json_encode($dataOutput);
    }
  }

  // Eliminar publicación
  if($_GET['op'] == 'deletePublication'){
    $publication->deletePublication(["idpublicacion" => $_GET['idpublicacion']]);
  }
}

if(isset($_POST['op'])){

  // Registrar una publicación con imagenes o video
  if($_POST['op'] == 'registerPublication'){
    // Registrar trabajo
    $data = $publication->registerPublication([
      'idusuario'      => $_SESSION['idusuario'],
      'titulo'         => $_POST['titulo'],
      'descripcion'    => $_POST['descripcion']
    ]);

    // Obtener idalbum publicaciones
    $dataAlbum = $album->getAnAlbumByNameAndUser(["idusuario" => $_SESSION['idusuario'], "nombrealbum" => "Publicaciones"]);
    $idalbum = $dataAlbum[0]['idalbum'];
    $idpublicacion = $data[0]['idpublicacion'];
    $countImg = 0;
    $result = "";

    // Si existe imagenes
    if (isset($_FILES['images'])){
      // Validar el array de archivos
      if(is_array(($_FILES))){
        foreach($_FILES['images']['name'] as $key => $value){
          $ext = explode('.', $_FILES['images']['name'][$key]);   // Separar la extension de la imagen
          $image = date('Ymdhis') . $countImg . '.' . end($ext);    // Renombrar cada imagen
  
          $gallery->registerGallery([   
            'idalbum'       => $idalbum,
            'idusuario'     => $_SESSION['idusuario'],
            'idpublicacion' => $idpublicacion,
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

      $result = 'Se agregaron ' . $countImg . ' imagenes';
    }

    // Si existe video
    if(isset($_FILES['video'])){
      $ext = explode('.', $_FILES['video']['name']);    // Obtener extensión del video
      $video = date('Ymdhis') . '.' . end($ext);        // Renombrar

      $gallery->registerGallery([   
        'idalbum'       => $idalbum,
        'idusuario'     => $_SESSION['idusuario'],
        'idpublicacion' => $idpublicacion,
        'tipo'          => 'V',
        'archivo'       => $video,
        'estado'        => '1'
      ]);
      
      // Mover a la carpeta img indicada
      if(move_uploaded_file($_FILES['video']['tmp_name'], '../dist/video/' . $video)){
        $result = 'Se agrego un video ' . $_FILES['video']['name'] . " (" . $video . ")";
      };
    }

    echo $idpublicacion;
  }

  // Actualizar publicación con imagenes o video
  if($_POST['op'] == 'updatePublication'){
    // Actualizar registro de trabajo
    $publication->updatePublication([
      'idpublicacion'  => $_POST['idpublicacion'],
      'titulo'         => $_POST['titulo'],
      'descripcion'    => $_POST['descripcion']
    ]);

    $deletedFiles = explode(',', $_POST['eliminados']);  

    // Elimar archivos indicados
    if($_POST['eliminados'] != ""){
      for($i = 0; $i < count($deletedFiles); $i++){
        $gallery->deleteGallery(["idgaleria" => $deletedFiles[$i]]);
      }
    }

    // Obtener id galeria publicacion
    $album = new Album();
    $idalbum = $album->getAnAlbumByNameAndUser(["idusuario" => $_SESSION['idusuario'], "nombrealbum" => "Publicaciones"]);
    $idalbum = $idalbum[0]['idalbum'];

    $idpublicacion = $_POST['idpublicacion'];
    $countImg = 0;

    // Si existe imagenes
    if (isset($_FILES['images'])){
      // Validar el array de archivos
      if(is_array($_FILES)){
        foreach($_FILES['images']['name'] as $key => $value){
          $ext = explode('.', $_FILES['images']['name'][$key]);   // Separar la extension de la imagen
          $image = date('Ymdhis') . $countImg . '.' . $ext[1];    // Renombrar cada imagen
  
          $gallery->registerGallery([   
            'idalbum'       => $idalbum,
            'idusuario'     => $_SESSION['idusuario'],
            'idpublicacion' => $idpublicacion,
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

    }

    // Si existe video
    if(isset($_FILES['video'])){
      $ext = explode('.', $_FILES['video']['name']);  // Obtener extensión del video
      $video = date('Ymdhis') . '.' . $ext[1];        // Renombrar

      $gallery->registerGallery([   
        'idalbum'       => $idalbum,
        'idusuario'     => $_SESSION['idusuario'],
        'idpublicacion' => $idpublicacion,
        'tipo'          => 'V',
        'archivo'       => $video,
        'estado'        => '1'
      ]);
      
      // Mover a la carpeta video indicada
      if(move_uploaded_file($_FILES['video']['tmp_name'], '../dist/video/' . $video)){

      };
    }
  }

}

?>