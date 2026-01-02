import Joi from 'joi';

// Esquema para crear un nuevo deporte
export const crearDeporteSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': `"nombre" debe ser un texto`,
      'string.empty': `"nombre" no puede estar vacío`,
      'string.min': `"nombre" debe tener al menos {#limit} caracteres`,
      'string.max': `"nombre" debe tener máximo {#limit} caracteres`,
      'any.required': `"nombre" es un campo obligatorio`,
    }),
});