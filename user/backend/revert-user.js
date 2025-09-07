import mongoose from 'mongoose';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

try {
    // Revert Krishna2 back to original user settings but keep hod hierarchy
    const result = await User.findByIdAndUpdate('68b99052d2b4928ba0b0bb24', { 
        role: 'user',           // Back to user role
        adminType: null,        // Back to null
        adminHierarchy: 'hod'   // Keep as HOD for SubAdmin functionality
    });
    
    console.log('✅ Reverted Krishna2 back to user role with HOD hierarchy');
    
    // Verify the revert
    const user = await User.findById('68b99052d2b4928ba0b0bb24');
    console.log('Krishna2 current settings:');
    console.log('- Role:', user.role);
    console.log('- AdminType:', user.adminType);
    console.log('- AdminHierarchy:', user.adminHierarchy);
    
} catch (error) {
    console.error('Error:', error);
} finally {
    await mongoose.disconnect();
    process.exit(0);
}
