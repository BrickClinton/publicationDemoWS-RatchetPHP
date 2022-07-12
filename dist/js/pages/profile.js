// VARIABLES GLOBALES
var idusuarioSession = localStorage.getItem("idusuarioSession");
var idusuarioActivo = localStorage.getItem("idusuarioActivo");
var idpersonaActivo = localStorage.getItem("idpersonaActivo");

idusuarioSession = idusuarioSession != null? idusuarioSession: -2;         // ID Usuario quien inicio sesión
idusuarioActivo = idusuarioActivo != null? idusuarioActivo: -1;            // ID Usuario perfil visitado
idpersonaActivo = idpersonaActivo != null? idpersonaActivo: -1;            // ID Usuario perfil visitado

// Plantilla album
var templateAlbum = String($("#container-album").html());
var templateGallerys = String($("#container-img-album").html());
var templateFollower = String($("#container-follower").html());
var optionImg;
var idprofile = 0;
var idport = 0;
var imageUserLogin = "";
var credentialType = "";


// validar usuario activo
if(idusuarioActivo != -1 && idusuarioActivo != idusuarioSession){
  disabledButtons();
} else {
  enabledButtons();
}


// Esta función desdabilita los botones de modificación o agregación
function disabledButtons(){
 // $("#container-add-publication").hide();  
  $(".create-publication").hide();  
  $(".opcciones-perfil").hide();  
  $(".cambiar-foto").hide();  
  $("#btn-edit-profile").hide();  
  $("#btn-follower").show();  
  $("#content-buttons-album").hide();  
}

// Esta función habilita los botones de modificación o agregación
function enabledButtons(){
  $(".create-publication").show();  
  $("#container-add-publication").show();
  $(".opcciones-perfil").show();  
  $(".cambiar-foto").show();  
  $("#btn-edit-profile").show();  
  $("#btn-follower").hide();  
  $("#content-buttons-album").show();  
}

// PROFILE Eliminar idusuario almacenado en el local storage
$(".btn-redirect-profile").click(function(){
  localStorage.removeItem("idusuarioActivo");
  localStorage.removeItem("idpersonaActivo");
  initWS();
});


/**
 * EDITAR PERFIL
 */
$("#btn-edit-profile").click(function(){
  $("#form-content-credentials")[0].reset(),
  $("#modal-edit-profile").modal('show');
});

// Abrir formulario para actualizar datos basicos
$("#btn-show-collapse-data").click(function(){
  // Cerrar modal security
  $("#collapse-buttons-security").collapse('hide');
  $("#collapse-credentials").collapse('hide');
  getAPersonLogin();
});

// Abrir formulario para actualizar datos privados
$("#btn-show-collapse-security").click(function(){
  // Cerrar modal datos
  $("#collapse-form-edit-profile").collapse('hide');
});

// Traer datos de una persona
function getAPersonLogin(){
  $.ajax({
    url: 'controllers/person.controller.php',
    type: 'GET',
    data: 'op=getAPersonLogin',
    dataType: 'JSON',
    success: function(res){
      let data = res[0];
      $("#eNombres").val(data.nombres);
      $("#eApellidos").val(data.apellidos);
      $("#eFechanac").val(data.fechanac);
      $("#eTelefono").val(data.telefono);
      $("#streetType").val(data.tipocalle);
      $("#streetName").val(data.nombrecalle);
      $("#streetNumber").val(data.numerocalle);
      $("#floorNumber").val(data.pisodepa);
    }

  });
}



/**
 * ACTUALIZAR DATOS PERSONALES
 */
$("#btn-update-dataperson").click(function(){
  var data = {
    nombres     : $("#eNombres").val(),
    apellidos   : $("#eApellidos").val(),
    fechanac    : $("#eFechanac").val(),
    telefono    : $("#eTelefono").val(),
    tipocalle   : $("#streetType").val(),
    nombrecalle : $("#streetName").val(),
    numerocalle : $("#streetNumber").val(),
    pisodepa    : $("#floorNumber").val()
  }

  if(data.nombres == "" || data.apellidos == "" || data.fechanac == "" || data.nombrecalle == ""){
    sweetAlertWarning("Datos invalidos", "Debe completar los datos");
  } else {
    sweetAlertConfirmQuestionSave("¿Está seguro de actualizar sus datos?").then((confirm) => {
      if(confirm.isConfirmed){
        data['op'] = 'updatePerson';
        updateDataPerson(data);
      }
    });
  }
});

