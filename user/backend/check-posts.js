import mongoose from 'mongoose';
import Post from './models/post.model.js';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Test admin ID
const testAdminId = '68b136b876318e0971d4fcc4';

try {
    console.log('🔍 Checking posts for test_admin...');
    
    // Get all posts by test_admin
    const allPosts = await Post.find({ author: testAdminId })
        .populate('author', 'name username')
        .populate('createdBy', 'name username')
        .populate('onBehalfOf', 'name username')
        .sort({ createdAt: -1 });
    
    console.log(`\n📊 Found ${allPosts.length} posts by test_admin:`);
    
    allPosts.forEach((post, index) => {
        console.log(`\n${index + 1}. Post ID: ${post._id}`);
        console.log(`   Content: ${post.content.substring(0, 50)}...`);
        console.log(`   Type: ${post.type}`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Author: ${post.author.name} (${post.author.username})`);
        console.log(`   CreatedBy: ${post.createdBy ? post.createdBy.name : 'N/A'}`);
        console.log(`   OnBehalfOf: ${post.onBehalfOf ? post.onBehalfOf.name : 'N/A'}`);
        console.log(`   Created: ${post.createdAt}`);
    });
    
    // Check pending posts specifically
    const pendingPosts = await Post.find({ 
        author: testAdminId, 
        status: 'pending' 
    });
    
    console.log(`\n⏳ Pending posts by test_admin: ${pendingPosts.length}`);
    
    // Check all pending posts in system
    const allPendingPosts = await Post.find({ status: 'pending' })
        .populate('author', 'name username');
    
    console.log(`\n📋 All pending posts in system: ${allPendingPosts.length}`);
    allPendingPosts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.author.name}: ${post.content.substring(0, 30)}...`);
    });
    
} catch (error) {
    console.error('Error:', error);
} finally {
    await mongoose.disconnect();
    process.exit(0);
}
