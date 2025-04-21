import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies["jwt-AlumnLink"];

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const verifySession = async (req, res, next) => {
	try {
		const token = req.cookies["jwt-AlumnLink"];
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const session = await Session.findOne({ userId: decoded.userId, token });
		if (!session) return res.status(401).json({ message: "Session expired or invalid" });

		req.user = { id: decoded.userId };
		next();
	} catch (error) {
		console.error("Session verification error:", error);
		res.status(401).json({ message: "Unauthorized" });
	}
};
export const isAdmin = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (!role || (role !== 'admin' && role !== 'superadmin')) {
            return res.status(403).json({ message: "Access denied. Admin rights required." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while verifying admin rights.", error: error.message });
    }
};
