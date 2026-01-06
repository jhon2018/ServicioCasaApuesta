import { pool } from "../database/connection";
import { eventoQueries } from "../database/queries/evento.queries";
import { Evento } from "../models/evento.model";

export class EventoService {
    // 1. Crear evento
    static async createEvento(id_liga: number, equipo_local: number, equipo_visitante: number, fecha_hora_inicio: Date, fecha_hora_fin: Date, resultado: string, estado: number, usuarioId: number): Promise<Evento> {
        const result = await pool.query(eventoQueries.insert, [id_liga, equipo_local, equipo_visitante, fecha_hora_inicio, fecha_hora_fin, resultado, estado, usuarioId, usuarioId]);
        return result.rows[0];
    }

    // 2. Listar eventos
    static async getEventos(): Promise<Evento[]> {
        const result = await pool.query(eventoQueries.selectAll);
        return result.rows;
    }

    // 3. Evento por ID
    static async getEventoById(id: number): Promise<Evento | null> {
        const result = await pool.query(eventoQueries.selectById, [id]);
        return result.rows[0] || null;
    }

    // 4. Actualizar evento
    static async updateEvento(id: number, id_liga: number, equipo_local: number, equipo_visitante: number, fecha_hora_inicio: Date, fecha_hora_fin: Date, resultado: string, estado: number, usuarioId: number): Promise<Evento | null> {
        const result = await pool.query(eventoQueries.update, [id_liga, equipo_local, equipo_visitante, fecha_hora_inicio, fecha_hora_fin, resultado, estado, usuarioId, id]);
        return result.rows[0] || null;
    }

    // 5. Eliminar evento
    static async deleteEvento(id: number): Promise<boolean> {
        // Verificar si tiene usuarios asignados
        // const countResult = await pool.query(equipoQueries.countUsuariosByRol, [id]);
        // const count = parseInt(countResult.rows[0].count);
        
        // if (count > 0) {
        //     throw new Error("No se puede eliminar, el equipo tiene usuarios asignados");
        // }
        
        const result = await pool.query(eventoQueries.delete, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}