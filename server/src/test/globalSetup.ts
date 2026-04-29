import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line no-var
  var __MONGOD__: MongoMemoryServer;
}

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  global.__MONGOD__ = mongod;
  process.env.MONGO_URI = mongod.getUri();
}
