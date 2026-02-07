import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should initialize the application', () => {
    expect(app).toBeDefined();
  });

  it('/auth/register (POST) - endpoint exists', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'test' })
      .expect((res) => {
        // Either 201 (created) or 400 (already exists) is acceptable
        expect([201, 400]).toContain(res.status);
      });
  });

  it('/auth/login (POST) - endpoint exists', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' })
      .expect((res) => {
        // Either 201 (success) or 401 (invalid) is acceptable
        expect([201, 401]).toContain(res.status);
      });
  });

  it('/tasks (GET) - requires authentication', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(401);
  });
});
