USE PUBLICATIONDB;

-- =============================================================================================================
-- VISTA DE PERSONAS Y DISTRITOS
-- -------------------------------------------------------------------------------------------------------------
CREATE VIEW vs_personas_listar AS
	SELECT 	PRS.idpersona, PRS.apellidos, PRS.nombres, PRS.fechanac,	
					PRS.telefono, DST.iddistrito, DST.distrito, PRV.idprovincia, 
					PRV.provincia, DPT.iddepartamento, DPT.departamento,
					CONCAT(
						CASE 
							WHEN PRS.tipocalle LIKE 'CA' THEN 'Calle'
							WHEN PRS.tipocalle LIKE 'AV' THEN 'Avenida'
							WHEN PRS.tipocalle LIKE 'UR' THEN 'Urbanización'
							WHEN PRS.tipocalle LIKE 'PJ' THEN 'Pasaje'
							WHEN PRS.tipocalle LIKE 'JR' THEN 'Jirón'
							WHEN PRS.tipocalle LIKE 'LT' THEN 'Lote'
						END, ' ', PRS.nombrecalle, ' #',
						CASE
							WHEN PRS.numerocalle IS NULL THEN 'S/N'
							WHEN PRS.numerocalle IS NOT NULL THEN PRS.numerocalle
						END, ' ',
						CASE
							WHEN PRS.pisodepa IS NULL THEN 'S/N'
							WHEN PRS.pisodepa IS NOT NULL THEN PRS.pisodepa
						END) AS 'direccion'								
		FROM personas PRS
		INNER JOIN distritos DST ON DST.iddistrito = PRS.iddistrito
		INNER JOIN provincias PRV ON PRV.idprovincia = DST.idprovincia
		INNER JOIN departamentos DPT ON DPT.iddepartamento = PRV.iddepartamento;

-- =============================================================================================================
-- VISTA DE USUARIOS
-- -------------------------------------------------------------------------------------------------------------
CREATE VIEW vs_usuarios_listar AS
	SELECT 	USU.idusuario, VPL.idpersona, VPL.apellidos, VPL.nombres, VPL.fechanac,
					USU.fechaalta, VPL.iddepartamento, VPL.departamento, VPL.idprovincia, 
					VPL.provincia, VPL.iddistrito, VPL.distrito, VPL.direccion,	VPL.telefono, 
					USU.rol, USU.email,	USU.clave, USU.nivelusuario, USU.estado
		FROM usuarios USU
		INNER JOIN vs_personas_listar VPL ON VPL.idpersona = USU.idpersona
		WHERE USU.estado = '1' OR USU.estado = '2';
		
	
	-- =============================================================================================================
-- VISTA DE GALERIAS Y ALBUNES
-- -------------------------------------------------------------------------------------------------------------
CREATE VIEW vs_galerias_listar AS
	SELECT 	GLR.idgaleria, VUL.idusuario, VUL.apellidos, VUL.nombres,
					GLR.idpublicacion, ALB.idalbum, ALB.nombrealbum, GLR.tipo, GLR.archivo,
					GLR.fechaalta
		FROM 	galerias GLR
		INNER JOIN albumes ALB ON ALB.idalbum = GLR.idalbum
		INNER JOIN vs_usuarios_listar VUL ON VUL.idusuario = GLR.idusuario
		WHERE GLR.estado <> 0;
		
	
	-- =============================================================================================================
-- VISTA DE PUBLICACIONES Y USUARIO
-- -------------------------------------------------------------------------------------------------------------
CREATE VIEW vs_publicaciones_listar AS 
	SELECT 	PBC.idpublicacion, USU.idusuario, PERS.idpersona, PERS.apellidos, 
					PERS.nombres, PBC.titulo, PBC.descripcion, PBC.fechapublicado,
					PBC.fechamodificado
		FROM publicaciones PBC
		INNER JOIN usuarios USU ON USU.idusuario = PBC.idusuario
		INNER JOIN personas PERS ON PERS.idpersona = USU.idpersona
		WHERE PBC.estado = 1;

-- =============================================================================================================
-- TABLA COMENTARIOS
-- ===========================================================================================================
CREATE VIEW vs_comentarios_listar AS 
	SELECT COM.idcomentario, PBC.idpublicacion, USU.idusuario, PERS.apellidos, 
				PERS.nombres, COM.comentario, COM.fechacomentado, COM.fechamodificado
		FROM comentarios COM
		INNER JOIN publicaciones PBC ON PBC.idpublicacion = COM.idpublicacion
		INNER JOIN usuarios USU ON USU.idusuario = COM.idusuario
		LEFT JOIN personas PERS ON PERS.idpersona = USU.idpersona
		WHERE PBC.estado = 1 AND COM.estado = 1;
		
		
-- =============================================================================================================
-- SEGUIDORES
-- ===========================================================================================================
CREATE VIEW vs_seguidores_listar AS
	SELECT SEG.idfollower, SEG.idfollowing, PER.idpersona, PER.nombres, 
				 PER.apellidos, SEG.fechaseguido,	USU.email
	FROM seguidores SEG
	INNER JOIN usuarios USU ON USU.idusuario = SEG.idfollower
	INNER JOIN personas PER ON PER.idpersona = USU.idpersona
	WHERE SEG.estado = 1 AND USU.estado = '1'
	ORDER BY SEG.idfollower;
	
	
-- =============================================================================================================
-- SEGUIDOS
-- ===========================================================================================================
CREATE VIEW vs_seguidos_listar AS
	SELECT SEG.idfollowing, SEG.idfollower, PER.idpersona, PER.nombres, 
				 PER.apellidos, SEG.fechaseguido,	USU.email
	FROM seguidores SEG
	INNER JOIN usuarios USU ON USU.idusuario = SEG.idfollowing
	INNER JOIN personas PER ON PER.idpersona = USU.idpersona
	WHERE SEG.estado = 1 AND USU.estado = '1'
	ORDER BY SEG.idfollowing;