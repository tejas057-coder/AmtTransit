import dotenv from "dotenv";
import mongoose from "mongoose";
import { Route } from "./models/Route";
import { Stop } from "./models/Stop";
import { Bus } from "./models/Bus";
import { mockData } from "./data/mockData";

dotenv.config();

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amravati-transit";
    
    console.log("🌱 Starting database seeding...");
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: "majority",
    });
    
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Route.deleteMany({});
    await Stop.deleteMany({});
    await Bus.deleteMany({});

    // Seed Routes
    console.log("📍 Seeding routes...");
    const routes = await Route.insertMany(mockData.routes);
    console.log(`✅ Inserted ${routes.length} routes`);

    // Seed Stops
    console.log("🛑 Seeding stops...");
    const stops = await Stop.insertMany(mockData.stops);
    console.log(`✅ Inserted ${stops.length} stops`);

    // Seed Buses
    console.log("🚌 Seeding buses...");
    const buses = await Bus.insertMany(mockData.buses);
    console.log(`✅ Inserted ${buses.length} buses`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Routes: ${routes.length}`);
    console.log(`   - Stops: ${stops.length}`);
    console.log(`   - Buses: ${buses.length}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
