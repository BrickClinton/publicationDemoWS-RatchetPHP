<?php require_once 'modals.php'; ?>
<link rel="stylesheet" href="dist/css/pages/profile.css">

<!--Contenido-->
<section class="perfil-usuario align-items-end">
  <div class="contenedor-perfil">
    <!--Portada-->
    <div class="portada-perfil">
      <img src="dist/img/banner.jpg" id="port-img">
      <div class="opcciones-perfil">
        <button type="button" data-option-img="portada" class="btn btn-secondary upload-img-profile"><i class="fas fa-camera"></i></button>
      </div>
    </div>

    <!--Perfil-->
    <div class="avatar-perfil" >
      <img src="dist/img/user/default_profile_avatar.svg" id="profile-img">
      <a href="javascript:void(0)" data-option-img="perfil" class="cambiar-foto upload-img-profile" ><i class="fas fa-camera"></i></a>
    </div>

    <div class="content-button">
      <button type="button" id="btn-edit-profile" class="btn btn-sm btn-primary ">Editar perfil</button>
      <button type="button" id="btn-follower" class="btn btn-sm btn-danger">Seguir</button>
    </div>

    <div class="data-user">
      <h5 class="name-user">Nombre del usuario</h5>
      <span class="email-user">@username.com</span>

      <div class="nav-followers mt-2">
        <a class="link" id="btn-follower-count" data-toggle="pill" href="#pills-follow" role="tab" aria-controls="pills-follow" aria-selected="false">
          <span>0</span> Seguidores
        </a>
        <a class="link" id="btn-following-count" data-toggle="pill" href="#pills-follow" role="tab" aria-controls="pills-follow" aria-selected="false">
          <span>0</span> Siguiendo
        </a>
      </div>
    </div>
  </div>
</section>
<!--====  End section  ====-->

