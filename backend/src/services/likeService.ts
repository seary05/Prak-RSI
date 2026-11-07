import { LikeRepository } from '../repositories/likeRepository.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class LikeService {
  constructor(private likeRepository: LikeRepository = new LikeRepository()) {}

  async createLike(reviewId: number, userId: number) {
    return this.likeRepository.create(reviewId, userId);
  }

  async deleteLike(reviewId: number, userId: number) {
    const row = await this.likeRepository.remove(reviewId, userId);
    if (!row) throw new NotFoundError('Like tidak ditemukan');
    return row;
  }
}