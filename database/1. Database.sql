CREATE DATABASE PUBLICATIONDB;

USE PUBLICATIONDB;

-- UBIGEO YA INCORPORADO
CREATE TABLE departamentos
(
  iddepartamento	VARCHAR(2) NOT NULL PRIMARY KEY,
  departamento		VARCHAR(45) NOT NULL
)ENGINE = INNODB;

CREATE TABLE provincias 
(
  idprovincia		VARCHAR(4)	NOT NULL PRIMARY KEY,
  provincia			VARCHAR(45) NOT NULL,
  iddepartamento	VARCHAR(2)	NOT NULL,
  CONSTRAINT fk_iddepartamento_pro FOREIGN KEY (iddepartamento) REFERENCES departamentos (iddepartamento)
)ENGINE = INNODB;

CREATE TABLE distritos 
(
  iddistrito		VARCHAR(6)	NOT NULL PRIMARY KEY,
  distrito			VARCHAR(45) DEFAULT NULL,
  idprovincia		VARCHAR(4)	DEFAULT NULL,
  iddepartamento	VARCHAR(2)	DEFAULT NULL,
  CONSTRAINT fk_idprovincia_dis FOREIGN KEY (idprovincia) REFERENCES provincias (idprovincia),
  CONSTRAINT fk_iddepartamento_dis FOREIGN KEY (iddepartamento) REFERENCES departamentos (iddepartamento)
)ENGINE = INNODB;


CREATE TABLE personas
(
	idpersona		INT AUTO_INCREMENT PRIMARY KEY,
	iddistrito	VARCHAR(6)		NOT NULL,
	apellidos		VARCHAR(40)		NOT NULL, 
	nombres			VARCHAR(40)		NOT NULL,
	fechanac		DATE 					NOT NULL,
	telefono		CHAR(11)			NULL,
	tipocalle 	CHAR(2)				NOT NULL, -- AV(Avenida), CA(Calle), JR(Jiron), PJ(Pasaje), UR(Urbanización), LT(Lote)
	nombrecalle VARCHAR(60)		NOT NULL,
	numerocalle VARCHAR(5) 		NULL,
	pisodepa  	VARCHAR(5)		NULL,
	CONSTRAINT fk_per_iddistrito FOREIGN KEY (iddistrito) REFERENCES distritos (iddistrito)	
)ENGINE = INNODB;

CREATE TABLE usuarios
(
	idusuario 			INT AUTO_INCREMENT PRIMARY KEY,
	idpersona				INT 					NOT NULL, 
	nivelusuario		CHAR(1)				NOT NULL DEFAULT 'E', -- E(Estandar), I(Intermedio), A(Avanzado)
	rol 						CHAR(1)				NOT NULL DEFAULT 'U', -- U = Usuario, A = Administrador
	email						VARCHAR(70)		NOT NULL,
	clave						VARCHAR(80)		NOT NULL,
	fechaalta				DATETIME			NOT NULL DEFAULT NOW(),
	fechabaja				DATETIME			NULL,
	estado					CHAR(1)				NOT NULL DEFAULT '1', -- 1 (Activo), 2 (Inactivo/bloqueado),0 (Eliminado)
	CONSTRAINT fk_usu_idpersona FOREIGN KEY (idpersona) REFERENCES personas (idpersona),
	CONSTRAINT uk_usu_email UNIQUE (email),
	CONSTRAINT uk_usu_idpersona UNIQUE(idpersona)
)ENGINE = INNODB;

CREATE TABLE publicaciones 
(
	idpublicacion			INT AUTO_INCREMENT PRIMARY KEY,
	idusuario					INT 					NOT NULL,
	titulo						VARCHAR(200) 	NOT NULL,
	descripcion				MEDIUMTEXT 		NOT NULL,
	fechapublicado		DATETIME 			NOT NULL DEFAULT NOW(),
	fechamodificado 	DATETIME  		NULL,
	fechaeliminado 		DATETIME			NULL,
	estado 						BIT 					NOT NULL DEFAULT 1,
	CONSTRAINT fk_trab_idusuario FOREIGN KEY(idusuario) REFERENCES usuarios(idusuario)
)ENGINE = INNODB;

