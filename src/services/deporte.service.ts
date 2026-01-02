import { Pool } from 'pg';
import { Deporte } from '../models/deporte.model';
import {pool} from '../database/queries/connection';
import { crearDeporteSchema } from '../schemas/deporte.schema';


export const getDeporte = async () => {
    const res = await pool.query('SELECT * FROM deporte');
    const registros = res.rows;  //  Correcto: res.rows es el array de resultados
    console.log('deporte.service::getDeporte', registros);
    return registros as Deporte[];  //  Devuelve array de Deporte


};
export const getDeporteById = async (id: number): Promise<Deporte | null> => {
  const res = await pool.query('SELECT * FROM deporte WHERE id_deporte = $1', [id]);
  return res.rows[0] || null;
};
export const createDeporte = async (nombre: string): Promise<Deporte> => {
  const query = `
    INSERT INTO deporte (nombre)
    VALUES ($1)
    RETURNING 
      id_deporte,
      nombre,
      fecha_creacion,
      fecha_modificacion,
      usuario_creacion,
      usuario_modificacion
  `;

  const values = [nombre.trim()];

  try {
    const res = await pool.query(query, values);
    return res.rows[0] as Deporte;
  } catch (error) {
    console.error('Error al crear deporte en el servicio:', error);
    throw new Error('No se pudo crear el deporte');
  }
};
// Eliminar
export const deleteDeporte = async (id: number): Promise<Deporte | null> => {
  const query = `
    DELETE FROM deporte 
    WHERE id_deporte = $1
    RETURNING *
  `;

  const values = [id];

  const res = await pool.query(query, values);
  return res.rows[0] || null;
};
// Actualizar
export const updateDeporte = async (id: number, nombre: string): Promise<Deporte | null> => {
  const query = `
    UPDATE deporte 
    SET nombre = $1, fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_deporte = $2
    RETURNING *
  `;

  const values = [nombre.trim(), id];

  const res = await pool.query(query, values);
  return res.rows[0] || null;
};
