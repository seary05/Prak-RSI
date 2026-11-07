import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createAuditLogSchema } from '../schemas/auditSchema.ts';

const auditRouter = Router();
const controller = new AuditController();

auditRouter.get('/', authenticate, authorize('admin'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.getAuditLogs(req, res);
});
auditRouter.post('/', authenticate, authorize('admin'), validate(createAuditLogSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Khusus admin', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.createAuditLog(req, res);
});

export { auditRouter };