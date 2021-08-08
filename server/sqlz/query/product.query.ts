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

export { Product as ProductQuery };
