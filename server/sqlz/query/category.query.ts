import { Includeable, Sequelize } from 'sequelize';
import { Category } from '../models/category.models';
import { Product } from '../models/product.models';
import { User } from '../models/user.models';
import { ProductQuery } from './product.query';

Category.belongsTo(User, {
  as: 'author',
  foreignKey: 'fk_user',
});
Category.hasMany(Product, {
  as: 'product',
  sourceKey: 'id',
  foreignKey: 'fk_category',
});

const include: Includeable[] = [
  {
    model: User,
    as: 'author',
    required: false,
    attributes: [
      'username',
      'first_name',
      'last_name',
      'createdAt',
      'updatedAt',
    ],
  },
  {
    model: ProductQuery,
    as: 'product',
    required: false,
    where: {
      fk_category: Sequelize.col('category.id'),
    },
    include: [
      {
        model: User,
        as: 'author',
        required: false,
        attributes: [
          'username',
          'first_name',
          'last_name',
          'createdAt',
          'updatedAt',
        ],
      },
      {
        model: Category,
        as: 'category',
        required: false,
        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      },
    ],
  },
];

export { Category as CategoryQuery, include as CategoryInclude };
