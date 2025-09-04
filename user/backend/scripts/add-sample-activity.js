// Migration script to add sample activity data for testing contribution graph
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { getISTDate, getISTDateString } from "../utils/activityTracker.js";

// Load environment variables
dotenv.config();

const addSampleActivityData = async () => {
  try {
    console.log("Starting sample activity data migration...");
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    }

    // Find a test user (you can replace with any username)
    const testUser = await User.findOne().limit(1);
    if (!testUser) {
      console.log("No users found. Please create a user first.");
      return;
    }

    console.log(`Adding sample data for user: ${testUser.username}`);

    // Generate sample activity data for the last 30 days
    const sampleActivityDays = [];
    const today = getISTDate();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Randomly generate some activity for some days
      const shouldHaveActivity = Math.random() > 0.3; // 70% chance of having activity
      
      if (shouldHaveActivity) {
        const posts = Math.floor(Math.random() * 3); // 0-2 posts
        const likes = Math.floor(Math.random() * 10); // 0-9 likes
        const comments = Math.floor(Math.random() * 5); // 0-4 comments
        
        sampleActivityDays.push({
          date: date,
          activities: {
            posts: posts,
            likes: likes,
            comments: comments,
            total: posts + likes + comments
          }
        });
      }
    }

    // Clear existing activity history for clean test
    testUser.activityHistory = [];
    
    // Add sample activity data
    testUser.activityHistory = sampleActivityDays;
    
    await testUser.save();
    
    console.log(`✅ Added ${sampleActivityDays.length} days of sample activity data for ${testUser.username}`);
    console.log("Sample contribution graph data is ready for testing!");
    
    // Calculate some stats
    const totalContributions = sampleActivityDays.reduce((sum, day) => sum + day.activities.total, 0);
    const activeDays = sampleActivityDays.length;
    
    console.log(`📊 Stats:`);
    console.log(`   Total contributions: ${totalContributions}`);
    console.log(`   Active days: ${activeDays}`);
    console.log(`   Average per day: ${(totalContributions / activeDays).toFixed(1)}`);
    
  } catch (error) {
    console.error("Error adding sample activity data:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
};

// Run the migration
addSampleActivityData();
