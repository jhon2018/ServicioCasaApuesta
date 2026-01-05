// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { 
    registroSchema, 
    loginSchema, 
    refreshTokenSchema,
    recuperarPasswordSchema,
    cambiarPasswordSchema 
} from "../schemas/auth.schema";
import BaseResponse from "../shared/BaseResponse";
import { 
    STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, 
    STATUS_UNAUTHORIZED, STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR,
    RESPONSE_CREDENTIALS_ERROR
} from "../utils/constants";
import { JWTService } from "../utils/jwt.utils";

// 1. POST /api/v1/auth/registro
export const registro = async (req: Request, res: Response) => {
    try {
        const { error, value } = registroSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const resultado = await AuthService.registro(value);
        res.status(STATUS_CREATED)
           .json(BaseResponse.success(resultado, "Registro exitoso"));
    } catch (error: any) {
        if (error.message.includes("ya está registrado")) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error en el registro"));
    }
};

// 2. POST /api/v1/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const resultado = await AuthService.login(value.username, value.password);
        res.json(BaseResponse.success(resultado, "Login exitoso"));
    } catch (error: any) {
        if (error.message.includes("Credenciales incorrectas") || 
            error.message.includes("Usuario suspendido")) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error en el login"));
    }
};

// 3. POST /api/v1/auth/refresh
export const refresh = async (req: Request, res: Response) => {
    try {
        const { error, value } = refreshTokenSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        const resultado = await AuthService.refreshToken(value.refresh_token);
        res.json(BaseResponse.success(resultado, "Token refrescado"));
    } catch (error: any) {
        if (error.message.includes("inválido") || 
            error.message.includes("no encontrado")) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al refrescar token"));
    }
};

// 4. POST /api/v1/auth/logout
export const logout = async (req: Request, res: Response) => {
    try {
        // Obtener usuario del token (después implementaremos middleware)
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("No autorizado"));
        }

        const token = authHeader.split(" ")[1];
        const payload = JWTService.verificarAccessToken(token);
        
        if (!payload) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Token inválido"));
        }

        await AuthService.logout(payload.id);
        res.json(BaseResponse.success(null, "Logout exitoso"));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error en logout"));
    }
};

// 5. POST /api/v1/auth/recuperar-password
export const recuperarPassword = async (req: Request, res: Response) => {
    try {
        const { error, value } = recuperarPasswordSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        await AuthService.recuperarPassword(value.email);
        res.json(BaseResponse.success(null, "Correo de recuperación enviado"));
    } catch (error: any) {
        if (error.message.includes("no encontrado")) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error en recuperación de password"));
    }
};

// 6. POST /api/v1/auth/cambiar-password
export const cambiarPassword = async (req: Request, res: Response) => {
    try {
        const { error, value } = cambiarPasswordSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.details[0].message));
        }

        await AuthService.cambiarPassword(value.token, value.nueva_password);
        res.json(BaseResponse.success(null, "Contraseña actualizada correctamente"));
    } catch (error: any) {
        if (error.message.includes("inválido")) {
            return res.status(STATUS_BAD_REQUEST)
                      .json(BaseResponse.error(error.message));
        }
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al cambiar contraseña"));
    }
};

// 7. GET /api/v1/auth/perfil
export const perfil = async (req: Request, res: Response) => {
    try {
        // Obtener usuario del token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("No autorizado"));
        }

        const token = authHeader.split(" ")[1];
        const payload = JWTService.verificarAccessToken(token);
        
        if (!payload) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Token inválido"));
        }

        // Buscar usuario completo
        const result = await pool.query(
            `SELECT u.*, r.nombre as rol_nombre 
             FROM usuarios u 
             LEFT JOIN rol r ON u.id_rol = r.id_rol 
             WHERE u.id_usuario = $1`,
            [payload.id]
        );

        if (result.rows.length === 0) {
            return res.status(STATUS_NOT_FOUND)
                      .json(BaseResponse.error("Usuario no encontrado"));
        }

        const usuario = result.rows[0];
        // Ocultar datos sensibles
        const perfil = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo_electronico: usuario.correo_electronico,
            telefono: usuario.telefono,
            tipo_usuario: usuario.tipo_usuario,
            rol_nombre: usuario.rol_nombre,
            estado: usuario.estado
        };

        res.json(BaseResponse.success(perfil));
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR)
           .json(BaseResponse.error("Error al obtener perfil"));
    }
};

// Necesitamos pool aquí
import { pool } from "../database/connection";