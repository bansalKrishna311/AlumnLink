// Example controller showing how to use DigitalOcean Spaces for new uploads
// This is just for reference - you can integrate this into your existing controllers

import { uploadToSpaces, uploadBase64ToSpaces, generatePresignedUrl } from "../lib/digitalocean.js";

// Example: Upload profile picture using DigitalOcean Spaces (for new uploads)
export const uploadProfilePictureToSpaces = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to DigitalOcean Spaces
    const imageUrl = await uploadToSpaces(
      req.file.buffer, 
      req.file.originalname, 
      req.file.mimetype, 
      'profiles' // folder in your bucket
    );

    res.status(200).json({ 
      message: "Profile picture uploaded successfully", 
      imageUrl 
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};

// Example: Upload post images using DigitalOcean Spaces (for new posts)
export const uploadPostImagesToSpaces = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(file => 
      uploadToSpaces(file.buffer, file.originalname, file.mimetype, 'posts')
    );

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({ 
      message: "Images uploaded successfully", 
      imageUrls 
    });
  } catch (error) {
    console.error("Error uploading post images:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};

// Example: Upload base64 image (like your current Cloudinary implementation)
export const uploadBase64ImageToSpaces = async (req, res) => {
  try {
    const { base64Image, folder = 'uploads' } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: "No base64 image provided" });
    }

    const imageUrl = await uploadBase64ToSpaces(base64Image, folder);

    res.status(200).json({ 
      message: "Image uploaded successfully", 
      imageUrl 
    });
  } catch (error) {
    console.error("Error uploading base64 image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

// Example: Generate presigned URL for direct client-side uploads
export const getPresignedUploadUrl = async (req, res) => {
  try {
    const { fileName, folder = 'uploads' } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const { presignedUrl, finalUrl, key } = await generatePresignedUrl(fileName, folder);

    res.status(200).json({ 
      presignedUrl, 
      finalUrl, 
      key,
      message: "Presigned URL generated successfully" 
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ message: "Error generating upload URL" });
  }
};
