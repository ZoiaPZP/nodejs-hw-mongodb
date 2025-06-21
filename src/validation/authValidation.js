import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(30).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(30).required(),
});

