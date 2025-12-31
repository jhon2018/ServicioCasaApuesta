//RUta: src/schemas/rol.schema.ts
import Joi from "joi";

export const rolSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

export const rolAsignarSchema = Joi.object({
    usuario_id: Joi.number().integer().positive().required()
});