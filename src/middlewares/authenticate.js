import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    
    req.user = { _id: payload.userId };


    next();
  } catch (error) {
    next(error);
  }
};
