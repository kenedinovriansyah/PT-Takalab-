import { Request, Response } from 'express';
import Joi from 'joi';
import { v4 } from 'uuid';
import { Price, Product, SalesPrice } from '../../sqlz/models/product.models';
import { Upload } from '../../types/interface';
import { uploadFile } from '../utils/upload';

class Service {
  constructor() {}

  public validate(body: any, res: Response) {
    const validate = Joi.object({
      name: Joi.string().required(),
      desc: Joi.string().required(),
      stock: Joi.number().required(),
      max_stock: Joi.number().required(),
      sku: Joi.string().required(),
      price: Joi.string().required(),
      sales_price: Joi.string().required(),
      category: Joi.string().required(),
    }).validate(body);
    if (validate.error) {
      return res.status(400).json({
        message: validate.error.message,
      });
    }
    return validate.value;
  }

  async create(body: any, user: any, file: Upload, res: Response) {
    const _ = await Product.create({
      ...this.validate(body, res),
      id: v4(),
      picture: uploadFile.file(file),
      fk_user: user.user.id,
      fk_category: this.validate(body, res).category,
    }).catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
    await Price.create({
      id: v4(),
      cost: this.validate(body, res).price,
      currency: this.validate(body, res).price,
      fk_product: _.get('id') as string,
    });
    await SalesPrice.create({
      id: v4(),
      cost: this.validate(body, res).sales_price,
      currency: this.validate(body, res).sales_price,
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
    _.category = req.body.category;
    _.save();
    return _;
  }
}

export const productService = new Service();
