
-- =============================================================================================================
-- UBIGEO
-- -------------------------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE spu_departamentos_listar()
BEGIN
	SELECT * FROM departamentos;
END $$

DELIMITER $$
CREATE PROCEDURE spu_provincias_listar(IN _iddepartamento	VARCHAR(2))
BEGIN
	SELECT * FROM provincias WHERE iddepartamento = _iddepartamento;
END $$


DELIMITER $$
CREATE PROCEDURE spu_distritos_listar(IN _idprovincia VARCHAR(4))
BEGIN
	SELECT * FROM distritos WHERE idprovincia = _idprovincia;
END $$

-- =============================================================================================================
-- TABLA PERSONAS
-- -------------------------------------------------------------------------------------------------------------
-- REGISTRAR PERSONAS--
DELIMITER $$
CREATE PROCEDURE spu_personas_registrar
(
	IN _iddistrito 	VARCHAR(6),
	IN _apellidos		VARCHAR(40),
	IN _nombres			VARCHAR(40), 
	IN _fechanac		DATE,
	IN _telefono		CHAR(11),
	IN _tipocalle 	CHAR(2),	
	IN _nombrecalle VARCHAR(60),
	IN _numerocalle VARCHAR(5),
	IN _pisodepa  	VARCHAR(5)

)
BEGIN
	IF _telefono = ''  THEN SET _telefono  = NULL; END IF;
	IF _numerocalle = ''  THEN SET _numerocalle  = NULL; END IF;
	IF _pisodepa = '' THEN SET _pisodepa = NULL; END IF;
	
	INSERT INTO personas (iddistrito, apellidos, nombres, fechanac, telefono, tipocalle, nombrecalle, numerocalle, pisodepa)
		VALUES (_iddistrito, _apellidos, _nombres, _fechanac, _telefono, _tipocalle, _nombrecalle, _numerocalle, _pisodepa);
		
	SELECT LAST_INSERT_ID() AS 'idpersona';
END $$


-- MODIFICAR PERSONA -- 
DELIMITER $$
CREATE PROCEDURE spu_personas_modificar
(
	IN _idpersona 		INT,
	IN _apellidos			VARCHAR(40),
	IN _nombres				VARCHAR(40), 
	IN _fechanac			DATE,
	IN _telefono			CHAR(11),
	IN _tipocalle 		CHAR(2),	
	IN _nombrecalle 	VARCHAR(60),
	IN _numerocalle 	VARCHAR(5),
	IN _pisodepa  		VARCHAR(5)
)
BEGIN
	IF _telefono = ''  THEN SET _telefono  = NULL; END IF;
	IF _numerocalle = ''  THEN SET _numerocalle  = NULL; END IF;
	IF _pisodepa = '' THEN SET _pisodepa = NULL; END IF;
	
	UPDATE personas SET
		apellidos 	= _apellidos, 
		nombres 	= _nombres, 
		fechanac 	= _fechanac,
		telefono 	= _telefono,
		tipocalle 	= _tipocalle,
		nombrecalle = _nombrecalle,
		numerocalle = _numerocalle,
		pisodepa 	= _pisodepa
	WHERE idpersona = _idpersona; 
END $$


-- OBTENER DATOS DE UNA PERSONA--
DELIMITER $$
CREATE PROCEDURE spu_personas_getdata(IN _idpersona INT)
BEGIN
	SELECT * FROM personas WHERE idpersona = _idpersona;
END $$

CALL spu_personas_getdata(5);

-- =============================================================================================================
-- TABLA USUARIOS
-- -------------------------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE spu_usuarios_listar()
BEGIN
	SELECT * FROM vs_usuarios_listar
		ORDER BY idusuario DESC;
END $$


DELIMITER $$
CREATE PROCEDURE spu_usuarios_registrar
(
	IN _idpersona 			INT,
	IN _email 					VARCHAR(70),
	IN _clave	 					VARCHAR(80)
)
BEGIN
	INSERT INTO usuarios (idpersona, email, clave) VALUES 
		(_idpersona, _email, _clave);
	
	SELECT LAST_INSERT_ID() AS 'idusuario';
