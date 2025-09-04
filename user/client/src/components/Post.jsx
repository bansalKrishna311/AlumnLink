import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Calendar, Clock, Globe, Lock, MessageCircle } from "lucide-react";

// Import modular components
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import PostModals from "./PostModals";

const Post = ({ post }) => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [activeReactionTab, setActiveReactionTab] = useState("all");
  const [showPostDetails, setShowPostDetails] = useState(false);
  // Optimistic UI states for reactions
  const [optimisticReactions, setOptimisticReactions] = useState(post.reactions || []);
  const [optimisticUserReaction, setOptimisticUserReaction] = useState(() => {
    if (!post.reactions || !authUser) return null;
    const reaction = post.reactions.find(r => {
      if (typeof r.user === 'object') {
        return r.user?._id === authUser?._id;
      } else {
        return r.user === authUser?._id;
      }
    });
    return reaction?.type || null;
  });

  // Check if the current user has bookmarked this post
  const isBookmarked = post.bookmarks?.some(id => id === authUser?._id);

  // Refs
  const optionsMenuRef = useRef(null);
  const reactionsModalRef = useRef(null);

  const queryClient = useQueryClient();

  // Get user's current reaction if any (from optimistic state)
  const userReaction = optimisticUserReaction;

  // Total reactions count (from optimistic state)
  const totalReactions = optimisticReactions.length;

  // Group reactions by type for the modal (from optimistic state)
  const reactionsByType =
    optimisticReactions.reduce((groups, reaction) => {
      if (!groups[reaction.type]) {
        groups[reaction.type] = [];
      }
      groups[reaction.type].push(reaction);
      return groups;
    }, {}) || {};

  // Helper function to get user details from reaction
  const getUserDetailsFromReaction = (reaction) => {
    if (!reaction || !reaction.user) {
      return { name: "Unknown", profilePicture: "/avatar.png" };
    }
    
    // Now we can directly use the populated user data from reaction
    if (typeof reaction.user === 'object' && reaction.user !== null) {
      return reaction.user;
    }
    
    // Fallback to previous logic for backward compatibility
    if (post.comments?.some(comment => comment.user && comment.user._id === reaction.user)) {
      const userComment = post.comments.find(comment => comment.user && comment.user._id === reaction.user);
      return userComment.user;
    }
    
    return post.author?._id === reaction.user ? post.author : { name: "User", profilePicture: "/avatar.png" };
  };

  // Close options menu and reactions modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
      if (reactionsModalRef.current && !reactionsModalRef.current.contains(event.target)) {
        setShowReactionsModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showReactionsModal || showPostDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showReactionsModal, showPostDetails]);

  // Mutations
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
      setShowOptionsMenu(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationKey: ["createComment"],
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add comment");
    },
  });

  const { mutate: createReply, isPending: isAddingReply } = useMutation({
    mutationKey: ["createReply"],
    mutationFn: async ({ postId, commentId, content }) => {
      await axiosInstance.post(`/posts/${postId}/comment/${commentId}/reply`, {
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Reply added successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add reply");
    },
  });

  const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Bookmark status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to bookmark post");
    },
  });

  const { mutate: reactToPost, isPending: isReacting } = useMutation({
    mutationKey: ["reactToPost"],
    mutationFn: async ({ postId, reactionType }) => {
      await axiosInstance.post(`/posts/${postId}/react`, {
        reactionType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error, { prevReactions, prevUserReaction }) => {
      // Revert optimistic update
      setOptimisticReactions(prevReactions);
      setOptimisticUserReaction(prevUserReaction);
      toast.error(error.message || "Failed to react to post");
    },
  });

  const { mutate: likeComment, isPending: isLikingComment } = useMutation({
    mutationKey: ["likeComment"],
    mutationFn: async ({ postId, commentId }) => {
      await axiosInstance.post(`/posts/${postId}/comment/${commentId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to like comment");
    },
  });

  const { mutate: likeReply, isPending: isLikingReply } = useMutation({
    mutationKey: ["likeReply"],
    mutationFn: async ({ postId, commentId, replyId }) => {
      await axiosInstance.post(`/posts/${postId}/comment/${commentId}/reply/${replyId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to like reply");
    },
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async ({ postId, commentId }) => {
      await axiosInstance.delete(`/posts/${postId}/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error, variables) => {
      // Revert optimistic update on error
      setComments(post.comments || []);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });

  const { mutate: deleteReply, isPending: isDeletingReply } = useMutation({
    mutationFn: async ({ postId, commentId, replyId }) => {
      await axiosInstance.delete(`/posts/${postId}/comment/${commentId}/reply/${replyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Reply deleted successfully");
    },
    onError: (error, variables) => {
      // Revert optimistic update on error
      setComments(post.comments || []);
      toast.error(error.response?.data?.message || "Failed to delete reply");
    },
  });

  // Action Handlers
  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleReactToPost = (reactionType) => {
    if (isReacting) return;

    // Save previous state for rollback
    const prevReactions = [...optimisticReactions];
    const prevUserReaction = optimisticUserReaction;

    let updatedReactions;
    let updatedUserReaction;
    if (userReaction === reactionType) {
      // Remove reaction
      updatedReactions = optimisticReactions.filter(r => {
        if (typeof r.user === 'object') {
          return r.user?._id !== authUser?._id;
        } else {
          return r.user !== authUser?._id;
        }
      });
      updatedUserReaction = null;
      setOptimisticReactions(updatedReactions);
      setOptimisticUserReaction(updatedUserReaction);
      reactToPost({ postId: post._id, reactionType: null, prevReactions, prevUserReaction });
      return;
    } else {
      // Add/update reaction
      // Remove previous reaction if exists
      updatedReactions = optimisticReactions.filter(r => {
        if (typeof r.user === 'object') {
          return r.user?._id !== authUser?._id;
        } else {
          return r.user !== authUser?._id;
        }
      });
      // Add new reaction
      updatedReactions.push({
        user: authUser,
        type: reactionType,
      });
      updatedUserReaction = reactionType;
      setOptimisticReactions(updatedReactions);
      setOptimisticUserReaction(updatedUserReaction);
      reactToPost({ postId: post._id, reactionType, prevReactions, prevUserReaction });
    }
  };

  const handleSharePost = async () => {
    try {
      // Generate the proper post URL
      const postUrl = `${window.location.origin}/post/${post._id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `${post.author?.name}'s post`,
          text: post.content,
          url: postUrl
        });
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(postUrl);
        toast.success('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share post');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
          replies: [],
        },
      ]);
    }
  };

  const handleAddReply = async (e, commentId, replyContent) => {
    e.preventDefault();
    if (!replyContent.trim() || isAddingReply) return;

    try {
      createReply({
        postId: post._id,
        commentId,
        content: replyContent
      });

      // Optimistic UI update
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                content: replyContent,
                user: {
                  _id: authUser._id,
                  name: authUser.name,
                  profilePicture: authUser.profilePicture,
                },
                createdAt: new Date()
              }
            ]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      return true; // Return success to reset form in child component
    } catch (error) {
      console.error("Error adding reply:", error);
      return false;
    }
  };

  const handleLikeComment = (commentId) => {
    if (isLikingComment) return;
    likeComment({ postId: post._id, commentId });
  };

  const handleLikeReply = (commentId, replyId) => {
    if (isLikingReply) return;
    likeReply({ postId: post._id, commentId, replyId });
  };

  const handleDeleteComment = (commentId) => {
    if (isDeletingComment) return;
    
    // Optimistically update local state
    const updatedComments = comments.filter(comment => comment._id !== commentId);
    setComments(updatedComments);
    
    deleteComment({ postId: post._id, commentId });
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (isDeletingReply) return;
    
    // Optimistically update local state
    const updatedComments = comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply._id !== replyId)
        };
      }
      return comment;
    });
    setComments(updatedComments);
    
    deleteReply({ postId: post._id, commentId, replyId });
  };

  const handleBookmarkPost = () => {
    if (isBookmarking) return;
    bookmarkPost();
  };

  const handleHashtagClick = (hashtag) => {
    // Navigate to hashtag search page or trigger search
    // This is handled in the PostContent component
  };

  // Utility functions
  const getReactionEmoji = (type) => {
    switch (type) {
      case "like": return "👍";
      case "love": return "❤️";
      case "sad": return "😢";
      case "wow": return "😮";
      case "angry": return "😠";
      default: return "👍";
    }
  };

  const getReactionText = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getReactionColor = (type) => {
    const colors = {
      like: "text-[#fe6019]",
      love: "text-[#fe6019]",
      sad: "text-[#fe6019]/80",
      wow: "text-[#fe6019]/90",
      angry: "text-[#fe6019]/70",
    };
    return colors[type] || "text-gray-700";
  };

  const getReactionBgColor = (type) => {
    const colors = {
      like: "bg-[#fe6019]/10 hover:bg-[#fe6019]/20",
      love: "bg-[#fe6019]/10 hover:bg-[#fe6019]/20",
      sad: "bg-[#fe6019]/10 hover:bg-[#fe6019]/20",
      wow: "bg-[#fe6019]/10 hover:bg-[#fe6019]/20",
      angry: "bg-[#fe6019]/10 hover:bg-[#fe6019]/20",
    };
    return colors[type] || "hover:bg-gray-100";
  };

  const getPostTypeBadgeColor = (type) => {
    const types = {
      // Discussion: Yellow/Gold color from image
      discussion: "bg-amber-400 text-white border-amber-500",
      // Job: Purple color from image
      job: "bg-indigo-400 text-white border-indigo-500",
      // Internship: Green color from image
      internship: "bg-emerald-400 text-white border-emerald-500",
      // Event: Light Blue color from image
      event: "bg-sky-400 text-white border-sky-500",
      // Personal: Pink color from image
      personal: "bg-pink-400 text-white border-pink-500",
      // Other: Dark Blue color from image
      other: "bg-blue-700 text-white border-blue-800",
    };
    return types[type] || "bg-gray-400 text-white border-gray-500";
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "job": return <Briefcase className="w-3 h-3 mr-1" />;
      case "internship": return <Clock className="w-3 h-3 mr-1" />;
      case "event": return <Calendar className="w-3 h-3 mr-1" />;
      case "discussion": return <MessageCircle className="w-3 h-3 mr-1" />;
      case "personal": return <Lock className="w-3 h-3 mr-1" />;
      default: return <Globe className="w-3 h-3 mr-1" />;
    }
  };

  // Calculate total comments count (comments + replies)
  const totalCommentsCount = useMemo(() => {
    if (!comments || !Array.isArray(comments)) return 0;
    
    // Count main comments
    const mainCommentsCount = comments.length;
    
    // Count all replies
    const repliesCount = comments.reduce((total, comment) => {
      return total + (Array.isArray(comment.replies) ? comment.replies.length : 0);
    }, 0);
    
    return mainCommentsCount + repliesCount;
  }, [comments]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden">
      <div className="p-4">
        {/* Post Header Component */}
        <PostHeader 
          post={post}
          authUser={authUser}
          showOptionsMenu={showOptionsMenu}
          setShowOptionsMenu={setShowOptionsMenu}
          setShowPostDetails={setShowPostDetails}
          handleDeletePost={handleDeletePost}
          isDeletingPost={isDeletingPost}
          optionsMenuRef={optionsMenuRef}
          getPostTypeBadgeColor={getPostTypeBadgeColor}
          getPostTypeIcon={getPostTypeIcon}
          handleBookmarkPost={handleBookmarkPost}
          isBookmarking={isBookmarking}
          isBookmarked={isBookmarked}
        />

        {/* Post Content Component */}
        <PostContent post={post} />

        {/* Post Actions Component */}
        <PostActions 
          post={{ ...post, reactions: optimisticReactions }}
          userReaction={userReaction}
          handleReactToPost={handleReactToPost}
          totalReactions={totalReactions}
          comments={comments}
          setShowComments={setShowComments}
          showComments={showComments}
          handleSharePost={handleSharePost}
          isReacting={isReacting}
          getReactionEmoji={getReactionEmoji}
          getReactionText={getReactionText}
          getReactionColor={getReactionColor}
          getReactionBgColor={getReactionBgColor}
          setShowReactionsModal={setShowReactionsModal}
          totalCommentsCount={totalCommentsCount}
        />
      </div>

      {/* Post Comments Component */}
      <PostComments 
        showComments={showComments}
        comments={comments}
        authUser={authUser}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        isAddingComment={isAddingComment}
        handleAddReply={handleAddReply}
        isAddingReply={isAddingReply}
        postId={post._id}
        handleLikeComment={handleLikeComment}
        handleLikeReply={handleLikeReply}
        isLikingComment={isLikingComment}
        isLikingReply={isLikingReply}
        handleDeleteComment={handleDeleteComment}
        handleDeleteReply={handleDeleteReply}
        isDeletingComment={isDeletingComment}
        isDeletingReply={isDeletingReply}
        totalCommentsCount={totalCommentsCount}
        postAuthorId={post.author._id}
      />

      {/* Post Modals Component */}
      <PostModals 
        post={{ ...post, reactions: optimisticReactions }}
        showReactionsModal={showReactionsModal}
        setShowReactionsModal={setShowReactionsModal}
        showPostDetails={showPostDetails}
        setShowPostDetails={setShowPostDetails}
        authUser={authUser}
        getReactionEmoji={getReactionEmoji}
        getReactionText={getReactionText}
        getReactionColor={getReactionColor}
        getPostTypeIcon={getPostTypeIcon}
        totalReactions={totalReactions}
        comments={comments}
        reactionsByType={reactionsByType}
        activeReactionTab={activeReactionTab}
        setActiveReactionTab={setActiveReactionTab}
        reactionsModalRef={reactionsModalRef}
        getUserDetailsFromReaction={getUserDetailsFromReaction}
      />
    </div>
  );
};

export default Post;

