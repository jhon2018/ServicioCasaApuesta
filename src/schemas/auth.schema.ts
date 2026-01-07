// src/schemas/auth.schema.ts
// objetivo: Definir los esquemas de validación para las operaciones de autenticación y gestión de usuarios.
import Joi from "joi";

export const registroSchema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    nombre: Joi.string().min(3).max(50).required(),
    telefono: Joi.string().min(9).max(15).required(),
    tipo_usuario: Joi.string().valid('Administrador', 'Operador', 'Cliente').default('cliente')
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required()
});

export const recuperarPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const cambiarPasswordSchema = Joi.object({
    token: Joi.string().required(),
    nueva_password: Joi.string().min(6).required()
});