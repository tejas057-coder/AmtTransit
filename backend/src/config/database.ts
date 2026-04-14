import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amravati-transit";
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

let retries = 0;

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", MONGODB_URI.replace(/\/\/.*:.*@/, "//***:***@"));

    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully!");
    retries = 0;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    if (retries < MAX_RETRIES) {
      retries++;
      console.log(`Retrying connection... (${retries}/${MAX_RETRIES})`);
      setTimeout(() => {
        connectDatabase();
      }, RETRY_DELAY);
    } else {
      console.error("Max retries reached. Please ensure MongoDB is running.");
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully!");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

export default mongoose;
