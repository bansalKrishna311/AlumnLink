// This script detects and fixes whitespace issues in .env file variables
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Set up paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

console.log("----- Environment Variable Whitespace Fixer -----");

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found at:", envPath);
  process.exit(1);
}

// Read the .env file
const envContent = fs.readFileSync(envPath, 'utf8');
let envLines = envContent.split('\n');
let fixedCount = 0;

// Variables to check for whitespace issues
const varsToCheck = [
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_REDIRECT_URI',
  'CLIENT_REDIRECT_URL',
  'JWT_SECRET'
];

// Process each line
const newLines = envLines.map(line => {
  // Skip empty lines and comments
  if (!line.trim() || line.trim().startsWith('#')) return line;
  
  // Check for variable assignments
  const matches = line.match(/^([A-Z_]+)=(.*)/);
  if (!matches) return line;
  
  const [full, varName, varValue] = matches;
  
  // Only check variables we're interested in
  if (!varsToCheck.includes(varName)) return line;
  
  // Check for whitespace issues
  const trimmedValue = varValue.trim();
  if (trimmedValue !== varValue) {
    console.log(`⚠️ Fixed whitespace in ${varName}`);
    fixedCount++;
    return `${varName}=${trimmedValue}`;
  }
  
  return line;
});

// Write back the file if changes were made
if (fixedCount > 0) {
  fs.writeFileSync(envPath, newLines.join('\n'));
  console.log(`✅ Fixed ${fixedCount} whitespace issues in the .env file.`);
} else {
  console.log("✅ No whitespace issues found in the .env file.");
}

// Reload environment variables and validate
dotenv.config({ path: envPath, override: true });

console.log("\nVerifying LinkedIn OAuth configuration:");
console.log(`LINKEDIN_CLIENT_ID: ${process.env.LINKEDIN_CLIENT_ID ? "✓ Set" : "✗ Missing"}`);
console.log(`LINKEDIN_CLIENT_SECRET: ${process.env.LINKEDIN_CLIENT_SECRET ? "✓ Set" : "✗ Missing"}`);
console.log(`LINKEDIN_REDIRECT_URI: ${process.env.LINKEDIN_REDIRECT_URI ? "✓ Set" : "✗ Missing"}`);
console.log(`CLIENT_REDIRECT_URL: ${process.env.CLIENT_REDIRECT_URL ? "✓ Set" : "✗ Missing"}`);

// Final notes
console.log("\nIf you're still having issues with LinkedIn authentication:");
console.log("1. Make sure the redirect URI in LinkedIn Developer Console exactly matches the LINKEDIN_REDIRECT_URI value");
console.log("2. Set CLIENT_REDIRECT_URL to http://139.59.66.21:5000/ for your Digital Ocean deployment");
console.log("3. Verify that CORS is properly configured for cross-domain cookies");
console.log("4. Check server logs during authentication attempts for detailed error messages");
