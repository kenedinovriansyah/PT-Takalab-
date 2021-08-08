import { Request, Response } from 'express';
import argon2 from 'argon2';
import { User } from '../../sqlz/models/user.models';

class Service {
  constructor() {}

  async changePassword(user: any, req: Request, res: Response) {
    const _ = await User.findOne({
      where: {
        id: user.user.id,
      },
    });
    if (!argon2.verify(_.password, req.body.old_password)) {
      return res.status(400).json({
        message: 'Password is wrong',
      });
    }
    if (req.body.password !== req.body.password_confirmation) {
      return res.status(400).json({
        message: "Password don't match, please checek again",
      });
    }
    _.password = await argon2.hash(req.body.password);
    _.save();
  }

  async changeEmail(user: any, req: Request, res: Response) {
    const _ = await User.findOne({
      where: {
        id: user.user.id,
      },
    });
    if (!argon2.verify(_.password, req.body.password)) {
      return res.status(400).json({
        message: 'Password is wrong',
      });
    }
    _.email = req.body.email;
    _.save();
  }
}

export const userService = new Service();
