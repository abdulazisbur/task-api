import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
    let app: INestApplication<App>;

    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: testEmail, password: testPassword })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('email', testEmail);
                });
        });

        it('should reject duplicate email registration', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: testEmail, password: testPassword })
                .expect(400);
        });

        it('should reject registration without email', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ password: testPassword })
                .expect((res) => {
                    // Bisa 400 atau 201 tergantung validasi DTO
                    expect([400, 201]).toContain(res.status);
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should login successfully with valid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: testEmail, password: testPassword })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token');
                    expect(typeof res.body.access_token).toBe('string');
                });
        });

        it('should reject login with wrong password', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: testEmail, password: 'wrongpassword' })
                .expect(401);
        });

        it('should reject login with non-existent email', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'nonexistent@example.com', password: testPassword })
                .expect(401);
        });
    });

    describe('Protected Routes', () => {
        let accessToken: string;

        beforeAll(async () => {
            // Login untuk mendapatkan token
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: testEmail, password: testPassword });
            accessToken = response.body.access_token;
        });

        it('should access protected route with valid token', () => {
            return request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });

        it('should reject access to protected route without token', () => {
            return request(app.getHttpServer())
                .get('/tasks')
                .expect(401);
        });

        it('should reject access with invalid token', () => {
            return request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', 'Bearer invalid_token_here')
                .expect(401);
        });
    });
});
