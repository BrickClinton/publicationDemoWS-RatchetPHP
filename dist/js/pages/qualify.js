/**
 * CALIFICACIÓN
 */

// Abrir contenido de calificaciones
$("#data-publication").on("click", ".qualify", function(){
  //$(".content-reactions-qualify").removeClass("reactions-show");
  $(this).children(".content-reactions-qualify").toggleClass("reactions-show");
});

// Aplicar la clase active al estar sobre el elemento - start
$("#data-publication").on("mouseover", ".reactions span", function(){
  // Activar los elementos anteriores
  $(this).prevAll().addClass("active");
  let numberPoint = $(this).attr("data-code");
  $(this).parent(".reactions").next(".number-points").html(numberPoint + " Punto");
});

// Quitar clase active al sacar el mouse del elemento
$("#data-publication").on("mouseleave", ".reactions span", function(){
  $(".reactions span").removeClass("active");
  $(this).parent(".reactions").next(".number-points").html("0 Punto");
});

// Obtener la puntuación
$("#data-publication").on("click", ".reactions span", function(){
  let idpublicacion = $(this).parent(".reactions").attr("data-idpublicacion");
  let idreaccion =$(this).parent(".reactions").attr("data-idcalificacion"); // id
  let reaccion = $(this).parent(".reactions").attr("data-reaction");        // Puntaje anterior
  let puntuacion = $(this).attr("data-code");

  let dataSend = {
    op          : 'registerQualify',
    idpublicacion   : idpublicacion,
    puntuacion  : puntuacion
  };

  if(idreaccion > 0){
    dataSend['op'] = 'updateQualify';
    dataSend['idcalificacion'] = idreaccion;
  } 

  qualifyService(dataSend);
});

// Asignar o quitar reacción
function qualifyService(dataSend){
  $.ajax({
    url: 'controllers/qualify.controller.php',
    data: dataSend,
    success: function(result){
      if(result != ""){
        sweetAlertWarning(result, 'Debe iniciar sesión o registrarse');
      } else {
        myQualifyPublication(dataSend.idpublicacion);
        promiseParallelScoreAndCountQualify(dataSend.idpublicacion);
      }
    }
  });
}

// Obtener mi calificación de cada publicación
function myQualifyPublication(idpublicacion){
  return new Promise((resolve, reject) => {
    let container = $(`.qualify[data-idpublicacion='${idpublicacion}']`);
    $(container).children("a").children(".badge").html(0);
  
    $.ajax({
      url: 'controllers/qualify.controller.php',
      type: 'GET',
      dataType: 'JSON',
      data: 'op=getScorePublicationByUser&idpublicacion=' + idpublicacion,
      success: function(result){
        $(container).children("a").children(".badge").html(result[0].puntuacion);
        $(container).children(".content-reactions-qualify").children(".reactions").attr("data-reaction", result[0].puntuacion);
        $(container).children(".content-reactions-qualify").children(".reactions").attr("data-idcalificacion", result[0].idcalificacion);
        
        resolve();
      }
    });
  });
}
