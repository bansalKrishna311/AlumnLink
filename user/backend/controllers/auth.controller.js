import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../emails/emailHandlers.js";
import crypto from "crypto";
import cloudinary from '../lib/cloudinary.js';
import { uploadToSpaces } from "../lib/digitalocean.js";

// Helper function to validate password strength
const validatePassword = (password) => {
	const errors = [];
	
	// Check minimum length
	if (password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}
	
	// Check for uppercase letters
	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}
	
	// Check for lowercase letters
	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}
	
	// Check for numbers
	if (!/[0-9]/.test(password)) {
		errors.push("Password must contain at least one number");
	}
	
	// Check for special characters
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		errors.push("Password must contain at least one special character");
	}
	
	return errors;
};

export const signup = async (req, res) => {
	try {
		let { name, username, email, password, role, adminType, location } = req.body;
		// Remove leading/trailing spaces from username
		if (username) username = username.trim();
		// Prevent spaces in username
		if (username && username.includes(" ")) {
			return res.status(400).json({ message: "Username must not contain spaces" });
		}

		if (!name || !username || !email || !password || !location) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!["Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi NCR", "Kolkata", "Ahmedabad", "Jaipur", "Thiruvananthapuram", "Lucknow", "Indore", "Chandigarh", "Nagpur"].includes(location)) {
			return res.status(400).json({ message: "Invalid location selected" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) return res.status(400).json({ message: "Email already exists" });

		const existingUsername = await User.findOne({ username });
		if (existingUsername) return res.status(400).json({ message: "Username already exists" });

		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			return res.status(400).json({ message: passwordErrors.join(", ") });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// For "admin" role, adminType is required
		if (role === "admin" && !adminType) {
			return res.status(400).json({ message: "Admin type is required for admin role" });
		}

		// Set headline based on role
		let headline = "AlumnLink User"; // Default headline
		if (role === "admin") {
			headline = "AlumnLink Admin";
		} else if (role === "AlumnLink superadmin") {
			headline = "SuperAdmin";
		}

		const user = new User({	
			name,
			email,
			password: hashedPassword,
			username,
			role: role || "user",
			adminType: role === "admin" ? adminType : undefined, // Set adminType only if role is admin
			headline,
			location // Assign calculated headline
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
		let { username, password } = req.body;
		// Remove leading/trailing spaces from username
		if (username) username = username.trim();
		// Prevent spaces in username
		if (username && username.includes(" ")) {
			return res.status(400).json({ message: "Username must not contain spaces" });
		}

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
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			return res.status(400).json({ message: passwordErrors.join(", ") });
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

export const getAccessToken = async(code) => {
	try {
		const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code : code,
				redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
				client_id: process.env.LINKEDIN_CLIENT_ID,
				client_secret: process.env.LINKEDIN_CLIENT_SECRET,
			}),
		});
		
		if(!response.ok) {
			const errorText = await response.text();
			console.error('LinkedIn access token error:', errorText);
			throw new Error(`LinkedIn OAuth error: ${response.status} - ${errorText}`);
		}
		
		const accessToken = await response.json();
		return accessToken;
	} catch (error) {
		console.error('Error getting LinkedIn access token:', error);
		throw error;
	}
}

export const linkedInCallback = async (req, res) => {
	try {
		const { code, error: linkedinError, error_description } = req.query;

		// Check for LinkedIn OAuth errors
		if (linkedinError) {
			console.error('LinkedIn OAuth error:', linkedinError, error_description);
			return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=linkedin_oauth_failed&message=${encodeURIComponent(error_description || linkedinError)}`);
		}

		if (!code) {
			console.error('No authorization code received from LinkedIn');
			return res.status(400).json({ message: "Authorization code is required" });
		}

		console.log('LinkedIn callback received code:', code.substring(0, 10) + '...');

		// Step 1: Get access token from LinkedIn
		const accessToken = await getAccessToken(code);
		console.log('LinkedIn access token received successfully');

		// Step 2: Get LinkedIn user data
		const userdata = await getLinkedInUserData(accessToken.access_token);
		console.log('LinkedIn user data received for email:', userdata?.email);

		if (!userdata || !userdata.email) {
			console.error('Failed to fetch user data from LinkedIn:', userdata);
			return res.status(400).json({ message: "Failed to fetch user data from LinkedIn" });
		}

		// Step 3: Upload profile picture to Cloudinary (if it exists)
		let profilePictureUrl = '';
		if (userdata.picture) {
			try {
				const imageRes = await fetch(userdata.picture);
				const buffer = await imageRes.arrayBuffer();
				const imageBuffer = Buffer.from(buffer);

				// Upload to DigitalOcean Spaces instead of Cloudinary
				profilePictureUrl = await uploadToSpaces(
					imageBuffer,
					'linkedin-profile.jpg',
					'image/jpeg',
					'linkedin-profiles'
				);
			} catch (err) {
				console.error("Cloudinary upload failed:", err.message);
				profilePictureUrl = ''; // fallback if upload fails
			}
		}

		// Step 4: Check if user already exists
		let user = await User.findOne({ email: userdata.email });
		if (!user) {
			// Generate a secure random password for LinkedIn users
			const tempPassword = crypto.randomBytes(12).toString('hex');
			// This password would meet our criteria with uppercase, lowercase, numbers and special characters
			const securePassword = tempPassword + 'A1!';
			
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(securePassword, salt);
			
			user = new User({
				name: userdata.name,
				email: userdata.email,
				username: userdata.email.split("@")[0],
				password: hashedPassword, // Store hashed password
				role: "user",
				profilePicture: profilePictureUrl,
			});
			await user.save();
		}

		// Step 5: Generate token & store session
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		await Session.create({ userId: user._id, token });

		// Step 6: Set cookie
		res.cookie("jwt-AlumnLink", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			secure: process.env.NODE_ENV === "production",
			domain: process.env.NODE_ENV === "production" ? ".alumnlink.com" : undefined
		});

		console.log('LinkedIn auth successful, redirecting to:', process.env.CLIENT_REDIRECT_URL);
		return res.redirect(process.env.CLIENT_REDIRECT_URL);
	} catch (error) {
		console.error("LinkedIn callback error:", error);

		if (!res.headersSent) {
			return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=linkedin_auth_failed&message=${encodeURIComponent(error.message)}`);
		}
	}
};

