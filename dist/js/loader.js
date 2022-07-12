function generateLoader(container){
  let loader = '<div class="container-loader"> ';
  loader += '<div class="loader"></div> ';
  loader += '<span class="text-loader">Cargando...</span> ';
  loader += '</div>';
  $(container).append(loader);
}

function getLoader(){
  let loader = '<div class="container-loader"> ';
  loader += '<div class="loader"></div> ';
  loader += '<span class="text-loader">Cargando...</span> ';
  loader += '</div>';
  return loader;
}

function getLoaderSetTex(text){
  let loader = '<div class="container-loader"> ';
  loader += '<div class="loader"></div> ';
  loader += `<span class="text-loader">${text}</span> `;
  loader += '</div>';
  return loader;
}
