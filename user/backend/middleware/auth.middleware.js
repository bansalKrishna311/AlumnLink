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

export const isAdminOrSubAdmin = async (req, res, next) => {
    try {
        const { role, adminHierarchy } = req.user;

        console.log("🔐 isAdminOrSubAdmin middleware check:");
        console.log("  User ID:", req.user._id);
        console.log("  User role:", role);
        console.log("  Admin hierarchy:", adminHierarchy);
        console.log("  Full user object keys:", Object.keys(req.user));
        console.log("  User name:", req.user.name);
        console.log("  User username:", req.user.username);
        console.log("  User isAdmin:", req.user.isAdmin);

        // Allow admins and superadmins
        if (role === 'admin' || role === 'superadmin') {
            console.log("  ✅ Access granted - User is admin/superadmin");
            return next();
        }

        // Allow users with any adminHierarchy OTHER than 'alumni' (default users)
        // This includes: hod, subadmin, moderator, faculty, institute_management, etc.
        if (adminHierarchy && adminHierarchy !== 'alumni') {
            console.log("  ✅ Access granted - User has elevated hierarchy:", adminHierarchy);
            return next();
        }

        // Also check if user has isAdmin flag (legacy check)
        if (req.user.isAdmin === true) {
            console.log("  ✅ Access granted - User has isAdmin flag");
            return next();
        }

        console.log("  ❌ Access denied - User is regular alumni or has no special privileges");
        console.log("  Available fields:", {
            role,
            adminHierarchy,
            isAdmin: req.user.isAdmin,
            allFields: Object.keys(req.user)
        });
        
        return res.status(403).json({ message: "Access denied. Admin or elevated hierarchy rights required." });

    } catch (error) {
        console.error("Error in isAdminOrSubAdmin middleware:", error);
        return res.status(500).json({ message: "An error occurred while verifying admin rights.", error: error.message });
    }
};
