// post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String },
        image: { type: String },
        reactions: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            type: {
                type: String,
                enum: ["like", "love", "sad", "wow", "angry"],  // Added new reactions
                required: true
            }
        }],
        comments: [{
            content: { type: String },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now },
        }],
        links: [{ type: mongoose.Schema.Types.ObjectId, ref: "LinkRequest" }],
        type: {
            type: String,
            enum: ["discussion", "job", "internship", "event", "personal", "other"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        adminFeedback: { type: String },
        reviewedAt: { type: Date },
        jobDetails: {
            companyName: { type: String },
            jobTitle: { type: String },
            jobLocation: { type: String },
        },
        internshipDetails: {
            companyName: { type: String },
            internshipDuration: { type: String },
        },
        eventDetails: {
            eventName: { type: String },
            eventDate: { type: Date },
            eventLocation: { type: String },
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
