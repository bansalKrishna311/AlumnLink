import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { uploadBase64ToSpaces } from "../lib/digitalocean.js";
import cacheCleanupService from "../utils/cache-cleanup.js";

// Cache for frequently accessed data
const suggestionsCache = new Map();
const profileCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes for suggestions

// Register caches with cleanup service
cacheCleanupService.registerCache('suggestionsCache', suggestionsCache, 50, CACHE_TTL);
cacheCleanupService.registerCache('profileCache', profileCache, 30, CACHE_TTL);



export const getSuggestedLinks = async (req, res) => {
    try {
        // Default pagination parameters - reduced limits for better performance
        const limit = Math.min(parseInt(req.query.limit) || 3, 10); // Max 10 users
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || "";

        // Create cache key
        const cacheKey = `${req.user._id}_${limit}_${offset}_${search}`;
        const cached = suggestionsCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.json(cached.data);
        }

        // Use lean() for better performance and get user links efficiently
        const currentUser = await User.findById(req.user._id).select("Links").lean();

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.Links,
            },
            // Search filter
            $or: [
                { name: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ]
        })
        .select("name username profilePicture headline")
        .skip(offset)
        .limit(limit)
        .lean(); // Use lean for better performance

        // Cache the result
        suggestionsCache.set(cacheKey, { data: suggestedUser, timestamp: Date.now() });
        
        // Clean cache if it gets too large
        if (suggestionsCache.size > 50) {
            const firstKey = suggestionsCache.keys().next().value;
            suggestionsCache.delete(firstKey);
        }

        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in getSuggestedLinks controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPublicProfile = async (req, res) => {
	try {
		const username = req.params.username;
		const cacheKey = `profile_${username}`;
		const cached = profileCache.get(cacheKey);
		
		// Use cache for frequently accessed profiles
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return res.json(cached.user);
		}

		const user = await User.findOne({ username }).select("-password").lean();

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Cache the profile
		profileCache.set(cacheKey, { user, timestamp: Date.now() });
		
		// Clean cache if it gets too large
		if (profileCache.size > 30) {
			const firstKey = profileCache.keys().next().value;
			profileCache.delete(firstKey);
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
			"skills",
			"experience",
			"education",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			// Special handling for experience array
			if (field === 'experience' && Array.isArray(req.body[field])) {
				updatedData[field] = req.body[field].map(exp => ({
					_id: exp._id,
					title: exp.title,
					company: exp.company,
					startDate: exp.startDate,
					endDate: exp.endDate,
					description: exp.description
				}));
			}
			// Handle other fields normally
			else if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		} 

		// Upload profile picture and banner in parallel for speed
		const uploadPromises = [];
		
		if (req.body.profilePicture) {
			console.log('🚀 Uploading profile picture...');
			uploadPromises.push(
				uploadBase64ToSpaces(req.body.profilePicture, 'profiles')
					.then(url => ({ type: 'profilePicture', url }))
			);
		}

		if (req.body.bannerImg) {
			console.log('🚀 Uploading banner image...');
			uploadPromises.push(
				uploadBase64ToSpaces(req.body.bannerImg, 'banners')
					.then(url => ({ type: 'bannerImg', url }))
			);
		}

		// Wait for all uploads to complete in parallel
		if (uploadPromises.length > 0) {
			console.log(`⚡ Processing ${uploadPromises.length} image uploads in parallel...`);
			const uploadResults = await Promise.all(uploadPromises);
			
			// Apply the upload results to updatedData
			uploadResults.forEach(result => {
				updatedData[result.type] = result.url;
			});
			
			console.log(`✅ Successfully uploaded ${uploadResults.length} images`);
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		// Clear relevant caches when profile is updated
		const username = user.username;
		if (username) {
			profileCache.delete(`profile_${username}`);
		}
		
		// Clear suggestions cache for this user
		for (const [key] of suggestionsCache) {
			if (key.startsWith(req.user._id)) {
				suggestionsCache.delete(key);
			}
		}

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get users for mention suggestions - OPTIMIZED
export const getMentionSuggestions = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = Math.min(parseInt(req.query.limit) || 20, 30); // Reduced limit
    
    // Create cache key for mentions
    const cacheKey = `mentions_${search}_${limit}`;
    const cached = suggestionsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    // Create search filter if search query is provided
    const searchFilter = search 
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } }
          ]
        } 
      : {};
    
    // Get users for mentions with optimized query
    const mentionUsers = await User.find({
      isDeleted: { $ne: true },
      role: { $in: ["user", "admin"] },
      ...searchFilter
    })
    .select("name username profilePicture role adminType")
    .limit(limit)
    .lean(); // Use lean for better performance
    
    // Cache the result
    suggestionsCache.set(cacheKey, { data: mentionUsers, timestamp: Date.now() });
    
    res.json(mentionUsers);
  } catch (error) {
    console.error("Error in getMentionSuggestions controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
