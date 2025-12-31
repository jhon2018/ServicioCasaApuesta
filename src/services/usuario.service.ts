// src/services/usuario.service.ts
// objetivo: Implementar la lógica de negocio para la gestión de usuarios

import { pool } from "../database/connection";
import { usuarioQueries } from "../database/queries/usuario.queries";
import { Usuario, UsuarioWithRol } from "../models/usuario.model";

export class UsuarioService {
    // 1. Crear usuario
    static async createUsuario(
        tipo_usuario: string,
        nombre: string,
        telefono: string,
        correo_electronico: string,
        estado: number,
        id_rol: number
        
        
    ): Promise<Usuario> {
        // Verificar si correo ya existe
        const emailCheck = await pool.query(usuarioQueries.checkEmailExists, [correo_electronico]);
        if (emailCheck.rows.length > 0) {
            throw new Error("El correo electrónico ya está registrado");
        }

        const result = await pool.query(usuarioQueries.insert, [
            tipo_usuario, nombre, telefono, correo_electronico,
            estado, id_rol  // 6 parámetros exactos
        ]);
        return result.rows[0];
    }
    // 2. Listar usuarios
    static async getUsuarios(): Promise<UsuarioWithRol[]> {
        const result = await pool.query(usuarioQueries.selectAll);
        return result.rows;
    }

    // 3. Usuario por ID
    static async getUsuarioById(id: number): Promise<UsuarioWithRol | null> {
        const result = await pool.query(usuarioQueries.selectById, [id]);
        return result.rows[0] || null;
    }

    // 4. Actualizar usuario
// src/services/usuario.service.ts - método updateUsuario
static async updateUsuario(
    id: number,
    tipo_usuario: string,
    nombre: string,
    telefono: string,
    correo_electronico: string,
    id_rol: number
): Promise<Usuario | null> {
    try {
        const result = await pool.query(usuarioQueries.update, [
            tipo_usuario, nombre, telefono, correo_electronico,
            id_rol, id
        ]);
        
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}

    // 5. Cambiar estado
static async updateEstado(
    id: number,
    estado: number
): Promise<Usuario | null> {
    try {
        const result = await pool.query(usuarioQueries.updateEstado, [estado, id]);
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}

    // 6. Eliminar usuario (validar dependencias)
    static async deleteUsuario(id: number): Promise<boolean> {
        // Verificar dependencias
        const dependencias = await pool.query(usuarioQueries.checkDependencias, [id]);
        const { total_apuestas, tiene_billetera } = dependencias.rows[0];
        
        if (parseInt(total_apuestas) > 0) {
            throw new Error("No se puede eliminar, el usuario tiene apuestas registradas");
        }
        
        if (parseInt(tiene_billetera) > 0) {
            throw new Error("No se puede eliminar, el usuario tiene billetera activa");
        }
        
        const result = await pool.query(usuarioQueries.delete, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // 7. Asignar/remover rol
    static async updateRolUsuario(
        id: number,
        id_rol: number,
       // usuarioId: number
    ): Promise<Usuario | null> {
        const result = await pool.query(usuarioQueries.updateRol, [id_rol, id]);
        return result.rows[0] || null;
    }
}