//Ruta: src/services/rol.service.ts
import { pool } from "../database/connection";
import { rolQueries } from "../database/queries/rol.queries";
import { Rol, RolWithUsuarios } from "../models/rol.model";

export class RolService {
    // 1. Crear rol
    static async createRol(nombre: string, usuarioId: number): Promise<Rol> {
        const client = await pool.connect();
        await client.query('BEGIN');
        const result = await pool.query(rolQueries.insert, [nombre, usuarioId, usuarioId]);
        await client.query('COMMIT');
        return result.rows[0];
    }

    // 2. Listar roles
    static async getRoles(): Promise<Rol[]> {
        const result = await pool.query(rolQueries.selectAll);
        return result.rows;
    }

    // 3. Rol por ID
    static async getRolById(id: number): Promise<Rol | null> {
        const result = await pool.query(rolQueries.selectById, [id]);
        return result.rows[0] || null;
    }

    // 4. Actualizar rol
    static async updateRol(id: number, nombre: string, usuarioId: number): Promise<Rol | null> {
        const result = await pool.query(rolQueries.update, [nombre, usuarioId, id]);
        return result.rows[0] || null;
    }

    // 5. Eliminar rol (solo si no tiene usuarios)
    static async deleteRol(id: number): Promise<boolean> {
        // Verificar si tiene usuarios asignados
        const countResult = await pool.query(rolQueries.countUsuariosByRol, [id]);
        const count = parseInt(countResult.rows[0].count);
        
        if (count > 0) {
            throw new Error("No se puede eliminar, el rol tiene usuarios asignados");
        }
        
        const result = await pool.query(rolQueries.delete, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // 6. Asignar rol a usuario
    static async asignarRolUsuario(rolId: number, usuarioId: number): Promise<{id_usuario: number, nombre: string}> {
        const result = await pool.query(rolQueries.asignarRolUsuario, [rolId, usuarioId]);
        if (result.rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        return result.rows[0];
    }

    // 7. Listar usuarios con un rol
    static async getUsuariosByRol(rolId: number): Promise<RolWithUsuarios> {
        // Obtener rol
        const rolResult = await pool.query(rolQueries.selectById, [rolId]);
        if (rolResult.rows.length === 0) {
            throw new Error("Rol no encontrado");
        }
        
        // Obtener usuarios con este rol
        const usuariosResult = await pool.query(rolQueries.getUsuariosByRol, [rolId]);
        
        return {
            ...rolResult.rows[0],
            usuarios: usuariosResult.rows
        };
    }
}