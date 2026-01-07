// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { JWTService } from "../utils/jwt.utils";
import BaseResponse from "../shared/BaseResponse";
import { STATUS_UNAUTHORIZED, STATUS_FORBIDDEN } from "../utils/constants";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Token de autenticación requerido"));
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Formato de token incorrecto. Use: Bearer {token}"));
        }
        
        const payload = JWTService.verificarAccessToken(token);
        if (!payload) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Token inválido o expirado"));
        }
        
        // Agregar usuario al request para usarlo en controllers
        (req as any).user = {
            id: payload.id,
            username: payload.username,
            tipo_usuario: payload.tipo_usuario,
            id_rol: payload.id_rol
        };
        
        next();
    } catch (error) {
        return res.status(STATUS_UNAUTHORIZED)
                  .json(BaseResponse.error("Error en autenticación"));
    }
};

// Middleware para roles específicos
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        
        if (!user) {
            return res.status(STATUS_UNAUTHORIZED)
                      .json(BaseResponse.error("Usuario no autenticado"));
        }
        
        if (!roles.includes(user.tipo_usuario)) {
            return res.status(STATUS_FORBIDDEN)
                      .json(BaseResponse.error("No tiene permisos para esta acción"));
        }
        
        next();
    };
};