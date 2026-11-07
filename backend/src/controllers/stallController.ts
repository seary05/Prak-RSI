import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/commonSchema.ts';
import type { StallQuery, CreateStallInput, UpdateStallInput } from '../schemas/stallSchema.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  getStalls = async (_req: Request, res: Response): Promise<void> => {
    const { page, limit, search, category } = getValidated<StallQuery>(res, 'query');
    const { data, total } = await this.stallService.getAllStalls({ search, category, page, limit });
    res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
  };

  getStallById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.getStallById(id);
    res.status(200).json({ status: 'success', data: stall });
  };

  getStallMenus = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const menus = await this.stallService.getStallMenus(id);
    res.status(200).json({ status: 'success', data: menus });
  };

  createStall = async (req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateStallInput>(res, 'body');
    const { id: ownerId } = getUser(req);
    const stall = await this.stallService.createStall(body, ownerId);
    res.status(201).json({ status: 'success', data: stall });
  };

  updateStall = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const body = getValidated<UpdateStallInput>(res, 'body');
    const stall = await this.stallService.updateStall(id, body, getUser(req));
    res.status(200).json({ status: 'success', data: stall });
  };

  deleteStall = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.deleteStall(id);
    res.status(200).json({ status: 'success', data: stall });
  };
}
