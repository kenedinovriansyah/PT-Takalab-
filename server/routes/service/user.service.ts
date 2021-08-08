import { Request, Response } from 'express';
import argon2 from 'argon2';
import { User } from '../../sqlz/models/user.models';
import { v4 } from 'uuid';
import Joi, { string } from 'joi';

class Service {
  constructor() {}

  async login(req: Request, res: Response) {
    const validate = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().required(),
    }).validate(req.body);
    if (validate.error) {
      return res.status(400).json({
        message: validate.error.message,
      });
    }
    const _ = await User.findOne({
      where: {
        username: validate.value.username,
      },
    });
    if (!argon2.verify(_.password, validate.value.password)) {
      return res.status(400).json({
        message: 'Inccorect username or password',
      });
    }
    return _;
  }

  async create(req: Request, res: Response) {
    const validate = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      password_confirmation: Joi.ref('password'),
    }).validate(req.body);
    if (validate.error) {
      return res.status(400).json({
        message: validate.error.message,
      });
    }
    await User.create({
      ...validate.value,
      id: v4(),
      password: await argon2.hash(validate.value.password),
    });
  }

  async changePassword(user: any, req: Request, res: Response) {
    const validate = Joi.object({
      old_password: Joi.string().required(),
      password: Joi.string().min(6).required(),
      password_confirmation: Joi.ref('password'),
    }).validate(req.body);
    if (validate.error) {
      return res.status(400).json({
        message: validate.error.message,
      });
    }
    const _ = await User.findOne({
      where: {
        id: user.user.id,
      },
    });
    if (!argon2.verify(_.password, validate.value.old_password)) {
      return res.status(400).json({
        message: 'Password is wrong',
      });
    }
    _.password = await argon2.hash(validate.value.password);
    _.save();
  }

  async changeEmail(user: any, req: Request, res: Response) {
    const validate = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    }).validate(req.body);
    if (validate.error) {
      return res.status(400).json({
        message: validate.error.message,
      });
    }
    const _ = await User.findOne({
      where: {
        id: user.user.id,
      },
    });
    if (!argon2.verify(_.password, validate.value.password)) {
      return res.status(400).json({
        message: 'Password is wrong',
      });
    }
    _.email = validate.value.email;
    _.save();
  }
}

export const userService = new Service();
