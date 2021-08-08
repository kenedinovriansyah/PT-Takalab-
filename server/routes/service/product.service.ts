import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { Price, Product, SalesPrice } from '../../sqlz/models/product.models';
import { Upload } from '../../types/interface';
import { uploadFile } from '../utils/upload';

class Service {
  constructor() {}

  async create(body: any, user: any, file: Upload, res: Response) {
    const _ = await Product.create({
      ...body,
      id: v4(),
      picture: uploadFile.file(file),
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
    return _;
  }

  async update(file: Upload, req: Request, res: Response) {
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
    if (file) {
      _.picture = uploadFile.file(file);
    }
    _.name = req.body.name;
    _.desc = req.body.desc;
    _.price = req.body.price;
    _.sales_price = req.body.sales_price;
    _.stock = req.body.stock;
    _.max_stock = req.body.max_stock;
    _.sku = req.body.sku;
    _.save();
    return _;
  }
}

export const productService = new Service();