<!-- navs -->
<div class="container-responsive">
  <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li class="nav-item active" role="presentation" data-subtitle="publication">
      <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Publicación</a>
    </li>
    <li class="nav-item" role="presentation" data-subtitle="gallery">
      <a class="nav-link" id="pills-gallery-tab" data-toggle="pill" href="#pills-gallery" role="tab" aria-controls="pills-gallery" aria-selected="false">Fotos</a>
    </li>
    <li class="nav-item" role="presentation" data-subtitle="follow">
      <a class="nav-link" id="pills-follow-tab" data-toggle="pill" href="#pills-follow" role="tab" aria-controls="pills-follow" aria-selected="false">Follow</a>
    </li>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <!-- Container publication -->
    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
      <!-- Contenidos -->
      <div class="row mt-2 container-services">
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
                    <img src='dist/img/user/default_profile_avatar.svg' class="img-user-comment" data-idusuario="{idusuario}"/>

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
                        <a href='javascript:void(0)' class='text-danger report-comment d-none' data-code='{idcomentario}' >Denunciar</a>
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

    <!-- Container galery -->
    <div class="tab-pane fade" id="pills-gallery" role="tabpanel" aria-labelledby="pills-gallery-tab">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-6">
              <h5 class="text-bold" id="text-title-album">Fotos</h5>              
            </div>
            <div class="col-md-6 text-right" id="content-buttons-album">
              <button type="button" class="btn btn-sm btn-outline-primary" id="btn-register-album">Crear album</button>
              <button type="button" class="btn btn-sm btn-outline-primary" data-toggle="modal" data-target="#modal-add-files" id="btn-add-files">Añadir fotos/video</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <nav class="nav justify-content-left text-left">
            <a class="nav-link item-photo" href="javascript:void(0)">Fotos</a>
            <a class="nav-link item-album active" href="javascript:void(0)">Albumes</a>
          </nav>

          <!-- Template album -->
          <div class="flex-box" id="container-album">
            <div class="col-flex content-album">
              <div class="card album" id="{idalbum}">
                <div class='container-options'>
                  <span class='text-black btn-show d-none' data-name-album='{nombrealbum}' data-idusuario="{idusuario}">
                    <i class="fas fa-ellipsis-h"></i>
                  </span>
                  <ul class='list-options d-none' data-option-value="{idalbum}">
                    <li class='item-option' data-idalbum="{idalbum}" data-option="edit">
                      <i class='fas fa-pen'></i>
                      <span>Editar</span>
                    </li>
                    <li class='item-option' data-idalbum="{idalbum}" data-option="delete">
                      <i class="fas fa-trash-alt"></i>
                      <span>Eliminar</span>
                    </li>
                  </ul>
                </div>
    
                <div class="card-body p-0">
                  <img src="dist/img/photo1.png" class="img-album" data-idalbum='{idalbum}'>
                </div>
                <div class="card-footer p-2">
                  <h5 class="text-uppercase-sm text-bold mb-0 title-album">{nombrealbum}</h5>
                  <span class="subtitle-album">{totalimages} elementos</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- template images -->
          <div class="flex-box" id="container-img-album">        
            <div class="col-flex content-album" >
              <div class="card album">
                <div class='container-options'>
                  <span class='text-black btn-show' data-idusuario="{idusuario}">
                    <i class='fas fa-pen'></i>
                  </span>
                  <ul class='list-options d-none' data-option-value="{idgaleria}">
                    <li class='item-option' data-idgaleria='{idgaleria}' data-archivo='{archivo}' data-idalbum='{idalbum}' data-option='eye'>
                      <a href="dist/img/user/{archivo}" class="d-block" data-toggle="lightbox" data-title="Imagen {idgaleria}" data-gallery="gallery">
                        <i class="fas fa-eye"></i>
                        <span>Ver</span>
                      </a>
                    </li>
                    <li class='item-option' data-idgaleria='{idgaleria}' data-archivo='{archivo}' data-idalbum='{idalbum}' data-option='delete'>
                      <i class="fas fa-trash-alt"></i>
                      <span>Eliminar</span>
                    </li>
                    <li class='item-option' data-idgaleria='{idgaleria}' data-archivo='{archivo}' data-idalbum='{idalbum}' data-option='profile'>
                      <i class="fas fa-user-circle"></i>
                      <span>Asignar perfil</span>
                    </li>
                    <li class='item-option' data-idgaleria='{idgaleria}' data-archivo='{archivo}' data-idalbum='{idalbum}' data-option='port'>
                      <i class="fas fa-image"></i>
                      <span>Asignar portada</span>
                    </li>
                  </ul>
                </div>
                <div class="card-body p-0">
                  <img src="dist/img/photo1.png" class="img-album" id="{idgaleria}">
                </div>            
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>

    <!-- Container follow -->
    <div class="tab-pane fade" id="pills-follow" role="tabpanel" aria-labelledby="pills-follow-tab">      
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <nav class="nav justify-content-left text-left">
                <a class="nav-link active" id="nav-follower" href="javascript:void(0)">Seguidores</a>
                <a class="nav-link" id="nav-following" href="javascript:void(0)">Seguidos</a>
              </nav>
            </div>
            <div class="card-body">
              <div class="content-comments" id="container-follower" style="max-height: 850px;">
                <div class='box-comment' data-idusuario="{idusuario}">
                  <img src='dist/img/user/default_profile_avatar.svg' data-idusuario="{idusuario}" class="img-user"/>
                  <div class='box-content-commented'>
                    <div class='name-user'>
                      <div>
                        <span class="d-block">{nombres} {apellidos}</span>
                        <a href="javascript:void(0)"><small class="link-user" data-idusuario="{idusuario}" data-idpersona="{idpersona}">@{email}</small></a>
                      </div>
                      <button class="btn btn-sm btn-outline-primary btn-follow" data-idusuario="{idusuario}">{follow}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card card-body">
            Cargando anuncios...
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!--Modales -->
<!-- Modal IMNG-->
<div class="modal fade" id="modal-images-profile" tabindex="-1" role="dialog" aria-labelledby="Modal reporte" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-md" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-bold text-uppercase">Actualizar imagen</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="form-image-profile">
          <div id="container-image-profile" ></div>    

          <input type="file" accept="jpg, png, jpeg" id="input-load-image-profile" hidden >
          <button type="button" id="btn-load-image-profile" class="btn btn-block btn-info">
            <i class="fa fas fa-camera-retro"></i> <span>Seleccionar imagen</span>
          </button>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar proceso</button>
        <button type="button" class="btn btn-sm btn-primary" id="btn-saveimg-profile">Guardar imagen</button>
      </div>
    </div>
  </div>
</div>
<!--./Modal IMG-->

<!-- MODAL CREAR ALBUM -->
<div class="modal fade" id="modal-create-album" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-bold text-uppercase">Crear nuevo album</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
        <form autocomplete="off">
          <div class="form-group">
            <label for="nameAlbum">Album</label>
            <input type="text" id="nameAlbum" class="form-control form-control-border" placeholder="Nombre album">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-sm btn-primary" id="btn-save-album">Guardar</button>
        <button type="button" class="btn btn-sm btn-info d-none" id="btn-update-album">Actualizar</button>
      </div>
    </div>
  </div>
</div>

<!--Modal de Añadir imagenes-->
<div class="modal fade" id="modal-add-files" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-uppercase text-bold">Agregar a mi galería</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form autocomplete="off" id="form-option-add-gallery">
          <div class="row">
            <div class="col-md-12 form-group">
              <label for="album">Albumes</label>
              <div class="input-group mr-3">
                <select class="custom-select rounded-0" id="album">
                  <!-- Asíncrono -->
                </select>
                <div class="input-group-append">                  
                  <button type="button" class="btn btn-md btn-primary rounded-0" id="btn-add-files-album"><i class="fas fa-folder-open"></i> Archivos</button>
                  <button type="button" class="btn btn-md btn-danger rounded-0 d-none" id="btn-remove-files-album"><i class="fas fa-trash-alt"></i> Eliminar</button>
                </div>
              </div>              
            </div>
          </div>

          <!-- Contenido previsualización -->
          <div class="row" id="content-images-preview" style="max-height: 450px; overflow-y: auto;">

          </div>
        </form>
        <form>
          <input type="file" id="add-image-galery" accept="image/*" max="6" multiple hidden />
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-sm btn-primary" id="btn-add-gal-md">Guardar</button>
      </div>
    </div>
  </div>
