// This script helps to test LinkedIn OAuth configuration
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Function to check LinkedIn configuration
async function checkLinkedInConfig() {
  console.log('----- LinkedIn OAuth Configuration Test -----');
  
  // 1. Check if all required environment variables are set
  const requiredVars = {
    'LINKEDIN_CLIENT_ID': process.env.LINKEDIN_CLIENT_ID,
    'LINKEDIN_CLIENT_SECRET': process.env.LINKEDIN_CLIENT_SECRET,
    'LINKEDIN_REDIRECT_URI': process.env.LINKEDIN_REDIRECT_URI,
    'CLIENT_REDIRECT_URL': process.env.CLIENT_REDIRECT_URL,
  };
  
  let missingVars = 0;
  
  console.log('\nEnvironment Variables:');
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.log(`❌ ${key}: Missing`);
      missingVars++;
    } else {
      if (key === 'LINKEDIN_CLIENT_SECRET') {
        // Hide the actual secret, but show if it has leading/trailing spaces
        const hasLeadingSpace = value.startsWith(' ');
        const hasTrailingSpace = value.endsWith(' ');
        console.log(`✅ ${key}: ${hasLeadingSpace ? '[Leading space!] ' : ''}*****${hasTrailingSpace ? ' [Trailing space!]' : ''}`);
        if (hasLeadingSpace || hasTrailingSpace) {
          console.log(`   ⚠️ WARNING: Your LinkedIn client secret has ${hasLeadingSpace ? 'leading' : ''} ${hasLeadingSpace && hasTrailingSpace ? 'and' : ''} ${hasTrailingSpace ? 'trailing' : ''} spaces which may cause authentication issues.`);
        }
      } else {
        console.log(`✅ ${key}: ${value}`);
      }
    }
  }
  
  if (missingVars > 0) {
    console.log(`\n❌ Missing ${missingVars} required environment variables. LinkedIn OAuth won't work.`);
    process.exit(1);
  }
  
  // 2. Perform a basic test of the LinkedIn API (doesn't require user auth)
  console.log('\nGenerating LinkedIn OAuth URL:');
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    state: new Date().getTime().toString(),
  }).toString();
  
  const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  console.log(`LinkedIn OAuth URL: ${linkedInUrl}`);
  
  console.log('\nTo test the integration:');
  console.log('1. Open the LinkedIn URL above in a browser');
  console.log('2. Complete the LinkedIn authentication');
  console.log('3. Check that you are redirected back to your application');
  console.log('\nIf you encounter errors:');
  console.log('- Verify your LinkedIn Developer Console settings');
  console.log('- Make sure your redirect URI exactly matches what\'s registered in LinkedIn');
  console.log('- Check that your client ID and secret are correct');
  console.log('- Ensure your application is handling cookies properly');
}

// Run the check
checkLinkedInConfig().catch(error => {
  console.error('Error in LinkedIn config check:', error);
});
