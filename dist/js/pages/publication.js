// VARIABLES GLOBALES
var idusuarioSession = localStorage.getItem("idusuarioSession");
var idusuarioActivo = localStorage.getItem("idusuarioActivo");
var idpersonaActivo = localStorage.getItem("idpersonaActivo");

idusuarioSession = idusuarioSession != null? idusuarioSession: -2;         // ID Usuario quien inicio sesión
idusuarioActivo = idusuarioActivo != null? idusuarioActivo: -1;            // ID Usuario perfil visitado
idpersonaActivo = idpersonaActivo != null? idpersonaActivo: -1;            // ID Usuario perfil visitado

var deviceUsed = navigator.userAgent || navigator.vendor || window.opera;  // Obtener información del dispositivo
var commentIsVisible = false;                                              // Validar si los comentarios serán visibles
var isDeleteImage = false;                                                 // Validar si es eliminación de imagenes
var isLoadImages = true;                                                   // Validar si es carga de imagenes
var isNewPublication = true;                                               // Validar si nueva publicación
var continueFetchData = true;                                              // Continuar traendo datos
var searchPublication = "";                                                // Publicación buscada
var idpublicacion = -1;                                                    // Idpublicacion (UPDATE and DELETE)
var uploadedImages = [];                                                   // Almacenar todos las imagenes subidos (Temporales)
var imagesTemp  = [];                                                      // Almacenar ímagenes traidos del servidor
var videoTemp  = [];                                                       // Almacenar video traido del servidor
var deletedFiles = [];                                                     // Almacena archivos eliminados (ID GALERIA)

// TEMPLATES HTML
var templateComplete = String($("#data-publication").html());
var templateCompletePublic = String($("#data-view-publication").html());              // view publication
var templateCompleteIn = String($(".target-service").html());
var templateHeader = String($(".target-header.card-header").html());
var templateUserBlock = String($(".user-block").html());
var templateUserBlockRight = String($(".user-block-right").html());
var templateCalification = String($(".content-califications[data-idpublicacion]").html());
var templateCalificationInner = String($(".content-califications[data-idpublicacion] .califications").html());
var templateBody1 = String($(".target-header.card-body").html());
var templateBody2 = String($(".target-body.card-body").html());
var templateContainerGallery = String($(".content-galeria").html());
var templateFooter = String($(".target-footer.card-footer").html());
var templateFooterMenu = String($(".option-menu").html());
var templateContainerComment = String($(".content-comments").html());
var templateContentComment = String($(".box-comment").html());
var templateWriteComment = String($(".write-comment").html());

// validar usuario activo
/* if(idusuarioActivo != -1){
  disabledButtons();
} else {
  enabledButtons();
}
 */



// Esta función desdabilita los botones de modificación o agregación
function disabledButtons(){
  $("#container-add-publication").hide();  
}

// Esta función habilita los botones de modificación o agregación
function enabledButtons(){
  $("#container-add-publication").show();
}


// Resetear formularios del modal
$(".btn-publication").click(openFormPublicationAdd);

// Abrir formulario para editar publicación
function openFormPublicationEdit(){
  clearFormPublication();
  $("#title-modal-publication").html("Editar publicación");                 // Titulo del modal
  $("#btn-add-publication").addClass("d-none");         // Ocultar botón agregar
  $("#btn-modify-publication").removeClass("d-none");   // Mostrar botón modificar
}

// Abrir formulario para registrar
function openFormPublicationAdd(){
  clearFormPublication();
  $("#title-modal-publication").html("Crear publicación");  // Titulo del modal
  $("#btn-modify-publication").addClass("d-none");          // Ocultar botón modificar
  $("#btn-add-publication").removeClass("d-none");          // Mostrar botón agregar
}

// Limpiar formulario de publicación
function clearFormPublication(){
  $("#form-publication")[0].reset();
  $("#form-upload-file")[0].reset();
  $("#input-new-image").val(null);
  $("#input-new-video").val(null);
  $("#container-video").hide();
  $("#titulo").focus();
  deleteAllImagespreview();
  deleteVideoPreview();
  changeInterfaceToImages(true);
}


