import supertest from 'supertest';
import { Category } from '../sqlz/models/category.models';
import { app } from '../www';
import { read } from './user.test';
import faker from 'faker';
import { Product } from '../sqlz/models/product.models';
import fs from 'fs';
import path from 'path';

describe('Product tests', () => {
  if (read.token) {
    if (read.category) {
      test('Create', async () => {
        const _: any = await Category.findOne();
        await supertest(app.app)
          .post('/api/v1/product/')
          .set('Authorization', 'Bearer ' + read.token)
          .field('name', faker.name.title())
          .field('desc', faker.lorem.text())
          .field('price', faker.random.number(20000))
          .field('sales_price', faker.random.number(20000))
          .field('stock', faker.random.number(100))
          .field('max_stock', faker.random.number(100))
          .field('sku', faker.name.title())
          .field('category', _.dataValues.id)
          .expect(201)
          .then(async (res) => {
            expect(res.status).toEqual(201);
            expect(res.body).not.toEqual(null);
            const count = await Product.count();
            fs.writeFileSync(
              path.join(__dirname, 'requirements.txt'),
              JSON.stringify({
                count: read.count,
                token: read.token,
                category: read.category,
                product: count,
              })
            );
          });
      });
    }
    if (read.product) {
      test('All', async () => {
        await supertest(app.app)
          .get('/api/v1/product/')
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Detail', async () => {
        const _: any = await Product.findOne();
        await supertest(app.app)
          .get(`/api/v1/product/${_.dataValues.id}/`)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Updated', async () => {
        const _: any = await Product.findOne();
        await supertest(app.app)
          .post(`/api/v1/product/${_.dataValues.id}/`)
          .set('Authorization', 'Bearer ' + read.token)
          .field('name', `Updated-${faker.name.title()}`)
          .field('desc', faker.lorem.text())
          .field('price', faker.random.number(20000))
          .field('sales_price', faker.random.number(20000))
          .field('stock', faker.random.number(100))
          .field('max_stock', faker.random.number(100))
          .field('sku', faker.name.title())
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
    }
  }
});
