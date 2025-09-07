import { sendLinkAcceptedEmail } from "../emails/emailHandlers.js";
import LinkRequest from "../models/LinkRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Hierarchy levels mapping
const HIERARCHY_LEVELS = {
  institute: ["alumni", "faculty", "hod", "institute_management"],
  school: ["student", "school_faculty", "school_hod", "principal", "school_management"],
  corporate: ["employee", "team_lead", "manager", "director", "corporate_management"]
};

// Helper function to get hierarchy level index
const getHierarchyIndex = (adminType, hierarchy) => {
  const levels = HIERARCHY_LEVELS[adminType];
  return levels ? levels.indexOf(hierarchy) : -1;
};

// Helper function to check if admin can grant specific hierarchy
const canGrantHierarchy = (adminType, adminHierarchy, requestedHierarchy) => {
  const adminIndex = getHierarchyIndex(adminType, adminHierarchy);
  const requestedIndex = getHierarchyIndex(adminType, requestedHierarchy);
  
  // Management level admins can grant any level including management
  if (adminHierarchy && adminHierarchy.includes('management')) {
    return requestedIndex !== -1; // Can grant any valid hierarchy
  }
  
  // Regular admins can only grant hierarchy one level below their own
  return adminIndex > requestedIndex && adminIndex !== -1 && requestedIndex !== -1;
};

