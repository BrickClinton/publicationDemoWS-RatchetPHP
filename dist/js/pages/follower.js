var continueFetchFollower = true;

// MENU FOLLOWER
$("#pills-follow .nav .nav-link").click(function(){
  $("#pills-follow .nav .nav-link").removeClass('active');
  $(this).addClass('active');
  let text = $(this).html();
  if(text == "Seguidos"){
    promiseLoadFollowing(0, true);
  } else {
    promiseLoadFollowers(0, true);
  }
});

/**
 * MENU SEGUIDORES/SEGUIDOS
 */
// Seguidores
$("#btn-follower-count").click(function(){
  $(".container-responsive .nav-pills .nav-item").removeClass("active");
  $("#pills-follow-tab").parent(".nav-item").addClass('active');
  $("#nav-follower").click();
  
});

// Seguidos
$("#btn-following-count").click(function(){
  $(".container-responsive .nav-pills .nav-item").removeClass("active");
  $("#pills-follow-tab").parent(".nav-item").addClass('active');
  $("#nav-following").click();
});

/**
 * REGISTRAR SEGUIDOR / ELIMINAR
 */
$("#btn-follower").click(function(){
  let text = $(this).html();
  let active = $("#pills-follow nav .nav-link.active").html();

  if(text == "Seguir"){
    registerFollower(idusuarioActivo).then((status) => {
      if(status){
        countFollowers();

        if(active == "Seguidores"){
          promiseLoadFollowers(0, true);
        } 
      }
    });
  } else {
    deleteFollower(idusuarioActivo).then((status) => {
      if(status){
        countFollowers();
        
        if(active == "Seguidores"){
          promiseLoadFollowers(0, true);
        } 
      }
    });
  }


});

// Desde el contenidos listados
$("#container-follower").on('click', '.btn-follow', function(){
  let idusuario = $(this).attr("data-idusuario");
  let text = $(this).html();
  let active = $("#pills-follow nav .nav-link.active").html();

  if(text == "Seguir"){
    registerFollower(idusuario).then((res) => {
      if(res){
        $(this).removeClass("btn-outline-primary").addClass("btn-outline-success");
        $(this).html("Seguido");   
        countFollowers();
        countFollowing();     
      }
    });
  } else {
    deleteFollower(idusuario).then((res) => {
      if(res){
        $(this).removeClass("btn-outline-success").addClass("btn-outline-primary");
        $(this).html("Seguir");
        countFollowers();
        countFollowing();     

        if(idusuarioActivo == -1 && active == "Seguidos"){
          $(`#container-follower .box-comment[data-idusuario='${idusuario}']`).remove();
        }
      }
    });
  }
});

function registerFollower(idusuario){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/follower.controller.php',
      type: 'GET',
      data: {
        op: 'registerFollower',
        idusuarioactivo: idusuario
      },
      success: function(result){
        if(result == ""){      
          validateFollower();   
          resolve(true);
        } else {
          sweetAlertError(result, "Registrese en el sistema");
        }
      }
    });
    
  });
}


/**
 * LISTAR SEGUIDORES
 */
function getFollowers(idfollower, clear){
  return new Promise((resolve, reject) => {
    if(clear){
      $("#container-follower").empty();
    }
  
    // Mostrar animación de carga si aun no contiene
    if($("#container-follower").find(".container-loader").length < 1){
      $("#container-follower").append(getLoaderSetTex("Cargando seguidores..."));
    }
  
    $.ajax({
      url: 'controllers/follower.controller.php',
      type: 'GET',
      //data: 'op=getFollowersByUser&idusuarioactivo=' + idusuarioActivo,
      data: {
        op: 'getFollowersByUser',
        idusuarioactivo: idusuarioActivo,
        idfollower: idfollower
      },
      success: function(result){
        $("#container-follower div.container-loader").remove();
  
        if(result == ""){
          // Validar si existen más registros mostrados
          if($("#data-publication").find(".box-comment").length < 1){
            $("#data-publication").append("<div class='container-loader'><span>Sin seguidores</span></div>");
          } 
        }
  
        if(result !== ""){
          let json = JSON.parse(result);
  
          json.forEach((value) => {
            let template = templateFollower;
            for(let key in value){
              template = template.replaceAll('{' + key + '}', value[key]);
            }
  
            $("#container-follower").append(template);
            $(`#container-follower .img-user[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.imagenperfil);
            
            let email = value.email;
            let arrEmail = email.split('@');
            $(`#container-follower .link-user[data-idusuario='${value.idusuario}']`).html('@'+ arrEmail[0]);
            
            let follow = $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).html();
            if(follow == "Seguir"){
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).removeClass("btn-outline-success").addClass("btn-outline-primary");
            } else {
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).removeClass("btn-outline-primary").addClass("btn-outline-success");
            }
  
            if(value.idusuario == idusuarioSession){
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).hide();
            }
  
          });

          resolve();
        }
      }
    });
  });
}

