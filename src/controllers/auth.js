import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { sendResetEmail } from '../services/email.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await authService.getUserByEmail(email);
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await authService.createUser({
    name,
    email,
    password: hashedPassword,
  });

  const userResponse = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: userResponse,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.getUserByEmail(email);
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const userId = user._id;

  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await authService.deleteSessionsByUserId(userId);

  const session = await authService.createSession({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 'success',
      message: 'Login successful',
      data: { accessToken },
    });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const { accessToken, newRefreshToken } = await authService.refreshSession(refreshToken);

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Not authorized');
  }

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};


const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await authService.getUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  
  await sendResetEmail(email, resetLink);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await authService.getUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await authService.updateUserPassword(email, hashedPassword);

  await authService.deleteSessionsByUserId(user._id);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  refresh: ctrlWrapper(refresh),
  logout: ctrlWrapper(logout),
  sendResetEmail: ctrlWrapper(sendResetEmailController), 
  resetPassword: ctrlWrapper(resetPasswordController),   
};






