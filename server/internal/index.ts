import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const port = process.env.port;
export const prod = process.env.prod;
export const db_name = process.env.db_name;
export const db_user = process.env.db_user;
export const db_pass = process.env.db_pass;
export const db_type: Dialect = process.env.db_type as Dialect;
export const __test__ = process.env.test;
