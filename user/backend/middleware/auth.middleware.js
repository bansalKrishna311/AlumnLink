import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import cacheCleanupService from "../utils/cache-cleanup.js";

// Cache for user sessions to reduce database calls
const sessionCache = new Map();
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Register caches with cleanup service
cacheCleanupService.registerCache('sessionCache', sessionCache, 100, CACHE_TTL);
cacheCleanupService.registerCache('userCache', userCache, 50, CACHE_TTL);

// Helper function to get cached user
const getCachedUser = async (userId) => {
  const cacheKey = userId.toString();
  const cached = userCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }
  
  const user = await User.findById(userId).select("-password").lean();
  
  if (user) {
    userCache.set(cacheKey, { user, timestamp: Date.now() });
    
    // Clean cache if it gets too large
    if (userCache.size > 50) {
      const firstKey = userCache.keys().next().value;
      userCache.delete(firstKey);
    }
  }
  
  return user;
};

// Helper function to verify cached session
const getCachedSession = async (userId, token) => {
  const cacheKey = `${userId}_${token.slice(-10)}`; // Use last 10 chars of token
  const cached = sessionCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.session;
  }
  
  const session = await Session.findOne({ userId, token }).lean();
  
  if (session) {
    sessionCache.set(cacheKey, { session, timestamp: Date.now() });
    
    // Clean cache if it gets too large
    if (sessionCache.size > 100) {
      const firstKey = sessionCache.keys().next().value;
      sessionCache.delete(firstKey);
    }
  }
  
  return session;
};

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

		// Use cached user lookup for better performance
		const user = await getCachedUser(decoded.userId);

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
		
		// Use cached session lookup for better performance
		const session = await getCachedSession(decoded.userId, token);
		if (!session) return res.status(401).json({ message: "Session expired or invalid" });

		// Get cached user data for enhanced user object
		const user = await getCachedUser(decoded.userId);
		req.user = { 
			id: decoded.userId,
			_id: decoded.userId,
			...user // Include cached user data
		};
		
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
