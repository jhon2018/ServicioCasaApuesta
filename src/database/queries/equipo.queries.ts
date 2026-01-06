export const equipoQueries = {
    insert: `INSERT INTO equipo (id_liga, nombre, abreviatura, usuario_creacion, usuario_modificacion) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    
    selectAll: `SELECT * FROM equipo ORDER BY id_equipo`,
    
    selectById: `SELECT * FROM equipo WHERE id_equipo = $1`,
    
    update: `UPDATE equipo SET 
             id_liga = $1,
             nombre = $2, 
             abreviatura = $3,
             usuario_modificacion = $4, 
             fecha_modificacion = CURRENT_TIMESTAMP 
             WHERE id_equipo = $5 RETURNING *`,
    
    delete: `DELETE FROM equipo WHERE id_equipo = $1`,
};