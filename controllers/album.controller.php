<?php 

session_start();
require_once '../models/Album.php';
require_once '../models/Gallery.php';

$album = new Album();
$gallery = new Gallery();

if (isset($_GET['op'])) {
  // Cargar el album dentro de un control select
  function loadAlbumSlcModal($data) {
    if (count($data) > 0) {
      echo  "<option value=''>Seleccione</option>";
      foreach ($data as $row) {
        if($row['nombrealbum'] == 'Portada' || $row['nombrealbum'] == 'Perfil' || $row['nombrealbum'] == 'Publicaciones'){
          continue;
        }else{
          echo "
            <option value='{$row['idalbum']}'>{$row['nombrealbum']}</option>
          ";
        }
      }
    }
  }

  // Cargar los albumes
  if ($_GET['op'] == 'getAlbumByUser') {
    $data = [];
    $array = [];
    $idusuario = 0;

    // Validar idusuario obtenido de la vista
    if($_GET['idusuarioactivo'] != -1){      
      $idusuario = $_GET['idusuarioactivo'];
    } else {
      $idusuario = $_SESSION['idusuario'];
    }
    
    $data = $album->getAlbumsByUser(["idusuario" => $idusuario]);
    
    if($data){
      foreach($data as $row){
        $images = $gallery->getLastImageByAlbum(["idusuario" => $idusuario, "nombrealbum" => $row['nombrealbum']]);
        
        $array[] = [
          "idalbum"       => $row['idalbum'],
          "idusuario"     => $row['idusuario'],
          "nombrealbum"   => $row['nombrealbum'],
          "totalimages"   => $row['totalimages'],
          "estado"        => $row['estado'],
          "archivo"       => $images[0]['archivo']
        ];
      }
      
      echo json_encode($array);      
    }    
  }

  // Eliminar album
  if ($_GET['op'] == 'deleteAlbum') {
    $data = $album->deleteAlbum(["idalbum" => $_GET['idalbum']]);
  }

  // Cargar el album dentro de un modal
  if($_GET['op'] == 'getSelectAlbumsByUser'){
      $data = $album->getSelectAlbumsByUser(["idusuario" => $_SESSION['idusuario']]);

      if($data){
        loadAlbumSlcModal($data);
      }
  }

  // Registrar un album
  if($_GET['op'] == "registerAlbum"){
    $data = $album->registerAlbum([
      "idusuario"     => $_SESSION['idusuario'],
      "nombrealbum"   => $_GET['nombrealbum']
    ]);
  }

  // Modificar un album
  if ($_GET['op'] == "updateAlbum") {
    $album->updateAlbum([
      "idalbum"       => $_GET['idalbum'],
      "nombrealbum"   => $_GET['nombrealbum']
    ]);
  }

  // Obtener un album
  if($_GET['op'] == 'getAnAlbum'){
    $data = $album->getAnAlbum(["idalbum" => $_GET['idalbum']]);
    if($data){
      echo json_encode($data);
    }
  }
}

