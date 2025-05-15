// tests/authMiddleware.test.js
const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should return 401 if no Authorization header', async () => {
    const res = await request(app).get('/api/messages/anything');
    expect(res.status).toBe(401);
    expect(res.body.msg).toMatch(/Pas de token/);
  });

  it('should return 401 if token is malformed', async () => {
    const res = await request(app)
      .get('/api/messages/anything')
      .set('Authorization', 'Bearer bad.token.here');
    expect(res.status).toBe(401);
    expect(res.body.msg).toMatch(/Token invalide/);
  });
});
