export interface Evento {
  id_evento: number;
  id_liga: number;
  equipo_local: string;
  equipo_visitante: string;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
  resultado: string;
  estado: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  usuario_creacion: number;
  usuario_modificacion: number;
}