/**
 * REALIZAR PUBLICACIÓN
 */
// Publicaciones
$("#btn-add-publication").click(function(){

  // Validar datos
  if(dataFormPublicationIsEmpty()){
    toastr.error("Datos incorrectos, por favor complete los campos");
  }
  else{

    // Confirmar
    sweetAlertConfirmQuestionSave("¿Estas seguro de hacer la publicación?").then((confirm) => {
      if(confirm.isConfirmed){

        var formData = new FormData();
        formData.append("op", "registerPublication");
        formData.append("titulo", $("#titulo").val());
        formData.append("descripcion", $("#descripcion").val());
      
        // Comprobar si son imagenes o video
        if(isLoadImages){
          // pasar las imagenes al array images[]
          for(let i = 0; i < uploadedImages.length; i++){
            formData.append("images[]", uploadedImages[i]);
          }
        }
        else{
          formData.append("video", $("#input-new-video")[0].files[0]);
        }
      
        registerPublication(formData);
      }
    }); // Fin Sweet alert
  }
});

// Registrar publicación
function registerPublication(formData){
  $.ajax({
    url: 'controllers/publication.controller.php',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    cache: false,
    success: function(result){
      let idpublicacion = result;
      sendDataWS({
        process: 'publication',
        type: 'register',
        idpublicacion: idpublicacion
      });
      promiseAddElementBYListPublication(idpublicacion);
      $("#modal-publication").modal('hide');
    }
  });
}

// Validar campo obligatorios
function dataFormPublicationIsEmpty(){
  return $("#titulo").val() == "" || $("#descripcion").val() == "";
}

/* PROMESAS */
// Agregar publicación antes de la lista de elementos
function addElementByListPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      data: 'op=getAtpublication&idpublicacion=' + idpublicacion,
      success: function(result){
        if(result != ""){
          let value = JSON.parse(result);
  
          let tmpTemplatePublic = templateComplete;
          for (key in value){
            tmpTemplatePublic = tmpTemplatePublic.replaceAll('{' + key + '}', value[key]);
          }  
  
          $("#data-publication").prepend(tmpTemplatePublic);
          $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
          $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
          $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
          $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();
          
          resolve();
        }
      }
    });
  });
}

// Ejecutar promesas 
async function promiseAddElementBYListPublication(idpublicacion){
  try{
    await addElementByListPublication(idpublicacion);
    // Ejecución en paralelo
    await Promise.all([
      generateFilesByPublication(idpublicacion),
      showCommentsByPublicationLimit(idpublicacion, 0),
      countCommentsByPublication(idpublicacion),
      myQualifyPublication(idpublicacion),
      promiseParallelScoreAndCountQualify(idpublicacion)
    ]);

  } catch (error){
    console.error(error);
  }
}


/**
 * MENU DE OPCIONES POR CADA PUBLICACIÓN
 */
// Mostrar el menu  de opciones
$("#data-publication").on("click", ".btn-show-config", function(){
  let idpublicacion = $(this).next(".list-public-config").attr("data-idpublicacion");
  let divs = $(".list-public-config").toArray();

  // Obteniendo los IDs de albumes
  let valAttributes = getDataArrayByElements(".list-public-config", "data-idpublicacion");
  for (let i = 0; i < valAttributes.length; i++){
    if(valAttributes[i] !== idpublicacion){
      divs[i].classList.remove("show-list");
    }
  }

  $(this).next(".list-public-config").toggleClass('show-list');
});

// Editar publicación (traer datos del servidor y mostrarlo en pantalla)
$("#data-publication").on("click", ".btn-edit-publication", function(){
  
  $(this).parent("li.item-public-config").parent("ul.list-public-config").toggleClass('show-list'); // Cerrar opciones
  openFormPublicationEdit();  // abrir formulario para editar publicación
  deletedFiles = [];       // Resetear el arreglo de imagenes eliminados
  imagesTemp = [];

  idpublicacion = $(this).attr("data-code");
  getAtPublication(idpublicacion);
});

