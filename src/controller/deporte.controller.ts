import { Request,Response } from "express";
import * as deporteService from "../services/deporte.service";
import { crearDeporteSchema } from "../schemas/deporte.schema";



export const getDeporte=async(req:Request ,res:Response)=>{
    try {
            const deportes=await deporteService.getDeporte();
    res.json(deportes);
    } catch (error) {
        console.error('Error en getDeportes:', error);
    res.status(500).json({ error: 'Error al obtener deportes' });
    }

}
export const createDeporte = async (req: Request, res: Response) => {
 
  const { error, value } = crearDeporteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map((d) => d.message),
    });
  }

  try {
    const nuevoDeporte = await deporteService.createDeporte(value.nombre);
    res.status(201).json({
      message: 'Deporte creado exitosamente',
      deporte: nuevoDeporte,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al crear el deporte' });
  }
};
// Obtener por ID
export const getDeporteById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const deporte = await deporteService.getDeporteById(id);
    if (!deporte) return res.status(404).json({ error: 'Deporte no encontrado' });

    res.json(deporte);
  } catch (error) {
    console.error('Error al obtener deporte:', error);
    res.status(500).json({ error: 'Error al obtener el deporte' });
  }
};
// Actualizar
export const updateDeporteCtrl = async (req: Request, res: Response) => {
  const { error, value } = crearDeporteSchema.validate(req.body); // Puedes crear un schema separado para update si quieres

  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(d => d.message)
    });
  }

  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const deporteActualizado = await deporteService.updateDeporte(id, value.nombre);
    if (!deporteActualizado) return res.status(404).json({ error: 'Deporte no encontrado' });

    res.json({
      message: 'Deporte actualizado exitosamente',
      deporte: deporteActualizado
    });
  } catch (error) {
    console.error('Error al actualizar deporte:', error);
    res.status(500).json({ error: 'Error al actualizar el deporte' });
  }
};
// Eliminar
export const deleteDeporteCtrl = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const deporteEliminado = await deporteService.deleteDeporte(id);
    if (!deporteEliminado) return res.status(404).json({ error: 'Deporte no encontrado' });

    res.json({ message: 'Deporte eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar deporte:', error);
    res.status(500).json({ error: 'Error al eliminar el deporte' });
  }
};