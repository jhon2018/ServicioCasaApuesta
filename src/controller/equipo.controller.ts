import { Request, Response } from "express";
import { EquipoService } from "../services/equipo.service";
import { equipoSchema } from "../schemas/equipo.schema";

import BaseResponse from "../shared/BaseResponse";
import { 
    STATUS_OK, STATUS_CREATED, STATUS_NO_CONTENT, 
    STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR,
    RESPONSE_INSERT_OK, RESPONSE_UPDATE_OK, RESPONSE_DELETE_OK 
} from "../utils/constants";

// 1. POST /api/v1/equipos
export const createEquipo = async (req: Request, res: Response) => {
    try {
        const { error, value } = equipoSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que crea (de JWT)
        const usuarioCreacion = 1; // TODO: Obtener de req.user después de auth
        
        const equipo = await EquipoService.createEquipo(value.id_liga, value.nombre, value.abreviatura, usuarioCreacion);
        res.status(STATUS_CREATED)
           .json(BaseResponse.success(equipo, RESPONSE_INSERT_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al crear el equipo"));
    }
};

// 2. GET /api/v1/equipos
export const getEquipos = async (req: Request, res: Response) => {
    try {
        const equipos = await EquipoService.getEquipos();
        res.json(BaseResponse.success(equipos));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener los equipos"));
    }
};

// 3. GET /api/v1/equipos/{id}
export const getEquipoById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const equipo = await EquipoService.getEquipoById(id);
        if (!equipo) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Equipo no encontrado"));
        }

        res.json(BaseResponse.success(equipo));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener el equipo"));
    }
};

// 4. PUT /api/v1/equipos/{id}
export const updateEquipo = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = equipoSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que modifica
        const usuarioModificacion = 1; // TODO: De JWT
        
        const equipo = await EquipoService.updateEquipo(id, value.id_liga, value.nombre, value.abreviatura, usuarioModificacion);
        if (!equipo) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Equipo no encontrado"));
        }

        res.json(BaseResponse.success(equipo, RESPONSE_UPDATE_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el equipo"));
    }
};

// 5. DELETE /api/v1/equipos/{id}
export const deleteEquipo = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        await EquipoService.deleteEquipo(id);
        res.json(BaseResponse.success(null, RESPONSE_DELETE_OK));
    } catch (error: any) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al eliminar el equipo"));
    }
};