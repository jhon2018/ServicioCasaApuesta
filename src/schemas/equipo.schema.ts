import Joi from "joi";

export const equipoSchema = Joi.object({
    id_liga: Joi.number().required(),
    nombre: Joi.string().min(3).max(50).required(),
    abreviatura: Joi.string().min(1).max(50).required()
});