/* PROMESAS */
// Obtener el registro de la publicación indicada
function getAtPublication(idpublicacion){
  $.ajax({
    url: 'controllers/publication.controller.php',
    type: 'GET',
    data: 'op=getAtpublication&idpublicacion=' + idpublicacion,
    success: function(result){
      if(result != ""){
        let dataController = JSON.parse(result);
        $("#titulo").val(dataController.titulo);
        $("#descripcion").val(dataController.descripcion);

        getFilesPublication(dataController.idpublicacion); // Listar imagenes o video
        
        $("#modal-publication").modal('show');
      }
    }
  });
}

// Obtener imagenes o video de la publicación
function getFilesPublication(idpublicacion){
  $.ajax({ 
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    data: 'op=getGalleriesByPublication&idpublicacion=' + idpublicacion,
    success: function(result){
      if(result !== ""){
        let dataController = JSON.parse(result);
  
        dataController.forEach(value => {          
          if(value.tipo == 'F'){
            imagesTemp.push(value.idgaleria); // almacenar los IDs IMAGENES
            createPreviewImagesController("#container-images", value.archivo, value.idgaleria);
          }
          else{
            videoTemp.push(value.idgaleria); // almacenar ID VIDEO
            $("#btn-video").click();                                            // Mostrar contenido de video
            $("#container-progress-load-video").addClass("d-none");             // ocultar barra de progreso
            $("#video-tag").addClass("d-none");                                 // ocultar previsualizador por defecto
            $("#btn-add-file").prop('disabled', true);                          // Desactivar carga de video
            clearContainer("#preview-video-server");                            // eliminar los elementos hijos
            createPreviewVideo("#preview-video-server", value.archivo);         // cargar el video indicado
          }  
        });
  
        // Mostrar boton de eliminación
        $("#btn-delete-files").removeClass("d-none");   
  
        // Desactivar boton para subir imagenes si son 5 imagenes
        if(dataController.length == 5){
          $("#btn-add-file").prop('disabled', true); 
        }
      } // Fin del if
    }
  });
}


/**
 * UPDATE PUBLICATION
 */
// Actualizar publicación
$("#btn-modify-publication").click(function(){

  // Validar datos
  if(dataFormPublicationIsEmpty()){
    sweetAlertWarning("Datos incorrectos", "Por avor complete los campos");
  } else {
    // Confirmar
    sweetAlertConfirmQuestionSave("¿Estas seguro de actualizar la publicación?").then((confirm) => {
      if(confirm.isConfirmed){
        var formData = new FormData();
        formData.append("op", "updatePublication");
        formData.append("idpublicacion",  idpublicacion);
        formData.append("titulo", $("#titulo").val());
        formData.append("descripcion", $("#descripcion").val());
        formData.append("eliminados", deletedFiles);

        // Comprobar si son imagenes o video
        if(isLoadImages){
          // Imagenes nuevas
          for(let i = 0; i < uploadedImages.length; i++){
            formData.append("images[]", uploadedImages[i]);
          }
        }
        else{
          formData.append("video", $("#input-new-video")[0].files[0]);
        }
      
        updatePublication(formData);
      }
    }); // Fin Sweet alert
  }
});

// Actualizar publicación
function updatePublication(formData){
  $.ajax({
    url: 'controllers/publication.controller.php',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    cache: false,
    success: function(result){  
      if(result == ""){
        //socket.send("publicationwork"); // Operación enviada al servidor
        idpublicacion = -1;
        sendDataWS({
          process: 'publication',
          type: 'update',
          idpublicacion: formData.get("idpublicacion")
        });
        promiseRechargeAtPublication(formData.get("idpublicacion"));
        $("#modal-publication").modal('hide');
      }
    }      
  }); 
}

