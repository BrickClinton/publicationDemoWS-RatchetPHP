<!--Modales -->
<!-- Modal PUBLICACIÓN DE TRABAJOS-->
<div class="modal fade" id="modal-publication" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-bold text-uppercase" id="title-modal-publication">Crear publicación</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form autocomplete="off" id="form-publication">
          <div class="form-group">
            <label for="titulo">Título</label>
            <input type="text" id="titulo" class="form-control form-control-border">
          </div>
          <div class="form-group">
            <label for="descripcion" class="col-form-label">Descripción</label>
            <textarea class="form-control form-control-border rounded-0" id="descripcion"></textarea>
          </div>

          <!-- opciones para cargar archivos -->
          <div class="row">
            <div class="col-6">
              <div class="btn-group" role="group">
                <button id="btn-options-files" type="button" class="btn btn-sm btn-secondary dropdown-toggle" data-toggle="dropdown">
                  Tipo de archivo
                </button>
                <div class="dropdown-menu" aria-labelledby="btn-options-files">
                  <a href="javascript:void(0)" class="dropdown-item" id="btn-image">Imagenes</a>
                  <a href="javascript:void(0)" class="dropdown-item" id="btn-video">Video</a>
                </div>
              </div>
              <div class="badge badge-success text-nowrap text-uppercase" id="title-options">Imagenes</div>
            </div>
            <div class="col-6 text-right">
              <button type="button" class="btn btn-sm btn-primary" id="btn-add-file"><i class="fas fa-folder-open"></i> <span>Cargar imagenes</span></button>
              <button type="button" class="btn btn-sm btn-danger d-none" id="btn-delete-files"><i class="fas fa-trash-alt"></i> Eliminar archivos</button>
            </div>
          </div>

          <!-- Contenido de Images previas -->
          <div class="row" id="container-images">
            <!-- Aquì se cargan las imagenes previas -->
          </div>

          <!-- Contenido del video vista previa -->
          <div id="container-video">
            <!-- progressbar -->
            <div class="row d-none" id="container-progress-load-video">
              <div class="col-sm-8">
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
              </div>
              <div class="col-sm-4 text-right">
                <span>Peso del video: </span>
                <span id="label-video-size">0 MB</span>
              </div>
            </div>

            <!-- Previsualizador de video traido del servidor -->
            <div id="preview-video-server"></div>

            <!-- Previsualizador de video cargado -->
            <div class="row">
              <div class="col-md-12">
                <video controls id="video-tag" class="d-none">
                  <source id="video-source" src="">
                </video>
              </div>
            </div>
          </div>
          <!-- /. Contenido del video vista previa -->
        </form>

        <!-- Formulario contiene los inputs (imagen / video)-->
        <form id="form-upload-file">
          <input type="file" id="input-new-image" accept="image/*" max="5" multiple hidden />
          <input type="file" id="input-new-video" accept="video/*" size="35" hidden />
        </form>
        <!-- /. Formulario de etiquetas inputs -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-sm btn-info" id="btn-modify-publication">Actualizar</button>
        <button type="button" class="btn btn-sm btn-primary" id="btn-add-publication">Publicar</button>
      </div>
    </div>
  </div>
</div>
<!-- /. Modal PUBLICACIÓN DE TRABAJOS-->

