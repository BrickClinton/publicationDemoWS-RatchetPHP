<?php

require_once '../core/model.master.php';
class User extends ModelMaster{

  // Hacer login
  public function loginUser(array $data){
    try{
      return parent::execProcedure($data, "spu_usuarios_login", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Obtener un registro
  public function getAUser(array $data){
    try{
      return parent::execProcedure($data, "spu_usuarios_getdata", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Listar los registro de usuarios
  public function getUsers(){
    try{
      return parent::getRows("spu_usuarios_listar");
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Registrar usuario
  public function registerUser(array $data){
    try{
      return parent::execProcedure($data, "spu_usuarios_registrar", true);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Actualizar usuario
  public function updateUser(array $data){
    try{
      parent::execProcedure($data, "spu_usuarios_modificar", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

  // Eliminar un registro de usuario
  public function deleteUser(array $data){
    try{
      parent::deleteRegister($data, "spu_usuarios_eliminar");
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

   // Actualizar correos
   public function updateEmailsUser(array $data){
    try{
      parent::execProcedure($data, "spu_usuarios_modificar_emails", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }
  
  // Actualizar clave
  public function updatePasswordUser(array $data){
    try{
      parent::execProcedure($data, "spu_usuarios_modificar_clave", false);
    }
    catch(Exception $error){
      die($error->getMessage());
    }
  }

}

?>