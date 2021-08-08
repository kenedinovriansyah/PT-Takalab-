import express from 'express';
import { Action, createExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import cors from 'cors';
var bodyparser = require('body-parser');
import jwt from 'jsonwebtoken';
import { port, __test__ } from '../internal';
import { UserControllers } from '../routes/user.controllers';
import { sequelize } from '../sqlz/config.database';
import { CategoryControllers } from '../routes/category.controllers';

class App {
  app: express.Application = express();
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
    this.app.use(cors());
    this.app.use(bodyparser.json());
    this.app.use(
      bodyparser.urlencoded({
        extended: true,
      })
    );
    this.app.use(
      createExpressServer({
        routePrefix: '/api/v1/',
        controllers: [UserControllers, CategoryControllers],
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