export const sendLinkRequest = async (req, res) => {
    try {
        const { userId } = req.params; // Retrieve userId from route params
        const senderId = req.user._id; // Current logged-in user's ID

        // Check if sender is trying to link themselves
        if (senderId.toString() === userId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        // Ensure recipientUserId is defined
        const recipientUserId = userId;

        // Check if the user is already linked
        if (req.user.Links.includes(recipientUserId)) {
            return res.status(400).json({ message: "You are already linked" });
        }

        // Check if a pending request already exists
        const existingRequest = await LinkRequest.findOne({
            sender: senderId,
            recipient: recipientUserId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A link request already exists" });
        }

        // Create new link request with status as "pending"
        const newRequest = new LinkRequest({
            sender: senderId,
            recipient: recipientUserId,
            rollNumber: req.body.rollNumber,
            batch: req.body.batch,
            courseName: req.body.courseName,
            selectedCourse: req.body.selectedCourse,
            status: "pending", // Set initial status to pending
            adminHierarchy: req.body.adminHierarchy || "alumni", // Default to alumni
            requestedHierarchy: req.body.requestedHierarchy || null,
            hierarchyChangeReason: req.body.hierarchyChangeReason || null,
            hierarchyStatus: req.body.requestedHierarchy ? "pending_hierarchy" : "no_change",
        });

        await newRequest.save();

        res.status(201).json({
            message: "Link request sent successfully",
            request: {
                ...newRequest.toObject(),
                status: newRequest.status, // Include the status in the response
            },
        });
    } catch (error) {
        console.error("Error in sendLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const acceptLinkRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { adminId } = req.query;
        const userId = req.user._id;

        console.log("🎯 acceptLinkRequest - SubAdmin hierarchy check:");
        console.log("  Current user (SubAdmin):", userId);
        console.log("  adminId from query:", adminId);
        console.log("  Request ID:", requestId);

        const request = await LinkRequest.findById(requestId)
            .populate("sender", "name email username location profilePicture headline")
            .populate("recipient", "name username location profilePicture headline");

        if (!request) {
            return res.status(404).json({ message: "Link request not found" });
        }

        // Determine the target admin - use adminId if provided (for SubAdmin actions), otherwise current user
        const targetAdminId = adminId || userId;
        console.log("  Final target admin ID:", targetAdminId);

        if (request.recipient._id.toString() !== targetAdminId.toString()) {
            console.log("  Authorization check failed - request recipient:", request.recipient._id.toString(), "vs target admin:", targetAdminId.toString());
            return res.status(403).json({ message: "Not authorized to accept this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        // Set the status to 'accepted' after all validations
        request.status = "accepted";
        await request.save();

        // Update links for both users - use target admin ID for the recipient
        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { Links: targetAdminId } });
        await User.findByIdAndUpdate(targetAdminId, { $addToSet: { Links: request.sender._id } });

        console.log("  Link request accepted successfully for admin:", targetAdminId);

        // Send acceptance email
        try {
            const profileUrl = `${process.env.CLIENT_URL}/profile/${req.user.username}`;
            await sendLinkAcceptedEmail(
                request.sender.email, 
                request.sender.name, 
                req.user.name, 
                profileUrl
            );
        } catch (emailError) {
            console.error("Error sending link acceptance email:", emailError);
            // Continue even if email fails
        }

        const notification = new Notification({
            recipient: request.sender._id,
            type: "LinkAccepted",
            relatedUser: userId,
        });

        await notification.save();

        res.json({ message: "Link accepted successfully", request });

    } catch (error) {
        console.error("Error in acceptLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const rejectLinkRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { adminId } = req.query;
        const userId = req.user._id;

        console.log("🎯 rejectLinkRequest - SubAdmin hierarchy check:");
        console.log("  Current user (SubAdmin):", userId);
        console.log("  adminId from query:", adminId);
        console.log("  Request ID:", requestId);

        const request = await LinkRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Link request not found" });
        }

        // Determine the target admin - use adminId if provided (for SubAdmin actions), otherwise current user
        const targetAdminId = adminId || userId;
        console.log("  Final target admin ID:", targetAdminId);

        if (request.recipient.toString() !== targetAdminId.toString()) {
            console.log("  Authorization check failed - request recipient:", request.recipient.toString(), "vs target admin:", targetAdminId.toString());
            return res.status(403).json({ message: "Not authorized to reject this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        request.status = "rejected";
        await request.save();

        console.log("  Link request rejected successfully for admin:", targetAdminId);

        res.json({ message: "Link request rejected", request });
    } catch (error) {
        console.error("Error in rejectLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const recipientId = req.user?._id;

        if (!recipientId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Set up pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Query with pagination including all relevant fields
        const pendingRequests = await LinkRequest.find({
            status: 'pending',
            recipient: new mongoose.Types.ObjectId(recipientId)
        })
            .select('sender recipient rollNumber batch courseName selectedCourse status createdAt updatedAt adminHierarchy requestedHierarchy hierarchyChangeReason hierarchyStatus')
            .populate('sender', 'name email location') // Assuming User model has these fields
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalCount = await LinkRequest.countDocuments({
            status: 'pending',
            recipient: new mongoose.Types.ObjectId(recipientId)
        });

        // Transform the data to include additional computed fields if needed
        const formattedRequests = pendingRequests.map(request => ({
            ...request,
            batchYear: request.batch, // For clarity in frontend
            academicDetails: {
                rollNumber: request.rollNumber,
                courseName: request.courseName,
                selectedCourse: request.selectedCourse,
                batch: request.batch
            },
            hierarchyDetails: {
                current: request.adminHierarchy,
                requested: request.requestedHierarchy,
                reason: request.hierarchyChangeReason,
                status: request.hierarchyStatus,
                displayName: request.adminHierarchy ? request.adminHierarchy.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Alumni'
            }
        }));

        res.status(200).json({
            success: true,
            data: formattedRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalRequests: totalCount,
                hasNextPage: skip + pendingRequests.length < totalCount,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error in getPendingRequests:', {
            userId: req?.user?._id,
            error: error.message
        });

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching pending requests'
        });
    }
};
export const getUserLinks = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const search = req.query.search; // Get search query
        const location = req.query.location; // Get location filter
        const company = req.query.company; // Get company filter
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Build base query
        const baseQuery = {
            $or: [{ sender: userId }, { recipient: userId }],
            status: "accepted",
        };

        // If search, company filter, or location filter is provided, use aggregation approach
        if ((search && search.trim()) || (company && company.trim()) || (location && location !== 'All Chapters')) {
            console.log('Using aggregation approach with filters:', { search, company, location });
            console.log('Company regex:', company && company.trim() ? new RegExp(company.trim(), 'i') : null);
            
            const searchRegex = search && search.trim() ? new RegExp(search.trim(), 'i') : null;
            
            // Build aggregation pipeline with search and/or company filter
            const pipeline = [
                { $match: baseQuery },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'sender',
                        foreignField: '_id',
                        as: 'senderData'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'recipient',
                        foreignField: '_id',
                        as: 'recipientData'
                    }
                },
                {
                    $unwind: '$senderData'
                },
                {
                    $unwind: '$recipientData'
                },
                {
                    $addFields: {
                        otherUser: {
                            $cond: {
                                if: { $eq: ['$sender', userId] },
                                then: '$recipientData',
                                else: '$senderData'
                            }
                        }
                    }
                },
                {
                    $match: (() => {
                        const conditions = [
                            // Only add search condition if search is provided
                            ...(searchRegex ? [{
                                $or: [
                                    { 'otherUser.name': searchRegex },
                                    { 'otherUser.username': searchRegex },
                                    { 'otherUser.email': searchRegex },
                                    { 'otherUser.location': searchRegex },
                                    { rollNumber: searchRegex },
                                    { batch: searchRegex },
                                    { courseName: searchRegex },
                                    { 'otherUser.experience': { $elemMatch: { 'company': searchRegex } } }
                                ]
                            }] : []),
                            // Add location filter if provided
                            ...(location && location !== 'All Chapters' ? [{ 'otherUser.location': location }] : []),
                            // Add company filter if provided
                            ...(company && company.trim() ? [{ 
                                'otherUser.experience': { 
                                    $elemMatch: { 
                                        'company': new RegExp(company.trim(), 'i') 
                                    } 
                                } 
                            }] : [])
                        ];
                        
                        console.log('Generated conditions:', JSON.stringify(conditions, null, 2));
                        
                        // If no conditions, return empty object (match all)
                        if (conditions.length === 0) {
                            return {};
                        }
                        
                        // If only one condition, return it directly
                        if (conditions.length === 1) {
                            return conditions[0];
                        }
                        
                        // Multiple conditions, use $and
                        return { $and: conditions };
                    })()
                },
                { $sort: sortOptions }
            ];

            // Get total count
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await LinkRequest.aggregate(countPipeline);
            const totalCount = countResult.length > 0 ? countResult[0].total : 0;

            // Add pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            // Execute aggregation
            const linkRequests = await LinkRequest.aggregate(pipeline);

            // Transform data
            const transformedLinks = linkRequests.map((request) => {
                const otherUser = request.otherUser;
                
                return {
                    _id: request._id,
                    connection: request.sender.equals(userId) ? "sent" : "received",
                    user: otherUser,
                    name: otherUser.name,
                    username: otherUser.username,
                    location: otherUser.location,
                    profilePicture: otherUser.profilePicture,
                    headline: otherUser.headline,
                    skills: otherUser.skills,
                    experience: otherUser.experience,
                    education: otherUser.education,
                    rollNumber: request.rollNumber,
                    batch: request.batch,
                    courseName: request.courseName,
                    selectedCourse: request.selectedCourse,
                    adminHierarchy: request.adminHierarchy,
                    status: request.status,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt,
                };
            });

            const totalPages = Math.ceil(totalCount / limit);

            // Set pagination headers
            res.set('X-Total-Count', totalCount.toString());
            res.set('X-Total-Pages', totalPages.toString());
            res.set('X-Current-Page', page.toString());
            res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page');

            return res.json(transformedLinks);
        }

        // Handle location filtering when no search is provided
        if (location && location !== 'All Chapters') {
            // Use aggregation pipeline for location filtering
            const pipeline = [
                { $match: baseQuery },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'sender',
                        foreignField: '_id',
                        as: 'senderData'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'recipient',
                        foreignField: '_id',
                        as: 'recipientData'
                    }
                },
                {
                    $unwind: '$senderData'
                },
                {
                    $unwind: '$recipientData'
                },
                {
                    $addFields: {
                        otherUser: {
                            $cond: {
                                if: { $eq: ['$sender', userId] },
                                then: '$recipientData',
                                else: '$senderData'
                            }
                        }
                    }
                },
                {
                    $match: {
                        'otherUser.location': location
                    }
                },
                { $sort: sortOptions }
            ];

            // Get total count
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await LinkRequest.aggregate(countPipeline);
            const totalCount = countResult.length > 0 ? countResult[0].total : 0;

            // Add pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            // Execute aggregation
            const linkRequests = await LinkRequest.aggregate(pipeline);

            // Transform data
            const transformedLinks = linkRequests.map((request) => {
                const otherUser = request.otherUser;
                
                return {
                    _id: request._id,
                    connection: request.sender.equals(userId) ? "sent" : "received",
                    user: otherUser,
                    name: otherUser.name,
                    username: otherUser.username,
                    location: otherUser.location,
                    profilePicture: otherUser.profilePicture,
                    headline: otherUser.headline,
                    skills: otherUser.skills,
                    experience: otherUser.experience,
                    education: otherUser.education,
                    rollNumber: request.rollNumber,
                    batch: request.batch,
                    courseName: request.courseName,
                    status: request.status,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt,
                };
            });

            const totalPages = Math.ceil(totalCount / limit);

            // Set pagination headers
            res.set('X-Total-Count', totalCount.toString());
            res.set('X-Total-Pages', totalPages.toString());
            res.set('X-Current-Page', page.toString());
            res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page');

            return res.json(transformedLinks);
        }

        // No search and no location filter - use simpler query
        const totalCount = await LinkRequest.countDocuments(baseQuery);
        
        // Fetch all accepted link requests with pagination
        const linkRequests = await LinkRequest.find(baseQuery)
            .populate("sender", "name username location profilePicture headline skills experience education")
            .populate("recipient", "name username location profilePicture headline skills experience education")
            .select("sender recipient rollNumber batch courseName selectedCourse adminHierarchy status createdAt updatedAt")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        if (!linkRequests || linkRequests.length === 0) {
            const totalPages = Math.ceil(totalCount / limit);
            
            // Set pagination headers even for empty results
            res.set('X-Total-Count', totalCount.toString());
            res.set('X-Total-Pages', totalPages.toString());
            res.set('X-Current-Page', page.toString());
            res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page');
            
            return res.status(404).json({ 
                success: false, 
                message: "No links found",
                pagination: {
                    totalCount,
                    totalPages,
                    currentPage: page,
                    pageSize: limit
                }
            });
        }

        // Transform data
        const transformedLinks = linkRequests
            .filter((request) => request.sender && request.recipient) // Ensure sender and recipient exist
            .map((request) => {
                const otherUser = request.sender._id.equals(userId) 
                  ? request.recipient 
                  : request.sender;
                
                return {
                    _id: request._id,
                    connection: request.sender._id.equals(userId) ? "sent" : "received",
                    user: otherUser,
                    name: otherUser.name,
                    username: otherUser.username,
                    location: otherUser.location,
                    profilePicture: otherUser.profilePicture,
                    headline: otherUser.headline,
                    skills: otherUser.skills,
                    experience: otherUser.experience,
                    education: otherUser.education,
                    rollNumber: request.rollNumber,
                    batch: request.batch,
                    courseName: request.courseName,
                    selectedCourse: request.selectedCourse,
                    adminHierarchy: request.adminHierarchy,
                    status: request.status,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt,
                };
            });

        const totalPages = Math.ceil(totalCount / limit);

        // Set pagination headers
        res.set('X-Total-Count', totalCount.toString());
        res.set('X-Total-Pages', totalPages.toString());
        res.set('X-Current-Page', page.toString());
        res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page');

        res.json(transformedLinks);
    } catch (error) {
        console.error("Error in getUserLinks controller:", error.message, error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user links",
            error: error.message,
        });
    }
};