function updateDataPerson(dataSend){
  $.ajax({
    url: 'controllers/person.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(res){
      if(res == ""){
        sendDataWS({
          process   : 'profile',
          type      : 'updateDataPerson'
        });
        getNameUser();
        $("#modal-edit-profile").modal('hide');
      }
    }
  });
}


/**
 * EDITAR
 */
// Botón edit correo
$("#btn-edit-email").click(function(){
  $("#form-content-credentials .container-password").addClass("d-none");
  $("#form-content-credentials .container-emails").removeClass("d-none");
  $("#btn-update-credential").removeClass("d-none");
  $("#btn-deleteUser").addClass("d-none");
  credentialType = "email";
  getAUserLogin();
});

// Botón edit contraseña
$("#btn-edit-password").click(function(){
  $("#form-content-credentials .container-emails").addClass("d-none");
  $("#form-content-credentials .container-password").removeClass("d-none");
  $("#btn-update-credential").removeClass("d-none");
  $("#btn-deleteUser").addClass("d-none");
  credentialType = "password";
});

// Botón eliminar cuenta
$("#btn-delete-user").click(function(){
  $("#form-content-credentials .container-emails").addClass("d-none");
  $("#form-content-credentials .container-password").addClass("d-none");
  $("#btn-update-credential").addClass("d-none");
  $("#btn-deleteUser").removeClass("d-none");
});

// Obtener datos del usuario
function getAUserLogin(){
  $.ajax({
    url:'controllers/user.controller.php',
    type: 'GET',
    data: 'op=getAUser&idusuarioactivo='+ idusuarioActivo,
    dataType: 'JSON',
    success: function(res){
      let data = res[0];
      $("#emailUserUpdate").val(data.email);
    }
  });
}

/**
 * ACTUALIZAR CORREO/CONTRASEÑA
 */
$("#btn-update-credential").click(function(){
  let email = $("#emailUserUpdate").val();
  let password = $("#passwordVerify").val();

  let password1 = $("#newPassword1").val();
  let password2 = $("#newPassword2").val();

  if(credentialType == "email"){
    if(email == "" || password == ""){
      sweetAlertWarning("Datos invalidos", "Complete sus datos");
    } else {
      sweetAlertConfirmQuestionSave("¿Está seguro de actualizar tu correo?").then((confirm) => {
        if(confirm.isConfirmed){          
          updateEmailUser(email, password);
        }
      });
    }
  } 
  else {
    if(password1 == "" || password2 == "" || password == ""){
      sweetAlertWarning("Datos invalidos", "Complete sus datos");
    } else {
      if(password1 != password2){
        sweetAlertWarning("Contraseña invalida", "Las contraseñas no son iguales");
      } else {
        sweetAlertConfirmQuestionSave("¿Está seguro de actualizar tu contraseña?").then((confirm) => {
          if(confirm.isConfirmed){
            updatePasswordUser(password, password1);
          }
        });
      }
    }
  }
});


// Actualizar correo
function updateEmailUser(email, password){
  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    data: {
      op      : 'updateEmailUser',
      email   : email,
      password: password
    },
    success: function(res){
      if(res != ""){
        sweetAlertError(res, "Vuelva a intentarlo");
      } else {
        getEmailUser();
        $("#modal-edit-profile").modal('hide');
      }
    }
  });
}

// Actualizar contraseña
function updatePasswordUser(password, newpassword){
  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    data: {
      op          : 'updatePasswordUser',
      password    : password,
      newpassword : newpassword
    },
    success: function(res){
      if(res != ""){
        sweetAlertError(res, "Vuelva a intentarlo");
      } else {
        $("#modal-edit-profile").modal('hide');
      }
    }
  });
}

/**
 * ELIMINAR CUENTA
 */
$("#btn-deleteUser").click(function(){
  let password = $("#passwordVerify").val();

  if(password == ""){
    sweetAlertWarning("No permitido", "Escriba su contraseña");
  } else {
    sweetAlertConfirmQuestionDelete("¿Está seguro de eliminar su cuenta?").then((confirm) => {
      if(confirm.isConfirmed){
        deleteAccountUser(password);
      }
    });
  }
});

function deleteAccountUser(password){
  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    data: 'op=deleteUser&password=' + password,
    success: function(res){
      if(res != ""){
        sweetAlertError(res, "Vuelva a intentarlo");
      } else {
        $("#modal-edit-profile").modal('hide');
        window.location.href = "controllers/user.controller.php?op=logout";
      }
    }
  });
}


/**
 * REDIREC PROFILE
 */
