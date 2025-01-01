import mongoose from 'mongoose';

const adminPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['discussion', 'job', 'internship', 'event', 'other'],
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    jobDetails: {
      companyName: { type: String, required: false },
      jobTitle: { type: String, required: false },
      jobLocation: { type: String, required: false },
    },
    internshipDetails: {
      companyName: { type: String, required: false },
      internshipDuration: { type: String, required: false },
    },
    eventDetails: {
      eventName: { type: String, required: false },
      eventDate: { type: Date, required: false },
      eventLocation: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);

export const AdminPost = mongoose.model('AdminPost', adminPostSchema);
