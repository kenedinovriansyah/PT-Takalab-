import { Association, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config.database';
import { Category } from './category.models';

interface UserAttributes {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  createAt?: Date;
  updateAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public username!: string;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public password!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;

  public readonly category?: Category[];

  public static associations: {
    category: Association<User, Category>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'users',
  }
);