END $$


DELIMITER $$
CREATE PROCEDURE spu_usuarios_getdata(IN _idusuario INT)
BEGIN
	SELECT * FROM usuarios
		WHERE idusuario = _idusuario;
END $$


DELIMITER $$
CREATE PROCEDURE spu_usuarios_modificar
(
	IN _idusuario 			INT,
	IN _idpersona 			INT,
	IN _email 					VARCHAR(70),
	IN _clave	 					VARCHAR(80)
)
BEGIN
	UPDATE usuarios SET 
		idpersona 			= _idpersona,
		email 					= _email,
		clave 					= _clave
	WHERE idusuario = _idusuario;
END $$

-- Actualizar correos
DELIMITER $$
CREATE PROCEDURE spu_usuarios_modificar_emails
(
	IN _idusuario 			INT,
	IN _email 					VARCHAR(70)
)
BEGIN
	UPDATE usuarios SET 
		email 				= _email
	WHERE idusuario = _idusuario;
END $$

DELIMITER $$
CREATE PROCEDURE spu_usuarios_modificar_clave
(
	IN _idusuario 			INT,
	IN _clave 					VARCHAR(80)
)
BEGIN
	UPDATE usuarios SET 
		clave 					= _clave
	WHERE idusuario = _idusuario;
END $$


DELIMITER $$
CREATE PROCEDURE spu_usuarios_eliminar(IN _idusuario INT)
BEGIN
	UPDATE usuarios SET estado = '0' 
		WHERE idusuario = _idusuario;
END $$

DELIMITER $$
CREATE PROCEDURE spu_usuarios_login(IN _email VARCHAR(70))
BEGIN
	SELECT * FROM usuarios
		WHERE email = _email AND estado = '1';
END $$


DELIMITER $$
CREATE PROCEDURE spu_usuarios_buscar_nombres_scroll(
	IN _search VARCHAR(40),
	IN _offset INT,
	IN _limit  TINYINT 
)
BEGIN
	SELECT* FROM vs_usuarios_listar
		WHERE nombres LIKE CONCAT('%', _search, '%') LIMIT _limit OFFSET _offset;
END $$

DELIMITER $$
CREATE PROCEDURE spu_usuarios_edit_pass
(
	IN _idusuario INT,
	IN _clave VARCHAR(80)
)
BEGIN
	UPDATE usuarios SET clave = _clave WHERE idusuario = _idusuario;
END


-- =============================================================================================================
-- TABLA DE SEGUIDORES
-- -------------------------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE spu_seguidor_registrar(IN _idfollowing INT, IN _idfollower INT)
BEGIN
	DECLARE _idseguidor INT;
	SET _idseguidor = (SELECT idseguidor FROM seguidores WHERE idfollowing = _idfollowing AND idfollower = _idfollower);
	
	IF _idseguidor IS NULL THEN
		INSERT INTO seguidores (idfollowing, idfollower) VALUES
		(_idfollowing, _idfollower);
	ELSE
		UPDATE seguidores SET estado = 1 WHERE idseguidor = _idseguidor;
	END IF;	
END $$


DELIMITER $$
CREATE PROCEDURE spu_seguidor_verificar
(
	IN _idusuario 	INT, 
	IN _idfollower 	INT
)
BEGIN
	DECLARE _id INT;
	SET _id = (SELECT idfollower FROM vs_seguidores_listar
	 WHERE idfollowing = _idusuario  AND idfollower = _idfollower);
	 
	IF _id IS NULL THEN
		SELECT FALSE AS 'estado';
	ELSE 
		SELECT TRUE AS 'estado';
	END IF;
END $$


DELIMITER $$
CREATE PROCEDURE spu_seguidores_listar
(
	IN _idusuario 	INT, 
	IN _idfollower 	INT,
	IN _limit 			TINYINT
)
BEGIN
	SELECT * FROM vs_seguidores_listar
	 WHERE idfollowing = _idusuario  AND idfollower > _idfollower LIMIT _limit;
END $$


