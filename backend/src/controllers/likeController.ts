import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateLikeInput } from '../schemas/likeSchema.ts';
import type { ReviewIdParam } from '../schemas/likeSchema.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class LikeController {
  constructor(private likeService: LikeService = new LikeService()) {}

  createLike = async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = getValidated<CreateLikeInput>(res, 'body');
    const like = await this.likeService.createLike(reviewId, getUser(req).id);
    res.status(201).json({ status: 'success', data: like });
  };

  deleteLike = async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = getValidated<ReviewIdParam>(res, 'params');
    const user = getUser(req);
    const like = await this.likeService.deleteLike(reviewId, user.id);
    if (!like) throw new NotFoundError('Like tidak ditemukan');
    res.status(200).json({ status: 'success', data: like });
  };
}