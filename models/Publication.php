<?php

require_once '../core/model.master.php';
class Publication extends ModelMaster{

  // Listar todas las publicaciones
  public function listPublications(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_listar", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones con limites
  public function listPublicationsLimit(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_listar_limit", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones para el autocompletado de titulos
  public function listPublicationsAutocomplete(array $data){
    try{
      return parent::execProcedure($data, "spu_lista_autocomplete_publicaciones", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones para el autocompletado de titulos - usuario
  public function listPublicationsAutocompleteByUser(array $data){
    try{
      return parent::execProcedure($data, "spu_lista_autocomplete_publicaciones_usuario", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Obtener el id mayor de publicaciones
  public function getMaxIdpublicationFinded(){
    try{
      return parent::getRows("spu_publicaciones_maxid_encontrado");
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones filtrados con limites
  public function listFilteredPublications(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_listar_filtrados_limit", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones filtrados por usuario con limites
  public function listFilteredPublicationByUser(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_listar_filtrados_usuario_limit", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar publicaciones por usuario
  public function getPublicationsByUser(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_listar_usuario", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Obtener un registro de publicación
  public function getAtPublication(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_getdata", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Registrar publicación
  public function registerPublication(array $data){
    try{
      return parent::execProcedure($data, "spu_publicaciones_registrar", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Actualizar publicación
  public function updatePublication(array $data){
    try{
      parent::execProcedure($data, "spu_publicaciones_modificar", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Eleminar publicación
  public function deletePublication(array $data){
    try{
      parent::deleteRegister($data, "spu_publicaciones_eliminar");
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

}
?>