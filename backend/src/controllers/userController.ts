import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateUserInput } from '../schemas/userSchema.ts';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.userService.getUsers();
    res.status(200).json({ status: 'success', data });
  };

  createUser = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateUserInput>(res, 'body');
    const user = await this.userService.createUser(input);
    res.status(201).json({ status: 'success', data: user });
  };
}