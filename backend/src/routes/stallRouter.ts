import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/commonSchema.ts';
import { createStallSchema, stallQuerySchema, updateStallSchema } from '../schemas/stallSchema.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), (req, res) => {
  // #swagger.security = []
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', authenticate, authorize('owner', 'admin'), validate(createStallSchema, 'body'), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.responses[403] = { description: 'Role tidak diizinkan', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.security = []
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put('/:id', authenticate, authorize('owner', 'admin'), validate(idParamSchema, 'params'), validate(updateStallSchema, 'body'), (req, res) => {
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.responses[403] = { description: 'Role atau kepemilikan tidak diizinkan', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.updateStall(req, res);
});

stallRouter.delete('/:id', authenticate, authorize('admin'), validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.deleteStall(req, res);
});

stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.security = []
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

export { stallRouter };
