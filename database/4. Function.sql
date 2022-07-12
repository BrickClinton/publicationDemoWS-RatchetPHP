-- DIVIDIR 2 NUMEROS
DELIMITER $$
CREATE FUNCTION DIVIDENUM
(
	_num1 DECIMAL(7,2), 
	_num2 DECIMAL(7,2)
)
RETURNS DECIMAL(7,2)
BEGIN
	DECLARE _salida DECIMAL(7,2);
	
	SET _salida = _num1 / _num2;
	SET _salida = ROUND(_salida, 2); -- Redondear a 2 decimales
	
	IF _salida IS NULL THEN SET _salida = 0; END IF;
	
	RETURN _salida;
END $$


-- TOTAL DE TRABAJOS POR USUARIO
DELIMITER $$
CREATE FUNCTION TOTAL_PUBLICACIONES(_idusuario INT)
RETURNS INT
BEGIN
	DECLARE _salida INT;
	
	SET _salida =	(SELECT COUNT(*)  
		FROM publicaciones 
		WHERE idusuario = _idusuario AND estado = '1');
	
	RETURN _salida;
END $$


-- OBTENER EL TOTAL DE REACCIONES POR TRABAJO
DELIMITER $$
CREATE FUNCTION TOTAL_REACCIONES(_idpublicacion INT)
RETURNS INT
BEGIN
	DECLARE _total INT;
	SET _total =	(SELECT SUM(CLF.puntuacion) AS 'puntos' 
			FROM calificaciones CLF
			INNER JOIN publicaciones PBC ON PBC.idpublicacion = CLF.idpublicacion
			WHERE PBC.idpublicacion = _idpublicacion
			GROUP BY PBC.idpublicacion);
		
	RETURN _total;
END $$


-- CALIFICACION POR TRABAJO (1 - 5)
DELIMITER $$
CREATE FUNCTION CALIFICACION_PUBLICACION(_idpublicacion INT)
RETURNS DECIMAL(4,2)
BEGIN
	DECLARE _calificacion DECIMAL(4,2);
	DECLARE _total_usuario INT;
	DECLARE _total_reacion INT;
	
	SET _total_usuario = (SELECT COUNT(*) FROM usuarios WHERE estado = '1');
	SET _total_reacion = TOTAL_REACCIONES(_idpublicacion);	
	SET _calificacion = DIVIDENUM(_total_reacion, _total_usuario);
	
	RETURN _calificacion;
END $$

-- SUMA DE TODAS LAS CALIFICACIONES DE LO QUE PERTENECEN A UN USUARIO
DELIMITER $$
CREATE FUNCTION TCALIFICACION_PUBLICACION(_idusuario INT)
RETURNS DECIMAL(4,2)
BEGIN
	DECLARE _total DECIMAL(4,2);	
	SET _total =	(SELECT SUM(CALIFICACION_PUBLICACION(idpublicacion)) FROM publicaciones WHERE idusuario = _idusuario);
				
	RETURN _total;
END $$

-- ESTRELLAS DEL USUARIO
DELIMITER $$
CREATE FUNCTION TCALIFICACION_USUARIO(_idusuario INT)
RETURNS DECIMAL(4,2)
BEGIN
	RETURN DIVIDENUM(TCALIFICACION_PUBLICACION(_idusuario), TOTAL_PUBLICACIONES(_idusuario));
END $$