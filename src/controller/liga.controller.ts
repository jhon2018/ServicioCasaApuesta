import { Request,Response } from "express";
import * as ligaService from "../services/liga.service";
import { crearLigaSchema } from "../schemas/liga.schema";


export const getLiga=async(req:Request ,res:Response)=>{
    try {
            const ligas=await ligaService.getLiga();
    res.json(ligas);
    } catch (error) {
        console.error('Error en getLigas:', error);
    res.status(500).json({ error: 'Error al obtener ligas' });
    }

}
export const createLigaController = async (req: Request, res: Response) => {
  const { error, value } = crearLigaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const nuevaLiga = await ligaService.createLiga(value);
    res.status(201).json({
      message: 'Liga creada exitosamente',
      liga: nuevaLiga
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la liga' });
  }
};
//ACTUALIZAR
export const updateLigaController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { error, value } = crearLigaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const ligaActualizada = await ligaService.updateLiga(id, value);
    if (!ligaActualizada) return res.status(404).json({ error: 'Liga no encontrada' });

    res.json({
      message: 'Liga actualizada exitosamente',
      liga: ligaActualizada
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la liga' });
  }
};
// Eliminar
export const deleteLigaCtrl = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const deporteEliminado = await ligaService.deleteLiga(id);
    if (!deporteEliminado) return res.status(404).json({ error: 'Liga no encontrado' });

    res.json({ message: 'Liga eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar deporte:', error);
    res.status(500).json({ error: 'Error al eliminar el liga' });
  }
};
// Obtener por ID
export const getLigaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const deporte = await ligaService.getLigaById(id);
    if (!deporte) return res.status(404).json({ error: 'Liga no encontrado' });

    res.json(deporte);
  } catch (error) {
    console.error('Error al obtener liga:', error);
    res.status(500).json({ error: 'Error al obtener la liga' });
  }
};