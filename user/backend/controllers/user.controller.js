import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";



export const getSuggestedLinks = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("Links");

        // Default pagination parameters
        const limit = parseInt(req.query.limit) || 3; // Number of users to return
        const offset = parseInt(req.query.offset) || 0; // Start fetching from this index
        const search = req.query.search || ""; // Get the search term

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.Links,
            },
            // Search filter
            $or: [
                { name: { $regex: search, $options: "i" } }, // Search by name (case-insensitive)
                { username: { $regex: search, $options: "i" } } // Search by username (case-insensitive)
            ]
        })
            .select("name username profilePicture headline")
            .skip(offset)
            .limit(limit);

        res.json(suggestedUser);
    } catch (error) {
        console.error("Error in getSuggestedLinks controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
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

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get users for mention suggestions
export const getMentionSuggestions = async (req, res) => {
  try {
    // Get search query from request
    const search = req.query.search || "";
    
    // Create search filter if search query is provided
    const searchFilter = search 
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
            { username: { $regex: search, $options: "i" } } // Case-insensitive username search
          ]
        } 
      : {};
    
    // Get users for mentions with optional search filter - only users with role "user" or "admin"
    const mentionUsers = await User.find({
      // Skip deleted users if applicable
      isDeleted: { $ne: true },
      // Only include users with roles "user" or "admin"
      role: { $in: ["user", "admin"] },
      // Apply search filter if present
      ...searchFilter
    })
    .select("name username profilePicture role adminType")
    .limit(50);
    
    res.json(mentionUsers);
  } catch (error) {
    console.error("Error in getMentionSuggestions controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
