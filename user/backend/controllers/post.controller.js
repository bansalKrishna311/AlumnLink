import cloudinary from "../lib/cloudinary.js";
import { uploadToSpaces, uploadBase64ToSpaces } from "../lib/digitalocean.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { 
    sendCommentNotificationEmail,
    sendLikeNotificationEmail,
    sendReplyNotificationEmail,
    sendMentionNotificationEmail,
    sendPostStatusNotificationEmail
} from "../emails/emailHandlers.js";
import cacheCleanupService from "../utils/cache-cleanup.js";

// Cache for frequently accessed data
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Register cache with cleanup service
cacheCleanupService.registerCache('postUserCache', userCache, 100, CACHE_TTL);

// Helper function to get user from cache or database
const getCachedUser = async (userId) => {
  const cacheKey = userId.toString();
  const cached = userCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }
  
  const user = await User.findById(userId).select('_id name username email profilePicture headline isAdmin').lean();
  
  if (user) {
    userCache.set(cacheKey, { user, timestamp: Date.now() });
    
    // Clean cache if it gets too large
    if (userCache.size > 100) {
      const firstKey = userCache.keys().next().value;
      userCache.delete(firstKey);
    }
  }
  
  return user;
};

// Helper function to extract mentions from content - OPTIMIZED
const extractMentions = async (content) => {
  if (!content || typeof content !== 'string') return [];
  
  const usernames = [];
  const mentions = [];
  
  // More efficient regex patterns
  const patterns = [
    /@\[([^\]]+)\]\(([^)]+)\)/g, // Old format
    /@(\w+)/g // New format
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const username = match[1];
      if (username && !usernames.includes(username)) {
        usernames.push(username);
      }
    }
  }
  
  if (usernames.length === 0) return [];
  
  try {
    // Use lean() for better performance
    const users = await User.find({ 
      username: { $in: usernames } 
    }).select('_id username name').lean();
    
    users.forEach(user => {
      mentions.push({
        username: user.username,
        userId: user._id.toString(),
        name: user.name
      });
    });
  } catch (error) {
    console.error('Error looking up mentioned users:', error);
  }
  
  return mentions;
};

