import faker from 'faker';
import fs from 'fs';
import supertest from 'supertest';
import { app } from '../www';
import path from 'path';
import { User } from '../sqlz/models/user.models';

export const read = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'requirements.txt'), {
    encoding: 'utf-8',
    flag: 'r',
  })
);

describe('User Tests', () => {
  test('Create', async () => {
    await supertest(app.app)
      .post('/api/v1/user/created/')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'Password',
      })
      .expect(201)
      .then(async (res) => {
        expect(res.status).toEqual(201);
        expect(res.body).toEqual({
          message: 'Accounts has been created',
        });
        const count = await User.count();
        fs.writeFileSync(
          path.join(__dirname, 'requirements.txt'),
          JSON.stringify({
            count: count,
            token: read.token,
            category: read.category,
            product: read.product,
          })
        );
      });
  });
  if (read.count) {
    test('Login', async () => {
      const user: any = await User.findOne();
      await supertest(app.app)
        .post('/api/v1/user/')
        .send({
          username: user.dataValues.username,
          password: 'Password',
        })
        .expect(200)
        .then((res) => {
          expect(res.status).toEqual(200);
          fs.writeFileSync(
            path.join(__dirname, 'requirements.txt'),
            JSON.stringify({
              count: read.count,
              token: res.body,
              category: read.category,
              product: read.product,
            })
          );
        });
    });
    if (read.token) {
      test('All', async () => {
        await supertest(app.app)
          .get('/api/v1/user/')
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Detail', async () => {
        const _: any = await User.findOne();
        await supertest(app.app)
          .get(`/api/v1/user/${_.dataValues.id}/`)
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Me', async () => {
        await supertest(app.app)
          .get('/api/v1/user/me/')
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).not.toEqual(null);
          });
      });
      test('Change Password', async () => {
        await supertest(app.app)
          .post('/api/v1/user/password/')
          .send({
            password: 'Password',
            old_password: 'Password',
            password_confirmation: 'Password',
          })
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
              message: 'Password has been updated',
            });
          });
      });
      test('Change Email', async () => {
        await supertest(app.app)
          .post('/api/v1/user/email/')
          .send({
            email: faker.internet.email(),
            password: 'Password',
          })
          .set('Authorization', 'Bearer ' + read.token)
          .expect(200)
          .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
              message: 'Email has been updated',
            });
          });
      });
    }
  }
});