DELIMITER $$
CREATE PROCEDURE spu_seguidos_listar
(
	IN _idusuario 	INT,
	IN _idfollowing INT,
	IN _limit 			TINYINT
)
BEGIN
	SELECT * FROM vs_seguidos_listar
	WHERE idfollower = _idusuario AND idfollowing > _idfollowing LIMIT _limit;
END $$


DELIMITER $$
CREATE PROCEDURE spu_seguidores_conteo(IN _idusuario INT)
BEGIN
	SELECT COUNT(idfollowing) AS 'totalseguidores'
	FROM seguidores
	WHERE idfollowing = _idusuario AND estado = 1;
END $$


DELIMITER $$
CREATE PROCEDURE spu_seguidos_conteo(IN _idusuario INT)
BEGIN
	SELECT COUNT(idfollower) AS 'totalseguidos'
	FROM seguidores
	WHERE idfollower = _idusuario AND estado = 1;
END $$

DELIMITER $$
CREATE PROCEDURE spu_seguidos_eliminar(IN _idusuario INT, IN _following INT)
BEGIN
	UPDATE seguidores SET
	estado = 0
	WHERE idfollower = _idusuario AND idfollowing = _following;
END $$


-- =============================================================================================================
-- TABLA ALBUMES
-- -------------------------------------------------------------------------------------------------------------==
DELIMITER $$
CREATE PROCEDURE spu_albumes_listar_usuario(IN _idusuario INT)
BEGIN
	SELECT ALB.idalbum, ALB.idusuario, ALB.nombrealbum, ALB.estado,
					COUNT(ALB.idalbum) AS 'totalimages'
		FROM albumes ALB
		RIGHT JOIN galerias GLR ON GLR.idalbum = ALB.idalbum			
		WHERE ALB.idusuario = _idusuario AND ALB.estado = 1 AND GLR.estado <> '0'
		GROUP BY ALB.idalbum ORDER BY ALB.idalbum;
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_listar_select_usuario(IN _idusuario INT)
BEGIN
	SELECT * FROM albumes 
		WHERE idusuario = _idusuario AND estado = 1;
END $$


DELIMITER $$
CREATE PROCEDURE spu_albumes_count_archivos(IN _idalbum INT)
BEGIN
	SELECT SUM(albumes.`idalbum`) FROM albumes 
		INNER JOIN galerias ON galerias.`idalbum` = albumes.`idalbum`
		GROUP BY albumes.idalbum
		WHERE idusuario = _idusuario AND estado = 1 ORDER BY idalbum;
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_getdata(IN _idalbum INT)
BEGIN
	SELECT * FROM albumes 
		WHERE idalbum = _idalbum AND estado = 1;
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_registrar
(
	IN _idusuario 	INT,
	IN _nombrealbum VARCHAR(30)
)
BEGIN
	DECLARE _idalbum INT;
	SET _idalbum = (SELECT idalbum FROM albumes WHERE idusuario = _idusuario AND nombrealbum = _nombrealbum);
	
	IF _idalbum IS NULL THEN
		INSERT INTO albumes (idusuario, nombrealbum) VALUES
			(_idusuario, _nombrealbum);
	ELSE 
		UPDATE albumes SET estado = 1
			WHERE idalbum = _idalbum;
	END IF;
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_predeterminados
(
	IN _idusuario 	INT
)
BEGIN
	INSERT INTO albumes (idusuario, nombrealbum) VALUES (_idusuario, 'Perfil');
	INSERT INTO albumes (idusuario, nombrealbum) VALUES (_idusuario, 'Portada');
	INSERT INTO albumes (idusuario, nombrealbum) VALUES (_idusuario, 'Publicaciones');
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_getalbum(IN _idusuario INT, IN _nombrealbum VARCHAR(30))
BEGIN
	SELECT * FROM albumes 
		WHERE nombrealbum = _nombrealbum AND idusuario = _idusuario;
END $$

DELIMITER $$
CREATE PROCEDURE spu_albumes_modificar
(
	IN _idalbum			INT,
	IN _nombrealbum VARCHAR(30)
)
BEGIN
	UPDATE albumes SET 
			nombrealbum = _nombrealbum
		WHERE idalbum = _idalbum;
