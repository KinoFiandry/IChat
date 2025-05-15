// tests/authController.error.test.js
const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth Controller Errors', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
    await User.deleteMany({ username: 'dupUser' });
    // créer une première fois
    await request(app).post('/api/auth/register').send({ username:'dupUser', password:'Pwd123!' });
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should return 400 when registering existing user', async () => {
    const res = await request(app).post('/api/auth/register').send({ username:'dupUser', password:'Pwd123!' });
    expect(res.status).toBe(400);
  });

  it('should return 400 on login wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username:'dupUser', password:'Wrong!' });
    expect(res.status).toBe(400);
  });
});
