import {
  MenuItemRepository,
  type CreateMenuItemInput as RepositoryCreateMenuItemInput,
  type FindMenuItemsParams,
} from '../repositories/menuItemRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import type { AuthUser } from './tokenService.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/menuItemSchema.ts';

export class MenuItemService {
  constructor(
    private menuItemRepository: MenuItemRepository = new MenuItemRepository(),
    private stallRepository: StallRepository = new StallRepository(),
  ) {}

  private async ensureStallAccess(stallId: number, user: AuthUser) {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new NotFoundError('Data warung tidak ditemukan');
    if (user.role !== 'admin' && stall.ownerId !== user.id) {
      throw new ForbiddenError('Kamu hanya bisa mengelola menu warung milikmu sendiri');
    }
  }

  async getAllMenuItems(params: FindMenuItemsParams) {
    const { rows, total } = await this.menuItemRepository.findAll(params);
    return { data: rows, total };
  }

  async getMenuItemById(id: number) {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new NotFoundError('Data menu tidak ditemukan');
    return row;
  }

  async createMenuItem(input: RepositoryCreateMenuItemInput, user: AuthUser) {
    await this.ensureStallAccess(input.stallId, user);
    const row = await this.menuItemRepository.create(input);
    if (!row) throw new NotFoundError('Data menu tidak ditemukan');
    return row;
  }

  async updateMenuItem(id: number, input: UpdateMenuItemInput, user: AuthUser) {
    const current = await this.menuItemRepository.findById(id);
    if (!current) throw new NotFoundError('Data menu tidak ditemukan');
    await this.ensureStallAccess(current.stallId, user);
    if (input.stallId !== undefined) await this.ensureStallAccess(input.stallId, user);
    const row = await this.menuItemRepository.update(id, input);
    if (!row) throw new NotFoundError('Data menu tidak ditemukan');
    return row;
  }

  async deleteMenuItem(id: number, user: AuthUser) {
    const current = await this.menuItemRepository.findById(id);
    if (!current) throw new NotFoundError('Data menu tidak ditemukan');
    await this.ensureStallAccess(current.stallId, user);
    const row = await this.menuItemRepository.remove(id);
    if (!row) throw new NotFoundError('Data menu tidak ditemukan');
    return row;
  }
}