END $$

SELECT * FROM albumes WHERE idalbum = 12;

DELIMITER $$
CREATE PROCEDURE spu_albumes_eliminar(IN _idalbum INT)
BEGIN
	UPDATE albumes SET 
		estado = 0
	WHERE idalbum = _idalbum;
END $$

-- =============================================================================================================
-- TABLA GALERIA
-- -------------------------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE spu_galerias_listar_usuario(IN _idusuario INT)
BEGIN
	SELECT * FROM vs_galerias_listar 
		WHERE idusuario = _idusuario AND tipo = "F";
END $$

DELIMITER $$
CREATE PROCEDURE spu_galerias_listar_album(IN _idalbum INT)
BEGIN
	SELECT * FROM vs_galerias_listar WHERE idalbum = _idalbum AND tipo = 'F';
END $$


DELIMITER $$
CREATE PROCEDURE spu_galerias_listar_publicacion(IN _idpublicacion INT)
BEGIN
	SELECT * FROM vs_galerias_listar WHERE idpublicacion = _idpublicacion;
END $$


DELIMITER $$
CREATE PROCEDURE spu_galerias_getdata(IN _idgaleria INT)
BEGIN
	SELECT * FROM vs_galerias_listar WHERE idgaleria = _idgaleria;
END $$

DELIMITER $$
CREATE PROCEDURE spu_galerias_registrar
(
	IN _idalbum 			INT,
	IN _idusuario 		INT,
	IN _idpublicacion INT,
	IN _tipo 					CHAR(1),
	IN _archivo 			VARCHAR(100),
	IN _estado				CHAR(1)
)
BEGIN
	IF _idalbum = '' THEN SET _idalbum = NULL; END IF;
	IF _idpublicacion = '' THEN SET _idpublicacion = NULL; END IF;
	
	INSERT INTO galerias (idalbum, idusuario, idpublicacion, tipo, archivo, estado) VALUES
		(_idalbum, _idusuario, _idpublicacion, _tipo, _archivo, _estado);
END $$

DELIMITER $$
CREATE PROCEDURE spu_galerias_modificar
(
	IN _idgaleria INT,
	IN _idalbum 	INT
)
BEGIN
	IF _idalbum = '' THEN SET _idalbum = NULL; END IF;
	
	UPDATE galerias SET
		fechaalta = NOW(),
		idalbum 	= _idalbum
	WHERE idgaleria = _idgaleria;
END $$


DELIMITER $$
CREATE PROCEDURE spu_galerias_eliminar(IN _idgaleria INT)
BEGIN
	UPDATE galerias SET
		fechabaja = NOW(),
		estado = '0'
	WHERE idgaleria = _idgaleria;
END $$

DELIMITER $$
CREATE PROCEDURE spu_galerias_foto_ultima(IN _idusuario INT, IN _nombrealbum VARCHAR(30))
BEGIN	
		SELECT * FROM vs_galerias_listar
			WHERE nombrealbum = _nombrealbum AND  idusuario = idusuario AND tipo = 'F'
			ORDER BY fechaalta DESC LIMIT 1;
END $$

-- MEJORAR
DELIMITER $$
CREATE PROCEDURE spu_galerias_foto_perfil(IN _idusuario INT)
BEGIN	
		SELECT * FROM vs_galerias_listar
			WHERE nombrealbum = 'Perfil' AND  idusuario = _idusuario
			ORDER BY fechaalta DESC LIMIT 1;
END $$

SELECT * FROM galerias WHERE idalbum = 3;

DELIMITER $$
CREATE PROCEDURE spu_galerias_foto_portada(IN _idusuario INT)
BEGIN	
		SELECT * FROM vs_galerias_listar
			WHERE nombrealbum = 'Portada' AND  idusuario = _idusuario
			ORDER BY fechaalta DESC LIMIT 1;
END $$


