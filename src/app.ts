//Ruta: /src/app.ts
//Descripción: Archivo principal para configurar y ejecutar el servidor Express.

import dotenv from 'dotenv';
import equipoRoutes from '../src/routes/equipo.route';
import eventoRoutes from '../src/routes/evento.route';
dotenv.config();
import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
const prefix = '/api/v1';

//Equipo
app.use(`${prefix}/equipos`, equipoRoutes);
//Evento
app.use(`${prefix}/eventos`, eventoRoutes);

app.listen(3000, () => {
  console.log('Servidor respondiendo en el puerto 3000');
});
