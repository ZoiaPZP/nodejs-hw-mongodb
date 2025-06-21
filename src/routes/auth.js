import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginUserSchema } from '../validation/authValidation.js';
import authController from '../controllers/auth.js';

const router = express.Router();

router.post('/refresh', authController.refresh);

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/login', validateBody(loginUserSchema), authController.login);

router.post('/logout', authController.logout);

export default router;