-- =============================================================================================================
-- TABLA PUBLICACIONES
-- -------------------------------------------------------------------------------------------------------------
/* REGISTRAR */
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_registrar
(
	IN _idusuario				INT ,
	IN _titulo					VARCHAR(200),
	IN _descripcion			MEDIUMTEXT
)
BEGIN 
	INSERT INTO publicaciones (idusuario, titulo, descripcion) VALUES
		(_idusuario , _titulo , _descripcion);
		
	SELECT LAST_INSERT_ID() AS 'idpublicacion'; -- ULTIMO ID REGISTRADO
END $$

/* ACTUALIZAR */
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_modificar
(	
	IN _idpublicacion		INT ,
	IN _idusuario				INT ,
	IN _titulo					VARCHAR(200),
	IN _descripcion			MEDIUMTEXT
)
BEGIN 
	UPDATE publicaciones SET 
		idusuario 		 = _idusuario,
		titulo				 = _titulo,
		descripcion		 = _descripcion
	WHERE idpublicacion = _idpublicacion;
END $$

DELIMITER $$
CREATE PROCEDURE spu_publicaciones_listar
(
	IN _offset 		INT,
	IN _limit 		INT
)
BEGIN
	SELECT * FROM vs_publicaciones_listar
		ORDER BY fechapublicado DESC LIMIT _limit OFFSET _offset;
END $$

DELIMITER $$
CREATE PROCEDURE spu_publicaciones_listar_limit
(
	IN _idpublicacion	INT,
	IN _limit 				INT
)
BEGIN
	SELECT * FROM vs_publicaciones_listar
		WHERE idpublicacion < _idpublicacion
		ORDER BY fechapublicado DESC LIMIT _limit;
END $$

-- AUTOCOMPLETADO
DELIMITER $$
CREATE PROCEDURE spu_lista_autocomplete_publicaciones(IN _titulo VARCHAR(200))
BEGIN
	SELECT * FROM publicaciones 
		WHERE titulo LIKE CONCAT('%', _titulo, '%') 
		GROUP BY titulo
		LIMIT 12;
END $$

-- AUTOCOMPLETADO POR USUARIO
DELIMITER $$
CREATE PROCEDURE spu_lista_autocomplete_publicaciones_usuario(IN _titulo VARCHAR(200), IN _idusuario INT)
BEGIN
	SELECT * FROM publicaciones 
		WHERE titulo LIKE CONCAT('%', _titulo, '%') AND idusuario = _idusuario
		GROUP BY titulo
		LIMIT 12;
END $$


-- FILTRADOS
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_listar_filtrados_limit
(
	IN _titulo				VARCHAR(200),
	IN _idpublicacion INT,
	IN _limit   			INT
)
BEGIN
	SELECT * FROM vs_publicaciones_listar
		WHERE idpublicacion < _idpublicacion AND titulo LIKE CONCAT('%', _titulo, '%')
		ORDER BY fechapublicado DESC LIMIT _limit;
END $$

-- FILTRADOS POR USUARIO
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_listar_filtrados_usuario_limit
(
	IN _titulo				VARCHAR(200),
	IN _idusuario     INT,
	IN _idpublicacion INT,
	IN _limit   			INT
)
BEGIN
	SELECT * FROM vs_publicaciones_listar
		WHERE idpublicacion < _idpublicacion AND
			idusuario = _idusuario AND
			titulo LIKE CONCAT('%', _titulo, '%')
		ORDER BY fechapublicado DESC LIMIT _limit;
END $$


-- ID MAYOR ENCONTRADO EN LA BUSQUEDA
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_maxid_encontrado()
BEGIN
	SELECT MAX(idpublicacion) AS 'idpublicacion' 
		FROM publicaciones
		WHERE estado = 1;
END $$


DELIMITER $$
CREATE PROCEDURE spu_publicaciones_listar_usuario
(
	IN _idusuario 		INT,
	IN _idpublicacion INT,
	IN _limit   			INT
)
BEGIN
	SELECT * FROM vs_publicaciones_listar
		WHERE idusuario = _idusuario AND
			idpublicacion < _idpublicacion
		ORDER BY idpublicacion DESC LIMIT _limit;
END $$


