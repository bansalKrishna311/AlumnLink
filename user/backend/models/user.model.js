import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
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
			default: "Earth",
		},
		about: {
			type: String,
			default: "",
		},
		skills: [String],
		experience: [
			{
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
				fieldOfStudy: String,
				startYear: Number,
				endYear: Number,
			},
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
			enum: ["institute", "corporate", "school"],
			required: function () {
			  return this.role === "admin";  // Only required for admins
			},
			default: "institute",  // Default type if admin role is selected
		  },
		  isApproved: {
			type: Boolean,
			default: false,
		},
	},

	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
