import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.routes.js';
import { initMongoConnection } from './db/initMongoConnection.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(pino());
app.use(express.json()); 

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

initMongoConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});



