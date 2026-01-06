import Joi from "joi";

export const eventoSchema = Joi.object({
    id_liga: Joi.number().required(),
    equipo_local: Joi.number().required(),
    equipo_visitante: Joi.number().required(),
    fecha_hora_inicio: Joi.date().required(),
    fecha_hora_fin: Joi.date().required(),
    resultado: Joi.string().min(3).max(50).required(),
    estado: Joi.number().required()
});