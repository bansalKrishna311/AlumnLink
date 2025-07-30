// Simple test script to verify DigitalOcean Spaces integration
import { uploadBase64ToSpaces } from './lib/digitalocean.js';
import dotenv from 'dotenv';

dotenv.config();

const testUpload = async () => {
  try {
    console.log('🚀 Testing DigitalOcean Spaces upload...');
    console.log('DO_SPACES_KEY:', process.env.DO_SPACES_KEY ? '✅ Set' : '❌ Missing');
    console.log('DO_SPACES_SECRET:', process.env.DO_SPACES_SECRET ? '✅ Set' : '❌ Missing');
    
    // Create a simple test image (1x1 pixel red PNG in base64)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    console.log('📤 Uploading test image...');
    const imageUrl = await uploadBase64ToSpaces(testImage, 'test');
    
    console.log('✅ Success! Image uploaded to:', imageUrl);
    console.log('🔗 You can access it at:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('❌ Error testing DigitalOcean Spaces:', error.message);
    console.error('Full error:', error);
  }
};

// Run the test
testUpload();
