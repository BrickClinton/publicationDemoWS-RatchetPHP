<?php
require_once '../core/model.master.php';
class Gallery extends ModelMaster{

  // Listar galerias por usuario
  public function getGalleriesByUser(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_listar_usuario", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar galerias por album
  public function getGalleriesByAlbum(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_listar_album", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar galerias por publicación
  public function getGalleriesByPublication(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_listar_publicacion", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Obtener la foto de perfil
  public function getProfilePicture(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_foto_perfil", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Obtener la foto de portada
  public function getPortPicture(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_foto_portada", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  //Obtener foto del ultimo imagen subido
  public function getLastImageByAlbum(array $data){
    try{
      return parent::execProcedure($data, "spu_galerias_foto_ultima", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Registrar galeria
  public function registerGallery(array $data){
    try{
      parent::execProcedure($data, "spu_galerias_registrar", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  //  Actualizar galeria
  public function updateGallery(array $data){
    try{
      parent::execProcedure($data, "spu_galerias_modificar", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Eliminar imagen
  public function deleteGallery(array $data){
    try{
      parent::deleteRegister($data, "spu_galerias_eliminar");
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }
}


?>