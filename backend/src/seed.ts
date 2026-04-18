import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { mockData } from "./data/mockData";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Clear existing data (Requires proper cascading or empty table approach in Supabase, but typically `.delete().neq("id", "")` clears everything if RLS allows)
    console.log("🗑️  Clearing existing data...");
    await supabase.from("routes").delete().neq("id", "0");
    await supabase.from("stops").delete().neq("id", "0");
    await supabase.from("buses").delete().neq("id", "0");

    // Seed Routes
    console.log("📍 Seeding routes...");
    const { data: routes, error: errRoutes } = await supabase.from("routes").insert(mockData.routes).select();
    if (errRoutes) throw errRoutes;
    console.log(`✅ Inserted ${routes?.length || 0} routes`);

    // Seed Stops
    console.log("🛑 Seeding stops...");
    const { data: stops, error: errStops } = await supabase.from("stops").insert(mockData.stops).select();
    if (errStops) throw errStops;
    console.log(`✅ Inserted ${stops?.length || 0} stops`);

    // Seed Buses
    console.log("🚌 Seeding buses...");
    const { data: buses, error: errBuses } = await supabase.from("buses").insert(mockData.buses).select();
    if (errBuses) throw errBuses;
    console.log(`✅ Inserted ${buses?.length || 0} buses`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Routes: ${routes?.length || 0}`);
    console.log(`   - Stops: ${stops?.length || 0}`);
    console.log(`   - Buses: ${buses?.length || 0}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
