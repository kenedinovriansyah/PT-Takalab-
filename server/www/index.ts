import express from 'express';
import { Action, createExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import cors from 'cors';
var bodyparser = require('body-parser');
import jwt from 'jsonwebtoken';
import { port, __test__ } from '../internal';
import { sequelize } from '../sqlz/config.database';
import path from 'path';

class App {
  app: express.Application = express();
  whitelist: any[string] = ['http://localhost:8080'];
  constructor() {
    sequelize.sync().then(() => {
      if (!__test__) {
        console.log('connect to db');
      }
    });
    this.extensions();
    this.listen();
  }

  public extensions() {
    const whitelist: any[] = this.whitelist;
    this.app.use(cors());
    this.app.use(bodyparser.json());
    this.app.use(bodyparser.urlencoded({ extended: false }));
    this.app.use(
      createExpressServer({
        routePrefix: '/api/v1/',
        cors: {
          origin: function (origin: any, callback: any) {
            if (whitelist.indexOf(origin) !== 1 || !origin) {
              callback(null, true);
            } else {
              callback(new Error('Not Allow By CORS'));
            }
          },
          optionsSuccessStatus: true,
        },
        controllers: [path.join(__dirname, '../routes/*.controllers.ts')],
        authorizationChecker: function (action: Action, roles: any[]) {
          const check =
            action.request.headers['authorization'].split('Bearer ')[1];
          if (check) {
            return true;
          }
          return false;
        },
        currentUserChecker: function (action: Action) {
          const check =
            action.request.headers['authorization'].split('Bearer ')[1];
          if (check) {
            return jwt.decode(check);
          }
          return null;
        },
        classTransformer: true,
        middlewares: [path.join(__dirname, '../routes/middleware.ts')],
      })
    );
  }
  public listen() {
    if (!__test__) {
      this.app.listen(port, () => {
        console.log(`application running on http://localhost:${port}`);
      });
    }
  }
}

export const app = new App();
