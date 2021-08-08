import { Request, Response } from 'express';
import {
  Authorized,
  Body,
  Controller,
  CurrentUser,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseAfter,
  UseBefore,
} from 'routing-controllers';
var bodyParser = require('body-parser');
import multer, { Multer, StorageEngine } from 'multer';
import path from 'path';
import { Price, SalesPrice, Product } from '../sqlz/models/product.models';
import { v4 } from 'uuid';
import compression from 'compression';
import { ProductInclude } from '../sqlz/query/product.query';

export class Multer_ {
  constructor() {}

  async upload(): Promise<Multer> {
    const storage: StorageEngine = multer.diskStorage({
      filename: function (req: Request, file, cb) {
        cb(
          null,
          `${file.originalname.replace('.', '')}.${file.mimetype.split('/')[1]}`
        );
      },
      destination: function (req: Request, file, cb) {
        cb(null, path.join(__dirname, '../media'));
      },
    });
    return multer({ storage });
  }
}

@Controller('product/')
@UseAfter(compression())
@UseBefore(bodyParser.json())
@UseBefore(bodyParser.urlencoded({ extended: false }))
export class ProductControllers {
  constructor() {}

  @Authorized()
  @Post()
  public async create(
    @UploadedFile('picture', {
      options: new Multer_().upload(),
    })
    picture: any,
    @CurrentUser() user: any,
    @Body() body: any,
    @Res() res: Response
  ) {
    const _ = await Product.create({
      ...body,
      id: v4(),
      fk_user: user.user.id,
      fk_category: body.category,
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    await Price.create({
      id: v4(),
      cost: body.price,
      currency: body.price,
      fk_product: _.get('id') as string,
    });
    await SalesPrice.create({
      id: v4(),
      cost: body.sales_price,
      currency: body.sales_price,
      fk_product: _.get('id') as string,
    });
    return res.status(201).json({
      message: 'Product has been created',
      data: _,
    });
  }

  @Post(':id/')
  public async updated(
    @UploadedFile('picture', {
      options: new Multer_().upload(),
    })
    picture: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    let _: any;
    _ = await Product.findOne({
      where: {
        id: req.params.id,
      },
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    _.name = req.body.name;
    _.desc = req.body.desc;
    _.price = req.body.price;
    _.sales_price = req.body.sales_price;
    _.stock = req.body.stock;
    _.max_stock = req.body.max_stock;
    _.sku = req.body.sku;
    _.save();

    return res.status(200).json({
      message: 'Product has been updated',
      data: _,
    });
  }

  @Get()
  public async all(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(
      await Product.findAll({
        include: ProductInclude,
      })
    );
  }

  @Get(':id/')
  public async getOne(@Req() req: Request, @Res() res: Response) {
    const _ = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: ProductInclude,
      attributes: {
        exclude: ['fk_user', 'fk_category'],
      },
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    return res.status(200).json(_);
  }
}