-- OBTENER UN REGISTRO
DELIMITER $$
CREATE PROCEDURE spu_publicaciones_getdata(IN _idpublicacion INT)
BEGIN
	SELECT * FROM vs_publicaciones_listar WHERE idpublicacion = _idpublicacion;
END $$


DELIMITER $$
CREATE PROCEDURE spu_publicaciones_eliminar(IN _idpublicacion INT)
BEGIN 
	UPDATE publicaciones SET estado = 0
		WHERE idpublicacion = _idpublicacion;
END $$

-- =============================================================================================================
-- TABLA COMENTARIOS
-- -------------------------------------------------------------------------------------------------------------

/* LISTAR */
DELIMITER $$
CREATE PROCEDURE spu_comentarios_listar_publicacion(IN _idpublicacion INT)
BEGIN
	SELECT * FROM vs_comentarios_listar
		WHERE idpublicacion = _idpublicacion
		ORDER BY idcomentario ASC;
END $$

DELIMITER $$
CREATE PROCEDURE spu_comentarios_listar_publicacion_limit
(
	IN _idpublicacion INT,
	IN _idcomentario  INT,
	IN _limit 				TINYINT
)
BEGIN
	SELECT * FROM vs_comentarios_listar
		WHERE idpublicacion = _idpublicacion AND
					idcomentario > _idcomentario
		ORDER BY fechacomentado ASC LIMIT _limit;
END $$

DELIMITER $$
CREATE PROCEDURE spu_comentarios_total_publicacion(IN _idpublicacion INT)
BEGIN
	SELECT idpublicacion, COUNT(idcomentario) AS 'total' FROM vs_comentarios_listar
		WHERE idpublicacion = _idpublicacion
		GROUP BY idpublicacion;
END $$


/* REGISTRAR */
DELIMITER $$
CREATE PROCEDURE spu_comentarios_registrar
(
	IN _idpublicacion		INT,
	IN _idusuario		INT,
	IN _comentario	MEDIUMTEXT
)
BEGIN 
	INSERT INTO comentarios (idpublicacion , idusuario , comentario ) VALUES 
		(_idpublicacion , _idusuario,_comentario);
		
	SELECT LAST_INSERT_ID() AS 'idcomentario';
END $$

/* GET DATA*/
DELIMITER $$
CREATE PROCEDURE spu_comentarios_getdata
(
	IN _idcomentario INT
)
BEGIN 
	SELECT * FROM vs_comentarios_listar WHERE idcomentario = _idcomentario;
END $$


/* MODIFICAR*/
DELIMITER $$
CREATE PROCEDURE spu_comentarios_modificar
(
	IN _idcomentario INT,
	IN _comentario	MEDIUMTEXT
)
BEGIN 
	UPDATE comentarios SET
		comentario 			= _comentario,
		fechamodificado = NOW()
	WHERE idcomentario = _idcomentario;
END $$

/* ELIMINAR */
DELIMITER $$
CREATE PROCEDURE spu_comentarios_eliminar(IN _idcomentario INT)
BEGIN 
	UPDATE comentarios SET estado = 0
		WHERE idcomentario = _idcomentario;
END $$


-- =============================================================================================================
-- TABLA CALIFICACIONES
-- -------------------------------------------------------------------------------------------------------------

/* LISTAR */
/* REGISTRAR */
DELIMITER $$
CREATE PROCEDURE spu_calificaciones_registrar
(
	IN _idpublicacion		INT,
	IN _idusuario		INT,
	IN _puntuacion	TINYINT 
)
BEGIN 
	INSERT INTO calificaciones (idpublicacion , idusuario , puntuacion) VALUES
		(_idpublicacion , _idusuario , _puntuacion);
END $$

/* MODIFICAR */
DELIMITER $$
CREATE PROCEDURE spu_calificaciones_modificar
(
	IN _idcalificacion 	INT,
	IN _puntuacion			TINYINT 
)
BEGIN 
	UPDATE calificaciones SET 
		puntuacion = _puntuacion
	WHERE idcalificacion = _idcalificacion;
END $$

