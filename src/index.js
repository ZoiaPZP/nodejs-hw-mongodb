import 'dotenv/config';
import contactsRouter from './routes/contacts.js';

import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express'; 

const PORT = process.env.PORT || 3000;

const setupServer = () => {
  const app = express();
  app.use(express.json()); 
  return app;
};

const bootstrap = async () => {
  try {
    await initMongoConnection();

    const app = setupServer();

    app.use('/api/contacts', contactsRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

bootstrap();



