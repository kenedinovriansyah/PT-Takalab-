import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config.database';
import { Category } from './category.models';
import { User } from './user.models';
import currencyFormatter from 'currency-formatter';

interface ProductAttributes {
  id: string;
  name: string;
  desc: string;
  stock: number;
  max_stock: number;
  sku: string;
  picture: any;
  createAt?: Date;
  updateAt?: Date;
  fk_category?: string;
  fk_user?: string;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id: string;
  public name: string;
  public desc: string;

  public stock: number;
  public max_stock: number;
  public sku: string;
  public picture: string;
  public fk_category!: string;
  public fk_user!: string;
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
    fk_user: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'cascade',
    },
    fk_category: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
      onDelete: 'cascade',
    },
  },
  {
    sequelize: sequelize,
    tableName: 'product',
  }
);

interface CurrencyAttributes {
  id: string;
  cost: string;
  currency: string;
  fk_product?: string;
}

class Price extends Model<CurrencyAttributes> implements CurrencyAttributes {
  public id: string;
  public cost: string;
  public currency: string;
  public fk_product!: string;
}

Price.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(2, 8),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'Rp.0',
      get() {
        const cost = this.getDataValue('cost');
        return currencyFormatter.format(parseInt(cost), { locale: 'id-ID' });
      },
    },
    fk_product: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
      onDelete: 'cascade',
    },
  },
  { sequelize: sequelize, tableName: 'price' }
);

class SalesPrice
  extends Model<CurrencyAttributes>
  implements CurrencyAttributes
{
  public id: string;
  public cost: string;
  public currency: string;
  public fk_product!: string;
}

SalesPrice.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(2, 8),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'Rp.0',
      get() {
        const cost = this.getDataValue('cost');
        return currencyFormatter.format(parseInt(cost), { locale: 'id-ID' });
      },
    },
    fk_product: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
      onDelete: 'cascade',
    },
  },
  { sequelize: sequelize, tableName: 'sales_price' }
);

export { Product, Price, SalesPrice };
