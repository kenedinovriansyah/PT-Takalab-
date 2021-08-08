import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config.database';
import { Product } from './product.models';
import { User } from './user.models';

interface CategoryAttributes {
  id: string;
  name: string;
  UserId?: string;
  createAt?: Date;
  updateAt?: Date;
}

export class Category
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id: string;
  public name: string;
  public UserId!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;

  public readonly product?: Product[];
  public static associations: {
    product: Association<Category, Product>;
  };
}

Category.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'category',
  }
);

Category.belongsTo(User, {
  targetKey: 'id',
});
