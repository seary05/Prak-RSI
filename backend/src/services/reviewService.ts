import { ReviewRepository, type CreateReviewInput } from '../repositories/reviewRepository.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import type { AuthUser } from './tokenService.ts';

export class ReviewService {
  constructor(private reviewRepository: ReviewRepository = new ReviewRepository()) {}

  getReviews(stallId?: number) {
    return this.reviewRepository.findAll(stallId);
  }

  createReview(input: CreateReviewInput) {
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error('INVALID_REVIEW_RATING');
    }
    return this.reviewRepository.create(input);
  }

  async deleteReview(id: number, user: AuthUser) {
    const current = await this.reviewRepository.findById(id);
    if (!current) throw new NotFoundError('Review tidak ditemukan');
    if (user.role !== 'admin' && current.userId !== user.id) {
      throw new ForbiddenError('Kamu hanya bisa menghapus review milikmu sendiri');
    }
    const row = await this.reviewRepository.remove(id);
    if (!row) throw new NotFoundError('Review tidak ditemukan');
    return row;
  }
}