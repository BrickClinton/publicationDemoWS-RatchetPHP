/**
 * FORO DE CONSULTAS
 */

// Bloquear saltos de linea
$("#content-data-forum").on("keypress", ".contenteditable", function(e){
  return disableLineBreaks($(this), e); 
});

// Evitar pegar en la caja de comentario, solo texto plano
$(".content-forum .contenteditable").on("paste", function (e){
  e.preventDefault();
  var text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand("insertHTML", false, text);
});

// Convierte la etiqueta P en una sección editable 
$("#content-data-forum").on("click", ".edit-comment", function(){
  hideOptionsCommentModify();

  // Habilitar campo editable
  $(this).prev('p.comment-text').attr('contenteditable', true);
  
  // habilitar botones
  $(this).addClass('d-none');
  $(this).next('.delete-comment').addClass('d-none');
  $(this).next('.delete-comment').next('.update-comment').removeClass('d-none');
  $(this).next('.delete-comment').next('.update-comment').next('.cancel-edit-comment').removeClass('d-none');
 
});

// Cancela la edición del comentario
$("#content-data-forum").on("click", ".cancel-edit-comment", function(){
  // Desabilitar campo editable
  $(this).prevAll('p.comment-text').attr('contenteditable', false);
  
  // habilitar botones
  $(this).addClass('d-none');
  $(this).prev('.update-comment').addClass('d-none');
  $(this).prev('.update-comment').prev('.delete-comment').removeClass('d-none');
  $(this).prev('.update-comment').prev('.delete-comment').prev('.edit-comment').removeClass('d-none');

  offsetTmp = 0;
  offset = 0;
  $("#content-data-forum div").remove();  // Limpiar contenidos 
  loadQueriesForumToUser();               // Recargar contenidos
});

// Detectar ENTER en la caja de consulta (Enviar datos al servidor)
$("#forum-post-answers").keydown(function(e){
  if (e.keyCode == 13) {
    e.preventDefault();
    $(".content-forum .btn-send").click();    
  }
});

// Registrar Consultas
$(".content-forum .btn-send").click(function (){
  let consulta = $("#forum-post-answers").html().trim();

  if(consulta == ""){
    sweetAlertWarning("Texto invalido", "Por favor escriba algo...");
  } else {
    registerCommentForum({
      op              : 'commentForum',
      idusuarioactivo : idusuarioActivo,
      consulta        : consulta
    });
  }
});

function registerCommentForum(dataSend){
  $.ajax({
    url: 'controllers/forum.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(result){      
      if(result != ""){
        sweetAlertWarning(result, "Debe iniciar sesión o registrarse");
      } else {
        socket.send("forum"); // Operación enviada al servidor
        $("#forum-post-answers").html('').focus();
        cleanContentForum();
        loadQueriesForumToUser();               // Recargar contenidos
      }
    }
  });
}

// Actualizar comentario
$("#content-data-forum").on("click", ".update-comment", function(){
  
  let idforo = $(this).attr('data-code-forum');
  let consulta = $(this).prev(".delete-comment").prev(".edit-comment").prev("p.comment-text").html().trim();

  updateQueryForum({
    op      : 'updateCommentForum',
    idforo  : idforo,
    consulta: consulta
  });

});

function updateQueryForum(dataSend){
  $.ajax({
    url: 'controllers/forum.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(result){
      if(result == ""){
        socket.send("forum"); // Operación enviada al servidor
        cleanContentForum();
        loadQueriesForumToUser();               // Recargar contenidos         
      }
    }
  });
}

// Eliminar consulta
$("#content-data-forum").on("click", ".delete-comment", function(){
  
  let idforo = $(this).attr('data-code-forum');

  sweetAlertConfirmQuestionDelete("¿Estas seguro de eliminar el comentario?").then(confirm => {
    if(confirm.isConfirmed){
      deleteQueryForum(idforo);
    }
  });

});

function deleteQueryForum(idforo){
  $.ajax({
    url: 'controllers/forum.controller.php',
    type: 'GET',
    data: 'op=deleteForum&idforo=' + idforo,
    success: function(result){
      if(result == ""){
        socket.send("forum"); // Operación enviada al servidor

        cleanContentForum();
        loadQueriesForumToUser();               // Recargar contenidos
      }
    }
  });
}

// Listar consultas del foro
function loadQueriesForumToUser(){  
  // Generar animación de carga
  $("#content-data-forum").append(getLoader());

  $.ajax({
    url: 'controllers/forum.controller.php',
    type: 'GET',
    data: {
      op             : 'getQueriesToUser',
      idusuarioactivo: idusuarioActivo,
      offset         : offset,
      limit          : limit
    },
    success: function(result){
      // Quitar animación de carga  
      $("#content-data-forum div").remove(".container-loader");
      //console.log(result)
      if(result != "" && result != "sin consultas"){
        $("#content-data-forum").append(result);
      } 
    }
  });
}

// ejecutar la carga de consultas
//loadQueriesForumToUser(); // Se ejecuta al hacer clic en el botón foro (profile.js)

// Detectar scroll al final del contenedor
$("#content-data-forum").scroll(function(){
  let result = isFinalContainer("#content-data-forum");
  if(result){
    offsetTmp++;
    offset = offsetTmp * limit;
    loadQueriesForumToUser();
  }
});

function cleanContentForum(){
  offsetTmp = 0;
  offset = 0;
  $("#content-data-forum div").remove();  // Limpiar contenidos 
}