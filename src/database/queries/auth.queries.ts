// src/database/queries/auth.queries.ts

export const authQueries = {
    // Crear credencial
    insertCredencial: `INSERT INTO credenciales (
                         id_usuario, username, password_hash
                       ) VALUES ($1, $2, $3) 
                       RETURNING *`,
    
    // Buscar por username
    findCredencialByUsername: `SELECT c.*, u.*, r.nombre as rol_nombre 
                               FROM credenciales c
                               JOIN usuarios u ON c.id_usuario = u.id_usuario
                               LEFT JOIN rol r ON u.id_rol = r.id_rol
                               WHERE c.username = $1`,
    
    // Buscar por email (para recuperación)
    findUsuarioByEmail: `SELECT u.*, c.username 
                         FROM usuarios u
                         LEFT JOIN credenciales c ON u.id_usuario = c.id_usuario
                         WHERE u.correo_electronico = $1`,
    
    // Actualizar refresh token
    updateRefreshToken: `UPDATE credenciales 
      SET refresh_token = $1
      WHERE id_usuario = $2 
      RETURNING *`, 
    
    // Limpiar refresh token (logout)
    clearRefreshToken: `UPDATE credenciales 
                        SET refresh_token = NULL
                        WHERE id_usuario = $1`,
    
    // Guardar reset token
    saveResetToken: `UPDATE credenciales 
    SET reset_token = $1, reset_expiracion = $2,
    reset_usado = FALSE 
    WHERE id_usuario = $3`,
    
    // Buscar por reset token
    findCredencialByResetToken: `SELECT c.*, u.* 
                                 FROM credenciales c
                                 JOIN usuarios u ON c.id_usuario = u.id_usuario
                                 WHERE c.reset_token = $1 AND c.reset_usado = FALSE 
                                 AND c.reset_expiracion > CURRENT_TIMESTAMP`,
    
    // Cambiar password
    cambiarPassword: `UPDATE credenciales 
                      SET password_hash = $1, reset_usado = TRUE
                      WHERE id_usuario = $2 
                      RETURNING *`,
    
    // Verificar si username existe
    checkUsernameExists: `SELECT id_usuario FROM credenciales WHERE username = $1`,
};