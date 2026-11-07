import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { createLikeSchema, reviewIdParamSchema } from '../schemas/likeSchema.ts';

const likeRouter = Router();
const controller = new LikeController();

likeRouter.post('/', authenticate, validate(createLikeSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.createLike(req, res);
});
likeRouter.delete('/:reviewId', authenticate, validate(reviewIdParamSchema, 'params'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.deleteLike(req, res);
});

export { likeRouter };