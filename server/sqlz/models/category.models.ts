import { Association, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config.database';
import { Product } from './product.models';
import { User } from './user.models';

interface CategoryAttributes {
  id: string;
  name: string;
  createAt?: Date;
  updateAt?: Date;
  fk_user?: string;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id: string;
  public name: string;
  public fk_user!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;

  public readonly product?: Product[];
  public readonly UserId?: User;

  public static associations: {
    product: Association<Category, Product>;
    UserId: Association<Category, User>;
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
    fk_user: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'cascade',
    },
  },
  {
    sequelize: sequelize,
    tableName: 'category',
  }
);