// LinkedIn OAuth initiation endpoint
export const initiateLinkedInAuth = async (req, res) => {
	try {
		const params = new URLSearchParams({
			response_type: 'code',
			client_id: process.env.LINKEDIN_CLIENT_ID,
			redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
			scope: 'openid email profile',
			state: crypto.randomBytes(16).toString('hex') // CSRF protection
		});
		
		const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
		console.log('Initiating LinkedIn auth with URL:', linkedinAuthUrl);
		res.redirect(linkedinAuthUrl);
	} catch (error) {
		console.error("LinkedIn auth initiation error:", error);
		res.status(500).json({ message: "Failed to initiate LinkedIn authentication" });
	}
};

// Debug endpoint to check LinkedIn configuration
export const debugLinkedInConfig = async (req, res) => {
	try {
		const config = {
			clientId: process.env.LINKEDIN_CLIENT_ID ? 'Set' : 'Not set',
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET ? 'Set' : 'Not set',
			redirectUri: process.env.LINKEDIN_REDIRECT_URI,
			clientRedirectUrl: process.env.CLIENT_REDIRECT_URL,
			nodeEnv: process.env.NODE_ENV
		};
		
		res.json({ 
			message: "LinkedIn configuration debug info",
			config: config
		});
	} catch (error) {
		console.error("Debug endpoint error:", error);
		res.status(500).json({ message: "Debug endpoint failed" });
	}
};

const getLinkedInUserData = async (accessToken) => {
	try {
		const response = await fetch('https://api.linkedin.com/v2/userinfo', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('LinkedIn userinfo error:', response.status, errorText);
			throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
		}
		
		const userData = await response.json();
		console.log('LinkedIn user data received:', {
			name: userData.name,
			email: userData.email,
			picture: userData.picture ? 'present' : 'not present'
		});
		return userData;
	} catch (error) {
		console.error('Error fetching LinkedIn user data:', error);
		throw error;
	}
};