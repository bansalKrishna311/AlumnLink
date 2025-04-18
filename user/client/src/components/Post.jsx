import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
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
  
  // Refs
  const optionsMenuRef = useRef(null);
  const reactionsModalRef = useRef(null);
  
  const queryClient = useQueryClient();

  // Get user's current reaction if any
  const userReaction = post.reactions?.find((reaction) => reaction.user === authUser?._id)?.type;

  // Total reactions count
  const totalReactions = post.reactions?.length || 0;

  // Group reactions by type for the modal
  const reactionsByType =
    post.reactions?.reduce((groups, reaction) => {
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

  const { mutate: reactToPost, isPending: isReacting } = useMutation({
    mutationFn: async ({ postId, reactionType }) => {
      await axiosInstance.post(`/posts/${postId}/react`, {
        reactionType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to react to post");
    },
  });

  const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post saved to your bookmarks");
    },
  });

  // Action Handlers
  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleReactToPost = (reactionType) => {
    if (isReacting) return;

    // If user clicks the same reaction again, send null to remove it
    if (userReaction === reactionType) {
      reactToPost({ postId: post._id, reactionType: null });
      return;
    }

    // Otherwise, add/update reaction
    reactToPost({ postId: post._id, reactionType });
  };

  const handleSharePost = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.author?.name}'s post`,
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
        },
      ]);
    }
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
      internship: "bg-purple-100 text-purple-700 border-purple-200",
      job: "bg-blue-100 text-blue-700 border-blue-200",
      event: "bg-orange-100 text-orange-700 border-orange-200",
      discussion: "bg-green-100 text-green-700 border-green-200",
      personal: "bg-indigo-100 text-indigo-700 border-indigo-200",
      other: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return types[type] || "bg-gray-100 text-gray-700 border-gray-200";
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
        />

        {/* Post Content Component */}
        <PostContent post={post} />

        {/* Post Actions Component */}
        <PostActions 
          post={post}
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
      />

      {/* Post Modals Component */}
      <PostModals 
        post={post}
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

