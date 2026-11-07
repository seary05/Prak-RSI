import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/commonSchema.ts';
import type { FlagStatusInput } from '../schemas/flagSchema.ts';

export class FlagController {
  constructor(private flagService: FlagService = new FlagService()) {}

  getFlags = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.flagService.getFlags();
    res.status(200).json({ status: 'success', data });
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const { status } = getValidated<FlagStatusInput>(res, 'body');
    const data = await this.flagService.updateStatus(id, status);
    res.status(200).json({ status: 'success', data });
  };
}