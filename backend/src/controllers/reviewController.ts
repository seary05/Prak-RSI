import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/commonSchema.ts';
import type { CreateReviewInput, ReviewQuery } from '../schemas/reviewSchema.ts';

export class ReviewController {
  constructor(private reviewService: ReviewService = new ReviewService()) {}

  getReviews = async (_req: Request, res: Response): Promise<void> => {
    const { stallId } = getValidated<ReviewQuery>(res, 'query');
    const data = await this.reviewService.getReviews(stallId);
    res.status(200).json({ status: 'success', data });
  };

  createReview = async (req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateReviewInput>(res, 'body');
    const review = await this.reviewService.createReview({ ...input, userId: getUser(req).id });
    res.status(201).json({ status: 'success', data: review });
  };

  deleteReview = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const data = await this.reviewService.deleteReview(id, getUser(req));
    res.status(200).json({ status: 'success', data });
  }
}