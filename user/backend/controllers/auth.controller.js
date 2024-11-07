import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../emails/emailHandlers.js";
import crypto from "crypto";

export const signup = async (req, res) => {
	try {
	  const { name, username, email, password, role, adminType } = req.body;
  
	  if (!name || !username || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	  }
  
	  const existingEmail = await User.findOne({ email });
	  if (existingEmail) return res.status(400).json({ message: "Email already exists" });
  
	  const existingUsername = await User.findOne({ username });
	  if (existingUsername) return res.status(400).json({ message: "Username already exists" });
  
	  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(password, salt);
  
	  // For "admin" role, adminType is required
	  if (role === "admin" && !adminType) {
		return res.status(400).json({ message: "Admin type is required" });
	  }
  
	  const user = new User({
		name,
		email,
		password: hashedPassword,
		username,
		role: role || "user",
		adminType: role === "admin" ? adminType : undefined,  // Set adminType only if the role is admin
	  });
  
	  await user.save();
  
	  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
	  const session = new Session({ userId: user._id, token });
	  await session.save();
  
	  res.cookie("jwt-AlumnLink", token, {
		httpOnly: true,
		maxAge: 3 * 24 * 60 * 60 * 1000,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	  });
  
	  res.status(201).json({ message: "User registered successfully" });
  
	  const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
	  try {
		await sendWelcomeEmail(user.email, user.name, profileUrl);
	  } catch (emailError) {
		console.error("Error sending welcome email", emailError);
	  }
	} catch (error) {
	  console.log("Error in signup:", error.message);
	  res.status(500).json({ message: "Internal server error" });
	}
  };
  
  

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		const session = new Session({ userId: user._id, token });
		await session.save();

		res.cookie("jwt-AlumnLink", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = async (req, res) => {
	try {
		const token = req.cookies["jwt-AlumnLink"];
		if (token) {
			await Session.deleteOne({ token });
			res.clearCookie("jwt-AlumnLink");
		}
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Generate token
		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
		user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

		await user.save();

		// Send reset email
		const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
		await sendResetPasswordEmail(user.email, user.name, resetUrl);

		res.status(200).json({ message: "Password reset link sent to your email" });
	} catch (error) {
		console.error("Error in requestPasswordReset:", error);
		res.status(500).json({ message: "Error processing request" });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		// Hash the token from the URL and compare with the hashed token in the database
		const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

		// Find user with the hashed token and check that the reset link hasn't expired
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired token" });
		}

		// Ensure the new password meets minimum length requirements
		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		// Clear reset token fields
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		// Save the updated user with the new password
		await user.save();

		// Respond to the client with a success message
		res.status(200).json({ message: "Password reset successful" });
	} catch (error) {
		console.error("Error in resetPassword:", error);
		res.status(500).json({ message: "Server error" });
	}
};

