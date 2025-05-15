// tests/db.test.js
jest.mock('mongoose');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

describe('config/db', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    // on mute les erreurs pour ne pas voir les console.error dans les logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  it('should exit if MONGO_URI is undefined', async () => {
    delete process.env.MONGO_URI;

    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code) => { throw new Error(`process.exit:${code}`); });

    await expect(connectDB()).rejects.toThrow('process.exit:1');
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it('should handle connection errors', async () => {
    process.env.MONGO_URI = 'mongodb://bad-uri';
    mongoose.connect.mockRejectedValue(new Error('fail'));

    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code) => { throw new Error(`process.exit:${code}`); });

    await expect(connectDB()).rejects.toThrow('process.exit:1');
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});
