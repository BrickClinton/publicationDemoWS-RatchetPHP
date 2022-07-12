// Definición de la url
var url = "controllers/publication.controller.php";

// Instanciamos XMLHttpRequest
var xmlHttp = new XMLHttpRequest();

// Ejecutar al cambiar de estado
xmlHttp.onreadystatechange = function(){
  // proseco completado
  if(xmlHttp.readyState === 4){
    // Datos recibidos
    if(xmlHttp.status === 200){
      // Analizar datos recibidos
      console.info(JSON.parse(xmlHttp.responseText));
    } else if(xmlHttp.status === 404){
      // Error, pagina no encontrada
      console.error("ERROR! 404");
      console.info(JSON.parse(xmlHttp.responseText));
    }
  }
}

xmlHttp.open("GET", url, true);     // Abrir la petición
//xmlHttp.send();                     // Enviar datos (ejecutar)

