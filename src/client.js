var socket;

// Iniciar web socket
function initWS(){
  socket = new WebSocket("ws://192.168.1.146:8080");

  // Conexión abierta
  socket.onopen = function(msg){
    console.log("Conexión abierta...!")
    //console.log("Bienvenido: " + this.readyState, "Conexión exitosa en", msg.srcElement.url);
  }

  // Mensaje recibido
  socket.onmessage = function(msg){
    let data = JSON.parse(msg.data);

    if(JSON.stringify(data) != "{}"){
      rechargeData(data);
    }    
  }

  // Coneión cerrada
  socket.onclose = function(msg){
    console.log("Desconectado", this.readyState);
  }

  // ERROR de conexión
  socket.onerror = function(msg){
    console.error("Error al conectar");
  }
}

// Enviar mensaje al servidor
function sendDataWS(obj){
  let objMsg = JSON.stringify(obj);
  if(objMsg != '{}'){
    socket.send(objMsg);
  }
}

// Desconectar del servidor
function closeConnection(){
  socket.close();
}

// Reconectar conexión
function reconnectConnection(){
  quitConnection();
  initWS();
}

// Recargar datos
function rechargeData(data){
  /**
   * COMENTARIOS
   */
  if(data.process == "comment"){
    // Nuevo agregado
    if(data.type == "register"){
      addCommentToList(data.idcomentario, data.idpublicacion);
      countCommentsByPublication(data.idpublicacion);
    }

    // Editado
    if(data.type == "update"){
      getAComment(data.idcomentario);
    }

    // Eliminar
    if(data.type == "delete"){
      deleteComment(data.idcomentario, data.idpublicacion);
    }
  
  }

  /**
   * PUBLICACIONES
   */
  if(data.process == "publication"){
    // Registrar
    if(data.type == "register"){
      promiseAddElementBYListPublication(data.idpublicacion);
    }

    // Actualizar
    if(data.type == "update"){
      promiseRechargeAtPublication(data.idpublicacion);
    }

    // Eliminar
    if(data.type == "delete"){
      deletePublication(data.idpublicacion);
    }
  }


  /**
   * PROFILE
   */
  if(data.process == "profile"){
    // Actualizar perfil
    if(data.type == "updateImgProfile"){
      getImageProfile();
      getAllImagesForAlbum(data.idalbum);
    }

    // Actualizar portada
    if(data.type == "updateImgPort"){
      getImagePort();
      getAllImagesForAlbum(data.idalbum);
    }

    // Selecccionar foto perfil
    if(data.type == "selectImgProfile"){
      selectImageProfile(data.operation, data.idgaleria, data.idalbum);
    }

    // Selecccionar foto portada
    if(data.type == "selectImgPort"){
      selectImageProfile(data.operation, data.idgaleria, data.idalbum);
    }

    // Actualizar datos
    if(data.type == "updateDataPerson"){
      getNameUser();
    }
  }
}

initWS();