$("#container-follower").on('click', '.link-user', function(){
  let idusuario = $(this).attr("data-idusuario");
  let idpersona = $(this).attr("data-idpersona");

  localStorage.setItem("idusuarioActivo", idusuario);
  localStorage.setItem("idpersonaActivo", idpersona);
  window.location.href = "index.php?view=profile-view";
});

// Navegación - menu activo
$(".container-responsive .nav-pills .nav-item").click(function(){
  $(".container-responsive .nav-pills .nav-item").removeClass("active");
  $(this).addClass("active");
  let subtitle = $(this).attr("data-subtitle");

  if(subtitle == "follow"){
    $("#nav-follower").click();
  }

  if(subtitle == "publication"){
    $('#pills-home-tab a[href="#pills-home"]').tab('show')
  }

  if(subtitle == "gallery"){
    $("#container-img-album").empty();
    $(".container-images-album").addClass("d-none");
    $("#text-title-album").html("Fotos");
    getAlbumUser();
  }
});

// MENU ALBUM
$("#pills-gallery .nav .nav-link").click(function(){
  $("#pills-gallery .nav .nav-link").removeClass('active');
  $(this).addClass('active');
});

// Mostra todas las fotos
$(".item-photo").click(function(){
  $("#container-album").empty();
  $("#text-title-album").html("Fotos");
  getAllImagesByUser();
});

// Mostrar los albumes
$(".item-album").click(function(){
  $("#container-img-album").empty();
  $(".container-images-album").addClass("d-none");
  $("#text-title-album").html("Fotos");
  getAlbumUser();
});

// Obtener nombre del usuario (PERSONA)
function getNameUser(){
  $.ajax({
    url: 'controllers/person.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getAPerson&idpersonaactivo=' + idpersonaActivo,
    success: function(result){
      // Asignar nombres
      $("h5.name-user").html(result[0].nombres + " " + result[0].apellidos);
    }
  });
}

// Obtener gmail usuario (USUARIO)
function getEmailUser(){
  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getAUser&idusuarioactivo=' + idusuarioActivo,
    success: function(result){
      let email = result[0].email;
      let user = email.split('@');
      $(".email-user").html("@" + user[0]);
    }
  });
}

// Mostrar albumes del usuario
function getAlbumUser(){
  // Limpiar contenedor
  $("#container-album").empty();
  
  $.ajax({
    url: 'controllers/album.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getAlbumByUser&idusuarioactivo=' + idusuarioActivo,
    success: function(result){
      // Recorrer los registros
      result.forEach(value => {        
        if(value.nombrealbum == "Perfil"){
          idprofile = value.idalbum;
        } else if (value.nombrealbum == "Portada"){
          idport = value.idalbum;          
        }

        // Actualizar valores de los atributos
        let templateTmp = templateAlbum;        
        for (key in value ){
          templateTmp = templateTmp.replaceAll('{' + key + '}', value[key]);
        }

        // Asignar al contenedor
        $("#container-album").append(templateTmp);
        $(`#${value.idalbum}`).attr('data-code', JSON.stringify(value.idusuario));
        $(`#${value.idalbum}`).attr('data-namealbum', JSON.stringify(value.nombrealbum));

        // Mostrar boton de ellipsis
        if(value.nombrealbum != "Perfil" && value.nombrealbum != "Portada"&& value.nombrealbum != "Publicaciones"){
          $(`.btn-show[data-name-album='${value.nombrealbum}']`).removeClass("d-none");
        } 
        
        if(idusuarioSession != value.idusuario){
          $(`.btn-show[data-idusuario='${value.idusuario}']`).hide();
        }

        $(`.img-album[data-idalbum='${value.idalbum}']`).attr("src", "dist/img/user/" + value.archivo)
      });
    }
  });
}

// Mostrar imagen de perfil
function getImageProfile(){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getProfilePicture&idusuarioactivo=' + idusuarioActivo,
    success: function(result){
      $("#profile-img").attr('src', 'dist/img/user/' + result[0].archivo)
    }
  });
}

// Mostrar imagen de perfil
function getImagePort(){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getPortPicture&idusuarioactivo=' + idusuarioActivo,
    success: function(result){
      $("#port-img").attr('src', 'dist/img/user/' + result[0].archivo)
    }
  });
}

