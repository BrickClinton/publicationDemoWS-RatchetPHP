/** 
 * 
 * MODAL REPORTE
 */
var idcomentario = -1;

// Abrir modal desde publicación de trabajos
$("#data-publication").on("click", ".report-comment", function(){
  if(idusuarioSession == -2){
    sweetAlertWarning("Iniciar sesión", "Debe iniciar sesión o registrese");
  } else {
    idcomentario = $(this).attr("data-code");
    $("#modal-report").modal("show");
    clearFormReport();
  }
});

// Abrir modal desde el foro de consultas
$("#content-data-forum").on("click", ".report-comment", function(){
  $("#modal-report").modal("show");
});

// Restringir el maximo de caracteres del texto de comentario (atributo maxlength)
$("#comentario").keydown(function(e){
  return disableLineBreaks($(this), e);
});