// Recargar solo el contenido de la publicación
function rechargeAtPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`.target-service[data-idpublicacion='${idpublicacion}']`).empty();
  
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      data: 'op=getAtpublication&idpublicacion=' + idpublicacion,
      success: function(result){
        if(result != ""){
          let value = JSON.parse(result);
          let tmpPublic = templateCompleteIn;
  
          // Actualizar datos
          for (key in value){
            tmpPublic = tmpPublic.replaceAll('{' + key + '}', value[key]);
          }
  
          $(`.target-service[data-idpublicacion='${idpublicacion}']`).append(tmpPublic);
          $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
          $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
          $(`.content-califications[data-califications='${value.idpublicacion}']`).empty();
          $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
          $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();

          resolve();
        }
      }
    });
  });
}

// Ejecutar promesas
async function promiseRechargeAtPublication(idpublicacion){
  try{
    await rechargeAtPublication(idpublicacion);
    // Ejecución en paralelo
    await Promise.all([
      generateFilesByPublication(idpublicacion),
      showCommentsByPublicationLimit(idpublicacion, 0),
      countCommentsByPublication(idpublicacion),
      myQualifyPublication(idpublicacion),
      promiseParallelScoreAndCountQualify(idpublicacion)
    ]);

  } catch (error){
    console.error(error);
  }
}


/**
 * DELETE PUBLICATION
 */
// Eliminar publicación
$("#data-publication").on("click", ".btn-delete-publication", function(){
  let idpublicacion = $(this).attr("data-code");

  sweetAlertConfirmQuestionDelete("¿Estas seguro de eliminar esta publicación?").then(confirm => {
    if(confirm.isConfirmed){
      sendDataWS({
        process: 'publication',
        type: 'delete',
        idpublicacion: idpublicacion
      });
      deletePublication(idpublicacion);
    }
  });

  // Cerrar menu de opciones
  $(this).parent("li.item-public-config").parent("ul.list-public-config").toggleClass('show-list'); 
});

function deletePublication(idpublicacion){
  $.ajax({
    url: 'controllers/publication.controller.php',
    type: 'GET',
    data: 'op=deletePublication&idpublicacion=' + idpublicacion,
    success: function(result){
      if(result == ""){
        $(`#data-publication .target-service[data-idpublicacion='${idpublicacion}']`).remove();
      }
    }
  });
}


/**
 * BLOQUEAR CONTENTEDITABLE
 */
// validar el Maximo de caracteres permitido
$("#data-publication").on("keypress", ".contenteditable", function(e){
  return disableLineBreaks($(this), e); 
});

// Bloquear el pegar contenido dentro del contenteditable, permitido solo texto plano
$("#data-publication").on("paste", ".contenteditable", function(e){
  e.preventDefault();
  var text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand("insertHTML", false, text);
});


/**
 * LISTAR PUBLICACIONES
 */
// Mostrar todas las publicaciones
function loadAllPublication(){
  return new Promise((resolve, reject) => {
    // Mostrar animación de carga
    $("#data-publication").append(getLoader());
  
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=listPublications',
      success: function(result){
        // Quitar animación de carga
        $("#data-publication").empty();
  
        // Crear publicaciones
        var idPosts = [];
        result.forEach(value => {
          let tmpTemplatePublic = templateComplete;
          for (key in value){
            tmpTemplatePublic = tmpTemplatePublic.replaceAll('{' + key + '}', value[key]);
          }  
  
          $("#data-publication").append(tmpTemplatePublic);
          $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
          $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
          $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
          $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();

          if(imageUserLogin != ""){
            $(`.img-user-login`).attr('src', 'dist/img/user/' + imageUserLogin);
          }
          
          idPosts.push(value.idpublicacion);   
        });

        resolve(idPosts);
      }
    });
  });
}

