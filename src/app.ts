//Ruta: /src/app.ts
//Descripción: Archivo principal para configurar y ejecutar el servidor Express.

import dotenv from 'dotenv';
import rolRoutes from "./routes/rol.routes";
dotenv.config();
import express from 'express';
import morgan from 'morgan';


const app = express();
app.use(morgan('dev'));
app.use(express.json());
const prefix = '/api/v1';

app.use(`${prefix}/roles`, rolRoutes);

app.listen(3000, () => {
    console.log('Servidor Respondiendo en el puerto 3000');
  });