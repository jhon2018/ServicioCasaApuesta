// src/utils/jwt.utils.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// USAR LAS VARIABLES DE .env - ASEGURAR QUE SON STRING
const JWT_SECRET = process.env.JWT_SECRET ? String(process.env.JWT_SECRET) : "secreto_super_seguro";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ? String(process.env.JWT_REFRESH_SECRET) : "refresh_secreto";


const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN ? 
    `${String(process.env.JWT_EXPIRES_IN)}m` : "15m";
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN ? 
    `${String(process.env.JWT_REFRESH_EXPIRES_IN)}d` : "7d";


    
export class JWTService {
    static generarAccessToken(usuario: any): string {
        const payload = {
            id: usuario.id_usuario,
            username: usuario.username,
            tipo_usuario: usuario.tipo_usuario,
            id_rol: usuario.id_rol
        };
        
        return jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'] }
        );
    }

    static generarRefreshToken(usuario: any): string {
        const payload = {
            id: usuario.id_usuario,
            tipo: "refresh"
        };
        
        return jwt.sign(
            payload,
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'] }
        );
    }

    static verificarAccessToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    static verificarRefreshToken(token: string): any {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }

    static verificarToken(token: string, esRefresh: boolean = false): any {
        try {
            const secret = esRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
            return jwt.verify(token, secret);
        } catch (error) {
            return null;
        }
    }
}