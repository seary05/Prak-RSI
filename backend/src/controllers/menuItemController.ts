import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/commonSchema.ts';
import type { CreateMenuItemInput, MenuItemQuery, UpdateMenuItemInput } from '../schemas/menuItemSchema.ts';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(menuItemService: MenuItemService = new MenuItemService()) {
    this.menuItemService = menuItemService;
  }

  getMenuItems = async (_req: Request, res: Response): Promise<void> => {
    const { page, limit, stallId } = getValidated<MenuItemQuery>(res, 'query');
    const { data, total } = await this.menuItemService.getAllMenuItems({ page, limit, stallId });
    res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
  };

  getMenuItemById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const item = await this.menuItemService.getMenuItemById(id);
    res.status(200).json({ status: 'success', data: item });
  };

  createMenuItem = async (req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateMenuItemInput>(res, 'body');
    const item = await this.menuItemService.createMenuItem(body, getUser(req));
    res.status(201).json({ status: 'success', data: item });
  };

  updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const body = getValidated<UpdateMenuItemInput>(res, 'body');
    const item = await this.menuItemService.updateMenuItem(id, body, getUser(req));
    res.status(200).json({ status: 'success', data: item });
  };

  deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const item = await this.menuItemService.deleteMenuItem(id, getUser(req));
    res.status(200).json({ status: 'success', data: item });
  };
}