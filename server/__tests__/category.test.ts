import { read } from './user.test';
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../www';
import { Category } from '../sqlz/models/category.models';
import fs from 'fs';
import path from 'path';

describe('Category tests', () => {
  if (read.token) {
    test('Create', async () => {
      await supertest(app.app)
        .post('/api/v1/category/')
        .send({
          name: faker.name.title(),
        })
        .set('Authorization', 'Bearer ' + read.token)
        .expect(201)
        .then(async (res) => {
          expect(res.status).toEqual(201);
          expect(res.body).not.toEqual(null);
          const count = await Category.count();
          fs.writeFileSync(
            path.join(__dirname, 'requirements.txt'),
            JSON.stringify({
              count: read.count,
              token: read.token,
              category: count,
              product: read.product,
            })
          );
        });
    });
    test('All', async () => {
      await supertest(app.app)
        .get('/api/v1/category/')
        .set('Authorization', 'Bearer ' + read.token)
        .expect(200)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body).not.toEqual(null);
        });
    });
    if (read.category) {
      test('Detail', async () => {
        const _: any = await Category.findOne();
        await supertest(app.app)
          .get(`/api/v1/category/${_.dataValues.id}/`)
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Updated', async () => {
        const _: any = await Category.findOne();
        await supertest(app.app)
          .post(`/api/v1/category/${_.dataValues.id}/`)
          .set('Authorization', 'Bearer ' + read.token)
          .send({
            name: faker.name.title(),
          })
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
    }
  }
});
