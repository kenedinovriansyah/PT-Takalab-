import path from 'path';
import { Sequelize } from 'sequelize';
import { db_name, db_pass, db_type, db_user } from '../internal';

export const sequelize = new Sequelize({
  username: db_user,
  password: db_pass,
  database: db_name,
  dialect: db_type,
  logging: false,
  storage: path.join(__dirname, '../../database.sqlite'),
});
