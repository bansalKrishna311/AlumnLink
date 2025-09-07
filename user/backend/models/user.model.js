import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		profilePicture: {
			type: String,
			default: "",
		},
		bannerImg: {
			type: String,
			default: "",
		},
		headline: {
			type: String,
			default: "AlumnLink User",
		},
		location: {
			
				type: String,
				
				enum: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai","Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur", "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur",]
		
		},
		about: {
			type: String,
			default: "",
		},
		skills: [String],
		experience: [
			{
				_id: String,
				title: String,
				company: String,
				startDate: Date,
				endDate: Date,
				description: String,
			},
		],
		education: [
			{
			  school: String,
			  degree: String,
			  fieldOfStudy: String,
			  startDate: Date,
			  endDate: Date,
			  isCurrentlyStudying: Boolean,
			  description: String,
			  _id: String
			}
		  ],
		Links: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		role: {
			type: String,
			enum: ["admin", "superadmin", "user"],
			default: "user",
		},
		adminType: {
			type: String,
			enum: ["institute", "corporate", "school",],
			required: function () {
			  return this.role === "admin";  // Only required for admins
			},
			default: null,  // Default type if admin role is selected
		  },
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
			default: function() {
			  if (this.role === "admin" || this.role === "superadmin") {
				// Default to highest level for admins based on their type
				if (this.adminType === "institute") return "institute_management";
				if (this.adminType === "school") return "school_management";  
				if (this.adminType === "corporate") return "corporate_management";
			  }
			  return "alumni"; // Default for regular users
			}
		},
		assignedCourses: {
			type: [String],
			default: [],
			required: function () {
			  return false; // Make it optional for now to support existing admins
			}
		  },
		// Activity tracking for contribution graph
		activityHistory: [
			{
				date: {
					type: Date,
					required: true
				},
				activities: {
					posts: { type: Number, default: 0 },
					likes: { type: Number, default: 0 },
					comments: { type: Number, default: 0 },
					total: { type: Number, default: 0 }
				}
			}
		],
	},

	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
