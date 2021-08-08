import { Request } from 'express';
import { v4 } from 'uuid';
import { Category } from '../../sqlz/models/category.models';

class Service {
  constructor() {}

  async create(req: Request, user: any) {
    const _ = await Category.create({
      name: req.body.name,
      id: v4(),
      fk_user: user.user.id,
    });
    return _;
  }
  async updated(req: Request) {
    const _ = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    _.name = req.body.name;
    _.save();
    return _;
  }
}

export const categoryService = new Service();
