import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createUserSchema } from '../schemas/userSchema.ts';

const userRouter = Router();
const controller = new UserController();

userRouter.get('/', authenticate, authorize('admin'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.getUsers(req, res);
});
userRouter.post('/', authenticate, authorize('admin'), validate(createUserSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.createUser(req, res);
});

export { userRouter };