export const getRejectedLinks = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find all link requests where the user is either the sender or recipient and the status is 'rejected'
        const linkRequests = await LinkRequest.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ],
            status: 'rejected' // Only fetch link requests with status 'rejected'
        })
        .populate('sender', 'name username location profilePicture headline')
        .populate('recipient', 'name username location profilePicture headline')
        .select('sender recipient rollNumber batch courseName selectedCourse adminHierarchy status createdAt updatedAt')
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

        const totalItems = await LinkRequest.countDocuments({
            $or: [
                { sender: userId },
                { recipient: userId }
            ],
            status: 'rejected'
        });

        const totalPages = Math.ceil(totalItems / limit);

        // Transform the data to include connection type (sent/received)
        const transformedLinks = linkRequests.map(request => ({
            _id: request._id,
            connection: request.sender._id.equals(userId) ? 'sent' : 'received',
            user: request.sender._id.equals(userId) ? request.recipient : request.sender,
            rollNumber: request.rollNumber,
            batch: request.batch,
            courseName: request.courseName,
            selectedCourse: request.selectedCourse,
            adminHierarchy: request.adminHierarchy,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        }));

        res.json({
            success: true,
            data: transformedLinks,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error in getRejectedLinks controller:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch rejected links",
            error: error.message 
        });
    }
};
export const removeLink = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, { $pull: { Links: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { Links: myId } });

        res.json({ message: "Link removed successfully" });
    } catch (error) {
        console.error("Error in removeLink controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getLinkstatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        // Fetch the target user to get their basic info
        const targetUser = await User.findById(targetUserId).select("adminHierarchy name username");
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Try to get the most recent hierarchy from LinkRequest documents
        // Check if this user has any LinkRequest (as sender OR recipient) with a hierarchy
        const userLinkRequest = await LinkRequest.findOne({
            $or: [
                { sender: targetUserId },
                { recipient: targetUserId }
            ],
            status: "accepted",
            adminHierarchy: { $exists: true, $ne: null }
        }).select("adminHierarchy sender recipient").sort({ updatedAt: -1 });

        // Use hierarchy from LinkRequest if available, otherwise from User document
        const actualHierarchy = userLinkRequest?.adminHierarchy || targetUser.adminHierarchy || "alumni";

        console.log(`🔍 Fetching hierarchy for user ${targetUser.username}:`, {
            userId: targetUserId,
            userDocHierarchy: targetUser.adminHierarchy,
            linkRequestHierarchy: userLinkRequest?.adminHierarchy,
            linkRequestDetails: userLinkRequest ? {
                sender: userLinkRequest.sender,
                recipient: userLinkRequest.recipient,
                adminHierarchy: userLinkRequest.adminHierarchy
            } : null,
            finalHierarchy: actualHierarchy
        });

        const currentUser = req.user;
        if (currentUser.Links.includes(targetUserId)) {
            return res.json({ 
                status: "Linked", 
                adminHierarchy: actualHierarchy
            });
        }

        const pendingRequest = await LinkRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId },
            ],
            status: "pending",
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ 
                    status: "pending", 
                    adminHierarchy: actualHierarchy
                });
            } else {
                return res.json({ 
                    status: "received", 
                    requestId: pendingRequest._id,
                    adminHierarchy: actualHierarchy
                });
            }
        }

        // if no Link or pending req found
        res.json({ 
            status: "not_Linked",
            adminHierarchy: actualHierarchy
        });
    } catch (error) {
        console.error("Error in getLinkstatus controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getUsersLinks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    const search = req.query.search ? req.query.search.trim() : '';
    const location = req.query.location ? req.query.location.trim() : '';
    const skill = req.query.skill ? req.query.skill.trim() : '';
    const company = req.query.company ? req.query.company.trim() : '';
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch all links for the user
    const user = await User.findById(userId).populate({
      path: "Links",
      select: "name username profilePicture location skills experience education batch courseName",
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Filter links array in-memory (for moderate dataset size)
    let filteredLinks = user.Links;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLinks = filteredLinks.filter(link =>
        (link.name && link.name.toLowerCase().includes(searchLower)) ||
        (link.username && link.username.toLowerCase().includes(searchLower))
      );
    }
    if (location) {
      filteredLinks = filteredLinks.filter(link => link.location === location);
    }
    if (skill) {
      const skillLower = skill.toLowerCase();
      filteredLinks = filteredLinks.filter(link =>
        Array.isArray(link.skills) &&
        link.skills.some(s => s && s.toLowerCase().includes(skillLower))
      );
    }
    if (company) {
      const companyLower = company.toLowerCase();
      filteredLinks = filteredLinks.filter(link =>
        Array.isArray(link.experience) &&
        link.experience.some(exp => exp.company && exp.company.toLowerCase().includes(companyLower))
      );
    }

    // Sort filtered links
    filteredLinks = filteredLinks.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = filteredLinks.length;
    const paginatedLinks = filteredLinks.slice(skip, skip + limit);

    // Set pagination headers
    res.set('X-Total-Count', totalCount.toString());
    res.set('X-Total-Pages', Math.ceil(totalCount / limit).toString());
    res.set('X-Current-Page', page.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page');

    res.json(paginatedLinks);
  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user links",
      error: error.message,
    });
  }
};