// Fetch posts for the user's feed - OPTIMIZED
export const getFeedPosts = async (req, res) => {
    try {
        // Use pagination to reduce memory usage
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 20); // Max 20 posts
        const skip = (page - 1) * limit;

        // Get the user's ID and linked user IDs
        const userIds = [...req.user.Links, req.user._id];

        // Use lean() for better performance and less memory usage
        const posts = await Post.find({
            $or: [
                { author: { $in: userIds } },
                { links: { $in: userIds } }
            ],
            status: "approved"
        })
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture username headline")
        .populate("reactions.user", "name username profilePicture headline")
        .populate("adminId", "name username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean for better performance

        res.status(200).json({
            posts,
            pagination: {
                currentPage: page,
                hasMore: posts.length === limit
            }
        });
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a post - OPTIMIZED FOR PERFORMANCE
export const createPost = async (req, res) => {
  const requestStartTime = Date.now();
  
  try {
    const { content, type, links, images: imagesFromBody, jobDetails, internshipDetails, eventDetails } = req.body;
    const userId = req.user.id;

    // Extract hashtags more efficiently
    const hashtags = [...new Set((content.match(/#(\w+)/g) || []).map(tag => tag.slice(1).toLowerCase()))];
    
    // Create the post object
    const postData = {
      content,
      author: userId,
      type: type || "discussion",
      hashtags,
      images: [],
      links: links && links.length > 0 ? links : undefined
    };

    // Handle image uploads efficiently
    try {
      if (req.files && req.files.length > 0) {
        console.log(`� Uploading ${req.files.length} files...`);
        
        // Limit concurrent uploads to prevent memory spikes
        const uploadPromises = req.files.slice(0, 5).map(file => 
          uploadToSpaces(file.buffer, file.originalname, file.mimetype, 'posts')
        );
        
        postData.images = await Promise.all(uploadPromises);
        console.log(`✅ Images uploaded successfully`);
        
      } else if (imagesFromBody && Array.isArray(imagesFromBody) && imagesFromBody.length > 0) {
        console.log(`� Uploading ${imagesFromBody.length} base64 images...`);
        
        // Limit and process base64 images
        const uploadPromises = imagesFromBody.slice(0, 5).map(img => 
          uploadBase64ToSpaces(img, 'posts')
        );
        
        postData.images = await Promise.all(uploadPromises);
        console.log(`✅ Base64 images uploaded successfully`);
      }
    } catch (error) {
      console.error("❌ Error uploading images:", error);
      return res.status(500).json({ 
        message: "Error uploading images", 
        error: error.message 
      });
    }

    // Add type-specific details efficiently
    if (type === "job" && jobDetails) {
      postData.jobDetails = typeof jobDetails === 'string' ? JSON.parse(jobDetails) : jobDetails;
    } else if (type === "internship" && internshipDetails) {
      postData.internshipDetails = typeof internshipDetails === 'string' ? JSON.parse(internshipDetails) : internshipDetails;
    } else if (type === "event" && eventDetails) {
      postData.eventDetails = typeof eventDetails === 'string' ? JSON.parse(eventDetails) : eventDetails;
    }

    // Get user and determine post status
    const user = await getCachedUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    postData.status = user.isAdmin ? "approved" : "pending";

    console.log('💾 Creating post in database...');
    const post = await Post.create(postData);

    // Handle admin notifications asynchronously for non-admin users
    if (!user.isAdmin) {
      // Don't await - run in background
      process.nextTick(async () => {
        try {
          const admins = await User.find({ isAdmin: true }).select('_id').lean();
          
          if (admins.length > 0) {
            const notifications = admins.map(admin => ({
              recipient: admin._id,
              type: "post_approval",
              content: `New post from ${user.name} requires approval`,
              reference: { type: "post", id: post._id }
            }));
            
            await Notification.insertMany(notifications);
            console.log(`✅ Created ${notifications.length} admin notifications`);
          }
        } catch (notificationError) {
          console.error('⚠️ Error creating admin notifications:', notificationError);
        }
      });
    }

    const totalTime = Date.now() - requestStartTime;
    console.log(`🎉 Post creation completed in ${totalTime}ms`);
    
    return res.status(201).json({ 
      post, 
      status: postData.status,
      uploadTime: totalTime 
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the current user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete the image from Cloudinary if it exists
        if (post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a post by ID
export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
    const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")
            .populate("reactions.user", "name username profilePicture headline")
      .populate("adminId", "name username") // Populate admin who approved the post
      .lean();

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPostById controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a comment on a post
export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        // First find the post to ensure it exists
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Add the comment to the post
        const comment = {
            user: req.user._id,
            content,
            createdAt: new Date(),
            replies: []
        };

        existingPost.comments.push(comment);
        await existingPost.save();

        // Get the updated post with populated data
    const updatedPost = await Post.findById(postId)
            .populate("author", "name email username headline profilePicture")
            .populate("comments.user", "name profilePicture username headline")
            .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .lean();

        // Extract mentions from the comment
        const mentions = await extractMentions(content);

        // Create notifications
        try {
            // First create notification for post author (if not the commenter)
            if (existingPost.author.toString() !== req.user._id.toString()) {
                const newNotification = new Notification({
                    recipient: existingPost.author,
                    type: "comment",
                    relatedUser: req.user._id,
                    relatedPost: postId,
                });
                await newNotification.save();

                // Try to send notification email
                try {
                    const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
                    await sendCommentNotificationEmail(
                        updatedPost.author.email, 
                        updatedPost.author.name, 
                        req.user.name, 
                        postUrl, 
                        content
                    );
                } catch (emailError) {
                    console.error("Error sending comment notification email:", emailError);
                    // Continue execution even if email fails
                }
            }
            
            // Create notifications for mentioned users
            if (mentions.length > 0) {
                for (const mention of mentions) {
                    // Skip if mentioned user is the commenter
                    if (mention.userId === req.user._id.toString()) continue;
                    
                    const mentionNotification = new Notification({
                        recipient: mention.userId,
                        type: "mention",
                        relatedUser: req.user._id,
                        relatedPost: postId,
                    });
                    await mentionNotification.save();
                    
                    // Send email notification for mentions
                    try {
                        // Get the mentioned user information
                        const mentionedUser = await mongoose.model("User").findById(mention.userId);
                        if (mentionedUser && mentionedUser.email) {
                            const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
                            
                            await sendMentionNotificationEmail(
                                mentionedUser.email,
                                mentionedUser.name,
                                req.user.name,
                                postUrl,
                                content
                            );
                        }
                    } catch (emailError) {
                        console.error("Error sending mention notification email:", emailError);
                        // Continue execution even if email fails
                    }
                }
            }
            
        } catch (notificationError) {
            console.error("Error creating notification:", notificationError);
            // Continue execution even if notification fails
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in createComment controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a reply to a comment
export const replyToComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;

        // Find the post first
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment by ID
        const commentIndex = post.comments.findIndex(
            comment => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Get the comment
        const comment = post.comments[commentIndex];
        
        // Initialize replies array if it doesn't exist
        if (!comment.replies) {
            comment.replies = [];
        }

        // Add the reply to the comment with user details
        comment.replies.push({
            user: {
                _id: req.user._id,
                name: req.user.name,
                username: req.user.username,
                profilePicture: req.user.profilePicture,
                headline: req.user.headline
            },
            content: content,
            createdAt: new Date()
        });

        // Save the post
        await post.save();

        // Get the updated post with populated user data
        const updatedPost = await Post.findById(postId)
            .populate("author", "name email username headline profilePicture")
            .populate("comments.user", "name profilePicture username headline")
            .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .lean();
            
        // Extract mentions from reply
        const mentions = await extractMentions(content);

        // Try to create notifications, but don't let it fail the entire request
        try {
            // Create a notification for the comment owner (if it's not the same user)
            if (comment.user.toString() !== req.user._id.toString()) {
                const newNotification = new Notification({
                    recipient: comment.user,
                    type: "reply",
                    relatedUser: req.user._id,
                    relatedPost: postId,
                });
                await newNotification.save();
                
                // Send notification email for reply
                try {
                    // Get the comment author information
                    const commentAuthor = await mongoose.model("User").findById(comment.user);
                    const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
                    
                    await sendReplyNotificationEmail(
                        commentAuthor.email,
                        commentAuthor.name,
                        req.user.name,
                        postUrl,
                        content
                    );
                } catch (emailError) {
                    console.error("Error sending reply notification email:", emailError);
                    // Continue execution even if email fails
                }
            }
            
            // Create notifications for mentioned users
            if (mentions.length > 0) {
                for (const mention of mentions) {
                    // Skip if mentioned user is the replier
                    if (mention.userId === req.user._id.toString()) continue;
                    // Skip if mentioned user is the comment owner (already notified as a reply)
                    if (mention.userId === comment.user.toString()) continue;
                    
                    const mentionNotification = new Notification({
                        recipient: mention.userId,
                        type: "mention",
                        relatedUser: req.user._id,
                        relatedPost: postId,
                    });
                    await mentionNotification.save();
                    
                    // TODO: Add email notification for mentions
                }
            }
            
        } catch (notificationError) {
            console.error("Error creating reply notification:", notificationError);
            // Continue execution even if notification fails
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error in replyToComment controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const reactToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { reactionType } = req.body; // e.g., "like", "love", "sad", etc.

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find existing reaction by user
        const existingReactionIndex = post.reactions.findIndex(
            (reaction) => reaction.user.toString() === req.user._id.toString()
        );

        // Track if this is a new reaction for notification purposes
        const isNewReaction = existingReactionIndex === -1 && reactionType !== null;
        const isRemovingReaction = reactionType === null && existingReactionIndex !== -1;

        if (reactionType === null) {
            // If reactionType is null, remove the user's reaction
            if (existingReactionIndex !== -1) {
                post.reactions.splice(existingReactionIndex, 1);
                await post.save();
            }
            return res.status(200).json(post);
        }

        // Ensure reactionType is valid
        const validReactions = ["like", "love", "sad", "wow", "angry"];
        if (!validReactions.includes(reactionType.toLowerCase())) {
            return res.status(400).json({ message: "Invalid reaction type" });
        }

        if (existingReactionIndex !== -1) {
            // If the user has already reacted, update their reaction
            post.reactions[existingReactionIndex].type = reactionType;
        } else {
            // Add new reaction
            post.reactions.push({ user: req.user._id, type: reactionType });
        }

        await post.save();

        // Create notification for post author if this is a new reaction and author is not the reactor
        try {
            if (isNewReaction && post.author.toString() !== req.user._id.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like", // Using "like" type for all reactions for simplicity
                    relatedUser: req.user._id,
                    relatedPost: postId,
                });
                await newNotification.save();
                
                // Send email notification for reactions
                try {
                    // Get the post author information
                    const postAuthor = await mongoose.model("User").findById(post.author);
                    const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
                    
                    await sendLikeNotificationEmail(
                        postAuthor.email,
                        postAuthor.name,
                        req.user.name,
                        postUrl,
                        post.content
                    );
                } catch (emailError) {
                    console.error("Error sending reaction notification email:", emailError);
                    // Continue execution even if email fails
                }
            }
        } catch (notificationError) {
            console.error("Error creating reaction notification:", notificationError);
            // Continue execution even if notification fails
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in reactToPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPendingPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Extract the logged-in user's ID
        
        // Check if this is an admin request
        if (req.user.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Get all pending posts for admin
            const posts = await Post.find({ status: "pending" })
                .populate("author", "name username profilePicture headline")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalItems = await Post.countDocuments({ status: "pending" });
            const totalPages = Math.ceil(totalItems / limit);

            return res.status(200).json({
                success: true,
                data: posts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        }

        // Regular user flow - get only their linked posts
        const objectId = new mongoose.Types.ObjectId(userId);

        // Query to find posts with status "pending" where the user is in the links array
        const posts = await Post.find({
            status: "pending",
            links: { $elemMatch: { $eq: objectId } }
        })
            .populate("author", "name username profilePicture headline")
            .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No pending posts available for this user." });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getPendingPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updatePostStatus = async (req, res) => {
    try {
      const { postId } = req.params;
      const { status } = req.body;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Update the post status
      post.status = status;
      post.reviewedAt = new Date();
      
      // Save admin ID who approved the post
      if (status === 'approved') {
        post.adminId = req.user._id;
      }
      
      await post.save();
      
      // Create notification for the author based on status
      try {
        const notificationType = status === 'approved' ? "postApproved" : "postRejected";
        
        const newNotification = new Notification({
          recipient: post.author,
          type: notificationType,
          relatedUser: req.user._id, // Admin who processed the post
          relatedPost: postId,
        });
        await newNotification.save();
        
        // Send email notification for post status change
        try {
          // Get post author and admin details
          const postAuthor = await mongoose.model("User").findById(post.author);
          const admin = await mongoose.model("User").findById(req.user._id);
          const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
          
          await sendPostStatusNotificationEmail(
            postAuthor.email,
            postAuthor.name,
            admin.name,
            status,
            postUrl,
            post.content,
            null
          );
        } catch (emailError) {
          console.error(`Error sending post ${status} notification email:`, emailError);
          // Continue execution even if email fails
        }
      } catch (notificationError) {
        console.error(`Error creating post ${status} notification:`, notificationError);
        // Continue execution even if notification fails
      }
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const reviewPost = async (req, res) => {
    // Handle both parameter formats (id and postId)
    const postId = req.params.postId || req.params.id;
    const { status, feedback } = req.body;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Update the status and feedback
      post.status = status;
      if (feedback) {
        post.feedback = feedback;
      }
      
      // Add review timestamp and admin ID
      post.reviewedAt = new Date();
      if (status === 'approved') {
        post.adminId = req.user._id;
      }
      
      await post.save();
      
      // Create notification for the author based on status
      try {
        const notificationType = status === 'approved' ? "postApproved" : "postRejected";
        
        const newNotification = new Notification({
          recipient: post.author,
          type: notificationType,
          relatedUser: req.user._id, // Admin who processed the post
          relatedPost: postId,
        });
        await newNotification.save();
        
        // Send email notification for post status change
        try {
          // Get post author and admin details
          const postAuthor = await mongoose.model("User").findById(post.author);
          const admin = await mongoose.model("User").findById(req.user._id);
          const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
          
          await sendPostStatusNotificationEmail(
            postAuthor.email,
            postAuthor.name,
            admin.name,
            status,
            postUrl,
            post.content,
            feedback || null
          );
        } catch (emailError) {
          console.error(`Error sending post ${status} notification email:`, emailError);
          // Continue execution even if email fails
        }
      } catch (notificationError) {
        console.error(`Error creating post ${status} notification:`, notificationError);
        // Continue execution even if notification fails
      }
  
      res.status(200).json({ message: "Post status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update post status", error });
    }
};

export const createAdminPost = async (req, res) => {
    try {
      const { title, content, type, jobDetails, internshipDetails, eventDetails } = req.body;
      
      // Modified to use buffer data from multer's memory storage instead of file path
      const imageBuffer = req.file ? req.file.buffer : null;
  
      console.log("Received data:", { title, content, type, jobDetails, internshipDetails, eventDetails, hasImage: !!imageBuffer });
  
      let newAdminPostData = {
        author: req.user._id,
        title,
        content,
        type,
        status: "approved", // Ensure admin posts are approved by default
      };
  
      // Include details based on AdminPost type
      if (type === "job" && jobDetails) {
        newAdminPostData.jobDetails = JSON.parse(jobDetails);
      } else if (type === "internship" && internshipDetails) {
        newAdminPostData.internshipDetails = JSON.parse(internshipDetails);
      } else if (type === "event" && eventDetails) {
        newAdminPostData.eventDetails = JSON.parse(eventDetails);
      }
  
      // Upload image to DigitalOcean Spaces if provided
      if (imageBuffer) {
        // Upload directly to DigitalOcean Spaces
        const imageUrl = await uploadToSpaces(
          imageBuffer, 
          req.file.originalname, 
          req.file.mimetype, 
          'admin-posts'
        );
        newAdminPostData.image = imageUrl;
      }
  
      // Create the post
      const newAdminPost = new Post(newAdminPostData);
      await newAdminPost.save();
  
      console.log("AdminPost created successfully:", newAdminPost);
      res.status(201).json(newAdminPost);
    } catch (error) {
      console.error("Error in createAdminPost controller:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Like or unlike a comment
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];
    
    // Check if user already liked the comment
    const likeIndex = comment.likes.findIndex(
      id => id.toString() === userId.toString()
    );

    // Track if this is a new like for notification purposes
    const isAddingLike = likeIndex === -1;

    // Toggle like
    if (isAddingLike) {
      // Add like
      comment.likes.push(userId);
      
      // Create notification for comment author (if not the same user)
      try {
        if (comment.user.toString() !== userId.toString()) {
          const newNotification = new Notification({
            recipient: comment.user,
            type: "like",
            relatedUser: userId,
            relatedPost: postId,
          });
          await newNotification.save();
          
          // Send email notification for comment likes
          try {
            // Get the comment author and the post
            const commentAuthor = await mongoose.model("User").findById(comment.user);
            const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
            
            await sendLikeNotificationEmail(
              commentAuthor.email,
              commentAuthor.name,
              req.user.name,
              postUrl,
              comment.content
            );
          } catch (emailError) {
            console.error("Error sending comment like notification email:", emailError);
            // Continue execution even if email fails
          }
        }
      } catch (notificationError) {
        console.error("Error creating comment like notification:", notificationError);
        // Continue execution even if notification fails
      }
    } else {
      // Remove like
      comment.likes.splice(likeIndex, 1);
    }

    await post.save();

    // Get updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("author", "name email username headline profilePicture")
      .populate("comments.user", "name profilePicture username headline")
      .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .lean();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in likeComment controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Like or unlike a reply
export const likeReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Find the reply
    const replyIndex = post.comments[commentIndex].replies.findIndex(
      reply => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const reply = post.comments[commentIndex].replies[replyIndex];

    // Initialize likes array if it doesn't exist
    if (!reply.likes) {
      reply.likes = [];
    }

    // Check if user already liked the reply
    const likeIndex = reply.likes.findIndex(
      id => id.toString() === userId.toString()
    );

    // Track if this is a new like for notification purposes
    const isAddingLike = likeIndex === -1;

    // Toggle like
    if (isAddingLike) {
      // Add like
      reply.likes.push(userId);
      
      // Create notification for reply author (if not the same user)
      try {
        if (reply.user._id.toString() !== userId.toString()) {
          const newNotification = new Notification({
            recipient: reply.user._id,
            type: "like",
            relatedUser: userId,
            relatedPost: postId,
          });
          await newNotification.save();
          
          // Send email notification for reply likes
          try {
            // Get the reply author information
            const replyAuthor = await mongoose.model("User").findById(reply.user._id);
            const liker = await mongoose.model("User").findById(userId);
            const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
            
            await sendLikeNotificationEmail(
              replyAuthor.email,
              replyAuthor.name,
              liker.name,
              postUrl,
              reply.content
            );
          } catch (emailError) {
            console.error("Error sending reply like notification email:", emailError);
            // Continue execution even if email fails
          }
        }
      } catch (notificationError) {
        console.error("Error creating reply like notification:", notificationError);
        // Continue execution even if notification fails
      }
    } else {
      // Remove like
      reply.likes.splice(likeIndex, 1);
    }

    await post.save();

    // Get updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("author", "name email username headline profilePicture")
      .populate("comments.user", "name profilePicture username headline")
      .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in likeReply controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Bookmark or unbookmark a post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already bookmarked this post
    const bookmarkIndex = post.bookmarks.findIndex(
      id => id.toString() === userId.toString()
    );

    // Toggle bookmark status
    if (bookmarkIndex === -1) {
      // Add bookmark
      post.bookmarks.push(userId);
    } else {
      // Remove bookmark
      post.bookmarks.splice(bookmarkIndex, 1);
    }

    await post.save();

    // Return the updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("author", "name email username headline profilePicture")
      .populate("comments.user", "name profilePicture username headline")
      .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in bookmarkPost controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all bookmarked posts for the current user
export const getBookmarkedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find posts that have the user's ID in the bookmarks array
    const bookmarkedPosts = await Post.find({
      bookmarks: { $in: [userId] },
      status: "approved" // Only show approved posts
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .populate("adminId", "name username") // Populate admin who approved the post
      .sort({ createdAt: -1 });

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.error("Error in getBookmarkedPosts controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get posts by a specific user
export const getPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find the user by username first
    const user = await mongoose.model("User").findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find posts by that user
    const posts = await Post.find({
      author: user._id,
      status: "approved" // Only show approved posts
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .populate("adminId", "name username") // Populate admin who approved the post
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsByUsername controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recent posts with analytics data for admin dashboard
export const getRecentAdminPosts = async (req, res) => {
  try {
    // Get recent posts (limit to 5) - use lean for memory efficiency
    const recentPosts = await Post.find({})
      .populate("author", "name username profilePicture headline")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Compute counts efficiently
    const [totalPosts, postsThisMonthAgg] = await Promise.all([
      Post.estimatedDocumentCount(),
      (async () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return Post.countDocuments({ createdAt: { $gte: startOfMonth } });
      })()
    ]);
    const postsThisMonth = postsThisMonthAgg;

    // Engagement stats via aggregation (no full document materialization)
    const engagementAgg = await Post.aggregate([
      {
        $project: {
          type: { $ifNull: ["$type", "other"] },
          reactionCount: { $size: { $ifNull: ["$reactions", []] } },
          commentCount: { $size: { $ifNull: ["$comments", []] } }
        }
      },
      {
        $group: {
          _id: "$type",
          totalReactions: { $sum: "$reactionCount" },
          totalComments: { $sum: "$commentCount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const validTypes = ['discussion', 'job', 'internship', 'event', 'other'];
    const totals = engagementAgg.reduce((acc, row) => {
      const t = validTypes.includes(row._id) ? row._id : 'other';
      acc.byType[t] = {
        reactions: row.totalReactions,
        comments: row.totalComments,
        count: row.count
      };
      acc.totalReactions += row.totalReactions;
      acc.totalComments += row.totalComments;
      return acc;
    }, { byType: {}, totalReactions: 0, totalComments: 0 });

    // Calculate percentages and most engaged type
    const totalEngagement = totals.totalReactions + totals.totalComments;
    const engagementPercentages = {};
    let mostEngagedType = 'other';
    let highestEngagement = 0;
    validTypes.forEach(type => {
      const t = totals.byType[type] || { reactions: 0, comments: 0, count: 0 };
      const engagement = t.reactions + t.comments;
      engagementPercentages[type] = totalEngagement > 0
        ? Math.round((engagement / totalEngagement) * 100)
        : 0;
      const avg = t.count > 0 ? engagement / t.count : 0;
      if (avg > highestEngagement) {
        highestEngagement = avg;
        mostEngagedType = type;
      }
    });

    // Get top performing posts - Using aggregation
  const topPosts = await Post.aggregate([
      {
        $project: {
          _id: 1,
          author: 1,
          content: 1,
          type: 1,
          createdAt: 1,
          reactionCount: { $size: { $ifNull: ["$reactions", []] } },
          commentCount: { $size: { $ifNull: ["$comments", []] } },
          totalEngagement: {
            $add: [
              { $size: { $ifNull: ["$reactions", []] } },
              { $size: { $ifNull: ["$comments", []] } }
            ]
          }
        }
      },
      { $sort: { totalEngagement: -1 } },
      { $limit: 3 }
    ]);
    
    // Populate author data for top posts
    await Post.populate(topPosts, { path: "author", select: "name username profilePicture headline" });

    // Create monthly post distribution data
    // Monthly post distribution via single aggregation
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);
    const monthlyAgg = await Post.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    // Map aggregation to last 12 months array (fill zeros)
    const monthlyPostData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const found = monthlyAgg.find(row => row._id.year === y && row._id.month === m);
      monthlyPostData.push({
        month: d.toLocaleString('default', { month: 'short' }),
        count: found ? found.count : 0,
        isCurrent: i === 0
      });
    }

    // Calculate weekly growth rate
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const [postsLastWeek, postsPreviousWeek] = await Promise.all([
      Post.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Post.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } })
    ]);
    
    // Calculate growth percentage
    let weeklyGrowthRate = 0;
    if (postsPreviousWeek > 0) {
      weeklyGrowthRate = Math.round(((postsLastWeek - postsPreviousWeek) / postsPreviousWeek) * 100);
    } else if (postsLastWeek > 0) {
      weeklyGrowthRate = 100; // If there were no posts the previous week but there are now
    }

    // Prepare and send response
    res.status(200).json({
      posts: recentPosts,
      stats: {
        totalPosts,
        postsThisMonth,
        weeklyGrowthRate,
        engagement: {
          totalReactions: totals.totalReactions,
          totalComments: totals.totalComments,
          mostEngagedType
        },
        engagementByType: engagementPercentages,
        monthlyPostData,
        topPosts
      }
    });
  } catch (error) {
    console.error("Error in getRecentAdminPosts controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all rejected posts for admin view
export const getRejectedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all posts with status "rejected"
    const rejectedPosts = await Post.find({ status: "rejected" })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .populate("adminId", "name username") // Populate admin who rejected the post
      .sort({ reviewedAt: -1 }) // Most recently reviewed first
      .skip(skip)
      .limit(limit);

    const totalItems = await Post.countDocuments({ status: "rejected" });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: rejectedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error in getRejectedPosts controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId)
      .populate("author", "_id")
      .populate("comments.user", "_id");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is authorized to delete the comment
    // Can delete if: 1) User is comment author, 2) User is post author, 3) User is admin
    const isCommentAuthor = comment.user._id.toString() === userId.toString();
    const isPostAuthor = post.author._id.toString() === userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Remove the comment
    comment.deleteOne();
    await post.save();

    // Get updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline")
      .lean();

    res.status(200).json({
      message: "Comment deleted successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error in deleteComment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId)
      .populate("author", "_id")
      .populate("comments.user", "_id");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Find the reply
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Check if user is authorized to delete the reply
    // Can delete if: 1) User is reply author, 2) User is comment author, 3) User is post author, 4) User is admin
    const isReplyAuthor = reply.user._id?.toString() === userId.toString() || reply.user.toString() === userId.toString();
    const isCommentAuthor = comment.user._id.toString() === userId.toString();
    const isPostAuthor = post.author._id.toString() === userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isReplyAuthor && !isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this reply" });
    }

    // Remove the reply
    reply.deleteOne();
    await post.save();

    // Get updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline")
      .populate("comments.replies.user", "name profilePicture username headline")
      .populate("reactions.user", "name username profilePicture headline");

    res.status(200).json({
      message: "Reply deleted successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error in deleteReply controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
