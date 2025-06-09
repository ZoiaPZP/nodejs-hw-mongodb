import 'dotenv/config';
import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
    MONGODB_DB,
  } = process.env;

  const mongoUri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

console.log('Connecting to MongoDB at:', mongoUri);  

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Mongo connection successfully established!');
  } catch (error) {
    console.error('❌ Mongo connection failed:', error.message);
    process.exit(1);
  }
};


