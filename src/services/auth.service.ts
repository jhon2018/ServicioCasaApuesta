// src/services/auth.service.ts
import { pool } from "../database/connection";
import { authQueries } from "../database/queries/auth.queries";
import { BcryptService } from "../utils/bcrypt.utils";
import { JWTService } from "../utils/jwt.utils";
import { Credencial, RegistroRequest, AuthResponse } from "../models/credencial.model";
import jwt from "jsonwebtoken";

export class AuthService {
    // 1. Registro
    static async registro(data: RegistroRequest): Promise<AuthResponse> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Verificar si username ya existe
            const usernameCheck = await client.query(authQueries.checkUsernameExists, [data.username]);
            if (usernameCheck.rows.length > 0) {
                throw new Error("El nombre de usuario ya está registrado");
            }
            
            // Verificar si email ya existe
            const emailCheck = await client.query(authQueries.findUsuarioByEmail, [data.email]);
            if (emailCheck.rows.length > 0) {
                throw new Error("El correo electrónico ya está registrado");
            }
            
            const passwordHash = await BcryptService.hashPassword(data.password);
            
            const usuarioResult = await client.query(
                `INSERT INTO usuarios (
                    tipo_usuario, nombre, telefono, correo_electronico, 
                    estado, id_rol
                ) VALUES ($1, $2, $3, $4, 1, 3) 
                RETURNING *`,
                [data.tipo_usuario || 'cliente', data.nombre, data.telefono, data.email]
            );
            const usuario = usuarioResult.rows[0];
            
            // 2. Crear credencial
            await client.query(authQueries.insertCredencial, [
                usuario.id_usuario, data.username, passwordHash
            ]);
            
            // 3. Generar tokens
            const token = JWTService.generarAccessToken(usuario);
            const refreshToken = JWTService.generarRefreshToken(usuario);
            


            await client.query(authQueries.updateRefreshToken, [
                refreshToken, usuario.id_usuario
            ]);
            
            await client.query('COMMIT');
            
            return {
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.correo_electronico,
                    tipo_usuario: usuario.tipo_usuario,
                    id_rol: usuario.id_rol
                },
                token,
                refresh_token: refreshToken
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // 2. Login
    static async login(username: string, password: string): Promise<AuthResponse> {
        // Buscar credencial
        const result = await pool.query(authQueries.findCredencialByUsername, [username]);
        if (result.rows.length === 0) {
            throw new Error("Credenciales incorrectas");
        }
        
        const credencial = result.rows[0];
        
        const passwordValido = await BcryptService.comparePassword(password, credencial.password_hash);
        if (!passwordValido) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Verificar estado usuario
        if (credencial.estado !== 1) {
            throw new Error("Usuario suspendido o cerrado");
        }
        
        // Generar tokens
        const token = JWTService.generarAccessToken(credencial);
        const refreshToken = JWTService.generarRefreshToken(credencial);
        

        
        await pool.query(authQueries.updateRefreshToken, [
            refreshToken,  credencial.id_usuario
        ]);
        
        return {
            usuario: {
                id_usuario: credencial.id_usuario,
                nombre: credencial.nombre,
                email: credencial.correo_electronico,
                tipo_usuario: credencial.tipo_usuario,
                id_rol: credencial.id_rol
            },
            token,
            refresh_token: refreshToken
        };
    }

    // 3. Refresh Token
    static async refreshToken(refreshToken: string): Promise<{ token: string }> {
        const payload = JWTService.verificarRefreshToken(refreshToken);
        if (!payload) {
            throw new Error("Refresh token inválido");
        }
        
        // Buscar credencial con este refresh token
        const result = await pool.query(
            "SELECT c.*, u.* FROM credenciales c JOIN usuarios u ON c.id_usuario = u.id_usuario WHERE c.refresh_token = $1",
            [refreshToken]
        );
        
        if (result.rows.length === 0) {
            throw new Error("Refresh token no encontrado");
        }
        
        const usuario = result.rows[0];
        
        const token = JWTService.generarAccessToken(usuario);
        
        return { token };
    }

