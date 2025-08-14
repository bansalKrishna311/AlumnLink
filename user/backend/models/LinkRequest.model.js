import mongoose from "mongoose";

const LinkRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},

  },
  { timestamps: true }
);

// Compound indexes for frequent queries
LinkRequestSchema.index({ status: 1, recipient: 1, createdAt: -1 });
LinkRequestSchema.index({ status: 1, sender: 1, createdAt: -1 });
LinkRequestSchema.index({ sender: 1, recipient: 1 }, { unique: false });
LinkRequestSchema.index({ createdAt: -1 });

const LinkRequest = mongoose.model("LinkRequest", LinkRequestSchema);

export default LinkRequest;
