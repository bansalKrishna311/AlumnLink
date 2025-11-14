/**
 * AWS Secrets Manager Integration
 * 
 * This module handles loading secrets from AWS Secrets Manager
 * with fallback to local .env file for development
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "alumsecret";

// Initialize the AWS Secrets Manager client
const client = new SecretsManagerClient({
  region: "us-east-1",
});

/**
 * Fetches secrets from AWS Secrets Manager
 * @returns {Promise<Object>} The secrets object
 */
async function getSecretsFromAWS() {
  try {
    console.log('🔐 Fetching secrets from AWS Secrets Manager...');
    
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    const secrets = JSON.parse(response.SecretString);
    console.log('✅ Successfully loaded secrets from AWS Secrets Manager');
    return secrets;
  } catch (error) {
    console.error('❌ Failed to fetch secrets from AWS Secrets Manager:', error.message);
    
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    
    // Check for specific error types
    if (error.name === 'ResourceNotFoundException') {
      console.error(`Secret "${secret_name}" not found in AWS Secrets Manager`);
    } else if (error.name === 'InvalidRequestException') {
      console.error('Invalid request to AWS Secrets Manager');
    } else if (error.name === 'InvalidParameterException') {
      console.error('Invalid parameter provided to AWS Secrets Manager');
    } else if (error.name === 'DecryptionFailure') {
      console.error('Failed to decrypt the secret');
    } else if (error.name === 'InternalServiceError') {
      console.error('AWS Secrets Manager internal service error');
    }
    
    throw error;
  }
}

/**
 * Loads environment variables from either AWS Secrets Manager or .env file
 * Priority: AWS Secrets Manager > .env file
 * 
 * @returns {Promise<Object>} The environment configuration
 */
export async function loadSecrets() {
  try {
    // Check if we should use AWS Secrets Manager
    const useAWS = process.env.USE_AWS_SECRETS === 'true' || 
                   process.env.NODE_ENV === 'production';

    if (useAWS) {
      console.log('🌐 Using AWS Secrets Manager for configuration');
      
      try {
        const secrets = await getSecretsFromAWS();
        
        // Merge AWS secrets with existing process.env
        // AWS secrets take precedence
        Object.keys(secrets).forEach(key => {
          if (secrets[key]) {
            process.env[key] = secrets[key];
          }
        });
        
        console.log('✅ Environment configured with AWS Secrets Manager');
        return secrets;
      } catch (awsError) {
        console.warn('⚠️  Falling back to .env file due to AWS Secrets Manager error');
        // Fall through to .env file
      }
    } else {
      console.log('📄 Using .env file for configuration (development mode)');
    }
    
    // Return current environment variables (from .env via dotenv)
    return {
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
      EMAIL_FROM: process.env.EMAIL_FROM,
      EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
      ADMIN_EMAILS: process.env.ADMIN_EMAILS,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLIENT_URL: process.env.CLIENT_URL,
      LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
      LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
      LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
      CLIENT_REDIRECT_URL: process.env.CLIENT_REDIRECT_URL,
      BACKEND_URL: process.env.BACKEND_URL,
      FRONTEND_URL: process.env.FRONTEND_URL,
      DO_SPACES_KEY: process.env.DO_SPACES_KEY,
      DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
    };
  } catch (error) {
    console.error('❌ Critical error loading configuration:', error);
    throw new Error('Failed to load application configuration');
  }
}

/**
 * Validates that all required environment variables are present
 * @param {Array<string>} requiredVars - Array of required variable names
 * @throws {Error} If any required variables are missing
 */
export function validateRequiredSecrets(requiredVars = []) {
  const defaultRequired = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const toValidate = requiredVars.length > 0 ? requiredVars : defaultRequired;
  const missing = toValidate.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please ensure all required secrets are configured in AWS Secrets Manager or .env file'
    );
  }

  console.log('✅ All required environment variables are present');
}

export default {
  loadSecrets,
  validateRequiredSecrets,
};
