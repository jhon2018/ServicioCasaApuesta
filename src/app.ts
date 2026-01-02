//Ruta: /src/app.ts
//Descripción: Archivo principal para configurar y ejecutar el servidor Express.
//Ruta: /src/app.ts
//Descripción: Archivo principal para configurar y ejecutar el servidor Express.

import dotenv from 'dotenv';
import deporteRoutes from '../src/routes/deporte.route';
import ligaRoutes from '../src/routes/liga.route';
dotenv.config();
import express from 'express';
import morgan from 'morgan';


const app = express();
app.use(morgan('dev'));
app.use(express.json());
const prefix = '/api/v1';

//TABLA DEPORTES
app.use(`${prefix}/deportes`, deporteRoutes);
//TABLA LIGAS
app.use(`${prefix}/ligas`, ligaRoutes);


app.listen(3000, () => {
    console.log('Servidor Respondiendo en el puerto 3000');
  });

