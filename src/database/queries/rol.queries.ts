//Ruta: src/database/queries/rol.queries.ts
export const rolQueries = {
    insert: `INSERT INTO rol (nombre, usuario_creacion, usuario_modificacion) 
             VALUES ($1, $2, $3) RETURNING *`,
    
    selectAll: `SELECT * FROM rol ORDER BY id_rol`,
    
    selectById: `SELECT * FROM rol WHERE id_rol = $1`,
    
    update: `UPDATE rol 
             SET nombre = $1, usuario_modificacion = $2, fecha_modificacion = CURRENT_TIMESTAMP 
             WHERE id_rol = $3 RETURNING *`,
    
    delete: `DELETE FROM rol WHERE id_rol = $1`,
    
    // Para endpoint 6-7: verificar si rol está asignado
    countUsuariosByRol: `SELECT COUNT(*) FROM usuarios WHERE id_rol = $1`,
    
    // Para endpoint 6: asignar rol a usuario
    asignarRolUsuario: `UPDATE usuarios SET id_rol = $1 WHERE id_usuario = $2 RETURNING id_usuario, nombre`,
    
    // Para endpoint 7: listar usuarios con este rol
    getUsuariosByRol: `SELECT id_usuario, nombre, correo_electronico 
                       FROM usuarios WHERE id_rol = $1`
};