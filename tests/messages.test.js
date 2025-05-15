// tests/messages.test.js
const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const msgUser = { username: 'msguser', password: 'Test@1234' };
let token;
const fakeReceiverId = new mongoose.Types.ObjectId().toHexString();

beforeAll(async () => {
  // (Re)connexion et préparation du user de test
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({ username: msgUser.username });
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(msgUser.password, salt);
  await new User({ username: msgUser.username, password: hashed }).save();

  // Récupération du token via l'API
  const res = await request(app)
    .post('/api/auth/login')
    .send(msgUser);
  token = res.body.token;
});

describe('Messages API', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post(`/api/messages/${fakeReceiverId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('content', 'Hello');
    expect(res.body).toHaveProperty('senderId');
    expect(res.body).toHaveProperty('receiverId', fakeReceiverId);
  });

  it('should get messages', async () => {
    const res = await request(app)
      .get(`/api/messages/${fakeReceiverId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('content', 'Hello');
  });
});

afterAll(async () => {
  // Fermeture propre
  await mongoose.connection.close();
  server.close();
});
