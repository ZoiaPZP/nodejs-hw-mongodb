import Joi from 'joi';

const nameSchema = Joi.string().min(3).max(20);
const emailSchema = Joi.string().email().min(3).max(20);
const phoneSchema = Joi.string()
  .pattern(/^[+]?[\d\s\-()]{3,20}$/)
  .message('PhoneNumber must contain only digits, spaces, dashes, parentheses, and may start with +')
  .min(3)
  .max(20);

export const createContactSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  phoneNumber: phoneSchema.required(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  isFavourite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
 phoneNumber: phoneSchema,
  isFavourite: Joi.boolean().default(false),
}).min(1); 

export const updateStatusSchema = Joi.object({
  isFavourite: Joi.boolean().required(),
});

