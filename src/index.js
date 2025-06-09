import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import './server.js';

const bootstrap = async () => {
  await initMongoConnection();      
};

bootstrap();


