// src/models/usuario.model.ts
export interface Usuario {
    id_usuario: number;
    tipo_usuario: string;  // 'admin', 'operador', 'cliente'
    nombre: string;
    telefono: string;
    correo_electronico: string;
    estado: number;        // 1=Activo, 2=Suspendido, 3=Cerrado
    id_rol: number;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    intentos_fallidos: number;
    bloqueado_hasta: Date | null;
    ultimo_login: Date | null;
}

export interface UsuarioWithRol extends Usuario {
    rol_nombre?: string;
}