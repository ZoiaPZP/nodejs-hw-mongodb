import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';
import createError from 'http-errors';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Contacts API! Use /contacts to access the API.',
    });
  });


  app.use('/contacts', contactsRouter);

  app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
  });

  app.use(errorHandler);

  return app;
};







