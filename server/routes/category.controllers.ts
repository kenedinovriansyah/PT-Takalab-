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
import { CategoryInclude, CategoryQuery } from '../sqlz/query/category.query';
import { categoryService } from './service/category.service';

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
    return res.status(201).json({
      message: 'Category has been created',
      data: await categoryService.create(req, user),
    });
  }

  @Post('category/:id/')
  public async updated(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      message: 'Category has been updated',
      data: await categoryService.updated(req),
    });
  }

  @Get('category/')
  public async all(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(
      await CategoryQuery.findAll({
        include: CategoryInclude,
      })
    );
  }

  @Get('category/:id/')
  public async getOne(@Req() req: Request, @Res() res: Response) {
    const _ = await CategoryQuery.findOne({
      where: {
        id: req.params.id,
      },
      include: CategoryInclude,
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    return res.status(200).json(_);
  }
}
