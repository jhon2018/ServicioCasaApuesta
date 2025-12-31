// src/schemas/usuario.schema.ts
// objectivos: Definir los esquemas de validación para las operaciones relacionadas con usuarios.
import Joi from "joi";

export const usuarioCreateSchema = Joi.object({
    tipo_usuario: Joi.string().valid('admin', 'operador', 'cliente').required(),
    nombre: Joi.string().min(3).max(50).required(),
    telefono: Joi.string().min(9).max(15).required(),
    correo_electronico: Joi.string().email().required(),
    id_rol: Joi.number().integer().positive().required(),
    estado: Joi.number().valid(1, 2, 3).default(1)
});

export const usuarioUpdateSchema = Joi.object({
    tipo_usuario: Joi.string().valid('admin', 'operador', 'cliente'),
    nombre: Joi.string().min(3).max(50),
    telefono: Joi.string().min(9).max(15),
    correo_electronico: Joi.string().email(),
    id_rol: Joi.number().integer().positive()
});

export const usuarioEstadoSchema = Joi.object({
    estado: Joi.number().valid(1, 2, 3).required()
});

export const usuarioRolSchema = Joi.object({
    id_rol: Joi.number().integer().positive().required()
});