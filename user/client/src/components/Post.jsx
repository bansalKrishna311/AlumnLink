import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  MoreHorizontal,
  Bookmark,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Building,
  Heart,
  Frown,
  AlertCircle,
  Smile,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post }) => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const optionsMenuRef = useRef(null);
  const reactionPickerRef = useRef(null);
  const isOwner = authUser?._id === post.author?._id;
  const queryClient = useQueryClient();
  const reactionTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (reactionTimeout.current) {
      clearTimeout(reactionTimeout.current);
    }
    setShowReactionPicker(true);
  };

  const handleMouseLeave = (event) => {
    if (
      reactionPickerRef.current &&
      !reactionPickerRef.current.contains(event.relatedTarget)
    ) {
      reactionTimeout.current = setTimeout(() => {
        setShowReactionPicker(false);
      }, 300); 
    }
  };

  // Get user's current reaction if any
  const userReaction = post.reactions?.find(
    (reaction) => reaction.user === authUser?._id
  )?.type;

  // Count of each reaction type
  const reactionCounts =
    post.reactions?.reduce((counts, reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
      return counts;
    }, {}) || {};

  // Total reactions count
  const totalReactions = post.reactions?.length || 0;

  // Close options menu and reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target)
      ) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setShowReactionPicker(false);
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

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleReactToPost = (reactionType) => {
    if (isReacting) return;
    reactToPost({ postId: post._id, reactionType });
  };

  const handleBookmarkPost = () => {
    if (isBookmarking) return;
    bookmarkPost();
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

  // Get reaction icon based on reaction type
  const getReactionIcon = (type, size = 14, className = "mr-1.5") => {
    switch (type) {
      case "like":
        return (
          <ThumbsUp
            size={size}
            className={`${className} ${
              userReaction === "like" ? "fill-blue-600 text-blue-600" : ""
            }`}
          />
        );
      case "love":
        return (
          <Heart
            size={size}
            className={`${className} ${
              userReaction === "love" ? "fill-red-600 text-red-600" : ""
            }`}
          />
        );
      case "sad":
        return (
          <Frown
            size={size}
            className={`${className} ${
              userReaction === "sad" ? "fill-yellow-600 text-yellow-600" : ""
            }`}
          />
        );
      case "wow":
        return (
          <AlertCircle
            size={size}
            className={`${className} ${
              userReaction === "wow" ? "fill-purple-600 text-purple-600" : ""
            }`}
          />
        );
      case "angry":
        return (
          <Smile
            size={size}
            className={`${className} ${
              userReaction === "angry" ? "fill-orange-600 text-orange-600" : ""
            }`}
          />
        );
      default:
        return <ThumbsUp size={size} className={className} />;
    }
  };

  // Get reaction text based on reaction type
  const getReactionText = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get reaction color based on reaction type
  const getReactionColor = (type) => {
    const colors = {
      like: "text-blue-600",
      love: "text-red-600",
      sad: "text-yellow-600",
      wow: "text-purple-600",
      angry: "text-orange-600",
    };
    return colors[type] || "text-gray-700";
  };

  // Get reaction background color based on reaction type
  const getReactionBgColor = (type) => {
    const colors = {
      like: "bg-blue-50 hover:bg-blue-100",
      love: "bg-red-50 hover:bg-red-100",
      sad: "bg-yellow-50 hover:bg-yellow-100",
      wow: "bg-purple-50 hover:bg-purple-100",
      angry: "bg-orange-50 hover:bg-orange-100",
    };
    return colors[type] || "hover:bg-gray-100";
  };

  // Function to determine post type badge color
  const getPostTypeBadgeColor = (type) => {
    const types = {
      internship: "bg-purple-100 text-purple-700",
      job: "bg-blue-100 text-blue-700",
      event: "bg-orange-100 text-orange-700",
      discussion: "bg-green-100 text-green-700",
      personal: "bg-indigo-100 text-indigo-700",
      other: "bg-gray-100 text-gray-700",
    };
    return types[type] || "bg-gray-100 text-gray-700";
  };

  // Generate icon based on post type
  const getPostTypeIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase size={12} className="mr-1" />;
      case "internship":
        return <Clock size={12} className="mr-1" />;
      case "event":
        return <Calendar size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 transition-all duration-300 hover:shadow-md">
      <div className="p-3">
        {/* Author section - more compact */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Link
              to={`/profile/${post?.author?.username}`}
              className="relative mr-2"
            >
              <img
                src={post.author?.profilePicture || "/avatar.png"}
                alt={post.author?.name}
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
            </Link>
            <div>
              <div className="flex items-center">
                <Link to={`/profile/${post?.author?.username}`}>
                  <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors text-sm">
                    {post.author?.name}
                  </h3>
                </Link>
                <span
                  className={`ml-2 text-xs py-0.5 px-1.5 rounded-full flex items-center ${getPostTypeBadgeColor(
                    post.type
                  )}`}
                >
                  {getPostTypeIcon(post.type)}
                  {post.type}
                </span>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-gray-500">{post.author?.headline}</p>
                <span className="mx-1 text-gray-300">•</span>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="relative" ref={optionsMenuRef}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={handleBookmarkPost}
                  className="w-full text-left px-3 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
                >
                  <Bookmark size={14} className="mr-2" />
                  {isBookmarking ? "Saving..." : "Save post"}
                </button>

                {isOwner && (
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-3 py-2 flex items-center text-sm text-red-600 hover:bg-red-50 rounded-b-md"
                  >
                    {isDeletingPost ? (
                      <Loader size={14} className="mr-2 animate-spin" />
                    ) : (
                      <>
                        <Loader size={14} className="mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post content - more concise */}
        <div className="mb-3">
          <p className="text-gray-800 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Post image - FIXED to show original size */}
        {post.image && (
          <div className="mb-3 -mx-3">
            <img src={post.image} alt="Post content" className="w-full" />
          </div>
        )}

        {/* Post type specific details - more compact */}
        {post.type === "internship" && post.internshipDetails && (
          <div className="bg-purple-50 p-2 rounded-md mb-3 border border-purple-100">
            <div className="flex items-center mb-1">
              <Building size={14} className="text-purple-600 mr-1" />
              <h4 className="font-medium text-purple-700 text-xs">
                Internship Opportunity
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center text-gray-700">
                <Building size={12} className="mr-1 text-purple-500" />
                <span>
                  <strong>Company:</strong> {post.internshipDetails.companyName}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock size={12} className="mr-1 text-purple-500" />
                <span>
                  <strong>Duration:</strong>{" "}
                  {post.internshipDetails.internshipDuration}
                </span>
              </div>
            </div>
          </div>
        )}

        {post.type === "job" && post.jobDetails && (
          <div className="bg-blue-50 p-2 rounded-md mb-3 border border-blue-100">
            <div className="flex items-center mb-1">
              <Briefcase size={14} className="text-blue-600 mr-1" />
              <h4 className="font-medium text-blue-700 text-xs">
                Job Opportunity
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center text-gray-700">
                <Building size={12} className="mr-1 text-blue-500" />
                <span>{post.jobDetails.companyName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Briefcase size={12} className="mr-1 text-blue-500" />
                <span>{post.jobDetails.jobTitle}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={12} className="mr-1 text-blue-500" />
                <span>{post.jobDetails.jobLocation}</span>
              </div>
            </div>
          </div>
        )}

        {post.type === "event" && post.eventDetails && (
          <div className="bg-orange-50 p-2 rounded-md mb-3 border border-orange-100">
            <div className="flex items-center mb-1">
              <Calendar size={14} className="text-orange-600 mr-1" />
              <h4 className="font-medium text-orange-700 text-xs">
                Upcoming Event
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center text-gray-700">
                <Calendar size={12} className="mr-1 text-orange-500" />
                <span>{post.eventDetails.eventName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock size={12} className="mr-1 text-orange-500" />
                <span>
                  {new Date(post.eventDetails.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={12} className="mr-1 text-orange-500" />
                <span>{post.eventDetails.eventLocation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Post stats and actions - with reactions */}
        <div className="flex items-center justify-between py-1 text-gray-500 text-xs">
          <div className="flex items-center space-x-2">
            {totalReactions > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-1 mr-1">
                  {Object.keys(reactionCounts)
                    .slice(0, 3)
                    .map((type) => (
                      <div
                        key={type}
                        className={`flex items-center justify-center w-4 h-4 rounded-full bg-white border ${getReactionColor(
                          type
                        )} border-white`}
                      >
                        {getReactionIcon(type, 8, "")}
                      </div>
                    ))}
                </div>
                <span className="text-gray-600">{totalReactions}</span>
              </div>
            )}
            <div className="flex items-center">
              <MessageCircle size={12} className="text-gray-600 mr-1" />
              <span className="text-gray-600">{comments.length}</span>
            </div>
            <span className="text-gray-500">{post.views || 0} views</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-2"></div>

        {/* Action buttons - with reaction picker */}
        <div className="flex justify-between items-center">
    <div 
      className="relative" 
      ref={reactionPickerRef} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center justify-center py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
          userReaction 
            ? `${getReactionColor(userReaction)} ${getReactionBgColor(userReaction)}`
            : "text-gray-700 hover:bg-gray-100"
        }`}
        disabled={isReacting}
      >
        {userReaction ? (
          <>
            {getReactionIcon(userReaction)}
            {getReactionText(userReaction)}
          </>
        ) : (
          <>
            <ThumbsUp size={14} className="mr-1.5" />
            React
          </>
        )}
      </button>
      
      {/* Reaction picker popup */}
      {showReactionPicker && (
        <div 
          className="absolute left-0 -top-12 bg-white border border-gray-200 rounded-full shadow-lg z-10 flex items-center p-1 space-x-1"
        >
          <button 
            onClick={() => handleReactToPost("like")}
            className={`p-2 rounded-full hover:bg-blue-100 ${userReaction === "like" ? "bg-blue-50" : ""}`}
            title="Like"
          >
            <ThumbsUp size={16} className={userReaction === "like" ? "fill-blue-600 text-blue-600" : "text-blue-600"} />
          </button>
          <button 
            onClick={() => handleReactToPost("love")}
            className={`p-2 rounded-full hover:bg-red-100 ${userReaction === "love" ? "bg-red-50" : ""}`}
            title="Love"
          >
            <Heart size={16} className={userReaction === "love" ? "fill-red-600 text-red-600" : "text-red-600"} />
          </button>
          <button 
            onClick={() => handleReactToPost("sad")}
            className={`p-2 rounded-full hover:bg-yellow-100 ${userReaction === "sad" ? "bg-yellow-50" : ""}`}
            title="Sad"
          >
            <Frown size={16} className={userReaction === "sad" ? "fill-yellow-600 text-yellow-600" : "text-yellow-600"} />
          </button>
          <button 
            onClick={() => handleReactToPost("wow")}
            className={`p-2 rounded-full hover:bg-purple-100 ${userReaction === "wow" ? "bg-purple-50" : ""}`}
            title="Wow"
          >
            <AlertCircle size={16} className={userReaction === "wow" ? "fill-purple-600 text-purple-600" : "text-purple-600"} />
          </button>
          <button 
            onClick={() => handleReactToPost("angry")}
            className={`p-2 rounded-full hover:bg-orange-100 ${userReaction === "angry" ? "bg-orange-50" : ""}`}
            title="Angry"
          >
            <Smile size={16} className={userReaction === "angry" ? "fill-orange-600 text-orange-600" : "text-orange-600"} />
          </button>
        </div>
      )}
    </div>
    
    <button
      onClick={() => setShowComments(!showComments)}
      className="flex items-center justify-center py-1.5 px-3 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
    >
      <MessageCircle size={14} className="mr-1.5" />
      Comment
    </button>
    
    <button
      className="flex items-center justify-center py-1.5 px-3 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
    >
      <Share2 size={14} className="mr-1.5" />
      Share
    </button>
  </div>
      </div>

      {/* Comments section - more compact */}
      {showComments && (
        <div className="border-t border-gray-100 px-3 py-3 bg-gray-50 rounded-b-lg">
          <div className="mb-3 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <MessageCircle
                  size={20}
                  className="mx-auto mb-1 text-gray-400"
                />
                <p className="text-xs">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="mb-2 bg-white p-2 rounded-md shadow-sm border border-gray-100"
                >
                  <div className="flex items-start">
                    <img
                      src={comment.user?.profilePicture || "/avatar.png"}
                      alt={comment.user?.name}
                      className="w-6 h-6 rounded-full mr-2 flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-1 text-xs">
                          {comment.user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt))}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <img
                src={authUser?.profilePicture || "/avatar.png"}
                alt={authUser?.name}
                className="w-6 h-6 rounded-full border border-gray-200"
              />
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
                disabled={isAddingComment || !newComment.trim()}
              >
                {isAddingComment ? (
                  <Loader size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