export const resetToPending = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        // Only admin should be able to reset status
        if (req.user.role !== "admin" && req.user.role !== "AlumnLink superadmin") {
            return res.status(403).json({ message: "Not authorized to reset this request" });
        }

        const request = await LinkRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Link request not found" });
        }

        // No need to check status as admin can reset from any status

        // Set the status to 'pending'
        request.status = "pending";
        await request.save();

        // If previously accepted, remove the links between users
        if (request.status === "accepted") {
            await User.findByIdAndUpdate(request.sender, { $pull: { Links: request.recipient } });
            await User.findByIdAndUpdate(request.recipient, { $pull: { Links: request.sender } });
        }

        res.json({ message: "Link request reset to pending status", request });
    } catch (error) {
        console.error("Error in resetToPending:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { timeframe } = req.query;
        
        // Calculate date range based on timeframe
        let dateFilter = {};
        const now = new Date();
        
        switch (timeframe) {
            case 'today':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                    }
                };
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
                weekStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: weekStart,
                        $lt: now
                    }
                };
                break;
            case 'month':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                    }
                };
                break;
            case 'year':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), 0, 1),
                        $lt: new Date(now.getFullYear() + 1, 0, 1)
                    }
                };
                break;
            case 'all':
            default:
                // No date filter for 'all' timeframe
                dateFilter = {};
                break;
        }
        
        // Build queries with date filter
        const baseQueries = {
            pending: {
                status: 'pending',
                recipient: userId,
                ...dateFilter
            },
            accepted: {
                $or: [{ sender: userId }, { recipient: userId }],
                status: "accepted",
                ...dateFilter
            },
            rejected: {
                $or: [{ sender: userId }, { recipient: userId }],
                status: "rejected",
                ...dateFilter
            }
        };
        
        // Run all queries in parallel for better performance
        const [pendingCount, acceptedCount, rejectedCount] = await Promise.all([
            LinkRequest.countDocuments(baseQueries.pending),
            LinkRequest.countDocuments(baseQueries.accepted),
            LinkRequest.countDocuments(baseQueries.rejected)
        ]);
        
        // Format the data for the dashboard
        const dashboardData = {
            totalRequests: pendingCount + acceptedCount + rejectedCount,
            stats: [
                { name: "Pending", value: pendingCount, status: "pending" },
                { name: "Accepted", value: acceptedCount, status: "accepted" },
                { name: "Rejected", value: rejectedCount, status: "rejected" }
            ]
        };
        
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch dashboard statistics",
            error: error.message 
        });
    }
};

