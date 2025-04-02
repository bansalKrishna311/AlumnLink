import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
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
  Globe,
  Lock,
  X,
  Users,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const Post = ({ post }) => {
  const { postId } = useParams()
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(post.comments || [])
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [showReactionsModal, setShowReactionsModal] = useState(false)
  const [activeReactionTab, setActiveReactionTab] = useState("all")
  const optionsMenuRef = useRef(null)
  const reactionPickerRef = useRef(null)
  const reactionsModalRef = useRef(null)
  const isOwner = authUser?._id === post.author?._id
  const queryClient = useQueryClient()
  const reactionTimeout = useRef(null)

  const handleMouseEnter = () => {
    if (reactionTimeout.current) {
      clearTimeout(reactionTimeout.current)
    }
    setShowReactionPicker(true)
  }

  const handleMouseLeave = (event) => {
    if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.relatedTarget)) {
      reactionTimeout.current = setTimeout(() => {
        setShowReactionPicker(false)
      }, 300)
    }
  }

  // Get user's current reaction if any
  const userReaction = post.reactions?.find((reaction) => reaction.user === authUser?._id)?.type

  // Count of each reaction type
  const reactionCounts =
    post.reactions?.reduce((counts, reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1
      return counts
    }, {}) || {}

  // Total reactions count
  const totalReactions = post.reactions?.length || 0

  // Group reactions by type for the modal
  const reactionsByType =
    post.reactions?.reduce((groups, reaction) => {
      if (!groups[reaction.type]) {
        groups[reaction.type] = []
      }
      groups[reaction.type].push(reaction)
      return groups
    }, {}) || {}

  // Close options menu, reaction picker, and reactions modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false)
      }
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        setShowReactionPicker(false)
      }
      if (reactionsModalRef.current && !reactionsModalRef.current.contains(event.target)) {
        setShowReactionsModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showReactionsModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showReactionsModal])

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Post deleted successfully")
      setShowOptionsMenu(false)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete post")
    },
  })

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Comment added successfully")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add comment")
    },
  })

  const { mutate: reactToPost, isPending: isReacting } = useMutation({
    mutationFn: async ({ postId, reactionType }) => {
      await axiosInstance.post(`/posts/${postId}/react`, {
        reactionType,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
      setShowReactionPicker(false)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to react to post")
    },
  })

  const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/bookmark`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Post saved to your bookmarks")
    },
  })

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    deletePost()
  }
  const handleReactToPost = (reactionType) => {
    if (isReacting) return;

    // If user clicks the same reaction again, send null to remove it
    if (userReaction === reactionType) {
        reactToPost({ postId: post._id, reactionType: null }); // Sending null instead of "none"
        return;
    }

    // Otherwise, add/update reaction
    reactToPost({ postId: post._id, reactionType });
};


  const handleBookmarkPost = () => {
    if (isBookmarking) return
    bookmarkPost()
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      createComment(newComment)
      setNewComment("")
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
      ])
    }
  }

  // Get reaction emoji based on reaction type
  const getReactionEmoji = (type) => {
    switch (type) {
      case "like":
        return "👍"
      case "love":
        return "❤️"
      case "sad":
        return "😢"
      case "wow":
        return "😮"
      case "angry":
        return "😠"
      default:
        return "👍"
    }
  }

  // Get reaction text based on reaction type
  const getReactionText = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Get reaction color based on reaction type
  const getReactionColor = (type) => {
    const colors = {
      like: "text-blue-600",
      love: "text-red-600",
      sad: "text-yellow-600",
      wow: "text-purple-600",
      angry: "text-orange-600",
    }
    return colors[type] || "text-gray-700"
  }

  // Get reaction background color based on reaction type
  const getReactionBgColor = (type) => {
    const colors = {
      like: "bg-blue-50 hover:bg-blue-100",
      love: "bg-red-50 hover:bg-red-100",
      sad: "bg-yellow-50 hover:bg-yellow-100",
      wow: "bg-purple-50 hover:bg-purple-100",
      angry: "bg-orange-50 hover:bg-orange-100",
    }
    return colors[type] || "hover:bg-gray-100"
  }

  // Function to determine post type badge color
  const getPostTypeBadgeColor = (type) => {
    const types = {
      internship: "bg-purple-100 text-purple-700 border-purple-200",
      job: "bg-blue-100 text-blue-700 border-blue-200",
      event: "bg-orange-100 text-orange-700 border-orange-200",
      discussion: "bg-green-100 text-green-700 border-green-200",
      personal: "bg-indigo-100 text-indigo-700 border-indigo-200",
      other: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return types[type] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  // Generate icon based on post type
  const getPostTypeIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase className="w-3 h-3 mr-1" />
      case "internship":
        return <Clock className="w-3 h-3 mr-1" />
      case "event":
        return <Calendar className="w-3 h-3 mr-1" />
      case "discussion":
        return <MessageCircle className="w-3 h-3 mr-1" />
      case "personal":
        return <Lock className="w-3 h-3 mr-1" />
      default:
        return <Globe className="w-3 h-3 mr-1" />
    }
  }

  // Filter reactions based on active tab
  const getFilteredReactions = () => {
    if (activeReactionTab === "all") {
      return post.reactions || []
    }
    return reactionsByType[activeReactionTab] || []
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <div className="p-4">
        {/* Author section */}
        <div className="flex items-center justify-between mb-3">
          <motion.div
            className="flex items-center"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={`/profile/${post?.author?.username}`} className="relative mr-3">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                src={post.author?.profilePicture || "/avatar.png"}
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            </Link>
            <div>
              <div className="flex items-center">
                <Link to={`/profile/${post?.author?.username}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {post.author?.name}
                  </h3>
                </Link>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`ml-2 text-xs py-0.5 px-2 rounded-full flex items-center border ${getPostTypeBadgeColor(
                    post.type,
                  )}`}
                >
                  {getPostTypeIcon(post.type)}
                  {post.type}
                </motion.span>
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
          </motion.div>

          <div className="relative" ref={optionsMenuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal size={16} />
            </motion.button>

            <AnimatePresence>
              {showOptionsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                    onClick={handleBookmarkPost}
                    className="w-full text-left px-3 py-2 flex items-center text-sm text-gray-700 rounded-t-md"
                  >
                    <Bookmark size={14} className="mr-2" />
                    {isBookmarking ? "Saving..." : "Save post"}
                  </motion.button>

                  {isOwner && (
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(254, 226, 226, 1)" }}
                      onClick={handleDeletePost}
                      className="w-full text-left px-3 py-2 flex items-center text-sm text-red-600 rounded-b-md"
                    >
                      {isDeletingPost ? (
                        <Loader size={14} className="mr-2 animate-spin" />
                      ) : (
                        <>
                          <Loader size={14} className="mr-2" />
                          Delete
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Post content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </motion.div>

        {/* Post image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 -mx-4"
          >
            <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full rounded-md shadow-sm" />
          </motion.div>
        )}

        {/* Post type specific details */}
        {post.type === "internship" && post.internshipDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 p-3 rounded-md mb-4 border border-purple-100 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <Building size={16} className="text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-700">Internship Opportunity</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center text-gray-700">
                <Building size={14} className="mr-2 text-purple-500" />
                <span>
                  <strong>Company:</strong> {post.internshipDetails.companyName}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock size={14} className="mr-2 text-purple-500" />
                <span>
                  <strong>Duration:</strong> {post.internshipDetails.internshipDuration}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {post.type === "job" && post.jobDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <Briefcase size={16} className="text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-700">Job Opportunity</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center text-gray-700">
                <Building size={14} className="mr-2 text-blue-500" />
                <span>{post.jobDetails.companyName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Briefcase size={14} className="mr-2 text-blue-500" />
                <span>{post.jobDetails.jobTitle}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={14} className="mr-2 text-blue-500" />
                <span>{post.jobDetails.jobLocation}</span>
              </div>
            </div>
          </motion.div>
        )}

        {post.type === "event" && post.eventDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 p-3 rounded-md mb-4 border border-orange-100 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <Calendar size={16} className="text-orange-600 mr-2" />
              <h4 className="font-medium text-orange-700">Upcoming Event</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center text-gray-700">
                <Calendar size={14} className="mr-2 text-orange-500" />
                <span>{post.eventDetails.eventName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock size={14} className="mr-2 text-orange-500" />
                <span>{new Date(post.eventDetails.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={14} className="mr-2 text-orange-500" />
                <span>{post.eventDetails.eventLocation}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Post stats and actions */}
        <div className="flex items-center justify-between py-2 text-gray-500 text-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-3"
          >
            {totalReactions > 0 && (
              <motion.div
                className="flex items-center cursor-pointer"
                onClick={() => setShowReactionsModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex -space-x-1 mr-1.5">
                  {Object.keys(reactionCounts)
                    .slice(0, 3)
                    .map((type) => (
                      <motion.div
                        key={type}
                        whileHover={{ y: -2 }}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm"
                      >
                        <span className="text-xs">{getReactionEmoji(type)}</span>
                      </motion.div>
                    ))}
                </div>
                <span className="text-gray-600 font-medium">{totalReactions}</span>
              </motion.div>
            )}
            <div className="flex items-center cursor-pointer" onClick={() => setShowComments(!showComments)}>
              <MessageCircle size={14} className="text-gray-600 mr-1.5" />
              <span className="text-gray-600">{comments.length}</span>
            </div>
            <span className="text-gray-500">{post.views || 0} views</span>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-200 my-2"
        />

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between items-center"
        >
          <div
            className="relative"
            ref={reactionPickerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                userReaction
                  ? `${getReactionColor(userReaction)} ${getReactionBgColor(userReaction)}`
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={isReacting}
              onClick={() => userReaction && handleReactToPost(userReaction)}
            >
              {userReaction ? (
                <>
                  <span className="mr-1.5 text-base">{getReactionEmoji(userReaction)}</span>
                  {getReactionText(userReaction)}
                </>
              ) : (
                <>
                  <ThumbsUp size={16} className="mr-1.5" />
                  React
                </>
              )}
            </motion.button>

            {/* Reaction picker popup */}
            <AnimatePresence>
              {showReactionPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -5, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 -top-12 bg-white border border-gray-200 rounded-full shadow-lg z-10 flex items-center p-1 space-x-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactToPost("like")}
                    className={`p-2 rounded-full hover:bg-blue-100 ${userReaction === "like" ? "bg-blue-50" : ""}`}
                    title="Like"
                  >
                    <span className="text-lg">👍</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactToPost("love")}
                    className={`p-2 rounded-full hover:bg-red-100 ${userReaction === "love" ? "bg-red-50" : ""}`}
                    title="Love"
                  >
                    <span className="text-lg">❤️</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactToPost("sad")}
                    className={`p-2 rounded-full hover:bg-yellow-100 ${userReaction === "sad" ? "bg-yellow-50" : ""}`}
                    title="Sad"
                  >
                    <span className="text-lg">😢</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactToPost("wow")}
                    className={`p-2 rounded-full hover:bg-purple-100 ${userReaction === "wow" ? "bg-purple-50" : ""}`}
                    title="Wow"
                  >
                    <span className="text-lg">😮</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactToPost("angry")}
                    className={`p-2 rounded-full hover:bg-orange-100 ${userReaction === "angry" ? "bg-orange-50" : ""}`}
                    title="Angry"
                  >
                    <span className="text-lg">😠</span>
                  </motion.button>
                  {userReaction && (
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReactToPost(userReaction)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      title="Remove reaction"
                    >
                      <X size={16} className="text-gray-600" />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center py-1.5 px-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={16} className="mr-1.5" />
            Comment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center py-1.5 px-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Share2 size={16} className="mr-1.5" />
            Share
          </motion.button>
        </motion.div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 px-4 py-4 bg-gray-50 rounded-b-lg"
          >
            <div className="mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6 text-gray-500"
                >
                  <MessageCircle size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No comments yet. Be the first to comment!</p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment._id || index}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="mb-3 bg-white p-3 rounded-md shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start">
                        <img
                          src={comment.user?.profilePicture || "/avatar.png"}
                          alt={comment.user?.name}
                          className="w-7 h-7 rounded-full mr-2 flex-shrink-0 border border-gray-200"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 mr-1.5">{comment.user?.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.createdAt))}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleAddComment}
              className="flex items-center"
            >
              <div className="flex-shrink-0 mr-2">
                <img
                  src={authUser?.profilePicture || "/avatar.png"}
                  alt={authUser?.name}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              </div>
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full pl-3 pr-10 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                  disabled={isAddingComment || !newComment.trim()}
                >
                  {isAddingComment ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reactions Modal */}
      <AnimatePresence>
        {showReactionsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
              ref={reactionsModalRef}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-gray-600" />
                  <h3 className="font-semibold text-lg">Reactions</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReactionsModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={18} className="text-gray-500" />
                </motion.button>
              </div>

              <div className="p-2">
                {/* Reaction type tabs */}
                <div className="flex border-b mb-2 overflow-x-auto">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${activeReactionTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                    onClick={() => setActiveReactionTab("all")}
                  >
                    All ({totalReactions})
                  </button>
                  {Object.keys(reactionsByType).map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 text-sm font-medium ${activeReactionTab === type ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                      onClick={() => setActiveReactionTab(type)}
                    >
                      <span className="mr-1">{getReactionEmoji(type)}</span>
                      {reactionsByType[type].length}
                    </button>
                  ))}
                </div>

                {/* Reactions list */}
                <div className="overflow-y-auto max-h-[50vh]">
                  {activeReactionTab === "all" ? (
                    Object.entries(reactionsByType).map(([type, reactions]) => (
                      <div key={type} className="mb-4">
                        <div className="flex items-center mb-2 px-2">
                          <span className="text-base mr-2">{getReactionEmoji(type)}</span>
                          <h4 className={`font-medium text-sm ${getReactionColor(type)}`}>
                            {getReactionText(type)} ({reactions.length})
                          </h4>
                        </div>
                        {reactions.map((reaction) => (
                          <motion.div
                            key={reaction._id || reaction.user}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                          >
                            <img
                              src={reaction.userDetails?.profilePicture || "/avatar.png"}
                              alt={reaction.userDetails?.name || "User"}
                              className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {reaction.userDetails?.name || "User"}
                                {reaction.user === authUser?._id && (
                                  <span className="ml-1 text-xs text-gray-500">(You)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">{reaction.userDetails?.headline || ""}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center mb-2 px-2">
                        <span className="text-base mr-2">{getReactionEmoji(activeReactionTab)}</span>
                        <h4 className={`font-medium text-sm ${getReactionColor(activeReactionTab)}`}>
                          {getReactionText(activeReactionTab)} ({reactionsByType[activeReactionTab]?.length || 0})
                        </h4>
                      </div>
                      {reactionsByType[activeReactionTab]?.map((reaction) => (
                        <motion.div
                          key={reaction._id || reaction.user}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                        >
                          <img
                            src={reaction.userDetails?.profilePicture || "/avatar.png"}
                            alt={reaction.userDetails?.name || "User"}
                            className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {reaction.userDetails?.name || "User"}
                              {reaction.user === authUser?._id && (
                                <span className="ml-1 text-xs text-gray-500">(You)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{reaction.userDetails?.headline || ""}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Post

