// POST.CONTROLLER.JS

import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";
import { 
    sendCommentNotificationEmail,
    sendLikeNotificationEmail,
    sendReplyNotificationEmail,
    sendMentionNotificationEmail,
    sendPostStatusNotificationEmail
} from "../emails/emailHandlers.js";

// Helper function to extract mentions from content
const extractMentions = (content) => {
  const mentionPattern = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const mentions = [];
  
  while ((match = mentionPattern.exec(content)) !== null) {
    const [, username, userId] = match;
    mentions.push({
      username,
      userId
    });
  }
  
  return mentions;
};

// Fetch posts for the user's feed
// Modify getFeedPosts to only show approved posts
export const getFeedPosts = async (req, res) => {
    try {
        // Get the user's ID and linked user IDs
        const userIds = [...req.user.Links, req.user._id];

        // Find posts by authors in `userIds` or where the post has links to any user in `userIds`
        const posts = await Post.find({
            $or: [
                { author: { $in: userIds } },
                { links: { $in: userIds } }
            ],
            status: "approved" // Only show approved posts
        })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")
            .populate("reactions.user", "name username profilePicture headline")
            .populate("adminId", "name username") // Populate admin who approved the post
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Create a new post

export const createPost = async (req, res) => {
    try {
        const { content, image, type, jobDetails, internshipDetails, eventDetails, links } = req.body; // Destructure the new field

        console.log("Received data:", { content, image, type, jobDetails, internshipDetails, eventDetails, links });

        let newPostData = {
            author: req.user._id,
            content,
            type,
        };

        // Include details based on post type
        if (type === "job" && jobDetails) {
            newPostData.jobDetails = jobDetails; // Add jobDetails to post data
        } else if (type === "internship" && internshipDetails) {
            newPostData.internshipDetails = internshipDetails; // Add internshipDetails to post data
        } else if (type === "event" && eventDetails) {
            newPostData.eventDetails = eventDetails; // Add eventDetails to post data
        }

        // Include links if provided
        if (Array.isArray(links) && links.length > 0) {
            newPostData.links = links; // Add links to post data
        }

        // Upload image to Cloudinary if provided
        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPostData.image = imgResult.secure_url; // Add image URL to post data
        }

        // Create a new post instance with the correct structure
        const newPost = new Post(newPostData);
        await newPost.save();

        console.log("Post created successfully:", newPost); // Log successful creation
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ message: "Server error" });
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
            .populate("adminId", "name username"); // Populate admin who approved the post

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
            .populate("reactions.user", "name username profilePicture headline");

        // Extract mentions from the comment
        const mentions = extractMentions(content);

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
            .populate("reactions.user", "name username profilePicture headline");
            
        // Extract mentions from reply
        const mentions = extractMentions(content);

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
    const { postId } = req.params;
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
      const image = req.file ? req.file.path : null;
  
      console.log("Received data:", { title, content, type, jobDetails, internshipDetails, eventDetails, image });
  
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
  
      // Upload image to Cloudinary if provided
      if (image) {
        const imgResult = await cloudinary.uploader.upload(image);
        newAdminPostData.image = imgResult.secure_url;
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
      .populate("reactions.user", "name username profilePicture headline");

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
