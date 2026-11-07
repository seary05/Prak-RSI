import { FlagRepository, type FlagStatus } from '../repositories/flagRepository.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class FlagService {
  constructor(private flagRepository: FlagRepository = new FlagRepository()) {}

  getFlags() {
    return this.flagRepository.findAll();
  }

  async updateStatus(id: number, status: FlagStatus) {
    const row = await this.flagRepository.updateStatus(id, status);
    if (!row) throw new NotFoundError('Flag tidak ditemukan');
    return row;
  }
}