CREATE TABLE albumes
(
	idalbum 			INT AUTO_INCREMENT PRIMARY KEY,
	idusuario			INT 					NOT NULL,
	nombrealbum 	VARCHAR(30) 	NOT NULL,
	estado 				BIT 					NOT NULL DEFAULT 1,
	CONSTRAINT fk_idusuario_alb FOREIGN KEY(idusuario) REFERENCES usuarios (idusuario),
	CONSTRAINT uk_album_alb UNIQUE(idusuario, nombrealbum)
)ENGINE = INNODB;

CREATE TABLE galerias 
(
	idgaleria				INT AUTO_INCREMENT PRIMARY KEY,
	idalbum					INT 					NULL,
	idusuario				INT 					NOT NULL,
	idpublicacion		INT 					NULL,
	tipo						CHAR(1)				NOT NULL, -- F = Foto, V = Video
	archivo 				VARCHAR(100)	NOT NULL,
	fechaalta				DATETIME 			NOT NULL DEFAULT NOW(),
	fechabaja	 			DATETIME 			NULL,
	estado 					CHAR(1) 			NOT NULL DEFAULT '1', -- 0(Elimimado), 1(activo), 2(Perfil activo), 3(Portada activo);
	CONSTRAINT fk_galerias_idalbum FOREIGN KEY(idalbum) REFERENCES albumes (idalbum),
	CONSTRAINT fk_galerias_idusuario FOREIGN KEY(idusuario) REFERENCES usuarios (idusuario),
	CONSTRAINT fk_galerias_idpublicacion FOREIGN KEY(idpublicacion) REFERENCES publicaciones (idpublicacion)
)ENGINE = INNODB;

CREATE TABLE calificaciones 
(
	idcalificacion 	INT AUTO_INCREMENT PRIMARY KEY,
	idpublicacion		INT 			NOT NULL,
	idusuario				INT 			NOT NULL,
	puntuacion			TINYINT 	NOT NULL,
	CONSTRAINT fk_cal_idpublicacion FOREIGN KEY(idpublicacion) REFERENCES publicaciones (idpublicacion),
	CONSTRAINT fk_cal_idusuario FOREIGN KEY(idusuario) REFERENCES usuarios(idusuario)
)ENGINE = INNODB;

CREATE TABLE comentarios 
(
	idcomentario 		INT AUTO_INCREMENT PRIMARY KEY,
	idpublicacion		INT 				NOT NULL,
	idusuario				INT 				NOT NULL,
	comentario			MEDIUMTEXT 	NOT NULL,
	fechacomentado	DATETIME	 	NOT NULL DEFAULT NOW(),
	fechamodificado DATETIME 		NULL,
	estado 					BIT 				NOT NULL DEFAULT 1,
	CONSTRAINT fk_com_idpublicacion FOREIGN KEY(idpublicacion) REFERENCES publicaciones (idpublicacion),
	CONSTRAINT fk_com_idusuario FOREIGN KEY(idusuario) REFERENCES usuarios(idusuario)
)ENGINE = INNODB;

CREATE TABLE seguidores
(
	idseguidor 			INT AUTO_INCREMENT PRIMARY KEY,
	idfollowing			INT 			NOT NULL,
	idfollower			INT 			NOT NULL,
	fechaseguido		DATETIME	NOT NULL DEFAULT NOW(),
	fechaeliminado	DATETIME	NULL,
	estado 					BIT 			NOT NULL DEFAULT 1,
	CONSTRAINT fk_seg_idfollowing FOREIGN KEY(idfollowing) REFERENCES usuarios (idusuario),
	CONSTRAINT fk_seg_idfollower FOREIGN KEY(idfollower) REFERENCES usuarios (idusuario),
	CONSTRAINT uk_seg_idfollower UNIQUE(idfollowing, idfollower)
)ENGINE = INNODB;