// Obtener archivos de cada publicación
function generateFilesByPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`.content-galeria[data-idpublicacion='${idpublicacion}']`).empty();

    $.ajax({
      url: 'controllers/gallery.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=getGalleriesByPublication&idpublicacion=' + idpublicacion,
      success: function(result){
        result.forEach(value => {
          let tmpImages = String(`<img src='dist/img/user/default_profile_avatar.svg' class='img-publication' data-idgaleria="{idgaleria}"/>`);
          let tmpVideo = templateContainerGallery;
  
          if(value.tipo == "F"){
            for (key in value){
              tmpImages = tmpImages.replaceAll('{' + key + '}', value[key]);
            }
    
            $(`.content-galeria[data-idpublicacion='${idpublicacion}']`).append(tmpImages);
            $(`.img-publication[data-idgaleria='${value.idgaleria}']`).attr('src', 'dist/img/user/' + value.archivo);
            
          } else {
            for (key in value){
              tmpVideo = tmpVideo.replaceAll('{' + key + '}', value[key]);
            }
  
            createPreviewVideo(`.content-galeria[data-idpublicacion='${idpublicacion}']`, value.archivo);
          }
        });

        resolve();
      }
    });
  });
}

// Mostrar comentarios
function showCommentsByPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`.content-comments[data-idpublicacion='${idpublicacion}']`).empty();
  
    $.ajax({
      url: 'controllers/comment.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=getCommentsByPublication&idpublicacion=' + idpublicacion,
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
          //$(container).scrollTop($(container).prop('scrollHeight') );   
          resolve();
        });
      }
    });
  });
}

// Total de comentarios por publicación
function countCommentsByPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`.count-comments[data-idpublicacion='${idpublicacion}']`).html(0);
  
    $.ajax({
      url: 'controllers/comment.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=countCommentsByPublication&idpublicacion=' + idpublicacion,
      success: function(result){
        $(`.count-comments[data-idpublicacion='${idpublicacion}']`).html(result[0].total);
        resolve();
      }
    });
  });
}

// Obtener calificación de publicación
function getScorePublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`.content-califications[data-idpublicacion='${idpublicacion}'] .califications`).empty();

    $.ajax({
      url: 'controllers/qualify.controller.php',
      type: 'GET',
      data: 'op=getScorePublication&idpublicacion=' + idpublicacion,
      dataType: 'JSON',
      success: function(res){
        let num = res[0].estrellas;
        let entero = parseInt(num.split('.')[0]);
        let decimal = parseFloat(num.split('.')[1]);

        if(decimal >= 50){
          entero += 1;
        } 
        
        let tmpTemplate = templateCalificationInner;
        let tmpMedium = String(`<i class="fas fa-star-half-alt"></i>`);
    
        for(let i = 0; i < entero; i++){
          $(`.content-califications[data-idpublicacion='${idpublicacion}'] .califications`).append(tmpTemplate);
        }
        
        if(decimal > 21 && decimal < 50){
          $(`.content-califications[data-idpublicacion='${idpublicacion}'] .califications`).append(tmpMedium);
        }

        resolve();
      }
    });
  });
}

// Obtenr cantidad de perasonas que calificarón una publicación
function countQualifyPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    $(`#data-publication .count-califications[data-idpublicacion='${idpublicacion}']`).empty();

    $.ajax({
      url: 'controllers/qualify.controller.php',
      type: 'GET',
      data: 'op=getTotalUsersReactedToAPost&idpublicacion=' + idpublicacion,
      dataType: 'JSON',
      success: function(res){
        let totalUser = res[0].usuarios;
        let text = "";

        if(totalUser < 2){
          text = "usuario";
        } else {
          text = "usuarios";
        }
        
        $(`#data-publication .count-califications[data-idpublicacion='${idpublicacion}']`).html('[' + totalUser + '] ' + text);
        resolve(); 
      }
    });
  });
}

async function promiseParallelScoreAndCountQualify(idpublicacion){
  try{
    await Promise.all([
      getScorePublication(idpublicacion),
      countQualifyPublication(idpublicacion)
    ]);
  } catch (error){
    console.error(error);
  }
}

