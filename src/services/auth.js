import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const createSession = async (sessionData) => {
  return await Session.create(sessionData);
};

export const deleteSessionsByUserId = async (userId) => {
  return await Session.deleteMany({ userId });
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  const userId = session.userId;

  const newAccessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await Session.deleteOne({ _id: session._id });

  await Session.create({
    userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, newRefreshToken };

};

export const logout = async (refreshToken) => {
  const result = await Session.deleteOne({ refreshToken });

  if (result.deletedCount === 0) {
    throw createHttpError(401, 'Not authorized');
  }
};



