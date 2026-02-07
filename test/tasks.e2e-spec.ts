import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tasks (e2e)', () => {
    let app: INestApplication<App>;
    let accessToken: string;

    // Generate unique email untuk setiap test run
    const testEmail = `tasktest_${Date.now()}@example.com`;
    const testPassword = 'password123';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        // Register user baru
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: testEmail, password: testPassword });

        // Login untuk mendapatkan token
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testEmail, password: testPassword });

        accessToken = loginResponse.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Task E2E' })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('title', 'Test Task E2E');
            expect(response.body).toHaveProperty('completed', false);
        });

        it('should reject task creation without auth', () => {
            return request(app.getHttpServer())
                .post('/tasks')
                .send({ title: 'Unauthorized Task' })
                .expect(401);
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks for authenticated user', async () => {
            const response = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should reject without auth token', () => {
            return request(app.getHttpServer())
                .get('/tasks')
                .expect(401);
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update task title', async () => {
            // Create task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task to Update Title' });
            const taskId = createRes.body.id;

            const response = await request(app.getHttpServer())
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Updated Task Title' })
                .expect(200);

            expect(response.body).toHaveProperty('title', 'Updated Task Title');
        });

        it('should update task completed status', async () => {
            // Create task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task to Complete' });
            const taskId = createRes.body.id;

            const response = await request(app.getHttpServer())
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ completed: true })
                .expect(200);

            expect(response.body).toHaveProperty('completed', true);
        });

        it('should return 404 for non-existent task', () => {
            return request(app.getHttpServer())
                .put('/tasks/99999')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Non-existent' })
                .expect(404);
        });

        it('should reject update without auth', async () => {
            // Create task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task for Unauth Update' });
            const taskId = createRes.body.id;

            return request(app.getHttpServer())
                .put(`/tasks/${taskId}`)
                .send({ title: 'Unauthorized Update' })
                .expect(401);
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should reject delete without auth', async () => {
            // Create task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task for Unauth Delete' });
            const taskId = createRes.body.id;

            return request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .expect(401);
        });

        it('should delete task successfully', async () => {
            // Create task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task to Delete' });
            const taskId = createRes.body.id;

            const response = await request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('deleted', true);
        });

        it('should return 404 when deleting already deleted task', async () => {
            // Create and delete task inline
            const createRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Task to Delete Twice' });
            const taskId = createRes.body.id;

            // First delete - should succeed
            await request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            // Second delete - should 404
            return request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });

        it('should return 404 for non-existent task', () => {
            return request(app.getHttpServer())
                .delete('/tasks/99999')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
    });

    describe('Authorization Isolation', () => {
        it('should not allow other user to update task', async () => {
            // Create task with first user
            const taskRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Isolated Task for Update' });
            const taskId = taskRes.body.id;

            // Register and login second user
            const otherEmail = `other_update_${Date.now()}@example.com`;
            await request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: otherEmail, password: testPassword });

            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: otherEmail, password: testPassword });
            const otherToken = loginRes.body.access_token;

            // Try to update with other user
            return request(app.getHttpServer())
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ title: 'Hacked!' })
                .expect(404);
        });

        it('should not allow other user to delete task', async () => {
            // Create task with first user
            const taskRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Isolated Task for Delete' });
            const taskId = taskRes.body.id;

            // Register and login second user
            const otherEmail = `other_delete_${Date.now()}@example.com`;
            await request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: otherEmail, password: testPassword });

            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: otherEmail, password: testPassword });
            const otherToken = loginRes.body.access_token;

            // Try to delete with other user
            return request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .expect(404);
        });

        it('should not include other users tasks in list', async () => {
            // Create task with first user
            const taskRes = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Isolated Task for List' });
            const taskId = taskRes.body.id;

            // Register and login second user
            const otherEmail = `other_list_${Date.now()}@example.com`;
            await request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: otherEmail, password: testPassword });

            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: otherEmail, password: testPassword });
            const otherToken = loginRes.body.access_token;

            // Get tasks as other user
            const response = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${otherToken}`)
                .expect(200);

            const hasIsolatedTask = response.body.some(
                (task: { id: number }) => task.id === taskId
            );
            expect(hasIsolatedTask).toBe(false);
        });
    });
});
