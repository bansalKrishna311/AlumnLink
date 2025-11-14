/**
 * AWS Secrets Manager Test Script
 * 
 * This script tests the AWS Secrets Manager integration
 * Run: node test-secrets.js
 */

import { loadSecrets, validateRequiredSecrets } from './lib/secretsManager.js';
import dotenv from 'dotenv';

// Load .env first
dotenv.config();

console.log('\n🧪 Testing AWS Secrets Manager Integration\n');
console.log('='.repeat(50));

async function testSecretsManager() {
  try {
    // Test 1: Check current environment
    console.log('\n📋 Test 1: Current Environment');
    console.log('-'.repeat(50));
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    console.log(`USE_AWS_SECRETS: ${process.env.USE_AWS_SECRETS || 'not set'}`);
    console.log(`AWS_REGION: ${process.env.AWS_REGION || 'not set (will use us-east-1)'}`);

    // Test 2: Load secrets
    console.log('\n🔐 Test 2: Loading Secrets');
    console.log('-'.repeat(50));
    const secrets = await loadSecrets();
    console.log('✅ Secrets loaded successfully');

    // Test 3: Check critical secrets (without revealing values)
    console.log('\n🔍 Test 3: Verifying Secret Presence');
    console.log('-'.repeat(50));
    const criticalSecrets = [
      'MONGO_URI',
      'JWT_SECRET',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'DO_SPACES_KEY',
      'DO_SPACES_SECRET',
    ];

    criticalSecrets.forEach(key => {
      const value = process.env[key];
      if (value) {
        // Show first 5 and last 3 characters, mask the rest
        const masked = value.length > 10 
          ? `${value.substring(0, 5)}${'*'.repeat(value.length - 8)}${value.substring(value.length - 3)}`
          : '*'.repeat(value.length);
        console.log(`✅ ${key}: ${masked}`);
      } else {
        console.log(`❌ ${key}: NOT SET`);
      }
    });

    // Test 4: Validate required secrets
    console.log('\n✔️  Test 4: Validating Required Secrets');
    console.log('-'.repeat(50));
    validateRequiredSecrets();
    console.log('✅ All required secrets are present');

    // Test 5: Show all available environment variables (names only)
    console.log('\n📊 Test 5: Available Environment Variables');
    console.log('-'.repeat(50));
    const allEnvVars = Object.keys(process.env).filter(key => 
      key.includes('MONGO') || 
      key.includes('JWT') || 
      key.includes('CLOUDINARY') || 
      key.includes('LINKEDIN') || 
      key.includes('MAILTRAP') || 
      key.includes('DO_SPACES') ||
      key.includes('CLIENT') ||
      key.includes('BACKEND') ||
      key.includes('FRONTEND') ||
      key === 'PORT' ||
      key === 'NODE_ENV'
    ).sort();
    
    console.log(`Total relevant variables: ${allEnvVars.length}`);
    allEnvVars.forEach(key => console.log(`  • ${key}`));

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All Tests Passed!');
    console.log('='.repeat(50));
    console.log('\n✅ AWS Secrets Manager integration is working correctly');
    console.log('✅ All required secrets are available');
    console.log('✅ Application is ready to start\n');

  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ Test Failed!');
    console.error('='.repeat(50));
    console.error('\nError Details:');
    console.error(`  Name: ${error.name}`);
    console.error(`  Message: ${error.message}`);
    
    if (error.stack) {
      console.error('\nStack Trace:');
      console.error(error.stack);
    }

    console.error('\n💡 Troubleshooting Tips:');
    console.error('  1. Check if AWS credentials are configured');
    console.error('  2. Verify IAM permissions for Secrets Manager');
    console.error('  3. Ensure secret "alumsecret" exists in us-east-1');
    console.error('  4. Check .env file as fallback');
    console.error('\n📚 See AWS_SECRETS_MANAGER_SETUP.md for detailed setup instructions\n');
    
    process.exit(1);
  }
}

// Run the tests
testSecretsManager();
