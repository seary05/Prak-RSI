import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const controller = new AuthController();

authRouter.post('/register', validate(registerSchema, 'body'), (req, res) => {
	// #swagger.security = []
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
	// #swagger.responses[400] = { description: 'Body tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.register(req, res);
});
authRouter.post('/login', validate(loginSchema, 'body'), (req, res) => {
	// #swagger.security = []
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
	// #swagger.responses[400] = { description: 'Body tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[401] = { description: 'Email atau password salah', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.login(req, res);
});
authRouter.get('/me', authenticate, (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.getMe(req, res);
});

export { authRouter };