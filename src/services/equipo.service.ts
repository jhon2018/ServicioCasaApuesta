import { pool } from "../database/connection";
import { equipoQueries } from "../database/queries/equipo.queries";
import { Equipo } from "../models/equipo.model";

export class EquipoService {
    // 1. Crear equipo
    static async createEquipo(id_liga: number, nombre: string, abreviatura: string, usuarioId: number): Promise<Equipo> {
        const result = await pool.query(equipoQueries.insert, [id_liga, nombre, abreviatura, usuarioId, usuarioId]);
        return result.rows[0];
    }

    // 2. Listar equipos
    static async getEquipos(): Promise<Equipo[]> {
        const result = await pool.query(equipoQueries.selectAll);
        return result.rows;
    }

    // 3. Equipo por ID
    static async getEquipoById(id: number): Promise<Equipo | null> {
        const result = await pool.query(equipoQueries.selectById, [id]);
        return result.rows[0] || null;
    }

    // 4. Actualizar equipo
    static async updateEquipo(id: number, id_liga: number, nombre: string, abreviatura: string, usuarioId: number): Promise<Equipo | null> {
        const result = await pool.query(equipoQueries.update, [id_liga, nombre, abreviatura, usuarioId, id]);
        return result.rows[0] || null;
    }

    // 5. Eliminar equipo
    static async deleteEquipo(id: number): Promise<boolean> {        
        const result = await pool.query(equipoQueries.delete, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}