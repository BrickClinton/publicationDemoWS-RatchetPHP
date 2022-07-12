var Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

function login() {
  let email = $("#email").val();
  let password = $("#password").val();
  let remember = $("#remember-account").prop("checked") ? true: false;

  if (email == "" || password == "") {
    toastr.error("Los datos están incompletos");
  } else {
    $.ajax({
      url: 'controllers/user.controller.php',
      type: 'GET',
      data: {
        op      : 'login',
        email   : email,
        password: password
      },
      success: function (result) {
        if(result == "error"){
          toastr.error("Esta cuenta no exite");          
        } else if(result == "no access") {
          toastr.warning("Contraseña incorrecta");
        } else {
          localStorage.removeItem("idusuarioActivo");
          localStorage.removeItem("idpersonaActivo");
          $("#modal-login").modal('hide');
          window.location.reload();
        }
      }
    });
  }
}

// Mostrar o ocultar password
$("#btn-see-password").click(function(){
  if($(this).attr('data-type') == 'text'){
    showTextInput(this);
    $(this).attr('data-type', 'password');
  } else {
    hideTextInput(this);
    $(this).attr('data-type', 'text');
  }
});

function showTextInput(element){
  $(element).children('i').removeClass('fa-eye').addClass('fa-eye-slash');
  $(element).parent('div').prev('#password').attr('type', 'text'); 
}

function hideTextInput(element){
  $(element).children('i').removeClass('fa-eye-slash').addClass('fa-eye');
  $(element).parent('div').prev('#password').attr('type', 'password');
}

// Ejecutar el evento click login
$("#password").keyup(function(e){
  if(e.keyCode == 13){
    $("#btn-login").click();
  }
});

$("#btn-login").click(login);

// Registrar usuario
function registerUser(dataSend){
  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(result){
      console.log(result)
    }
  });
}

// Ubigeo
function getDepartments(){
  $.ajax({
    url: 'controllers/ubigeo.controller.php',
    type: 'GET',
    data: 'op=getDepartments',
    success: function(result){
      $("#department").html(result);
    }
  });
}

function getProvinces(iddepartamento){
  $.ajax({
    url: 'controllers/ubigeo.controller.php',
    type: 'GET',
    data: 'op=getProvinces&iddepartamento=' + iddepartamento,
    success: function(result){
      $("#province").html(result);
    }
  });
}

$("#department").change(function(){
  getProvinces($(this).val());
});

function getDistricts(idprovincia){
  $.ajax({
    url: 'controllers/ubigeo.controller.php',
    type: 'GET',
    data: 'op=getDistricts&idprovincia=' + idprovincia,
    success: function(result){
      $("#district").html(result);
    }
  });
}

$("#province").change(function(){
  getDistricts($(this).val());
});

// Obtener datos del formulario
function getDataFormUser(){
  let data = {
    nombres     : $("#firstname").val(),
    apellidos   : $("#lastname").val(),
    fechanac    : $("#birthdate").val(),
    telefono    : $("#phone").val(),
    iddistrito  : $("#district").val(),
    tipocalle   : $("#streetType").val(),
    nombrecalle : $("#streetName").val(),
    numerocalle : $("#streetNumber").val(),
    pisodepa    : $("#floorNumber").val(),
    email       : $("#emailUser").val(),
    tipoemail   : $("#emailType").val(),
    clave1      : $("#password1").val(),
    clave2      : $("#password2").val()
  }

  return data;
}

// Validar campos obligatorios
function dataFormIsEmpty(){
  let data = getDataFormUser();
  return data.apellidos == "" || data.nombres == "" || data.fechanac == "" || data.iddistrito == "" || data.nombrecalle == "" || data.email == ""  || data.clave1 == "" || data.clave2 == "";
}

// Registrar
function registerUser(){
  let dataSend = getDataFormUser();

  // Actualizar datos del array asociativo
  dataSend['op'] = 'registerUser';
  dataSend['email'] = dataSend.email + dataSend.tipoemail;
  dataSend['clave'] = dataSend.clave1;

  $.ajax({
    url: 'controllers/user.controller.php',
    type: 'GET',
    data: dataSend,
    success: function(result){
      if(result == ""){
        $("#form-register-user")[0].reset();
        $("#modal-register").modal('hide');
      }
    }
  });
}

$("#btn-register-user").click(function(){
  if(dataFormIsEmpty()){
    sweetAlertWarning("Datos invalido", "Por favor complete todo sus datos");
  } else {

    let dataSend = getDataFormUser();

    // Comprobar claves
    if(dataSend.clave1 != dataSend.clave2){
      sweetAlertWarning("Clave invalido", "Las claves no son iguales");
    } else {
      sweetAlertConfirmQuestionSave("¿Estás seguro de crear su cuenta de usuario?").then((confirm) => {
        if(confirm.isConfirmed){
          registerUser();
        }
      });
    }
  }
});

getDepartments();
