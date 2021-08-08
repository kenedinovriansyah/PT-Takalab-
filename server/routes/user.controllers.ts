import { Request, Response } from 'express';
import {
  Authorized,
  Controller,
  CurrentUser,
  Get,
  Post,
  Req,
  Res,
} from 'routing-controllers';
import { User } from '../sqlz/models/user.models';
import { v4 } from 'uuid';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

@Controller()
export class UserControllers {
  constructor() {}

  @Authorized()
  @Get('user/')
  public async getAll(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(await User.findAll());
  }

  @Authorized()
  @Get('user/:id/')
  public getOne(@Req() req: Request, @Res() res: Response) {
    const _ = User.findOne({
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

  @Authorized()
  @Get('user/me/')
  public me(@CurrentUser() user: any, @Res() res: Response) {
    return res.status(200).json(user);
  }

  @Post('user/')
  public async login(@Req() req: Request, @Res() res: Response) {
    const _ = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!argon2.verify(_.password, req.body.password)) {
      return res.status(400).json({
        message: 'Inccorect username or password',
      });
    }
    return res.status(200).json(jwt.sign({ user: _ }, 'Hello Worlds'));
  }

  @Post('user/created/')
  public async created(@Req() req: Request, @Res() res: Response) {
    await User.create({
      ...req.body,
      id: v4(),
      password: await argon2.hash(req.body.password),
    });
    return res.status(201).json({
      message: 'Accounts has been created',
    });
  }

  @Authorized()
  @Post('user/password/')
  public async changePassword(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
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
    return res.status(200).json({
      message: 'Password has been updated',
    });
  }

  @Authorized()
  @Post('user/email/')
  public async changeEmail(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
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
    return res.status(200).json({
      message: 'Email has been updated',
    });
  }
}