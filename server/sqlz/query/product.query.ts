import { Includeable } from 'sequelize/types';
import { Category } from '../models/category.models';
import { Product } from '../models/product.models';
import { User } from '../models/user.models';

Product.belongsTo(Category, {
  as: 'category',
  foreignKey: 'fk_category',
});

Product.belongsTo(User, {
  as: 'author',
  foreignKey: 'fk_user',
});

const include: Includeable[] = [
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
