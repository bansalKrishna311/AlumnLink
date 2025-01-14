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
  chapter:{
    type: String,
    required: [true, "Current Location is required"],
    enum: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai","Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur", "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur",]
  }
  },
  { timestamps: true }
);

const LinkRequest = mongoose.model("LinkRequest", LinkRequestSchema);

export default LinkRequest;
