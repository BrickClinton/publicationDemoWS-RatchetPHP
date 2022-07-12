// Continuar consultando datos al servidor
var continueFetchDataComment = true;  

/**
 * COMENTARIOS CONFIG
 */
// MOSTRAR LOS COMENTARIOS REALIZADOS
$("#data-publication").on("click", ".open-comments", function(){
  let container = $(this).parent().parent(".option-menu").next(".content-comments");
  if($(container).is(":hidden")){
    $(container).show('slow');
    //$(container).scrollTop($(container).prop('scrollHeight'));  
  }
});

// Evento click en la caja de comentario para MOSTRAR LOS COMENTARIOS REALIZADOS
$("#data-publication").on("click", ".write-text-comment", function(){
  let container = $(this).parent().parent(".write-comment").prev(".collapse");
  $(container).show("slow");
  $(container).scrollTop($(container).prop('scrollHeight')); 
});

// Detectar ENTER en la caja de comentario (Enviar datos al servidor)
$("#data-publication").on("keydown", ".write-text-comment", function(e){
  if (e.keyCode == 13) {
    e.preventDefault();
    let comentario = $(this).html().trim();
    let idpublicacion = $(this).attr("data-code");

    if(comentario == ""){
      sweetAlertWarning("Texto invalido", "Por favor escriba algo...");
    }
    else{     

      registerComment({
        op          : 'registerComment',
        idpublicacion   : idpublicacion,
        comentario  : comentario
      });
    }

    // Enfoque
    $(this).focus();
  }
});


/** 
 * REGISTER COMMENT
 */
// Botón enviar comentario al servidor (REGISTRAR COMENTARIO)
$("#data-publication").on("click", ".btn-send", function(){
  let comentario = $(this).prev(".text-auto-height").children(".write-text-comment").html().trim();
  let idpublicacion = $(this).prev(".text-auto-height").children(".write-text-comment").attr("data-code");
  
  if(comentario == ""){
    sweetAlertWarning("Texto invalido", "Por favor escriba un comentario");
  }
  else{
    registerComment({
      op          : 'registerComment',
      idpublicacion   : idpublicacion,
      comentario  : comentario
    });
  }

  // Enfoque
  $(this).prev(".text-auto-height").children(".write-text-comment").focus();
});

// Registrar comentario
function registerComment(dataSend){
  $.ajax({
    url: 'controllers/comment.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: dataSend,
    success: function(result){    
      if(result == "error_access"){
        sweetAlertWarning(result, "Debe iniciar sesión o registrase");
      } else {
        // Limpiar caja
        $(".write-text-comment").html('');
        commentIsVisible = true;
        sendDataWS({
          process      : "comment", 
          type         : "register", 
          idcomentario : result[0].idcomentario,
          idpublicacion: dataSend.idpublicacion
        });
        addCommentToList(result[0].idcomentario, dataSend.idpublicacion)
        countCommentsByPublication(dataSend.idpublicacion);
      }
    }
  });
}

