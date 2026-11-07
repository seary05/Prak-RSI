import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/commonSchema.ts';
import { flagStatusSchema } from '../schemas/flagSchema.ts';

const flagRouter = Router();
const controller = new FlagController();

flagRouter.get('/', authenticate, authorize('admin'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.getFlags(req, res);
});
flagRouter.put('/:id', authenticate, authorize('admin'), validate(idParamSchema, 'params'), validate(flagStatusSchema, 'body'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.updateStatus(req, res);
});
flagRouter.put('/:id/status', authenticate, authorize('admin'), validate(idParamSchema, 'params'), validate(flagStatusSchema, 'body'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.updateStatus(req, res);
});

export { flagRouter };