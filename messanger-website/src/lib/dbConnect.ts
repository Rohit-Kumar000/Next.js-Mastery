import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
let connectionPromise: Promise<void> | undefined;

async function dbConnect(): Promise<void> {
  if (connection.isConnected === 1 && mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured. Add it to .env.local.');
  connectionPromise = mongoose.connect(uri)
    .then(() => { connection.isConnected = mongoose.connection.readyState; })
    .catch((error: unknown) => {
      connection.isConnected = 0;
      throw error;
    })
    .finally(() => { connectionPromise = undefined; });
  return connectionPromise;
}

export default dbConnect;
