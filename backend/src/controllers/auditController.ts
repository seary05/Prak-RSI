import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateAuditLogInput } from '../schemas/auditSchema.ts';

export class AuditController {
  constructor(private auditService: AuditService = new AuditService()) {}

  getAuditLogs = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.auditService.getAuditLogs();
    res.status(200).json({ status: 'success', data });
  };

  createAuditLog = async (req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateAuditLogInput>(res, 'body');
    const log = await this.auditService.createAuditLog({ ...input, userId: getUser(req).id });
    res.status(201).json({ status: 'success', data: log });
  };
}