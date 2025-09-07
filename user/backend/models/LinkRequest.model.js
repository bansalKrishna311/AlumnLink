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
    selectedCourse: {
      type: String,
      required: false, // Make optional for backward compatibility
    },
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
    // Hierarchical Admin System
    adminHierarchy: {
      type: String,
      enum: [
        // Institute hierarchy
        "alumni", "faculty", "hod", "institute_management",
        // School hierarchy  
        "student", "school_faculty", "school_hod", "principal", "school_management",
        // Corporate hierarchy
        "employee", "team_lead", "manager", "director", "corporate_management"
      ],
      default: "alumni", // Default level for new users
    },

  },
  { timestamps: true }
);

const LinkRequest = mongoose.model("LinkRequest", LinkRequestSchema);

export default LinkRequest;
