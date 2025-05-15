// config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI non défini');
    await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ MongoDB connecté');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
