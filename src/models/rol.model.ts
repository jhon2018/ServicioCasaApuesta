// ruta: src/models/rol.model.ts
export interface Rol {
    id_rol: number;
    nombre: string;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    usuario_creacion: number;
    usuario_modificacion: number;
}

export interface RolWithUsuarios extends Rol {
    usuarios?: Array<{
        id_usuario: number;
        nombre: string;
        correo_electronico: string;
    }>;
}