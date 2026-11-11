import mongoose from "mongoose";

interface MongooseCache {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Keep the cache on globalThis so hot reloads in development
// do not create a new connection (and new listeners) on every request.
const globalForMongoose = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache;
};

if (!globalForMongoose.mongooseCache) {
    globalForMongoose.mongooseCache = { connection: null, promise: null };
}

const cache = globalForMongoose.mongooseCache;

export async function connect(): Promise<typeof mongoose> {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error("MONGO_URL is not configured");
    }

    // Reuse the existing connection
    if (cache.connection) {
        return cache.connection;
    }

    // Start connecting only once, even if many requests arrive together
    if (!cache.promise) {
        cache.promise = mongoose.connect(mongoUrl, { bufferCommands: false });
    }

    try {
        cache.connection = await cache.promise;
    } catch (error) {
        // Allow the next request to try again
        cache.promise = null;
        throw error;
    }

    return cache.connection;
}