/* ASYNC AWAIT - PROMISE */
// Ejecución de promesas en paralelo
async function promisePallelPostExecution(idPosts){
  try{
    idPosts.forEach(async (idpublicacion) => {
      // Ejecución en paralelo
      await Promise.all([
        generateFilesByPublication(idpublicacion),
        showCommentsByPublicationLimit(idpublicacion, 0),
        countCommentsByPublication(idpublicacion),
        myQualifyPublication(idpublicacion),
        promiseParallelScoreAndCountQualify(idpublicacion)
      ]);
    });
  } catch (error){
    console.error(error);
  }
}

// Cargar contenido de las publicacones
async function postLoadedByPromise(){
  try{
    continueFetchData = false;
    let idPosts = await loadAllPublication();
    await promisePallelPostExecution(idPosts);
  } catch (error){
    console.error(error);
  } finally {
    continueFetchData = true;
  }
}


/**
 * LISTAR PUBLICACIONES POR IDUSUARIO
 */

// Listar publicaciones por usuario
function loadPublicationByUser(idpublicacion, clear){
  return new Promise((resolve, reject) => {
    // Limpiar contenidos
    if(clear){
      $("#data-publication").empty();
    }

    // Mostrar animación de carga si aun no contiene
    if($("#data-publication").find(".container-loader").length < 1){
      $("#data-publication").append(getLoader());
    }

    // Consultar datos
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      data: {
        op: 'getPublicationsByUser',
        idusuarioactivo: idusuarioActivo,
        idpublicacion: idpublicacion
      },
      success: function(res){
        // Quitar animación de carga
        $("#data-publication div.container-loader").remove();

        // Comprobar si exiten datos 
        if(res == ""){
          $("#data-publication").append("<div class='container-loader mb-3'><a href='#' class='btn btn-outline-primary'>No existen más datos</a></div>");
        } else {
          // Convertir el jsonstring a JSON
          var json = JSON.parse(res);
    
          // Crear publicaciones
          var idPosts = [];
          json.forEach(value => {
            let tmpTemplatePublic = templateComplete;
            for (key in value){
              tmpTemplatePublic = tmpTemplatePublic.replaceAll('{' + key + '}', value[key]);
            }    
    
            $("#data-publication").append(tmpTemplatePublic);
            $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
            $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
            //$(`.content-califications[data-califications='${value.idpublicacion}']`).remove();
            $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
            $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();
            
            if(imageUserLogin != ""){
              $(`.img-user-login`).attr('src', 'dist/img/user/' + imageUserLogin);
            }

            idPosts.push(value.idpublicacion);  
          });
  
          resolve(idPosts);
        }        
      }
    });
  });
}

// Ejecutar promesa
async function promisePostLoadedByUser(idpublicacion, clear){
  try{
    continueFetchData = false;
    let idPosts = await loadPublicationByUser(idpublicacion, clear);
    await promisePallelPostExecution(idPosts);
  } catch( error){
    console.error(error);
  } finally {
    continueFetchData = true;
  }
}


/**
 * AUTOCOMPLETE SEARCH PUBLICATION
 */

// Autocompletado de texto
$("#search").autocomplete({
  source: function( request, response ) {
    let dataSend = {
      op: 'listPublicationsAutocomplete',
      titulo: request.term
    };

    // vista perfil
    if(getParamUrl("view") == "profile-view"){
      dataSend['op'] = 'listPublicationsAutocompleteByUser';
      dataSend['idusuarioactivo'] = idusuarioActivo;
    }

    $.ajax( {
      url: "controllers/publication.controller.php",
      dataType: "JSON",
      data: dataSend,
      success: function( data ) {
        response(data);
      }
    });
  },
  select: function( event, ui ) {
    searchPublication = ui.item.value;
    promiseLoadFilteredPublication({
      op            : 'listFilteredPublications',
      titulo        : searchPublication,
      idpublicacion : -1,
      clear         : true
    });
  },
  minLength: 1,   // Minimo de caracteres
  maxLength: 15   // Maximo de caracteres
});

