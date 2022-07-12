
var uploadImagesAlbum = [];
var idalbum = -1;
var uploadedImages = [];                                                   // Almacenar todos las imagenes subidos (Temporales)
var imagesTemp  = [];                                                      // Almacenar ímagenes traidos del servidor
var videoTemp  = [];                                                       // Almacenar video traido del servidor
var deletedFiles = [];                                                     // Almacena archivos eliminados (ID GALERIA)


/**
 * ALTERNAR ENTRE LA INTERFAZ DE CARGA DE IMAGENES O VIDEO
 */
// MOSTRAR CONTENIDO DE CARGAR IMAGENES
$("#btn-image").click(function () {
  let totalVideo = $(".new-video").toArray().length;  // video traido del servidor

  if($("#input-new-video").val() == '' && totalVideo == 0){
    changeInterfaceToImages(true);
  }
  else{
    sweetAlertConfirmQuestionSave("¿Si cambias de opcion se borrara el video?").then((confirm) => {
      if(confirm.isConfirmed){
        deleteVideoPreview();
        changeInterfaceToImages(true);
      }
    });
  }
});

// MOSTRAR CONTENIDO DE CARGAR VIDEO
$("#btn-video").click(function () {
  // validar si existen datos subidos
  if(uploadedImages.length == 0 && imagesTemp.length == 0){
    changeInterfaceToImages(false);
  }
  else{
    sweetAlertConfirmQuestionSave("¿Si cambias de opcion se borraran las imagenes?").then((confirm) => {
      if(confirm.isConfirmed){
        deleteAllImagespreview();
        changeInterfaceToImages(false);
      }
    });
  }
});

// Cambiar de interfaz, carga de (imagenes o video)
function changeInterfaceToImages(isImages){
  if(isImages){
    if ($("#container-video").is(':visible')) $("#container-video").hide();
    $("#container-images").show('slow');
    $("#title-options").html("Imagenes");
    $("#btn-add-file span").html("Cargar imagenes");
    isLoadImages = true;
  }
  else{
    if ($("#container-images").is(':visible')) $("#container-images").hide();
    $("#container-video").show('slow');
    $("#title-options").html("Video");
    $("#btn-add-file span").html("Cargar video");
    isLoadImages = false;
  }
}


/**
 * ALTERNAR ENTRE IMAGENES O VIDEO (Cargar y eliminar)
 */
// Llamar al evento change
$("#btn-add-file").click(function () {

  $("#form-upload-file")[0].reset(); // Limpiar formulario de los input file

  if(isLoadImages){
    $("#input-new-image").click();
  } else {
    $("#input-new-video").click();
  }
});

// Eliminar imagenes o video (todos)
$("#btn-delete-files").click(function(){
  if(isLoadImages){
    sweetAlertConfirmQuestionDelete("¿Estas seguro de borrar todas las imagenes?").then(confirm => {
      if(confirm.isConfirmed){
        deleteAllImagespreview();      
      }
    });
  } else {
    sweetAlertConfirmQuestionDelete("¿Estas seguro de borrar el video?").then(confirm => {
      if(confirm.isConfirmed){    
        deleteVideoPreview();
      }
    });
  }

});


/**
 * CARGAR IMAGENES PREVIAS EN EL MODAL PUBLICACIÓN
 */

// Ejecutar el evento change de imagenes
$("#input-new-image").change(function(e){
  let supportedImages = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  let totalImgPreview = $(".image-new").toArray().length;
  let max = $(this).attr('max');  // Maximo de imagenes permnitidos
  let files = this.files;         // Archivos cargados
  let arrayTmp = [];

  // validar que no exceda el maximo permitido
  if (files.length > max || totalImgPreview >= max) {
    sweetAlertInformation(max + " Imagenes como maximo", "Se excedio el maximo de archivo permitido");
  } else {
    if(uploadedImages.length < max){
      arrayTmp = getFileArraySupported(files, supportedImages);
  
      // Existe imagenes permitidas
      if(arrayTmp.length > 0){
        arrayTmp.forEach(file => {
          uploadedImages.push(file);
          createPreviewImages("#container-images", file);
        });

        // si existe imagenes mostrar botón de eliminación
        if(uploadedImages.length > 0 || totalImgPreview > 0){
          $("#btn-delete-files").removeClass("d-none");
        }
      }

    } else {
      sweetAlertInformation(max + " Imagenes como maximo", "Se excedio el maximo de archivo permitido");
    }
  }

  // Condición para impedir subir imagenes
  if(uploadedImages.length == max || totalImgPreview == max){
    $("#btn-add-file").prop('disabled', true);
  }

});

