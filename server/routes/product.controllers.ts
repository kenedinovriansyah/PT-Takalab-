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
import { Product } from '../sqlz/models/product.models';
import { v4 } from 'uuid';
import compression from 'compression';

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
      UserId: user.user.id,
      CategoryId: body.category,
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
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
    return res.status(200).json(await Product.findAll());
  }

  @Get(':id/')
  public async getOne(@Req() req: Request, @Res() res: Response) {
    const _ = await Product.findOne({
      where: {
        id: req.params.id,
      },
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    return res.status(200).json(_);
  }
}
