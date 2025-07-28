`src/server.ts`

import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { User } from './models/User';

const PORT = process.env.PORT || 4000;

const seedAdminUser = async () => {
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    await User.create({
      name: 'Admin',
      username: 'admin',
      password: 'admin@123',
    });
    console.log('✅ Admin user seeded');
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminUser();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
};

startServer();