// Eliminar previsualización del modal publicaciones
$("#container-images").on("click", ".image-new figure figcaption i", function () {
  // Remover la imagen previa 
  $(this).parent("figcaption").parent("figure").parent(".image-new").remove();
  let image = $(this).parent("figcaption").parent("figure").parent(".image-new").attr("data-img");
  let idimage = $(this).parent("figcaption").parent("figure").parent(".image-new").attr("data-code");
  let totalImgPreview = $("#container-images").children(".image-new").toArray().length;

  // Comprobar si son datos por modificar
  if(idimage != undefined){
    deletedFiles.push(idimage);
  }

  // Eliminar la imagen del arreglo de tipo object
  removeItemFromArrayObject(uploadedImages, image);

  // Ocultar botón de eliminación
  if (uploadedImages.length == 0 && totalImgPreview == 0) {
    $("#btn-delete-files").addClass("d-none");   
  } // Mostrar boton para subir imagen
  else if(uploadedImages.length >= 0 && totalImgPreview >= 0) {
    $("#btn-add-file").prop('disabled', false); 
  }
});

// Eliminar todas las imagenes previsualizadas
function deleteAllImagespreview(){
  $("#container-images").children(".image-new").remove();
  uploadedImages = [];
  deletedFiles = imagesTemp;     // Pasar datos al nuevo array
  imagesTemp = [];               //almacenar los IDs IMAGENES (Traidos del servidor)
  changeInterfaceToOnLoad(true);
}

/**
 * CARGAR IMAGENES EN EL MODAL - GALERIA
 */
// Abrir modal para cargar imagenes
$("#btn-add-files").click(function(){
  $("#content-images-preview").children(".image-new").remove();
  $("#btn-remove-files-album").addClass("d-none");
  $("#form-option-add-gallery")[0].reset();
  uploadImagesAlbum = [];
});

// Ejecutar el evento de carga
$("#btn-add-files-album").click(function(){
  $("#add-image-galery").click();
});

// Ejecutar evento change - cargar imagenes
$("#add-image-galery").change(function(e){
  let supportedImages = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  let totalImgPreview = $(".image-new").toArray().length;
  let max = $(this).attr('max');  // Maximo de imagenes permnitidos
  let files = this.files;         // Archivos cargados
  let arrayTmp = [];

  // validar que no exceda el maximo permitido
  if (files.length > max || totalImgPreview >= max) {
    sweetAlertInformation(max +" Imagenes como maximo", "Se excedio el maximo de archivo permitido");
  } else {
    if(uploadImagesAlbum.length < max){
      arrayTmp = getFileArraySupported(files, supportedImages);
  
      // Existe imagenes permitidas
      if(arrayTmp.length > 0){
        arrayTmp.forEach(file => {
          uploadImagesAlbum.push(file);
          createPreviewImages("#content-images-preview", file);
        });

        // si existe imagenes mostrar botón de eliminación
        if(uploadImagesAlbum.length > 0 || totalImgPreview > 0){
          $("#btn-remove-files-album").removeClass("d-none");
        }
      }

    } else {
      sweetAlertInformation(max + " Imagenes como maximo", "Se excedio el maximo de archivo permitido");
    }
  }

  // Condición para impedir subir imagenes
  if(uploadImagesAlbum.length == max || totalImgPreview == max){
    $("#btn-add-files-album").prop('disabled', true);
  }

});

// Eliminar de forma individual
$("#content-images-preview").on("click", ".image-new figure figcaption i", function(){
  // Remover la imagen previa 
  $(this).parent("figcaption").parent("figure").parent(".image-new").remove();
  let image = $(this).parent("figcaption").parent("figure").parent(".image-new").attr("data-img");
  let totalImgPreview = $("#content-images-preview").children(".image-new").toArray().length;

  // Eliminar la imagen del arreglo de tipo object
  removeItemFromArrayObject(uploadImagesAlbum, image);

  // Ocultar botón de eliminación
  if (uploadImagesAlbum.length == 0 && totalImgPreview == 0) {
    $("#btn-remove-files-album").addClass("d-none");
  } // Mostrar boton para subir imagen
  else if(uploadImagesAlbum.length >= 0 && totalImgPreview >= 0) {
    $("#btn-add-files-album").prop('disabled', false);
  }
});

