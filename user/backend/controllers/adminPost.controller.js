import { AdminPost } from '../models/adminPost.model.js';
import cloudinary from "../lib/cloudinary.js";

export const createAdminPost = async (req, res) => {
  try {
    const { title, content, type, jobDetails, internshipDetails, eventDetails } = req.body;
    const image = req.file ? req.file.path : null;

    console.log("Received data:", { title, content, type, jobDetails, internshipDetails, eventDetails, image });

    let newAdminPostData = {
      author: req.user._id,
      title,
      content,
      type,
    };

    // Include details based on AdminPost type
    if (type === "job" && jobDetails) {
      newAdminPostData.jobDetails = JSON.parse(jobDetails);
    } else if (type === "internship" && internshipDetails) {
      newAdminPostData.internshipDetails = JSON.parse(internshipDetails);
    } else if (type === "event" && eventDetails) {
      newAdminPostData.eventDetails = JSON.parse(eventDetails);
    }

    // Upload image to Cloudinary if provided
    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newAdminPostData.image = imgResult.secure_url;
    }

    // Create a new AdminPost instance with the correct structure
    const newAdminPost = new AdminPost(newAdminPostData);
    await newAdminPost.save();

    console.log("AdminPost created successfully:", newAdminPost);
    res.status(201).json(newAdminPost);
  } catch (error) {
    console.error("Error in createAdminPost controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
