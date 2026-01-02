import Joi from 'joi';

export const crearLigaSchema = Joi.object({
  id_deporte: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': `"id_deporte" debe ser un número`,
      'number.integer': `"id_deporte" debe ser un número entero`,
      'number.positive': `"id_deporte" debe ser mayor que 0`,
      'any.required': `"id_deporte" es obligatorio (debe existir el deporte)`,
    }),
  nombre: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': `"nombre" debe ser texto`,
      'string.empty': `"nombre" no puede estar vacío`,
      'string.min': `"nombre" debe tener al menos {#limit} caracteres`,
      'string.max': `"nombre" debe tener máximo {#limit} caracteres`,
      'any.required': `"nombre" es obligatorio`,
    }),
  pais: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': `"pais" debe tener máximo {#limit} caracteres`,
    }),
});

export const actualizarLigaSchema = crearLigaSchema.fork(['id_deporte', 'nombre'], (field) => field.optional());