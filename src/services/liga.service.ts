import {Pool} from 'pg'
import { Liga } from '../models/liga.model'
import {pool} from '../database/queries/connection';

export const getLiga = async () => {
    const res = await pool.query('SELECT * FROM liga');
    const registros = res.rows;  //  Correcto: res.rows es el array de resultados
    console.log('deporte.service::getLiga', registros);
    return registros as Liga[];  //  Devuelve array de Deporte
};
export const createLiga = async (datos: Liga): Promise<Liga> => {
  console.log('liga.service::createLiga - Datos recibidos:', datos);

  const { id_deporte, nombre, pais } = datos;

  const query = `
    INSERT INTO liga (id_deporte, nombre, pais)
    VALUES ($1, $2, $3)
    RETURNING 
      id_liga,
      id_deporte,
      nombre,
      pais,
      fecha_creacion,
      fecha_modificacion,
      usuario_creacion,
      usuario_modificacion
  `;

  const values = [
    id_deporte,
    nombre.trim(),
    pais ? pais.trim() : null  // Si pais es undefined o vacío, guarda NULL
  ];

  try {
    const res = await pool.query(query, values);
    const nuevaLiga = res.rows[0] as Liga;

    console.log('liga.service::createLiga - Liga creada exitosamente:', nuevaLiga);

    return nuevaLiga;
  } catch (error) {
    console.error('liga.service::createLiga - Error al crear la liga:', error);
    throw new Error('No se pudo crear la liga');
  }
};
//OBTENER ID
export const getLigaById = async (id: number): Promise<Liga | null> => {
  const res = await pool.query('SELECT * FROM liga WHERE id_liga = $1', [id]);
  return res.rows[0] || null;
};
// Eliminar
export const deleteLiga = async (id: number): Promise<Liga | null> => {
  const query = `
    DELETE FROM liga
    WHERE id_liga = $1
    RETURNING *
  `;

  const values = [id];

  const res = await pool.query(query, values);
  return res.rows[0] || null;
};
export const updateLiga = async (id: number, datos: { nombre?: string; pais?: string }): Promise<Liga | null> => {
  console.log('liga.service::updateLiga - ID:', id, 'Datos:', datos);

  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (datos.nombre !== undefined) {
    updates.push(`nombre = $${paramIndex}`);
    values.push(datos.nombre.trim());
    paramIndex++;
  }

  if (datos.pais !== undefined) {
    updates.push(`pais = $${paramIndex}`);
    values.push(datos.pais.trim() || null);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error('No se proporcionaron datos para actualizar');
  }

  updates.push(`fecha_modificacion = CURRENT_TIMESTAMP`);

  const query = `
    UPDATE liga
    SET ${updates.join(', ')}
    WHERE id_liga = $${paramIndex}
    RETURNING 
      id_liga,
      id_deporte,
      nombre,
      pais,
      fecha_creacion,
      fecha_modificacion,
      usuario_creacion,
      usuario_modificacion
  `;

  values.push(id);  

  try {
    const res = await pool.query(query, values);
    const ligaActualizada = res.rows[0] as Liga | undefined;

    if (!ligaActualizada) {
      console.log('liga.service::updateLiga - Liga no encontrada con ID:', id);
      return null;
    }

    console.log('liga.service::updateLiga - Liga actualizada:', ligaActualizada);
    return ligaActualizada;
  } catch (error) {
    console.error('liga.service::updateLiga - Error al actualizar la liga:', error);
    throw new Error('No se pudo actualizar la liga');
  }
};