</div>
<!--./Modal de Añadir imagenes-->

<!-- Modal -->
<div class="modal fade" id="modal-edit-profile" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-bold text-uppercase">Actualizar datos</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6 form-group">
            <button type="button" id="btn-show-collapse-data" class="btn btn-block btn-outline-primary" data-toggle="collapse" data-target="#collapse-form-edit-profile">Datos personales</button>
          </div>
          <div class="col-md-6 form-group">
            <button type="button" id="btn-show-collapse-security" class="btn btn-block btn-outline-primary" data-toggle="collapse" data-target="#collapse-buttons-security">Información privada</button>
          </div>
        </div>

        <!-- Datos personales -->
        <div class="card card-body collapse" id="collapse-form-edit-profile">
          <form autocomplete="off">
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="eNombres">Nombres</label>
                <input type="text" id="eNombres" class="form-control form-control-border">
              </div>
              <div class="col-md-6 form-group">
                <label for="eApellidos">Apellidos</label>
                <input type="text" id="eApellidos" class="form-control form-control-border">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label for="eFechanac">Fecha de nacimiento</label>
                <input type="date" id="eFechanac" class="form-control form-control-border">
              </div>
              <div class="col-md-6 form-group">
                <label for="eTelefono">Telefono</label>
                <input type="tel" id="eTelefono" maxlength="9" class="form-control form-control-border">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="eDireccion">Direccion</label>
                <div class="form-group row">
                  <div class="col-md-2">
                    <Select class="custom-select form-control-border" id="streetType">
                      <option value="AV">AV</option>
                      <option value="CA">CA</option>
                      <option value="JR">JR</option>
                      <option value="PJ">PJ</option>
                      <option value="UR">UR</option>
                      <option value="LT">LT</option>
                    </Select>
                  </div>
                  <div class="col-md-6">
                    <input type="text" placeholder="Nombre de calle" class="form-control form-control-border" id="streetName" >
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <input type="number" class="form-control form-control-border" placeholder="N°" id="streetNumber" maxlength="5" min="1" max="99999" >
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <input type="number" class="form-control form-control-border" placeholder="Piso" id="floorNumber" maxlength="5" min="1" max="99999" >
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 text-right">
                <button type="button" class="btn btn-sm btn-info" id="btn-update-dataperson">Actualizar</button>
              </div>
            </div>
          </form>
        </div>

        <!-- Botones seguros -->
        <div class="row collapse" id="collapse-buttons-security">
          <div class="col-sm-4 form-group">
            <button type="button" id="btn-edit-email" class="btn btn-block btn-info" data-toggle="collapse" data-target="#collapse-credentials">Correo</button>
          </div>
          <div class="col-sm-4 form-group">
            <button type="button" id="btn-edit-password" class="btn btn-block btn-success" data-toggle="collapse" data-target="#collapse-credentials">Contraseña</button>
          </div>
          <div class="col-sm-4 form-group">
            <button type="button" id="btn-delete-user" class="btn btn-block btn-danger" data-toggle="collapse" data-target="#collapse-credentials">Eliminar cuenta</button>
          </div>
        </div>

        <!-- Datos privados -->
        <div class="card card-body collapse" id="collapse-credentials">
          <form autocomplete="off" id="form-content-credentials">
            <div class="row container-emails">
              <div class="col-12 form-group">
                <label for="emailUserUpdate">Correo electrónico</label>
                <input type="email" class="form-control form-control-border" id="emailUserUpdate">
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 form-group">
                <label for="passwordVerify">Escriba su contraseña actual</label>
                <input type="password" class="form-control form-control-border" id="passwordVerify">
              </div>
            </div>

            <div class="row container-password d-none">
              <div class="col-md-12 form-group">
                <label for="newPassword1">Escriba su nueva contraseña</label>
                <input type="password" class="form-control form-control-border" id="newPassword1">
              </div>
              <div class="col-md-12 form-group">
                <label for="newPassword2">Reescriba su nueva contraseña</label>
                <input type="password" class="form-control form-control-border" id="newPassword2">
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 text-right">
                <button type="button" class="btn btn-sm btn-danger d-none" id="btn-deleteUser">Eliminar</button>
                <button type="button" class="btn btn-sm btn-info" id="btn-update-credential">Actualizar</button>
              </div>
            </div>
          </form>
        </div>

      </div>
      <div class="modal-footer d-none">
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-sm btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Actualizar correo, contraseña y eliminar cuenta -->


<script src="dist/js/pages/profile.js"></script>
<script src="dist/js/pages/publication.js"></script>
<script src="dist/js/pages/comment.js"></script>
<script src="dist/js/pages/qualify.js"></script>
<script src="dist/js/pages/files.js"></script>
<script src="dist/js/pages/follower.js"></script>