// New Hierarchy Management Functions

export const approveHierarchyUpgrade = async (req, res) => {
    try {
        const { linkRequestId } = req.params;
        const { approved, newHierarchy } = req.body;
        const adminId = req.user._id;

        // Check if user is admin
        if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Only admins can approve hierarchy changes" });
        }

        // Find the link request with populated sender
        const linkRequest = await LinkRequest.findById(linkRequestId)
            .populate("sender", "adminHierarchy")
            .populate("recipient", "adminType");

        if (!linkRequest) {
            return res.status(404).json({ message: "Link request not found" });
        }

        if (!newHierarchy) {
            return res.status(400).json({ message: "No hierarchy level specified" });
        }

        // Get admin's current hierarchy level
        const adminUser = await User.findById(adminId);
        const adminType = adminUser.adminType;
        const adminHierarchy = adminUser.adminHierarchy || "institute_management"; // Default to highest level for admins

        // Check if admin can grant the requested hierarchy
        if (!canGrantHierarchy(adminType, adminHierarchy, newHierarchy)) {
            return res.status(403).json({ 
                message: "You don't have sufficient privileges to grant this hierarchy level" 
            });
        }

        if (approved) {
            // Simply update the hierarchy
            linkRequest.adminHierarchy = newHierarchy;
            await linkRequest.save();

            // Create notification for the user
            const notification = new Notification({
                recipient: linkRequest.sender._id,
                type: "HierarchyApproved",
                relatedUser: adminId,
                message: `Your hierarchy has been updated to ${newHierarchy}`
            });
            await notification.save();

            res.json({ 
                message: "Hierarchy upgrade approved successfully", 
                linkRequest 
            });
        } else {
            // Reject the hierarchy change
            linkRequest.hierarchyStatus = "hierarchy_rejected";
            linkRequest.approvedBy = adminId;

            // Create notification for the user
            const notification = new Notification({
                recipient: linkRequest.sender._id,
                type: "HierarchyRejected", 
                relatedUser: adminId,
                message: `Your hierarchy upgrade request has been rejected`
            });
            await notification.save();

            res.json({ 
                message: "Hierarchy upgrade rejected", 
                linkRequest 
            });
        }

        await linkRequest.save();

    } catch (error) {
        console.error("Error in approveHierarchyUpgrade:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getHierarchyRequests = async (req, res) => {
    try {
        const adminId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if user is admin
        if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Only admins can view hierarchy requests" });
        }

        // Get admin's type to filter relevant requests
        const adminUser = await User.findById(adminId);
        const adminType = adminUser.adminType;

        // Get appropriate hierarchy levels for this admin type
        const relevantHierarchies = HIERARCHY_LEVELS[adminType] || [];

        // Find pending hierarchy requests
        const hierarchyRequests = await LinkRequest.find({
            hierarchyStatus: "pending_hierarchy",
            requestedHierarchy: { $in: relevantHierarchies }
        })
        .populate("sender", "name email username profilePicture")
        .populate("recipient", "name email username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalCount = await LinkRequest.countDocuments({
            hierarchyStatus: "pending_hierarchy",
            requestedHierarchy: { $in: relevantHierarchies }
        });

        res.json({
            success: true,
            data: hierarchyRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalRequests: totalCount,
                hasNextPage: skip + hierarchyRequests.length < totalCount,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error in getHierarchyRequests:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAvailableHierarchies = async (req, res) => {
    try {
        const { adminType } = req.query;
        
        if (!adminType || !HIERARCHY_LEVELS[adminType]) {
            return res.status(400).json({ message: "Invalid or missing admin type" });
        }

        const hierarchies = HIERARCHY_LEVELS[adminType].map((level, index) => ({
            level,
            index,
            displayName: level.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        }));

        res.json({
            success: true,
            adminType,
            hierarchies
        });

    } catch (error) {
        console.error("Error in getAvailableHierarchies:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Temporary function to fix admin hierarchies
export const fixAdminHierarchies = async (req, res) => {
    try {
        // Only allow superadmin to run this
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Only superadmin can run this operation" });
        }

        const updates = [];

        // Update institute admins
        const instituteUpdate = await User.updateMany(
            { role: "admin", adminType: "institute", adminHierarchy: { $exists: false } },
            { $set: { adminHierarchy: "institute_management" } }
        );
        updates.push({ type: "institute", count: instituteUpdate.modifiedCount });

        // Update school admins
        const schoolUpdate = await User.updateMany(
            { role: "admin", adminType: "school", adminHierarchy: { $exists: false } },
            { $set: { adminHierarchy: "school_management" } }
        );
        updates.push({ type: "school", count: schoolUpdate.modifiedCount });

        // Update corporate admins
        const corporateUpdate = await User.updateMany(
            { role: "admin", adminType: "corporate", adminHierarchy: { $exists: false } },
            { $set: { adminHierarchy: "corporate_management" } }
        );
        updates.push({ type: "corporate", count: corporateUpdate.modifiedCount });

        res.json({
            success: true,
            message: "Admin hierarchies updated successfully",
            updates
        });

    } catch (error) {
        console.error("Error fixing admin hierarchies:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get current user's hierarchy from their most recent LinkRequest
export const getCurrentUserHierarchy = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Get user basic info
        const user = await User.findById(currentUserId).select("name username adminHierarchy");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the most recent LinkRequest where this user is either sender or recipient
        // and the request has been accepted (meaning they have established hierarchy)
        // Sort by hierarchy priority first, then by updatedAt
        const hierarchyPriority = {
            'institute_management': 1, 'school_management': 1, 'corporate_management': 1,
            'hod': 2, 'school_hod': 2, 'manager': 2, 'director': 2,
            'faculty': 3, 'school_faculty': 3, 'team_lead': 3,
            'alumni': 4, 'student': 4, 'employee': 4
        };

        // Get all LinkRequests for this user
        const allUserLinkRequests = await LinkRequest.find({
            $or: [
                { sender: currentUserId },
                { recipient: currentUserId }
            ],
            status: "accepted",
            adminHierarchy: { $exists: true, $ne: null }
        }).select("adminHierarchy sender recipient status updatedAt").sort({ updatedAt: -1 });

        console.log(`🔍 Found ${allUserLinkRequests.length} LinkRequests for user:`, 
            allUserLinkRequests.map(req => ({
                id: req._id,
                adminHierarchy: req.adminHierarchy,
                sender: req.sender,
                recipient: req.recipient,
                updatedAt: req.updatedAt
            }))
        );

        // Find the one with highest hierarchy (lowest priority number)
        const userLinkRequest = allUserLinkRequests.reduce((best, current) => {
            if (!best) return current;
            const bestPriority = hierarchyPriority[best.adminHierarchy] || 999;
            const currentPriority = hierarchyPriority[current.adminHierarchy] || 999;
            return currentPriority < bestPriority ? current : best;
        }, null);

        // Use hierarchy from LinkRequest if available, otherwise from User document
        const actualHierarchy = userLinkRequest?.adminHierarchy || user.adminHierarchy || "alumni";

        console.log(`🔍 Getting hierarchy for current user ${user.username}:`, {
            userId: currentUserId,
            userDocHierarchy: user.adminHierarchy,
            selectedLinkRequest: userLinkRequest ? {
                id: userLinkRequest._id,
                adminHierarchy: userLinkRequest.adminHierarchy,
                sender: userLinkRequest.sender,
                recipient: userLinkRequest.recipient,
                status: userLinkRequest.status
            } : null,
            finalHierarchy: actualHierarchy,
            totalLinkRequestsFound: allUserLinkRequests.length
        });

        res.json({
            success: true,
            adminHierarchy: actualHierarchy,
            source: userLinkRequest ? 'linkRequest' : 'userDocument',
            user: {
                name: user.name,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Error in getCurrentUserHierarchy:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get dashboard stats for SubAdmin (shows stats for users in their network/domain)
export const getSubAdminDashboardStats = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { timeframe, adminId } = req.query;
        
        // Use target admin ID if provided, otherwise use current user ID
        const targetAdminId = adminId || currentUserId;
        
        console.log(`📊 Getting SubAdmin dashboard stats for target admin: ${targetAdminId} (requested by: ${currentUserId})`);
        
        // Calculate date range based on timeframe
        let dateFilter = {};
        const now = new Date();
        
        switch (timeframe) {
            case 'today':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                    }
                };
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: weekStart,
                        $lt: now
                    }
                };
                break;
            case 'month':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                    }
                };
                break;
            case 'year':
                dateFilter = {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), 0, 1),
                        $lt: new Date(now.getFullYear() + 1, 0, 1)
                    }
                };
                break;
            case 'all':
            default:
                dateFilter = {};
                break;
        }

        // Build queries for SubAdmin - show ONLY requests sent TO the target admin
        // This shows what requests people are sending to the TARGET admin specifically
        const baseQueries = {
            pending: {
                status: 'pending',
                recipient: targetAdminId, // Only requests TO the target admin
                ...dateFilter
            },
            accepted: {
                status: "accepted",
                recipient: targetAdminId, // Only requests TO the target admin
                ...dateFilter
            },
            rejected: {
                status: "rejected",
                recipient: targetAdminId, // Only requests TO the target admin
                ...dateFilter
            }
        };

        // Execute all queries in parallel
        const [pendingStats, acceptedStats, rejectedStats] = await Promise.all([
            LinkRequest.find(baseQueries.pending),
            LinkRequest.find(baseQueries.accepted),
            LinkRequest.find(baseQueries.rejected)
        ]);

        // Calculate summary statistics
        const stats = {
            total: pendingStats.length + acceptedStats.length + rejectedStats.length,
            pending: pendingStats.length,
            accepted: acceptedStats.length,
            rejected: rejectedStats.length,
            recentActivity: {
                pending: pendingStats.slice(0, 5).map(req => ({
                    id: req._id,
                    senderName: req.senderName || 'Unknown',
                    recipientName: req.recipientName || 'Unknown',
                    createdAt: req.createdAt,
                    rollNumber: req.rollNumber,
                    batch: req.batch,
                    courseName: req.courseName
                })),
                accepted: acceptedStats.slice(0, 5).map(req => ({
                    id: req._id,
                    senderName: req.senderName || 'Unknown',
                    recipientName: req.recipientName || 'Unknown',
                    updatedAt: req.updatedAt,
                    adminHierarchy: req.adminHierarchy
                })),
                rejected: rejectedStats.slice(0, 5).map(req => ({
                    id: req._id,
                    senderName: req.senderName || 'Unknown',
                    recipientName: req.recipientName || 'Unknown',
                    updatedAt: req.updatedAt
                }))
            }
        };

        console.log(`📊 SubAdmin dashboard stats for admin ${adminId}:`, {
            totalRequests: stats.total,
            pending: stats.pending,
            accepted: stats.accepted,
            rejected: stats.rejected,
            timeframe
        });

        res.json({
            success: true,
            stats,
            timeframe: timeframe || 'all',
            adminInfo: {
                adminId: adminId,
                message: 'Showing requests sent TO this admin specifically'
            }
        });

    } catch (error) {
        console.error("Error in getSubAdminDashboardStats:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get pending link requests for SubAdmin - requests sent TO this specific admin
export const getSubAdminPendingRequests = async (req, res) => {
    try {
        const currentUserId = req.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get target admin ID from query params or use current user ID
        const targetAdminId = req.query.adminId || currentUserId;

        console.log(`📋 Getting pending requests for target admin: ${targetAdminId} (requested by: ${currentUserId})`);

        // Set up pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Find pending requests where recipient is the TARGET admin
        // This shows all requests sent TO the target admin only
        const pendingRequests = await LinkRequest.find({
            status: 'pending',
            recipient: targetAdminId // Only requests TO the target admin
        })
            .select('sender recipient rollNumber batch courseName selectedCourse status createdAt updatedAt adminHierarchy requestedHierarchy hierarchyChangeReason hierarchyStatus')
            .populate('sender', 'name email location profilePicture headline')
            .populate('recipient', 'name email location profilePicture headline')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalCount = await LinkRequest.countDocuments({
            status: 'pending',
            recipient: targetAdminId
        });

        // Transform the data to include additional computed fields
        const formattedRequests = pendingRequests.map(request => ({
            ...request,
            batchYear: request.batch,
            // Focus on sender info (who is requesting to connect)
            senderInfo: {
                name: request.sender?.name,
                email: request.sender?.email,
                location: request.sender?.location,
                profilePicture: request.sender?.profilePicture,
                headline: request.sender?.headline
            },
            // Recipient info (user in SubAdmin's network)
            recipientInfo: {
                name: request.recipient?.name,
                email: request.recipient?.email,
                location: request.recipient?.location,
                profilePicture: request.recipient?.profilePicture,
                headline: request.recipient?.headline
            },
            academicDetails: {
                rollNumber: request.rollNumber,
                courseName: request.courseName,
                selectedCourse: request.selectedCourse,
                batch: request.batch
            },
            hierarchyDetails: {
                current: request.adminHierarchy,
                requested: request.requestedHierarchy,
                reason: request.hierarchyChangeReason,
                status: request.hierarchyStatus,
                displayName: request.adminHierarchy ? request.adminHierarchy.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Alumni'
            }
        }));

        res.status(200).json({
            success: true,
            data: formattedRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalRequests: totalCount,
                hasNextPage: skip + pendingRequests.length < totalCount,
                hasPreviousPage: page > 1
            },
            networkInfo: {
                adminId: targetAdminId,
                requestsToThisAdmin: totalCount,
                message: 'Showing requests sent TO this admin specifically'
            }
        });

    } catch (error) {
        console.error("Error in getSubAdminPendingRequests:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get rejected link requests for SubAdmin - requests sent TO the target admin
export const getSubAdminRejectedRequests = async (req, res) => {
    try {
        const currentUserId = req.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get target admin ID from query params or use current user ID
        const targetAdminId = req.query.adminId || currentUserId;

        console.log(`🚫 Getting rejected requests for target admin: ${targetAdminId} (requested by: ${currentUserId})`);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find rejected requests where recipient is the TARGET admin
        // This shows all rejected requests sent TO the target admin only
        const rejectedRequests = await LinkRequest.find({
            status: 'rejected',
            recipient: targetAdminId // Only requests TO the target admin
        })
            .populate('sender', 'name username location profilePicture headline email')
            .populate('recipient', 'name username location profilePicture headline email')
            .select('sender recipient rollNumber batch courseName selectedCourse adminHierarchy status createdAt updatedAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalItems = await LinkRequest.countDocuments({
            status: 'rejected',
            recipient: targetAdminId
        });

        // Transform the data to include connection type and better structure
        const transformedLinks = rejectedRequests.map(request => ({
            _id: request._id,
            connection: 'rejected_by_this_admin', // These are requests rejected by this specific admin
            // Sender info (who made the request TO this admin)
            senderInfo: {
                id: request.sender?._id,
                name: request.sender?.name,
                username: request.sender?.username,
                location: request.sender?.location,
                profilePicture: request.sender?.profilePicture,
                headline: request.sender?.headline,
                email: request.sender?.email
            },
            // Recipient info (this admin)
            recipientInfo: {
                id: request.recipient?._id,
                name: request.recipient?.name,
                username: request.recipient?.username,
                location: request.recipient?.location,
                profilePicture: request.recipient?.profilePicture,
                headline: request.recipient?.headline,
                email: request.recipient?.email
            },
            // Legacy fields for compatibility
            user: request.sender,
            recipient: request.recipient,
            rollNumber: request.rollNumber,
            batch: request.batch,
            courseName: request.courseName,
            selectedCourse: request.selectedCourse,
            adminHierarchy: request.adminHierarchy,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        }));

        res.json({
            success: true,
            data: transformedLinks,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            networkInfo: {
                adminId: adminId,
                rejectedByThisAdmin: totalItems,
                message: 'Showing rejected requests sent TO this admin specifically'
            }
        });

    } catch (error) {
        console.error("Error in getSubAdminRejectedRequests:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get accepted/connected alumni for SubAdmin - users accepted BY this specific admin
export const getSubAdminManagedAlumni = async (req, res) => {
    try {
        const currentUserId = req.user?._id;
        
        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get target admin ID from query params (for SubAdmin functionality) or use current user ID
        const targetAdminId = req.query.adminId || currentUserId;
        
        console.log(`👥 Getting managed alumni for target admin: ${targetAdminId} (requested by: ${currentUserId})`);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';

        // Find accepted requests where recipient is the TARGET admin
        // This shows all users that the TARGET admin has accepted and given access to
        let query = {
            status: 'accepted',
            recipient: targetAdminId // Use target admin ID instead of current user ID
        };

        // Add search functionality
        if (searchTerm) {
            query.$or = [
                { rollNumber: { $regex: searchTerm, $options: 'i' } },
                { courseName: { $regex: searchTerm, $options: 'i' } },
                { batch: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const acceptedConnections = await LinkRequest.find(query)
            .populate('sender', 'name username email location profilePicture headline adminHierarchy')
            .populate('recipient', 'name username email location profilePicture headline adminHierarchy')
            .select('sender recipient rollNumber batch courseName selectedCourse adminHierarchy status createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalItems = await LinkRequest.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        // Transform the data to focus on the users that THIS admin gave access to
        const transformedConnections = acceptedConnections.map(connection => ({
            _id: connection._id,
            connectionType: 'accepted_by_this_admin',
            // Sender info (who THIS admin accepted and gave access to)
            alumniInfo: {
                id: connection.sender?._id,
                name: connection.sender?.name,
                username: connection.sender?.username,
                email: connection.sender?.email,
                location: connection.sender?.location,
                profilePicture: connection.sender?.profilePicture,
                headline: connection.sender?.headline,
                adminHierarchy: connection.sender?.adminHierarchy
            },
            // Recipient info (this admin who gave the access)
            adminInfo: {
                id: connection.recipient?._id,
                name: connection.recipient?.name,
                username: connection.recipient?.username,
                email: connection.recipient?.email,
                location: connection.recipient?.location,
                profilePicture: connection.recipient?.profilePicture,
                headline: connection.recipient?.headline,
                adminHierarchy: connection.recipient?.adminHierarchy
            },
            academicDetails: {
                rollNumber: connection.rollNumber,
                batch: connection.batch,
                courseName: connection.courseName,
                selectedCourse: connection.selectedCourse
            },
            connectionDetails: {
                status: connection.status,
                connectedAt: connection.updatedAt,
                requestedAt: connection.createdAt,
                adminHierarchy: connection.adminHierarchy
            },
            // Legacy fields for compatibility
            sender: connection.sender,
            recipient: connection.recipient,
            rollNumber: connection.rollNumber,
            batch: connection.batch,
            courseName: connection.courseName,
            selectedCourse: connection.selectedCourse,
            status: connection.status,
            createdAt: connection.createdAt,
            updatedAt: connection.updatedAt
        }));

        res.json({
            success: true,
            data: transformedConnections,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            adminInfo: {
                targetAdminId: targetAdminId,
                currentUserId: currentUserId,
                usersGivenAccess: totalItems,
                message: `Showing users that admin ${targetAdminId} has accepted and given access to`
            }
        });

    } catch (error) {
        console.error("Error in getSubAdminManagedAlumni:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

