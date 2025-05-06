import { MongoClient, ServerApiVersion } from "mongodb";

// Ensure the MongoDB URI is defined in environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

// Check if we're in development mode
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by Hot Module Replacement (HMR).
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  // In production mode, don't use a global variable.
  client = new MongoClient(uri, options);
}

// Export the client for reuse across functions or modules.
export default client;
