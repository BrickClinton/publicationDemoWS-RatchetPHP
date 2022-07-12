<?php require_once 'modals.php'; ?>

<!-- Contenidos -->
<div class="container-responsive">
  <div class="row container-services">
    <!-- Agregar publicación -->
    <div class="content-header col-12" id="container-add-publication">
      <div class="card card-outline card-primary">
        <div class="card-body">
          <div class="user-block-publication create-publication">
            <img class="img-circle user-image img-user-login" src="dist/img/user/default_profile_avatar.svg">
            <button type="button" class="btn btn-publication btn-primary" data-toggle="modal" data-target="#modal-publication">
              Crear publicación
            </button>
          </div>
          <hr class="create-publication">
          <div class="mt-2">
            <form autocomplete="off">
              <div class="input-group flex-nowrap">
                <input type="text" class="form-control" id="search" placeholder="Busqueda">
                <div class="input-group-append">
                  <button type="button" class="btn btn-info" id="btn-search-public"><i class="fas fa-search"></i></button>
                  <button type="button" class="btn btn-dark" id="btn-reset-search"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Publicaciones de servicios -->
    <div class="content-service col-12">
      <!-- Contenido de las publicaciones -->
      <div class="content-data-publication" id="data-publication">
        <!-- plantilla -->
        <div class='target-service card' data-idpublicacion="{idpublicacion}">
          <div class='target-header card-header'>
            <div class='user-block'>
              <img class='img-circle img-user-public' src='dist/img/user/default_profile_avatar.svg' data-idusuario='{idusuario}'>
              <span class='username'><a href='javascript:void(0)' class="link-user" data-idusuario="{idusuario}" data-idpersona="{idpersona}">{nombres} {apellidos}</a></span>
              <span class='description'>{fechapublicado}</span>
            </div>
            <div class='user-block-right'>
              <span class='text-black btn-show-config d-none' data-idusuario="{idusuario}">
                <i class='fas fa-ellipsis-h'></i>
              </span>
              <ul class='list-public-config' data-idpublicacion="{idpublicacion}">
                <li class='item-public-config'>
                  <a href='javascript:void(0)' class='btn-edit-publication' data-code='{idpublicacion}'>
                    <i class='fas fa-pen'></i>
                    <span>Editar publicación</span>
                  </a>
                </li>
                <li class='item-public-config'>
                  <a href='javascript:void(0)' class='btn-delete-publication' data-code='{idpublicacion}'>
                    <i class='fas fa-ban'></i>
                    <span>Eliminar publicación</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class='target-header card-body'>
            <!-- Contenido de las calificaciones realizadas -->
            <div class='content-califications' data-idpublicacion="{idpublicacion}">
              <div class='califications'>
                <i class='fa fa-star'></i>
              </div>
              <span class='text-muted count-califications' data-idpublicacion="{idpublicacion}">[0]</span>
            </div>
            <!-- /. Contenido de las calificaciones realizadas -->
            
            <h4 class='job-title'>{titulo}</h4>
          </div>  
          <div class='target-body card-body'>
            <!-- Descripción de la publicación -->
            <p class='text-service'>
              {descripcion}
            </p>
            <!-- /. Descripción de la publicación -->
  
            <!-- Contenido de las galerias -->
            <div class='content-galeria' data-idpublicacion="{idpublicacion}">
              <!-- <img src='dist/img/user/default_profile_avatar.svg' id="{idgaleria}"/> -->
              <video id="{idgaleria}" data-plyr-config='{ "title": "Video de prueba", "volume": "10" }' class='video-js fm-video vjs-big-play-centered vjs-16-9 vjs-fluid' controls data-setup='{}' preload='auto'>
                <source src='dist/video/demo-player.mp4' type='video/mp4'>
              </video>
            </div>
            <!-- /. Contenido de las galerias -->
          </div>  
          <div class='target-footer card-footer'>
  
            <!-- menu (comentarios, calificaciones) -->
            <div class='option-menu'>
              <ul>
                <li class='open-comments'><a href='javascript:void(0)'><span class='badge badge-info text-nowrap count-comments' data-idpublicacion="{idpublicacion}">{total}</span> Comentarios</a></li>
                <li class='qualify' data-idpublicacion="{idpublicacion}">
                  <a href='javascript:void(0)'>
                    <span class='badge badge-success '>{puntuacion} </span>
                    Mi reacción
                  </a>
                  <!-- Reacciones -->
                  <div class='content-reactions-qualify'>
                    <div class='reactions' data-idpublicacion='{idpublicacion}' data-reaction='{puntuacion}' data-idcalificacion='{idcalificacion}'>
                      <span data-code='1'><i class='fa fa-star'></i></span>
                      <span data-code='2'><i class='fa fa-star'></i></span>
                      <span data-code='3'><i class='fa fa-star'></i></span>
                      <span data-code='4'><i class='fa fa-star'></i></span>
                      <span data-code='5'><i class='fa fa-star'></i></span>
                    </div>
  
                    <span class='number-points'>0 punto</span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- /. menu (comentarios, calificaciones) -->
  
            <!-- Contenido de los comentarios -->
            <div class='content-comments collapse' data-idpublicacion="{idpublicacion}" onscroll="scrollCommentDetected({idpublicacion})">
              <div class='box-comment' data-idcomentario="{idcomentario}">
                <img src='dist/img/user/default_profile_avatar.svg' class="img-user-comment" data-idusuario="{idusuario}" />
  
                <div class='box-content-commented'>
                  <div class='name-user'>
                    <span>{nombres} {apellidos}</span>
                    <small class='fecha text-muted'>{fechacomentado}</small>
                  </div>
                  <p class='comment-text contenteditable' maxlength='350' data-idcomentario="{idcomentario}">
                    {comentario}
                  </p>
                  <div class="content-buttons-comment d-none" data-idusuario="{idusuario}">
                    <a href='javascript:void(0)' class='text-info edit-comment'>Editar</a>
                    <a href='javascript:void(0)' class='text-danger delete-comment' data-code='{idcomentario}'>Eliminar</a>
                    <a href='javascript:void(0)' class='text-info update-comment d-none mr-2' data-code='{idcomentario}'>Actualizar</a>
                    <a href='javascript:void(0)' class='text-secondary cancel-edit-comment d-none' data-code='{idcomentario}'>Cancelar</a>
                    <a href='javascript:void(0)' class='text-danger report-comment d-none' data-code='{idcomentario}'>Denunciar</a>
                  </div>
                </div>
              </div>
            </div>
            <!-- /. Contenido de los comentarios -->
  
            <!-- Escribir comentario -->
            <div class='write-comment'>
              <img src='dist/img/user/default_profile_avatar.svg' class="img-circle img-user-login" />
              <div class='text-auto-height'>
                <div class='text-input-auto contenteditable write-text-comment' contenteditable='true' maxlength='250' data-code='{idpublicacion}'> </div>
              </div>
              <button type='button' class='btn btn-primary btn-send'>
                <i class='fas fa-paper-plane'></i>
              </button>
            </div>
            <!-- /. Escribir comentario -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="dist/js/pages/profile.js"></script>
<script src="dist/js/pages/publication.js"></script>
<script src="dist/js/pages/comment.js"></script>
<script src="dist/js/pages/qualify.js"></script>
<script src="dist/js/pages/files.js"></script>