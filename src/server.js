import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';
import createError from 'http-errors';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path'; 

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

 
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf8')
  );

  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Contacts API! Use /contacts to access the API.',
    });
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

 
  app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
  });

  app.use(errorHandler);

  return app;
};










