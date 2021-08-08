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
import compression from 'compression';
import { ProductInclude } from '../sqlz/query/product.query';
import { Upload } from '../types/interface';
import { productService } from './service/product.service';
import { OpenAPI } from 'routing-controllers-openapi';

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
    file: Upload,
    @CurrentUser() user: any,
    @Body() body: any,
    @Res() res: Response
  ) {
    return res.status(201).json({
      message: 'Product has been created',
      data: await productService.create(body, user, file, res),
    });
  }

  @Post(':id/')
  public async updated(
    @UploadedFile('picture', {
      options: new Multer_().upload(),
    })
    file: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return res.status(200).json({
      message: 'Product has been updated',
      data: await productService.update(file, req, res),
    });
  }

  @Get()
  @OpenAPI({
    description: 'List all avaiable product',
    responses: {
      '400': {
        description: 'Bad Request',
      },
    },
  })
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