// Agregar ultimo comentario a la lista de comentarios
function addCommentToList(idcomentario, idpublicacion){
  $(`.content-comments[data-idpublicacion='${idpublicacion}'] .deleted`).remove();

  $.ajax({
    url: 'controllers/comment.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getAComment&idcomentario=' + idcomentario,
    success: function(result){
      let tmpComments = templateContainerComment;

      for (key in result[0]){
        tmpComments = tmpComments.replaceAll('{' + key + '}', result[0][key]);
      }

      let container = (`.content-comments[data-idpublicacion='${idpublicacion}']`);
      $(container).append(tmpComments);
      $(`.img-user-comment[data-idusuario='${result[0].idusuario}']`).attr('src', 'dist/img/user/' + result[0].fotoperfil);
      $(`.content-buttons-comment[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
      $(container).scrollTop($(container).prop('scrollHeight') );
    }
  });
}


/**
 * DETECTED THE SCROLL
 */
// Al hacer scroll - CONTENIDO DE COMENTARIOS
function scrollCommentDetected(idpublicacion){
  let container = (`.content-comments[data-idpublicacion='${idpublicacion}']`);
  if(isFinalContainer(container)){  
    if(continueFetchDataComment){
      let divs = $(`${container} .box-comment[data-idcomentario]`);
      let attr = "data-idcomentario";
      let values = getDataArrayByElements(divs, attr);
      let idcomentario = values[values.length - 1]; // Ultimo id
  
      showCommentsPromise(idpublicacion, idcomentario);
    }
  }
}

// Ejecutar promesa - mostrar comentarios
async function showCommentsPromise(idpublicacion, idcomentario){
  try{
    continueFetchDataComment = false; // Detener consulta
    await showCommentsByPublicationLimit(idpublicacion, idcomentario);   
    
  } catch (error){
    console.log(error)
  } finally{
    continueFetchDataComment = true; // Volver a consultar
  }
}

// Traer más registros de comentarios al hacer scroll
function showCommentsByPublicationLimit(idpublicacion, idcomentario){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/comment.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: {
        op            : 'getCommentsByPublicationLimit',
        idpublicacion : idpublicacion,
        idcomentario  : idcomentario
      },
      success: function(result){
        // Recorrer los registros
        result.forEach(value => {
          let tmpComments = templateContainerComment;
          for (key in value){
            tmpComments = tmpComments.replaceAll('{' + key + '}', value[key]);
          }
  
          let container = (`.content-comments[data-idpublicacion='${idpublicacion}']`);
          $(container).append(tmpComments);
          $(`.img-user-comment[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
          $(`.content-buttons-comment[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
          //$(container).scrollTop($(container).prop('scrollHeight') );   
        });

        resolve();
      }
    });
  });
}

/**
 * EDIT COMMENT
 */
// Convierte la etiqueta P en una sección editable 
$("#data-publication").on("click", ".edit-comment", function(){
  hideOptionsCommentModify();

  // Habilitar campo editable
  $(this).parent(".content-buttons-comment").prev('p.comment-text').attr('contenteditable', true);
  
  // habilitar botones
  $(this).addClass('d-none');
  $(this).next('.delete-comment').addClass('d-none');
  $(this).next('.delete-comment').next('.update-comment').removeClass('d-none');
  $(this).next('.delete-comment').next('.update-comment').next('.cancel-edit-comment').removeClass('d-none');
 
});

// Cancela la edición del comentario
$("#data-publication").on("click", ".cancel-edit-comment", function(){
  // Desabilitar campo editable
  $(this).prevAll('p.comment-text').attr('contenteditable', false);
  
  // habilitar botones
  $(this).addClass('d-none');
  $(this).prev('.update-comment').addClass('d-none');
  $(this).prev('.update-comment').prev('.delete-comment').removeClass('d-none');
  $(this).prev('.update-comment').prev('.delete-comment').prev('.edit-comment').removeClass('d-none');

  // Volver a mostrar el comentario original
  getAComment($(this).attr("data-code"));
});

// Ocultar botones
function hideOptionsCommentModify(){
  // Desactivar campo editable
  $('p.comment-text').attr('contenteditable', false);

  $(".edit-comment").removeClass("d-none");
  $(".delete-comment").removeClass("d-none");

  $(".cancel-edit-comment").addClass("d-none");
  $(".update-comment").addClass("d-none");
}


/**
 * UPDATE COMMENT
 */
// Actualizar comentario de trabajos publicados
$("#data-publication").on("click", ".update-comment", function(){
  
  let idcomentario = $(this).attr('data-code');
  let comentario = $(this).parent(".content-buttons-comment").prev("p.comment-text").html().trim();
  
  updateCommentPublication({
    op            : 'updateComment',
    idcomentario  : idcomentario,
    comentario    : comentario
  });
});

function updateCommentPublication(dataSend){
  $.ajax({
    url: 'controllers/comment.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(result){
      if(result == ""){
        commentIsVisible = true; // Mostrar contenidos
        sendDataWS({
          process       : "comment", 
          type          : "update", 
          idcomentario  : dataSend.idcomentario
        });
        getAComment(dataSend.idcomentario);
      }
    }
  });
}

// Obtener un comentario por ID
function getAComment(idcomentario){
  $.ajax({
    url: 'controllers/comment.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getAComment&idcomentario=' + idcomentario,
    success: function(result){

      let tmpComment = templateContentComment;

      for (key in result[0]){
        tmpComment = tmpComment.replaceAll('{' + key + '}', result[0][key]);
      }

      $(`.box-comment[data-idcomentario='${idcomentario}']`).html(tmpComment);
      $(`.img-user-comment[data-idusuario='${result[0].idusuario}']`).attr('src', 'dist/img/user/' + result[0].fotoperfil);
      $(`.content-buttons-comment[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
    }
  });
}

/**
 * DELETE COMMENT
 */
// Eliminar comentario
$("#data-publication").on("click", ".delete-comment", function(){
  
  let idcomentario = $(this).attr('data-code');
  let idpublicacion = $(this).parent(".content-buttons-comment").parent(".box-content-commented").parent(".box-comment").parent(".content-comments").attr("data-idpublicacion");

  sweetAlertConfirmQuestionDelete("¿Estas seguro de eliminar el comentario?").then(confirm => {
    if(confirm.isConfirmed){
      sendDataWS({
        process      : "comment", 
        type         : "delete", 
        idcomentario : idcomentario,
        idpublicacion: idpublicacion
      });
      deleteComment(idcomentario, idpublicacion);
    }
  });
});

// Función eliminar
function deleteComment(idcomentario, idpublicacion){  
  $.ajax({
    url: 'controllers/comment.controller.php',
    type: 'GET',
    data: 'op=deleteComment&idcomentario='+ idcomentario,
    success: function(result){
      if(result == ""){
        //showCommentsByPublication(idpublicacion);        
        countCommentsByPublication(idpublicacion);
        $(`.box-comment[data-idcomentario='${idcomentario}']`).after("<div class='box-comment deleted'><span class='text-muted'>Comentario eliminado...</span></div>");
        $(`.box-comment[data-idcomentario='${idcomentario}']`).remove();
        
        // Quitar despues de 2 segundos
        setTimeout(() => {
          $(`.content-comments[data-idpublicacion='${idpublicacion}'] .deleted`).remove();
        }, 2000);
      }
    }
  });
}
