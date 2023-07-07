import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import app from './app.js';

// Configuration file
dotenv.config({ path: "./config.env" });

// Static variable
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
const createConnection = async () => {
  // create a new instance of mongoclient
  const client = new MongoClient(MONGO_URL);
  try {
    // connect to mongodb server using above client-url
    await client.connect();
    console.log("Connected successfully.");
    return client;
  } catch (err) {
    console.log(err.message);
    console.log("Something went wrong in connection");
  }
};
const client = await createConnection();

app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});

export default client;