// Mostrar todas las imagenes del usuario
function getAllImagesByUser(){
  $("#container-img-album").empty(); // Limpiar contenidos

  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getGalleriesByUser&idusuarioactivo=' + idusuarioActivo,
    success: function(result){
      result.forEach(value => {
        let templateGalleryTmp = templateGallerys;
        for (key in value){
          templateGalleryTmp = templateGalleryTmp.replaceAll('{' + key + '}', value[key]);
        }

        $("#container-img-album").append(templateGalleryTmp);
        $(`#${value.idgaleria}`).attr('src', 'dist/img/user/' + value.archivo);

        if(idusuarioSession != value.idusuario){
          $(`.btn-show[data-idusuario='${value.idusuario}']`).hide();
        }

      });
    }
  });
}

// IMAGEN USUARIO LOGIN
function getImageProfileLogin(){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/gallery.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=getProfilePicture',
      success: function(result){
        $(".img-user-login").attr('src', 'dist/img/user/' + result[0].archivo);

        imageUserLogin = result[0].archivo;
        resolve(result[0].archivo);
      }
    });
  });
}

// Opción para subir imagen PERFIL/PORTADA
$(".upload-img-profile").click(function(){
  optionImg = $(this).attr('data-option-img');
  $("#container-image-profile .image-new").remove(); // Eliminar la previsualización actual
  $("#form-image-profile")[0].reset();
  $("#modal-images-profile").modal('show');
});

// Ejecutar la carga de imagen PERFIL
$("#btn-load-image-profile").click(function () {
  $("#input-load-image-profile").click();
});

// cargar imagenes
$("#input-load-image-profile").change(function (e) {
  let supportedImages = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  let file = this.files[0];   

  // Obtener el tamaño del archivo subido
  let sizeByte = file.size;
  let sizeKilobyte = parseInt(sizeByte / 1024);

  // Validar si son imagenes permitidos (-1 no se encontro el elemento)
  if (supportedImages.indexOf(file.type) == -1) {
    let index = file.type.indexOf('/');
    let ext = file.type.substr(index + 1);	
    sweetAlertWarning("Archivo " + ext.toUpperCase() + " no permitido", "Permitidos: jpeg, jpg, png, gif");
  } else {                    
    createAPreviewImage("#container-image-profile", file);      // Crear previsualización
  }
});

// Eliminar previsualización de la imagen
$(document).on("click", "#container-image-profile .image-new figure figcaption i", function () {
  // limpiar todo el formulario de imagen
  $(this).parent("figcaption").parent("figure").parent(".image-new").remove();
  $("#form-image-profile")[0].reset();
});

// Actualizar imagen de perfil
function updateImgProfile(dataSend){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'POST',
    data: dataSend,
    contentType: false,
    processData: false,
    cache: false,
    success: function(result){
      $("#container-image-profile").remove();
      $("#modal-images-profile").modal('hide');

      if(dataSend.get("nombrealbum") == "perfil"){
        getImageProfile();
        getAllImagesForAlbum(idprofile);
        sendDataWS({
          process : 'profile',
          type    : 'updateImgProfile',
          idalbum: idprofile
        });
      } else {
        getImagePort();
        getAllImagesForAlbum(idport);
        sendDataWS({
          process : 'profile',
          type    : 'updateImgPort',
          idalbum: idport
        });
      }

      getAlbumUser();
    }
  });
}

// Actualizar foto
$("#btn-saveimg-profile").click(function(){
  let image = $("#input-load-image-profile")[0].files[0];

  sweetAlertConfirmQuestionSave("¿Está seguro de actualizar su foto?").then(confirm => {
    if(confirm.isConfirmed){
      let formData = new FormData();
      formData.append("op", "registerPortProfileImg");
      formData.append("nombrealbum", optionImg);
      formData.append("archivo", image);
    
      updateImgProfile(formData);
    }
  });

});

// Mostrar contenido del album
$(document).on('click', '#container-album .album .img-album', function(){
  let idalbum = $(this).parent(".card-body").parent(".album").attr('id');
  let nombrealbum = $(this).parent(".card-body").parent(".album").attr('data-namealbum');

  $("#container-album").empty();
  $(".container-images-album").removeClass("d-none");
  $("#text-title-album").html(JSON.parse(nombrealbum));

  // Listar imagenes del album
  getAllImagesForAlbum(idalbum);
});

// Listar fotos por idalbum
function getAllImagesForAlbum(idalbum){
  $("#container-img-album").empty();

  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    dataType: 'JSON',
    data: 'op=getGalleriesByAlbum&idalbum=' + idalbum,
    success: function(result){
      result.forEach(value => {

        let templateGalleryTmp = templateGallerys;
        for (key in value){
          templateGalleryTmp = templateGalleryTmp.replaceAll('{' + key + '}', value[key]);
        }

        $("#container-img-album").append(templateGalleryTmp);
        $(`#${value.idgaleria}`).attr('src', 'dist/img/user/' + value.archivo);
        if(idusuarioSession != value.idusuario){
          $(`.btn-show[data-idusuario='${value.idusuario}']`).hide();
        }

      });
    }
  });
}