// Eliminar todas las fotos
$("#btn-remove-files-album").click(function(){  
  sweetAlertConfirmQuestionDelete("Está seguro de eliminar todas las imágenes?").then((confirm) => {
    if(confirm.isConfirmed){
      $("#content-images-preview").children(".image-new").remove();
      $("#btn-add-files-album").prop('disabled', false);
      uploadImagesAlbum = [];
      $(this).addClass("d-none");
    }
  });
});


/**
 * CARGAR VIDEO EN EL MODAL PUBLICACIONES
 */
// Evento change para subir video
$("#input-new-video").change(function (event) {
  let videoSrc = document.querySelector("#video-source");
  let supportedVideo = ["video/mp4"];

  // Ocultar video traido del servidor
  $("#container-progress-load-video").removeClass("d-none");          // Mostrar progreso de carga del video
  $("#video-tag").removeClass("d-none");                              // Mostrar previsualizador por defecto
  clearContainer("#preview-video-server");                            // eliminar previsualizador de video (traido del servidor)

  // Obtener el tamaño del archivo subido
  let sizeByte = event.target.files[0].size;
  let sizeKilobyte = parseInt(sizeByte / 1024);
  let sizeMegabyte = parseInt(sizeKilobyte / 1024);

  // Valor del atributo size (Maximo en MB permitido)
  let valueSize = $(this).attr("size");

  // Iniciar en 0 el progressbar
  let percentLoad = 0;
  $("#label-video-size").html('0 MB');
  $(".progress .progress-bar").html('0 %');
  $(".progress .progress-bar").addClass("progress-bar-animated").addClass("progress-bar-striped");

  let fileVideo = this.files[0]; 
  
  // Validar archivo
  if(supportedVideo.indexOf(fileVideo.type) == -1){
    sweetAlertWarning("Archivo no permitido", "Permitido: mp4");
  }
  else{
    // Validar tamaño del archivo
    if (valueSize < sizeMegabyte) {
      sweetAlertWarning("Supera el tamaño maximo permitido ", " (" + valueSize + " MB)");
    } else {
      // es aceptable
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();      // instancia Objeto reader
        var file = event.target.files[0];   // leer el video subido
  
        // cargar contenido
        reader.onload = function (e) {
          videoSrc.src = e.target.result
          videoSrc.parentElement.load()
        }.bind(this)
  
        // Leer el contenido de file
        reader.readAsDataURL(file);
  
        // progreso de carga
        reader.onprogress = function (e) {
          percentLoad = Number.parseInt(e.loaded * 100 / e.total); // calculando porcentaje
          $(".progress .progress-bar").html('Cargando...' + percentLoad + ' %');
          $(".progress .progress-bar").css('width', percentLoad + '%');
        }
  
        // carga completa
        reader.onloadend = function (e) {
          $("#label-video-size").html(sizeMegabyte + ' MB');
          $(".progress .progress-bar").html('Carga completa ' + percentLoad + ' %');
          $(".progress .progress-bar").removeClass("progress-bar-animated").removeClass("progress-bar-striped");
  
          $("#btn-add-file").prop('disabled', true);
          $("#btn-delete-files").removeClass("d-none");
        }
      }
    }
  }

});

// Eliminar video
function deleteVideoPreview(){
  deletedFiles = videoTemp;     // Pasar datos al nuevo array
  videoTemp = [];               // resetear
  
  let videoSrc = document.querySelector("#video-source");
  videoSrc.src = '';
  videoSrc.parentElement.load();
  
  $("#container-progress-load-video").addClass("d-none");             // ocultar barra de progreso
  $("#video-tag").addClass("d-none");                                 // ocultar previsualizador por defecto
  clearContainer("#preview-video-server");                            // eliminar previsualizador (traido del servidor)

  $("#form-upload-file")[0].reset();
  $("#label-video-size").html('0 MB');
  $(".progress .progress-bar").html('0 %');
  $(".progress .progress-bar").css('width', 0 + '%');
  changeInterfaceToOnLoad(true);
}

// Habilitar los botones (Agregar o Eliminar)
function changeInterfaceToOnLoad(isLoad){
  if(isLoad){
    $("#btn-delete-files").addClass("d-none");
    $("#btn-add-file").prop('disabled', false);    
  }
  else{
    $("#btn-delete-files").removeClass("d-none");
    $("#btn-add-file").prop('disabled', true);    
  }
}


/**
 * CREAR ALBUM
 */
// Abrir modal
$("#btn-register-album").click(function(){
  $("#btn-update-album").addClass("d-none");
  $("#btn-save-album").removeClass("d-none");
  $("#nameAlbum").val('');
  $("#nameAlbum").focus();
  $("#modal-create-album").modal('show');
});

