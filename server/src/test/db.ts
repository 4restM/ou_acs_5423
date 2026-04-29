import mongoose from 'mongoose';

export async function connectTestDB() {
  await mongoose.connect(process.env.MONGO_URI!);
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function disconnectTestDB() {
  await mongoose.disconnect();
}
