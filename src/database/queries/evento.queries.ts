export const eventoQueries = {
    insert: `INSERT INTO evento (id_liga, equipo_local, equipo_visitante, fecha_hora_inicio, fecha_hora_fin, resultado, estado, usuario_creacion, usuario_modificacion) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    
    selectAll: `SELECT * FROM evento ORDER BY id_evento`,
    
    selectById: `SELECT * FROM evento WHERE id_evento = $1`,
    
    update: `UPDATE evento SET 
             id_liga = $1,
             equipo_local = $2,
             equipo_visitante = $3,
             fecha_hora_inicio = $4,
             fecha_hora_fin = $5,
             resultado = $6, 
             estado = $7,
             usuario_modificacion = $8, 
             fecha_modificacion = CURRENT_TIMESTAMP 
             WHERE id_evento = $9 RETURNING *`,
    
    delete: `DELETE FROM evento WHERE id_evento = $1`,
};