    // 4. Logout
    static async logout(userId: number): Promise<boolean> {
        const result = await pool.query(authQueries.clearRefreshToken, [userId]);
        return true;
    }

    // 5. Recuperar password
    static async recuperarPassword(email: string): Promise<boolean> {
        try {
            console.log("Buscando usuario con email:", email);
            
            const result = await pool.query(authQueries.findUsuarioByEmail, [email]);
            console.log("Resultado query:", result.rows);
            
            if (result.rows.length === 0) {
                console.error("Usuario no encontrado");
                throw new Error("Usuario no encontrado");
            }
            
            const usuario = result.rows[0];
            console.log("Usuario encontrado:", usuario.id_usuario, usuario.correo_electronico);
            
            // Generar JWT
            const resetToken = jwt.sign(
                {
                    id: usuario.id_usuario,
                    email: usuario.correo_electronico,
                    type: "password_reset"
                },
                process.env.JWT_SECRET || "secreto_super_seguro",
                { expiresIn: "1h" }
            );
            
            console.log("Reset Token generado:", resetToken);
            
            const expiracion = new Date();
            expiracion.setHours(expiracion.getHours() + 1);
            console.log("Expiración:", expiracion);
            
            // 3 PARÁMETROS:
            await pool.query(authQueries.saveResetToken, [
                resetToken, 
                expiracion,      // ← Este faltaba
                usuario.id_usuario
            ]);
            
            console.log("Token guardado en DB");
            return true;
        } catch (error: any) {
            console.error(" Error en recuperarPassword:", error.message);
            console.error("Stack:", error.stack);
            throw error;
        }
    }


    // 6. Cambiar passwor
static async cambiarPassword(token: string, nuevaPassword: string): Promise<boolean> {
    try {
        
        // 1. Primero buscar en DB como reset_token
        const result = await pool.query(authQueries.findCredencialByResetToken, [token]);
        console.log("Resultado DB:", result.rows.length, "registros");
        
        if (result.rows.length > 0) {
            console.log("Token encontrado en DB");
            console.log("Usuario ID:", result.rows[0].id_usuario);
            console.log("Expiración DB:", result.rows[0].reset_expiracion);
                        
            const credencial = result.rows[0];
            const passwordHash = await BcryptService.hashPassword(nuevaPassword);
            await pool.query(authQueries.cambiarPassword, [passwordHash, credencial.id_usuario]);
            console.log("Password actualizado via reset_token");
            return true;
        } else {
            console.log("Token NO encontrado en DB");
            
            // 2. Verificar si es JWT válido (con JWT_SECRET, no REFRESH_SECRET)
            let payload: any = null;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro") as any;
                console.log("WT verificado correctamente");
            } catch (error: any) {
                console.log("JWT inválido o expirado:", error.message);
            }
            
            console.log(" Payload JWT:", payload);
            
            if (payload && payload.type === "password_reset") {
                console.log(" JWT válido de tipo password_reset");
                console.log(" Usuario ID del JWT:", payload.id);
                

                const check = await pool.query(
                    `SELECT reset_token, reset_usado 
                     FROM credenciales 
                     WHERE id_usuario = $1 
                     AND reset_token IS NOT NULL`,
                    [payload.id]
                );
                
                if (check.rows.length > 0 && check.rows[0].reset_usado === true) {
                    throw new Error("Este token de recuperación ya fue utilizado");
                }

                // Actualizar password usando JWT
                const passwordHash = await BcryptService.hashPassword(nuevaPassword);
                await pool.query(authQueries.cambiarPassword, [passwordHash, payload.id]);
                console.log("Password actualizado via JWT");

                return true;
            } else {
                console.log(" No es JWT válido de password_reset");
                throw new Error("Token inválido o expirado");
            }
        }
    } catch (error: any) {
        console.error(" Error en cambiarPassword:", error.message);
        throw error;
    }
}
}