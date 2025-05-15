// tests/auth.test.js
const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

const authUser = { username: 'authuser', password: 'Test@1234' };

describe('Auth API', () => {
  beforeAll(async () => {
    // (Re)connexion et nettoyage
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await User.deleteMany({ username: authUser.username });
  });

  afterAll(async () => {
    // Fermeture propre
    await mongoose.connection.close();
    server.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(authUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(authUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
