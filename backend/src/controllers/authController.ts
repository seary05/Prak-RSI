import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';

export class AuthController {
  constructor(private userService: UserService = new UserService()) {}

  register = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<RegisterInput>(res, 'body');
    const user = await this.userService.register(input);
    res.status(201).json({ status: 'success', data: { user } });
  };

  login = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<LoginInput>(res, 'body');
    const data = await this.userService.login(input);
    res.status(200).json({ status: 'success', data });
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: getUser(req) });
  };
}