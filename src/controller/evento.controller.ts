import { Request, Response } from "express";
import { EventoService } from "../services/evento.service";
import { eventoSchema } from "../schemas/evento.schema";

import BaseResponse from "../shared/BaseResponse";
import { 
    STATUS_OK, STATUS_CREATED, STATUS_NO_CONTENT, 
    STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR,
    RESPONSE_INSERT_OK, RESPONSE_UPDATE_OK, RESPONSE_DELETE_OK 
} from "../utils/constants";

// 1. POST /api/v1/eventos
export const createEvento = async (req: Request, res: Response) => {
    try {
        const { error, value } = eventoSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que crea (de JWT)
        const usuarioCreacion = 1; // TODO: Obtener de req.user después de auth
        
        const evento = await EventoService.createEvento(value.id_liga, value.equipo_local, value.equipo_visitante, value.fecha_hora_inicio, value.fecha_hora_fin, value.resultado, value.estado, usuarioCreacion);
        res.status(STATUS_CREATED)
           .json(BaseResponse.success(evento, RESPONSE_INSERT_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al crear el evento"));
    }
};

// 2. GET /api/v1/eventos
export const getEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await EventoService.getEventos();
        res.json(BaseResponse.success(eventos));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener los eventos"));
    }
};

// 3. GET /api/v1/eventos/{id}
export const getEventoById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const evento = await EventoService.getEventoById(id);
        if (!evento) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Evento no encontrado"));
        }

        res.json(BaseResponse.success(evento));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener el evento"));
    }
};

// 4. PUT /api/v1/eventos/{id}
export const updateEvento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = eventoSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que modifica
        const usuarioModificacion = 1; // TODO: De JWT
        
        const evento = await EventoService.updateEvento(id, value.id_liga, value.equipo_local, value.equipo_visitante, value.fecha_hora_inicio, value.fecha_hora_fin, value.resultado, value.estado, usuarioModificacion);
        if (!evento) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Evento no encontrado"));
        }

        res.json(BaseResponse.success(evento, RESPONSE_UPDATE_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el evento"));
    }
};

// 5. DELETE /api/v1/eventos/{id}
export const deleteEvento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        await EventoService.deleteEvento(id);
        res.json(BaseResponse.success(null, RESPONSE_DELETE_OK));
    } catch (error: any) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al eliminar el evento"));
    }
};