// Evitar producir evento por defecto al hacer ENTER
$("#search").keypress(function(e){
  if(e.keyCode === 13){
    e.preventDefault();
    searchPublication = $(this).val();

    promiseLoadFilteredPublication({
      op            : 'listFilteredPublications',
      titulo        : searchPublication,
      idpublicacion : -1,
      clear         : true
    });
  }
});

// Resetear serach
$("#btn-reset-search").click(function(){
  $("#search").val(null).focus();
  searchPublication = "";

  // Continuar si los datos se cargarón completamente
  if(continueFetchData){
    if(getParamUrl('view') == 'profile-view' ){
      promisePostLoadedByUser(-1, true);
    }
    
    // Publicaciones
    if(getParamUrl('view') == 'publication-view' ){
      postLoadedByPromise();
    }
  }
});

// Boton ejecutar busqueda
$("#btn-search-public").click(function(){
  let titulo = $("#search").val().trim();

  if(titulo !== ""){
    promiseLoadFilteredPublication({
      op            : 'listFilteredPublications',
      titulo        : titulo,
      idpublicacion : -1,
      clear         : true
    });
  }
});

// Filtrados
function loadSearchPublications(data){
  return new Promise((resolve, reject) => {
    if(data.clear){
      $("#data-publication").empty();
    }

    // Mostrar animación de carga si aun no contiene
    if($("#data-publication").find(".container-loader").length < 1){
      $("#data-publication").append(getLoader());
    }
      
    // Consultar datos
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      data: {
        op            : data.op,
        titulo        : data.titulo,
        idusuario     : data.idusuario,
        idpublicacion : data.idpublicacion
      },
      success: function(result){
        // Quitar animación de carga
        $("#data-publication div.container-loader").remove();
        
        // No existen datos
        if(result == ""){
          // Validar si existen más registros mostrados
          if($("#data-publication").find(".target-service").length < 1){
            $("#data-publication").append("<div class='container-loader mb-3'><a href='#' class='btn btn-outline-danger'>No existen datos</a></div>");
          } else {
            $("#data-publication").append("<div class='container-loader mb-3'><a href='#' class='btn btn-outline-info'>No existen más datos</a></div>");
          }
          
          // Permitir traer más datos
          continueFetchData = true;
        } else {
          var json = JSON.parse(result);
    
          // Crear publicaciones
          var idPosts = [];
          json.forEach(value => {
            let tmpTemplatePublic = templateComplete;
            for (key in value){
              tmpTemplatePublic = tmpTemplatePublic.replaceAll('{' + key + '}', value[key]);
            }
    
    
            $("#data-publication").append(tmpTemplatePublic);
            $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
            $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
            $(`.content-califications[data-califications='${value.idpublicacion}']`).empty();
            $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
            $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();
            
            if(imageUserLogin != ""){
              $(`.img-user-login`).attr('src', 'dist/img/user/' + imageUserLogin);
            }
            
            idPosts.push(value.idpublicacion);  
          });
  
          resolve(idPosts);
        }  
      }
    });
  });
}

// Ejecutar datos filtrados
async function promiseLoadFilteredPublication(data){
  try{
    continueFetchData = false;
    let idPosts = await loadSearchPublications(data);
    await promisePallelPostExecution(idPosts);
  } catch (error){
    console.error(error);
  } finally {
    continueFetchData = true;
  }
};


/**
 * CARGAR PUBLICACIONES AL HACER SCROLL
 */