-- MODIFICAR O ELIMINAR PUNTUACIÓN
DELIMITER $$
CREATE PROCEDURE spu_calificaciones_modificar_eliminar
(
	IN _idcalificacion 	INT,
	IN _puntuacion			TINYINT 
)
BEGIN
	DECLARE _puntaje_anterior TINYINT;
	SET _puntaje_anterior = (SELECT puntuacion FROM calificaciones WHERE idcalificacion = _idcalificacion);
	
	IF _puntaje_anterior = _puntuacion THEN
		CALL spu_calificaciones_modificar(_idcalificacion, 0);
	ELSE
		CALL spu_calificaciones_modificar(_idcalificacion, _puntuacion);
	END IF;
END $$

-- PUNTUACIÓN DEL USUARIO
DELIMITER $$
CREATE PROCEDURE spu_reacciones_publicacion_usuario(IN _idpublicacion INT, IN _idusuario INT)
BEGIN
	SELECT idcalificacion, puntuacion FROM calificaciones 
		WHERE idpublicacion = _idpublicacion AND idusuario = _idusuario;
END $$

-- =============================================================================================================
-- GENERAR PUNTUACIONES POR TRABAJO Y POR USUARIO
-- -------------------------------------------------------------------------------------------------------------
-- TOTAL DE PUBLICACIONES POR USUARIO
DELIMITER $$
CREATE PROCEDURE spu_total_publicaciones_usuario(IN _idusuario INT)
BEGIN
	SELECT COUNT(*) AS 'total' FROM publicaciones WHERE idusuario = _idusuario;
END $$


-- TOTAL DE REACCIONES POR PUBLICACIÓN
DELIMITER $$
CREATE PROCEDURE spu_total_reaciones_publicacion(IN _idpublicacion INT)
BEGIN
	SELECT SUM(CLF.puntuacion) AS 'total' 
			FROM calificaciones CLF
			INNER JOIN publicaciones PBC ON PBC.idpublicacion = CLF.idpublicacion
			WHERE PBC.idpublicacion = _idpublicacion
			GROUP BY PBC.idpublicacion;
END $$

-- TOTAL DE USUARIOS QUE REACCIONARÓN A UNA PUBLICACIÓN DE TRABAJO
DELIMITER $$
CREATE PROCEDURE  spu_total_usuarios_reaccion_publicacion(IN _idpublicacion INT)
BEGIN
	SELECT idpublicacion, COUNT(DISTINCT(idusuario)) AS 'usuarios'
	FROM calificaciones
	GROUP BY idpublicacion
	HAVING idpublicacion = _idpublicacion;
END $$;


CALL spu_total_usuarios_reaccion_publicacion(13);

-- CALIFICACION POR CADA PUBLICACION
DELIMITER $$
CREATE PROCEDURE spu_estrellas_publicacion(IN _idpublicacion INT)
BEGIN
	DECLARE estrellas DECIMAL(4,2);
	DECLARE total_usuario INT;
	DECLARE total_reacion INT;
	
	SET total_usuario = (SELECT COUNT(*) FROM usuarios);
	SET total_reacion = TOTAL_REACCIONES(_idpublicacion);
	SET estrellas = DIVIDENUM(total_reacion, total_usuario);
	
	SELECT estrellas;
END $$


-- TOTAL DE ESTRELLAS POR TODOS LAS PUBLICACIONES DEL USUARIO
DELIMITER $$
CREATE PROCEDURE spu_total_calificacion_publicaciones(IN _idusuario INT)
BEGIN
	SELECT SUM(CALIFICACION_PUBLICACION(idpublicacion)) AS 'total' 
		FROM publicaciones
		WHERE idusuario = _idusuario AND estado = 1;
END $$


-- ESTRELLAS POR USUARIOS
DELIMITER $$
CREATE PROCEDURE spu_estrellas_usuario(IN _idusuario INT)
BEGIN
	SELECT DIVIDENUM(TCALIFICACION_PUBLICACION(_idusuario), TOTAL_PUBLICACIONES(_idusuario)) AS 'estrellas';
END $$