// Registrar
$("#btn-save-album").click(function(){
  let nombrealbum = $("#nameAlbum").val();

  if(nombrealbum == ""){
    $("#nameAlbum").addClass("invalid");
    sweetAlertWarning("Invalido", "Complete el nombre del album");
  } else {
    sweetAlertConfirmQuestionSave("¿Está seguro de crear el album?").then((confirm) => {
      if(confirm.isConfirmed){
        createAlbum(nombrealbum);
      }
    });
  }
});

// Crear album
function createAlbum(nombrealbum){
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    data: 'op=registerAlbum&nombrealbum=' + nombrealbum,
    success: function(res){
      if(res == ""){
        listAlbumesControlSelect();
        $("#nameAlbum").val('');
        $("#modal-create-album").modal('hide');
      }
    }
  });
}

// Listar albumes
function listAlbumesControlSelect(){
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    data: 'op=getSelectAlbumsByUser',
    success: function(res){
      $("#album").html(res);
    }
  });
}

// Listar albumes en el control select -registrar imagenes
listAlbumesControlSelect();


/** 
 * MENU DE OPCIONES ALBUM
 */
$("#container-album").on("click", ".item-option", function(){
  $(".list-options").addClass("d-none");
  idalbum = $(this).attr("data-idalbum");
  let option = $(this).attr("data-option");

  switch(option){
    case "edit":
      getAnAlbum(idalbum);
      break;
    case "delete":
      sweetAlertConfirmQuestionDelete("¿Está seguro de eliminar el album?").then((confirm) => {
        if(confirm.isConfirmed){
          deleteAlbum(idalbum);
        }
      });
      break;
    default:
      console.log("default")
  }
});

// Obtener un registro
function getAnAlbum(idalbum){
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    data: 'op=getAnAlbum&idalbum='+ idalbum,
    dataType: 'JSON',
    success: function(res){
      idalbum = res[0].idalbum;
      $("#nameAlbum").val(res[0].nombrealbum);
      $("#btn-save-album").addClass("d-none");
      $("#btn-update-album").removeClass("d-none");
      $("#modal-create-album").modal('show');
    }
  });
}


/** 
 * ACTUALIZAR ALBUM
 */
 $("#btn-update-album").click(function(){
  let nombrealbum = $("#nameAlbum").val();

  if(nombrealbum == "" || idalbum == -1){
    sweetAlertWarning("Datos invalidos", "Por favor escriba el nombre");
  } else {
    sweetAlertConfirmQuestionSave("¿Está seguro de actualizar el nombre del album?").then((confirm) => {
      if(confirm.isConfirmed){
        updateAlbum(idalbum, nombrealbum);
      }
    });
  }
 });

function updateAlbum(idalbum, nombrealbum){
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    data: {
      op: 'updateAlbum',
      idalbum: idalbum,
      nombrealbum: nombrealbum
    },
    success: function(res){
      let status = res.includes('Duplicate');
      if(status){
        sweetAlertInformation("Nombre duplicado", "Ya existe un album con este nombre");
      }

      if(res == ""){
        getAlbumUser();
      }

      $("#modal-create-album").modal('hide');
    }
  });
}

/**
 * ELIMINAR ALBUM
 */
function deleteAlbum(idalbum){
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    data: {
      op: 'deleteAlbum',
      idalbum: idalbum
    },
    success: function(res){
      if(res == ""){
        getAlbumUser();
      }
    }
  });
}


/**
 * REGISTRAR IMAGENES DENTRO DE ALBUM
 */
$("#btn-add-gal-md").click(function(){
  let len = uploadImagesAlbum.length;
  let idalbum = $("#album").val();

  if(len == 0 || idalbum == ""){
    sweetAlertWarning("Datos Invalidos", "Por favor complete los datos");
  } else {
    sweetAlertConfirmQuestionSave("¿Está seguro de guardar las imagenes?").then((confirm) => {
      if(confirm.isConfirmed){
        let formData = new FormData();
        formData.append("op", "registerSeveralImages");
        formData.append("idalbum", idalbum);

        // Cargar las imagenes al array images[]
        for(let i = 0; i < uploadImagesAlbum.length; i++){
          formData.append("images[]", uploadImagesAlbum[i]);
        }

        registerImagesAlbum(formData);
      }
    });
  }
});

// Registrar imagenes
function registerImagesAlbum(formData){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    cache: false,
    success: function(res){
      if(res == "success"){
        $("#modal-add-files").modal('hide');
        getAlbumUser();
      }
    }
  });
}