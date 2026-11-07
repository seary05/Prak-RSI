import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/commonSchema.ts';
import { createReviewSchema, reviewQuerySchema } from '../schemas/reviewSchema.ts';

const reviewRouter = Router();
const controller = new ReviewController();

reviewRouter.get('/', validate(reviewQuerySchema, 'query'), (req, res) => {
	// #swagger.security = []
	return controller.getReviews(req, res);
});
reviewRouter.post('/', authenticate, validate(createReviewSchema, 'body'), (req, res) => {
	// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.createReview(req, res);
});
reviewRouter.delete('/:id', authenticate, validate(idParamSchema, 'params'), (req, res) => {
	// #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid', schema: { $ref: '#/definitions/ErrorResponse' } }
	// #swagger.responses[403] = { description: 'Review milik pengguna lain', schema: { $ref: '#/definitions/ErrorResponse' } }
	return controller.deleteReview(req, res);
});

export { reviewRouter };