// Detectar scroll de la ventana
$(window).scroll(function(){
  // Escritorio  => deviceUsed.includes("Windows")
  // Movil       => deviceUsed.includes("Android") || deviceUsed.includes("Linux")

  // Pagina perfil
  if(isFinalWindowResponsive() && getParamUrl('view') == 'profile-view' ){
    if(continueFetchData){
      let divs = $(`#data-publication .target-service[data-idpublicacion]`);
      let attr = "data-idpublicacion";
      let values = getDataArrayByElements(divs, attr);
      let idpublicacion = values[values.length - 1]; // Ultimo id
      
      if(idpublicacion !== undefined){
        if(searchPublication == ""){
          promisePostLoadedByUser(idpublicacion, false);
        } else {
          promiseLoadFilteredPublication({
            op            : 'listFilteredPublicationByUser',
            titulo        : searchPublication,
            idusuario     : idusuarioActivo,
            idpublicacion : idpublicacion,
            clear         : false
          });          
        }
      }
    }
  }  

  // Pagina publicaciones
  if(isFinalWindowResponsive() && getParamUrl('view') == 'publication-view' ){
    if(continueFetchData){
      let divs = $(`#data-publication .target-service[data-idpublicacion]`);
      let attr = "data-idpublicacion";
      let values = getDataArrayByElements(divs, attr);
      let idpublicacion = values[values.length - 1]; // Ultimo id
      
      if(idpublicacion !== undefined){
        if(searchPublication == ""){
          postLoadedPromiseForLimit(idpublicacion);
        } else {
          promiseLoadFilteredPublication({
            op            : 'listFilteredPublications',
            titulo        : searchPublication,
            idpublicacion : idpublicacion,
            clear         : false
          });
        }
      }
    }
  }  
});


// Cargar más publicaciones
function loadAllPublicationLimit(idpublicacion){
  return new Promise((resolve, reject) => {
    // Mostrar animación de carga si aun no contiene
    if($("#data-publication").find(".container-loader").length < 1){
      $("#data-publication").append(getLoader());
    }
    
    // Consulta por ajax
    $.ajax({
      url: 'controllers/publication.controller.php',
      type: 'GET',
      data: {
        op              : 'listPublicationsLimit',
        idpublicacion   : idpublicacion
      },
      success: function(result){
        // Quitar animación de carga
        $("#data-publication div.container-loader").remove();
        
        // No existen datos
        if(result == ""){
          $("#data-publication").append("<div class='container-loader mb-3'><a href='#' class='btn btn-outline-primary'>No existen más datos</a></div>");
        } else {
          var json = JSON.parse(result);
    
          // Crear publicaciones
          var idPosts = [];
          json.forEach(value => {
            let tmpTemplatePublic = templateComplete;
            for (key in value){
              tmpTemplatePublic = tmpTemplatePublic.replaceAll('{' + key + '}', value[key]);
            }
    
    
            $("#data-publication").append(tmpTemplatePublic);
            $(`.img-user-public[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.fotoperfil);
            $(`.btn-show-config[data-idusuario='${idusuarioSession}']`).removeClass("d-none");
            $(`.content-galeria[data-idpublicacion='${value.idpublicacion}']`).empty();
            $(`.content-comments[data-idpublicacion='${value.idpublicacion}']`).empty();
            
            idPosts.push(value.idpublicacion);  
          });
  
          resolve(idPosts);
        }  
      },
      error: function(error){
        reject(error);
      }
    });
  });
}  

// Ejecutar promesa (traer mas al hacer scroll)
async function postLoadedPromiseForLimit(idpublicacion){
  try{
    // Evitar seguir consultando al servidor
    continueFetchData = false;  
    let idPosts = await loadAllPublicationLimit(idpublicacion);
    await promisePallelPostExecution(idPosts);
  } catch (error){
    console.error(error);
  } finally {
    // Permitir seguir consultando al servidor
    continueFetchData = true;
  }
}


/**
 * REDIREC PROFILE
 */
$("#data-publication").on('click', '.link-user', function(){
  let idusuario = $(this).attr("data-idusuario");
  let idpersona = $(this).attr("data-idpersona");

  localStorage.setItem("idusuarioActivo", idusuario);
  localStorage.setItem("idpersonaActivo", idpersona);
  window.location.href = "index.php?view=profile-view";
});


/**
 * EJECUTAR FUNCIONES - PARA LISTAR PUBLICACIÓN SEGUN LA VISTA
 */
// Perfil
if(getParamUrl('view') == 'profile-view' ){
  promisePostLoadedByUser(idpublicacion, true);
}

// Publicaciones
if(getParamUrl('view') == 'publication-view' ){
  postLoadedByPromise();
}
