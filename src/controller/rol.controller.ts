//Ruta: src/controllers/rol.controller.ts
import { Request, Response } from "express";
import { RolService } from "../services/rol.service";
import { rolSchema, rolAsignarSchema } from "../schemas/rol.schema";

import BaseResponse from "../shared/BaseResponse";
import { 
    STATUS_OK, STATUS_CREATED, STATUS_NO_CONTENT, 
    STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR,
    RESPONSE_INSERT_OK, RESPONSE_UPDATE_OK, RESPONSE_DELETE_OK 
} from "../utils/constants";

// 1. POST /api/v1/roles
export const createRol = async (req: Request, res: Response) => {
    try {
        const { error, value } = rolSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que crea (de JWT)
        //const usuarioCreacion = 1;
        const usuarioCreacion = (req as any).user.id;

        const rol = await RolService.createRol(value.nombre, usuarioCreacion);
        res.status(STATUS_CREATED)
           .json(BaseResponse.success(rol, RESPONSE_INSERT_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al crear el rol"));
    }
};

// 2. GET /api/v1/roles
export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await RolService.getRoles();
        res.json(BaseResponse.success(roles));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener los roles"));
    }
};

// 3. GET /api/v1/roles/{id}
export const getRolById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const rol = await RolService.getRolById(id);
        if (!rol) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Rol no encontrado"));
        }

        res.json(BaseResponse.success(rol));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener el rol"));
    }
};

// 4. PUT /api/v1/roles/{id}
export const updateRol = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = rolSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        // Obtener usuario que modifica
        const usuarioModificacion = 1; // TODO: De JWT
        
        const rol = await RolService.updateRol(id, value.nombre, usuarioModificacion);
        if (!rol) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Rol no encontrado"));
        }

        res.json(BaseResponse.success(rol, RESPONSE_UPDATE_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el rol"));
    }
};

// 5. DELETE /api/v1/roles/{id}
export const deleteRol = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        await RolService.deleteRol(id);
        res.json(BaseResponse.success(null, RESPONSE_DELETE_OK));
    } catch (error: any) {
        if (error.message.includes("tiene usuarios asignados")) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al eliminar el rol"));
    }
};

// 6. POST /api/v1/roles/{id}/asignar/{usuario_id}
export const asignarRolUsuario = async (req: Request, res: Response) => {
    try {
        const rolId = parseInt(req.params.id);
        const usuarioId = parseInt(req.params.usuario_id);
        
        if (isNaN(rolId) || isNaN(usuarioId)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("IDs inválidos"));
        }

        const resultado = await RolService.asignarRolUsuario(rolId, usuarioId);
        res.json(BaseResponse.success(resultado, "Rol asignado correctamente"));
    } catch (error: any) {
        if (error.message.includes("no encontrado")) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al asignar el rol"));
    }
};

// 7. GET /api/v1/roles/{id}/usuarios
export const getUsuariosByRol = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const rolConUsuarios = await RolService.getUsuariosByRol(id);
        res.json(BaseResponse.success(rolConUsuarios));
    } catch (error: any) {
        if (error.message.includes("no encontrado")) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener usuarios del rol"));
    }
};