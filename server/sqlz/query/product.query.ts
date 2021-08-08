import { Includeable, Sequelize } from 'sequelize';
import { Category } from '../models/category.models';
import { Price, Product, SalesPrice } from '../models/product.models';
import { User } from '../models/user.models';

Product.belongsTo(Category, {
  as: 'category',
  foreignKey: 'fk_category',
});

Product.belongsTo(User, {
  as: 'author',
  foreignKey: 'fk_user',
});

Product.hasOne(Price, {
  sourceKey: 'id',
  as: 'price',
  foreignKey: 'fk_product',
});

Product.hasOne(SalesPrice, {
  sourceKey: 'id',
  as: 'sales_price',
  foreignKey: 'fk_product',
});

const include: Includeable[] = [
  {
    model: Price,
    as: 'price',
    required: false,
    attributes: ['cost', 'currency'],
    where: {
      fk_product: Sequelize.col('product.id'),
    },
  },
  {
    model: SalesPrice,
    as: 'sales_price',
    required: false,
    attributes: ['cost', 'currency'],
    where: {
      fk_product: Sequelize.col('product.id'),
    },
  },
  {
    model: Category,
    as: 'category',
    required: false,
    attributes: {
      exclude: ['fk_user'],
    },
  },
  {
    model: User,
    as: 'author',
    required: false,
    attributes: [
      'id',
      'username',
      'first_name',
      'last_name',
      'createdAt',
      'updatedAt',
    ],
  },
];

export { Product as ProductQuery, include as ProductInclude };