// Mostrar imagenes
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox({
    resizeDuration: 200,
    wrapAround: true,
    fitImagesInViewport: true,
    fadeDuration: 600,
    showImageNumberLabel: true,
    alwaysShowNavOnTouchDevices: true,
    maxWidth: 860,
    maxHeight: 560,
    alwaysShowClose: true
  });
});

// Mostrar opciones ALBUM
$("#container-album").on("click", ".btn-show", function(){
  let idalbum = $(this).next(".list-options").attr("data-option-value");
  var divs = $(".list-options").toArray();

  // Obteniendo los IDs de albumes
  let valAttributes = getDataArrayByElements(".list-options", "data-option-value");
  for (let i = 0; i < valAttributes.length; i++){
    if(valAttributes[i] !== idalbum){
      divs[i].classList.add("d-none")
    }
  }

  $(this).next(".list-options").toggleClass("d-none");
});

// Mostrar opciones GALERIAS
$("#container-img-album").on("click", ".btn-show", function(){
  let idgaleria = $(this).next(".list-options").attr("data-option-value");
  var divs = $(".list-options").toArray();

  // Obteniendo los IDs de galerias
  let valAttributes = getDataArrayByElements(".list-options", "data-option-value");
  for (let i = 0; i < valAttributes.length; i++){
    if(valAttributes[i] !== idgaleria){
      divs[i].classList.add("d-none")
    }
  }

  $(this).next(".list-options").toggleClass("d-none");
});

// menu de opciones IMAGENES
$("#container-img-album").on("click", ".item-option", function(){
  $(".list-options").addClass("d-none");
  let idgaleria = $(this).attr("data-idgaleria");
  let idalbum = $(this).attr("data-idalbum");
  let archivo = $(this).attr("data-archivo");
  let option = $(this).attr("data-option");
  let operation = "";

  switch(option){
    case "eye":
      operation = "visualizar";
      break;
    case "delete":
      operation = "eliminar";
      sweetAlertConfirmQuestionDelete("¿Está seguro de eliminar la imagen?").then(confirm => {
        if(confirm.isConfirmed){
          deleteImageAlbum(archivo, idgaleria, idalbum);
        }
      });
      break;
    case "profile":
      operation = "perfil";
      sweetAlertConfirmQuestionSave("¿Está seguro de actualizar su " + operation + " ?").then(confirm => {
        if(confirm.isConfirmed){
          sendDataWS({
            process   : 'profile',
            type      : 'selectImgProfile',
            operation : operation,
            idalbum   : idprofile,
            idgaleria : idgaleria
          });
          selectImageProfile(operation, idgaleria, idprofile);
        }
      });
      break;
    case "port":
      operation = "portada";
      sweetAlertConfirmQuestionSave("¿Está seguro de actualizar su " + operation + " ?").then(confirm => {
        if(confirm.isConfirmed){
          sendDataWS({
            process   : 'profile',
            type      : 'selectImgPort',
            operation : operation,
            idalbum   : idport,
            idgaleria : idgaleria
          });
          selectImageProfile(operation, idgaleria, idport);
        }
      });
      break;
    default:
     console.log("error"); 
     break;
  }

});

// Seleccionar imagen como perfil
function selectImageProfile(operation, idgaleria, idalbum){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    data: {   
      op       : "updateGallery",
      idgaleria: idgaleria,
      idalbum  : idalbum
    },
    success: function(result){
      if(result == ""){
        if(operation == "perfil"){
          getAllImagesForAlbum(idport);
        } else if( operation == "portada"){
          getAllImagesForAlbum(idprofile);
        }

        getImageProfile();
        getImagePort();
      }
    }
  });
}

// Eliminar imagen
function deleteImageAlbum(archivo, idgaleria, idalbum){
  $.ajax({
    url: 'controllers/gallery.controller.php',
    type: 'GET',
    data: {   
      op       : "deleteGallery",
      idgaleria: idgaleria,
      archivo  : archivo
    },
    success: function(result){
      if(result == ""){
        getAllImagesForAlbum(idalbum);
      }
    }
  });
}


// Ejecutar funciones
getNameUser();
getEmailUser();
getImageProfileLogin();
getImageProfile();
getImagePort();
getAllImagesByUser();
