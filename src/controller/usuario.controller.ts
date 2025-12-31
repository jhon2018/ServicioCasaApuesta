// src/controllers/usuario.controller.ts
import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { 
    usuarioCreateSchema, 
    usuarioUpdateSchema, 
    usuarioEstadoSchema,
    usuarioRolSchema 
} from "../schemas/usuario.schema";
import BaseResponse from "../shared/BaseResponse";
import { 
    STATUS_OK, STATUS_CREATED, STATUS_NO_CONTENT, 
    STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR,
    RESPONSE_INSERT_OK, RESPONSE_UPDATE_OK, RESPONSE_DELETE_OK 
} from "../utils/constants";

// 1. POST /api/v1/usuarios
export const createUsuario = async (req: Request, res: Response) => {
    try {
        const { error, value } = usuarioCreateSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const usuarioCreacion = 1; // TODO: De JWT
        const usuario = await UsuarioService.createUsuario(
            value.tipo_usuario,
            value.nombre,
            value.telefono,
            value.correo_electronico,
            value.estado || 1,
            value.id_rol,
            // usuarioCreacion
        );
        
        res.status(STATUS_CREATED)
           .json(BaseResponse.success(usuario, RESPONSE_INSERT_OK));
    } catch (error: any) {
        if (error.message.includes("ya está registrado")) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al crear el usuario"));
    }
};

// 2. GET /api/v1/usuarios
export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await UsuarioService.getUsuarios();
        res.json(BaseResponse.success(usuarios));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener los usuarios"));
    }
};

// 3. GET /api/v1/usuarios/{id}
export const getUsuarioById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const usuario = await UsuarioService.getUsuarioById(id);
        if (!usuario) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Usuario no encontrado"));
        }

        res.json(BaseResponse.success(usuario));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener el usuario"));
    }
};

// 4. PUT /api/v1/usuarios/{id}
export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = usuarioUpdateSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const usuarioModificacion = 1; // TODO: De JWT
        const usuario = await UsuarioService.updateUsuario(
            id,
            value.tipo_usuario,
            value.nombre,
            value.telefono,
            value.correo_electronico,
            value.id_rol,
           // usuarioModificacion
        );

        if (!usuario) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Usuario no encontrado"));
        }

        res.json(BaseResponse.success(usuario, RESPONSE_UPDATE_OK));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el usuario"));
    }
};

// 5. PATCH /api/v1/usuarios/{id}/estado
export const updateEstadoUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = usuarioEstadoSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const usuarioModificacion = 1; // TODO: De JWT
        const usuario = await UsuarioService.updateEstado(
            id, 
            value.estado, 
            //usuarioModificacion
        );

        if (!usuario) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Usuario no encontrado"));
        }

        res.json(BaseResponse.success(usuario, "Estado actualizado correctamente"));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el estado"));
    }
};

// 6. DELETE /api/v1/usuarios/{id}
export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        await UsuarioService.deleteUsuario(id);
        res.json(BaseResponse.success(null, RESPONSE_DELETE_OK));
    } catch (error: any) {
        if (error.message.includes("No se puede eliminar")) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al eliminar el usuario"));
    }
};

// 7. POST /api/v1/usuarios/{id}/roles
export const updateRolUsuario = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error("ID inválido"));
        }

        const { error, value } = usuarioRolSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const usuarioModificacion = 1; // TODO: De JWT
        const usuario = await UsuarioService.updateRolUsuario(
            id, 
            value.id_rol, 
            //usuarioModificacion
        );

        if (!usuario) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Usuario no encontrado"));
        }

        res.json(BaseResponse.success(usuario, "Rol actualizado correctamente"));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al actualizar el rol"));
    }
};