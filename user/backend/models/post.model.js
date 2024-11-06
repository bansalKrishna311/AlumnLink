// post.model.js

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String },
        image: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                content: { type: String },
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        type: {
            type: String,
            enum: ["discussion", "job", "internship", "event", "personal", "other"],
            required: true,
        },
        jobDetails: {
            companyName: { type: String },
            jobTitle: { type: String },
            jobLocation: { type: String },
        }, // For job posts
        internshipDetails: {
            companyName: { type: String },
            internshipDuration: { type: String },
        }, // For internship posts
        eventDetails: {
            eventName: { type: String },
            eventDate: { type: Date },
            eventLocation: { type: String },
        }, // For event posts
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
