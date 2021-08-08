import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config.database';
import { Category } from './category.models';
import { User } from './user.models';

interface ProductAttributes {
  id: string;
  name: string;
  desc: string;
  price: string;
  sales_price: string;
  stock: number;
  max_stock: number;
  sku: string;
  picture: any;
  createAt?: Date;
  updateAt?: Date;
}

export class Product
  extends Model<ProductAttributes>
  implements ProductAttributes
{
  public id: string;
  public name: string;
  public desc: string;
  public price: string;
  public sales_price: string;
  public stock: number;
  public max_stock: number;
  public sku: string;
  public picture: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sales_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'product',
  }
);

Product.belongsTo(User, {
  targetKey: 'id',
});
Product.belongsTo(Category, {
  targetKey: 'id',
});
