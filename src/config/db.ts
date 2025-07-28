`src/config/db.ts`

import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const isDocker = process.env.DOCKER_ENV === 'true';
  const mongoUri = isDocker
    ? process.env.MONGODB_URI_DOCKER
    : process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MongoDB URI is not defined in environment variables.');
  }

  try {
    console.log(`🔌 Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
  } catch (err: any) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};