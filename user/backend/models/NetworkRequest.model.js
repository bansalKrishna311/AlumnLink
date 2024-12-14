import mongoose from "mongoose";

const networkRequestSchema = new mongoose.Schema(
  {
    network: {
      type: String,
      required: [true, "Network is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll Number is required"],
      match: /^[a-zA-Z0-9]+$/, // Alphanumeric validation
    },
    batch: {
      type: Number,
      required: [true, "Batch is required"],
    },
    courseName: {
      type: String,
      required: [true, "Course Name is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const NetworkRequest = mongoose.model("NetworkRequest", networkRequestSchema);

export default NetworkRequest;
