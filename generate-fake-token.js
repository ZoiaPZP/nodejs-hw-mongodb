import 'dotenv/config';
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { email: 'fake-user999@example.com' },
  process.env.JWT_SECRET,
  { expiresIn: '5m' }
);

console.log('Generated token:', token);
