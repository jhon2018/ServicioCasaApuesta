// src/models/credencial.model.ts
// objetivo: Definir las interfaces para la gestión de credenciales y autenticación de usuarios.
export interface Credencial {
    id_credencial: number;
    id_usuario: number;
    username: string;
    password_hash: string;
    refresh_token: string | null;
    reset_token: string | null;
    reset_expiracion: Date | null;
    reset_usado: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegistroRequest {
    username: string;
    password: string;
    email: string;
    nombre: string;
    telefono: string;
    tipo_usuario?: string; // 'cliente' por defecto
}

export interface AuthResponse {
    usuario: {
        id_usuario: number;
        nombre: string;
        email: string;
        tipo_usuario: string;
        id_rol: number;
    };
    token: string;
    refresh_token: string;
}