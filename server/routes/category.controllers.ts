import compression from 'compression';
import { Request, Response } from 'express';
import {
  Controller,
  CurrentUser,
  Get,
  Post,
  Req,
  Res,
  UseAfter,
} from 'routing-controllers';
import { v4 } from 'uuid';
import { Category } from '../sqlz/models/category.models';

@Controller()
@UseAfter(compression())
export class CategoryControllers {
  constructor() {}

  @Post('category/')
  public async create(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const _ = await Category.create({
      name: req.body.name,
      id: v4(),
      UserId: user.user.id,
    });
    return res.status(201).json({
      message: 'Category has been created',
      data: _,
    });
  }

  @Post('category/:id/')
  public async updated(@Req() req: Request, @Res() res: Response) {
    const _ = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    _.name = req.body.name;
    _.save();
    return res.status(200).json({
      message: 'Category has been updated',
    });
  }

  @Get('category/')
  public async all(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(await Category.findAll());
  }

  @Get('category/:id/')
  public async getOne(@Req() req: Request, @Res() res: Response) {
    const _ = await Category.findOne({
      where: {
        id: req.params.id,
      },
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    console.log(_);
    return res.status(200).json(_);
  }
}
