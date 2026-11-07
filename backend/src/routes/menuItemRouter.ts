import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/commonSchema.ts';
import { createMenuItemSchema, menuItemQuerySchema, updateMenuItemSchema } from '../schemas/menuItemSchema.ts';

const menuItemRouter = Router();
const controller = new MenuItemController();

menuItemRouter.get('/', validate(menuItemQuerySchema, 'query'), (req, res) => {
	// #swagger.security = []
	return controller.getMenuItems(req, res);
});
menuItemRouter.post('/', authenticate, authorize('owner', 'admin'), validate(createMenuItemSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Role atau kepemilikan tidak diizinkan', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.createMenuItem(req, res);
});
menuItemRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
	// #swagger.security = []
	return controller.getMenuItemById(req, res);
});
menuItemRouter.put('/:id', authenticate, authorize('owner', 'admin'), validate(idParamSchema, 'params'), validate(updateMenuItemSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Role atau kepemilikan tidak diizinkan', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.updateMenuItem(req, res);
});
menuItemRouter.delete('/:id', authenticate, authorize('owner', 'admin'), validate(idParamSchema, 'params'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Role atau kepemilikan tidak diizinkan', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.deleteMenuItem(req, res);
});

export { menuItemRouter };