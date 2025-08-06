import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// DigitalOcean Spaces configuration with performance optimizations
const spacesClient = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com", // Your region endpoint
  region: "blr1", // Your region
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false, // Important for DigitalOcean Spaces
  // Performance optimizations
  maxAttempts: 3, // Retry failed uploads up to 3 times
  retryMode: "adaptive", // Smart retry strategy
  requestHandler: {
    // Connection pool settings for better performance
    maxConnections: 30, // Allow multiple simultaneous uploads
    connectionTimeout: 5000, // 5 second connection timeout
    socketTimeout: 30000, // 30 second socket timeout
  }
});

const BUCKET_NAME = "alumnlink"; // Your bucket name
const CDN_ENDPOINT = "https://alumnlink.blr1.cdn.digitaloceanspaces.com"; // CDN URL for faster delivery

/**
 * Upload a file to DigitalOcean Spaces with optimized settings for speed
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Folder path (e.g., 'posts', 'profiles', 'banners')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadToSpaces = async (fileBuffer, fileName, mimeType, folder = 'uploads') => {
  const startTime = Date.now();
  
  try {
    // Generate unique filename to avoid conflicts
    const uniqueId = crypto.randomUUID();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uniqueId}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // Make file publicly accessible
      CacheControl: "max-age=31536000", // Cache for 1 year for better performance
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': fileName,
        'file-size': fileBuffer.length.toString()
      },
      // Performance optimizations
      ServerSideEncryption: undefined, // Skip encryption for speed
      StorageClass: "STANDARD", // Use standard storage for best performance
    };

    const command = new PutObjectCommand(uploadParams);
    await spacesClient.send(command);

    const uploadTime = Date.now() - startTime;
    const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
    
    // Return the CDN URL for better performance
    const publicUrl = `${CDN_ENDPOINT}/${key}`;
    console.log(`⚡ Uploaded ${fileSizeMB}MB in ${uploadTime}ms: ${fileName} → ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    const uploadTime = Date.now() - startTime;
    console.error(`❌ Upload failed after ${uploadTime}ms:`, error.message);
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }
};

/**
 * Upload base64 image to DigitalOcean Spaces with optimized settings
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} folder - Folder path
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadBase64ToSpaces = async (base64Data, folder = 'uploads') => {
  try {
    // Extract mime type and data from base64 string
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 string");
    }

    const mimeType = matches[1];
    const base64Buffer = Buffer.from(matches[2], 'base64');
    
    // Generate filename based on mime type
    const extension = mimeType.split('/')[1];
    const fileName = `image.${extension}`;

    console.log(`📤 Uploading ${mimeType} image to DigitalOcean Spaces/${folder}`);
    return await uploadToSpaces(base64Buffer, fileName, mimeType, folder);
  } catch (error) {
    console.error("❌ Error uploading base64 to DigitalOcean Spaces:", error);
    throw new Error("Failed to upload base64 image to storage");
  }
};

/**
 * Delete a file from DigitalOcean Spaces
 * @param {string} fileUrl - The public URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromSpaces = async (fileUrl) => {
  try {
    // Extract the key from the URL
    const urlParts = fileUrl.replace(CDN_ENDPOINT, '').replace(`https://${BUCKET_NAME}.blr1.digitaloceanspaces.com`, '');
    const key = urlParts.startsWith('/') ? urlParts.substring(1) : urlParts;

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await spacesClient.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting from DigitalOcean Spaces:", error);
    return false;
  }
};

/**
 * Generate a presigned URL for direct client-side uploads
 * @param {string} fileName - The filename
 * @param {string} folder - Folder path
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<Object>} - Object containing presigned URL and final file URL
 */
export const generatePresignedUrl = async (fileName, folder = 'uploads', expiresIn = 3600) => {
  try {
    const uniqueId = crypto.randomUUID();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uniqueId}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ACL: "public-read",
      CacheControl: "max-age=31536000",
    });

    const presignedUrl = await getSignedUrl(spacesClient, command, { expiresIn });
    const finalUrl = `${CDN_ENDPOINT}/${key}`;

    console.log(`🔗 Generated presigned URL for ${fileName} in ${folder}`);
    return {
      presignedUrl,
      finalUrl,
      key
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
};

/**
 * Check if an image URL is from Cloudinary (for existing images)
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - True if the URL is from Cloudinary
 */
export const isCloudinaryUrl = (imageUrl) => {
  return imageUrl && (
    imageUrl.includes('cloudinary.com') || 
    imageUrl.includes('res.cloudinary.com')
  );
};

/**
 * Check if an image URL is from DigitalOcean Spaces
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - True if the URL is from DigitalOcean Spaces
 */
export const isDigitalOceanUrl = (imageUrl) => {
  return imageUrl && (
    imageUrl.includes('digitaloceanspaces.com') || 
    imageUrl.includes('cdn.digitaloceanspaces.com')
  );
};

/**
 * Get storage statistics
 * @returns {Object} - Object containing storage usage info
 */
export const getStorageStats = () => {
  return {
    provider: 'DigitalOcean Spaces',
    region: 'BLR1 (Bangalore)',
    cdn: CDN_ENDPOINT,
    costPerGB: '$0.02/month',
    transferCost: '$0.01/GB',
    features: ['CDN included', 'S3 compatible', 'Global edge locations']
  };
};

export default spacesClient;