async function promiseLoadFollowers(idfollower, clear){
  try{
    continueFetchFollower = false;
    await getFollowers(idfollower, clear);
  } catch (error){
    console.log(error);
  } finally {
    continueFetchFollower = true;
  }
}

// Conteo de seguidores
function countFollowers(){
  $.ajax({
    url: 'controllers/follower.controller.php',
    type: 'GET',
    data: 'op=getCountFollowersByUser&idusuarioactivo=' + idusuarioActivo,
    dataType: 'JSON',
    success: function(res){
      let total = parseInt(res[0].totalseguidores);
      $("#btn-follower-count span").html(total);
    }
  });
}

/**
 * LISTAR SEGUIDOS
 */
function getFollowing(idfollowing, clear){
  return new Promise((resolve, reject) => {
    if(clear){
      $( "#container-follower").empty();
    }

    // Mostrar animación de carga si aun no contiene
    if($("#container-follower").find(".container-loader").length < 1){
      $("#container-follower").append(getLoaderSetTex("Cargando seguidores..."));
    }
  
    $.ajax({
      url: 'controllers/follower.controller.php',
      type: 'GET',
      //data: 'op=getFollowedByUser&idusuarioactivo=' + idusuarioActivo,
      data: {
        op: 'getFollowedByUser',
        idusuarioactivo: idusuarioActivo,
        idfollowing: idfollowing
      },
      success: function(result){
        $("#container-follower div.container-loader").remove();

        if(result == ""){
          // Validar si existen más registros mostrados
          if($("#data-publication").find(".box-comment").length < 1){
            $("#data-publication").append("<div class='container-loader'><span>Sin seguidos</span></div>");
          } 
        }        
  
        if(result !== ""){
          let json = JSON.parse(result);
  
          json.forEach((value) => {
            let template = templateFollower;
            for(let key in value){
              template = template.replaceAll('{' + key + '}', value[key]);
            }
  
            $("#container-follower").append(template);
            $(`#container-follower .img-user[data-idusuario='${value.idusuario}']`).attr('src', 'dist/img/user/' + value.imagenperfil);
            
            let email = value.email;
            let arrEmail = email.split('@');
            $(`#container-follower .link-user[data-idusuario='${value.idusuario}']`).html('@'+ arrEmail[0]);
            
            let follow = $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).html();
            if(follow == "Seguir"){
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).removeClass("btn-outline-success").addClass("btn-outline-primary");
            } else {
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).removeClass("btn-outline-primary").addClass("btn-outline-success");
            }
  
            if(value.idusuario == idusuarioSession){
              $(`#container-follower .btn-follow[data-idusuario='${value.idusuario}']`).hide();
            }
  
          });

          resolve();
        }
      }
    });
  });
}

async function promiseLoadFollowing(idfollowing, clear){
  try{
    continueFetchFollower = false;
    await getFollowing(idfollowing, clear);
  } catch (error){
    console.error(error);
  } finally {
    continueFetchFollower = true;
  }
}

// Conteo de seguidos
function countFollowing(){
  $.ajax({
    url: 'controllers/follower.controller.php',
    type: 'GET',
    data: 'op=getCountFollowedByUser&idusuarioactivo=' + idusuarioActivo,
    dataType: 'JSON',
    success: function(res){
      let total = parseInt(res[0].totalseguidos);
      $("#btn-following-count span").html(total);
    }
  });
}

/**
 * ELIMINAR
 */
function deleteFollower(idusuario){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/follower.controller.php',
      type: 'GET',
      data: {
        op: 'deleteFollower',
        idfollowing: idusuario
      },
      success: function(result){
        if(result == ""){      
          validateFollower();    
          resolve(true);
        }
      }
    });
  });
}

/**
 * VALIDAR USUARIO SEGUIDO
 */

function validateFollower(){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'controllers/follower.controller.php',
      type: 'GET',
      data: 'op=validateFollower&idusuarioactivo=' + idusuarioActivo,
      success: function(res){
        if(res == 0){
          $("#btn-follower").removeClass("btn-success").addClass("btn-danger");
          $("#btn-follower").html("Seguir");
        } else {
          $("#btn-follower").removeClass("btn-danger").addClass("btn-success");
          $("#btn-follower").html("Seguido");
        }
        resolve(res);
      }
    });
  });
}

/**
 * SCROLL
 */

$("#container-follower").scroll(function(){
  if(isFinalContainer($(this))){
    let active = $("#pills-forum nav .nav-link.active").html();
    let divs = $(`#container-follower .box-comment[data-idusuario]`);
    let attr = "data-idusuario";
    let values = getDataArrayByElements(divs, attr);
    let idusuario = values[values.length - 1]; // Ultimo id

    if(continueFetchFollower){
      // Seguidores
      if(active == "Seguidores"){
        promiseLoadFollowers(idusuario, false);
      } else {
        promiseLoadFollowing(idusuario, false);
      }
    }
  }
});

promiseLoadFollowers(0, true);
countFollowers();
countFollowing();
validateFollower();