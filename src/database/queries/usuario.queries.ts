// src/database/queries/usuario.queries.ts
export const usuarioQueries = {
    //(con defaults para fecha_creacion, fecha_modificacion)
    insert: `INSERT INTO usuarios (
                tipo_usuario, nombre, telefono, 
                correo_electronico, estado, id_rol
             ) VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,  
    
    // SELECT ALL
    selectAll: `SELECT u.*, r.nombre as rol_nombre 
                FROM usuarios u 
                LEFT JOIN rol r ON u.id_rol = r.id_rol 
                ORDER BY u.id_usuario`,
    
    // SELECT BY ID
    selectById: `SELECT u.*, r.nombre as rol_nombre 
                 FROM usuarios u 
                 LEFT JOIN rol r ON u.id_rol = r.id_rol 
                 WHERE u.id_usuario = $1`,
    
    // UPDATE - Actualiza fecha_modificacion automáticamente
    update: `UPDATE usuarios 
             SET tipo_usuario = $1, nombre = $2, telefono = $3, 
                 correo_electronico = $4, id_rol = $5,
                 fecha_modificacion = CURRENT_TIMESTAMP
             WHERE id_usuario = $6 
             RETURNING *`,
    
    // UPDATE ESTADO
    updateEstado: `UPDATE usuarios 
                   SET estado = $1, fecha_modificacion = CURRENT_TIMESTAMP
                   WHERE id_usuario = $2 
                   RETURNING *`,
    
    // DELETE
    delete: `DELETE FROM usuarios WHERE id_usuario = $1`,
    
    // UPDATE ROL
    updateRol: `UPDATE usuarios 
                SET id_rol = $1, fecha_modificacion = CURRENT_TIMESTAMP
                WHERE id_usuario = $2 
                RETURNING *`,
    
    // Verificar correo
    checkEmailExists: `SELECT id_usuario FROM usuarios WHERE correo_electronico = $1`,
    
    // Verificar dependencias
    checkDependencias: `
        SELECT 
            (SELECT COUNT(*) FROM apuesta WHERE id_usuario = $1) as total_apuestas,
            (SELECT COUNT(*) FROM billetera WHERE id_usuario = $1) as tiene_billetera
    `
};