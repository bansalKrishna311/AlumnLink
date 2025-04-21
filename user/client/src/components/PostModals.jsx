import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Building, Briefcase, MapPin, Clock, Calendar, ThumbsUp, MessageCircle, Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import for navigation

const PostModals = ({
  post,
  showReactionsModal,
  setShowReactionsModal,
  showPostDetails,
  setShowPostDetails,
  authUser,
  getReactionEmoji,
  getReactionText,
  getReactionColor,
  getPostTypeIcon,
  totalReactions,
  comments,
  reactionsByType,
  activeReactionTab,
  setActiveReactionTab,
  reactionsModalRef,
  getUserDetailsFromReaction
}) => {
  const navigate = useNavigate(); // For navigation to profile pages

  // Function to navigate to a user's profile
  const navigateToProfile = (username) => {
    if (username) {
      navigate(`/profile/${username}`);
      setShowReactionsModal(false); // Close the modal when navigating
    }
  };

  return (
    <>
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
                  <Users size={18} className="mr-2 text-[#fe6019]" />
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
                    className={`px-4 py-2 text-sm font-medium ${activeReactionTab === "all" ? "text-[#fe6019] border-b-2 border-[#fe6019]" : "text-gray-600 hover:text-gray-900"}`}
                    onClick={() => setActiveReactionTab("all")}
                  >
                    All ({totalReactions})
                  </button>
                  {Object.keys(reactionsByType).map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 text-sm font-medium ${activeReactionTab === type ? "text-[#fe6019] border-b-2 border-[#fe6019]" : "text-gray-600 hover:text-gray-900"}`}
                      onClick={() => setActiveReactionTab(type)}
                    >
                      <span className="mr-1">{getReactionEmoji(type)}</span>
                      {reactionsByType[type].length}
                    </button>
                  ))}
                </div>

                {/* Reactions list */}
                <div className="overflow-y-auto max-h-[50vh]">
                  {totalReactions > 0 ? (
                    activeReactionTab === "all" ? (
                      Object.entries(reactionsByType).map(([type, reactions]) => (
                        <div key={type} className="mb-4">
                          <div className="flex items-center mb-2 px-2">
                            <span className="text-base mr-2">{getReactionEmoji(type)}</span>
                            <h4 className={`font-medium text-sm ${getReactionColor(type)}`}>
                              {getReactionText(type)} ({reactions.length})
                            </h4>
                          </div>
                          {reactions.map((reaction) => {
                            const userDetails = getUserDetailsFromReaction(reaction);
                            return (
                              <motion.div
                                key={reaction._id || `reaction-${Math.random()}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center p-2 hover:bg-[#fff8f5] rounded-md"
                              >
                                <img
                                  src={userDetails.profilePicture || "/avatar.png"}
                                  alt={userDetails.name || "User"}
                                  className="w-8 h-8 rounded-full mr-3 border border-gray-200 cursor-pointer"
                                  onClick={() => navigateToProfile(userDetails.username || userDetails.name)}
                                />
                                <div className="flex-grow">
                                  <p 
                                    className="font-medium text-sm cursor-pointer hover:text-[#fe6019]"
                                    onClick={() => navigateToProfile(userDetails.username || userDetails.name)}
                                  >
                                    {userDetails.name || "Unknown User"}
                                    {reaction.user && reaction.user._id 
                                      ? (reaction.user._id === authUser?._id && <span className="ml-1 text-xs text-[#fe6019]">(You)</span>) 
                                      : (reaction.user === authUser?._id && <span className="ml-1 text-xs text-[#fe6019]">(You)</span>)
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">{userDetails.headline || ""}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      <div className="mb-4">
                        {reactionsByType[activeReactionTab]?.map((reaction) => {
                          const userDetails = getUserDetailsFromReaction(reaction);
                          return (
                            <motion.div
                              key={reaction._id || `reaction-${Math.random()}`}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center p-2 hover:bg-[#fff8f5] rounded-md"
                            >
                              <img
                                src={userDetails.profilePicture || "/avatar.png"}
                                alt={userDetails.name || "User"}
                                className="w-8 h-8 rounded-full mr-3 border border-gray-200 cursor-pointer"
                                onClick={() => navigateToProfile(userDetails.username || userDetails.name)}
                              />
                              <div className="flex-grow">
                                <p 
                                  className="font-medium text-sm cursor-pointer hover:text-[#fe6019]"
                                  onClick={() => navigateToProfile(userDetails.username || userDetails.name)}
                                >
                                  {userDetails.name || "Unknown User"}
                                  {reaction.user && reaction.user._id 
                                    ? (reaction.user._id === authUser?._id && <span className="ml-1 text-xs text-[#fe6019]">(You)</span>) 
                                    : (reaction.user === authUser?._id && <span className="ml-1 text-xs text-[#fe6019]">(You)</span>)
                                  }
                                </p>
                                <p className="text-xs text-gray-500">{userDetails.headline || ""}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 text-sm">No reactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Details Modal */}
      <AnimatePresence>
        {showPostDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPostDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-32 bg-gradient-to-r from-[#fe6019] to-[#ff8a00] flex items-end p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPostDetails(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={18} className="text-white" />
                </motion.button>
                <div className="relative flex items-end">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={post.author?.profilePicture || "/avatar.png"}
                    alt={post.author?.name}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover cursor-pointer"
                    onClick={() => navigateToProfile(post.author?.username || post.author?.name)}
                  />
                  <div className="ml-4 mb-1 text-white">
                    <motion.h3 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-semibold text-xl cursor-pointer hover:underline"
                      onClick={() => navigateToProfile(post.author?.username || post.author?.name)}
                    >
                      {post.author?.name}
                    </motion.h3>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/80 text-sm"
                    >
                      {post.author?.headline}
                    </motion.p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}  
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-[#fff8f5] p-4 rounded-xl">
                    <h4 className="font-medium text-[#fe6019] mb-2 flex items-center">
                      {getPostTypeIcon(post.type)}
                      <span className="ml-2">Type</span>
                    </h4>
                    <p className="text-gray-600 capitalize">{post.type}</p>
                  </div>
                  <div className="bg-[#fff8f5] p-4 rounded-xl">
                    <h4 className="font-medium text-[#fe6019] mb-2">Posted</h4>
                    <p className="text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </motion.div>

                {/* Admin Approval Information */}
                {post.adminId && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="bg-[#f0fff4] p-4 rounded-xl border border-green-100"
                  >
                    <h4 className="font-medium text-green-600 mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Approved by Admin
                    </h4>
                    <div className="flex items-center mt-2">
                      <img
                        src={post.adminId.profilePicture || "/avatar.png"}
                        alt={post.adminId.name}
                        className="w-8 h-8 rounded-full mr-3 border border-gray-200 cursor-pointer"
                        onClick={() => navigateToProfile(post.adminId.username)}
                      />
                      <div>
                        <p 
                          className="font-medium text-sm cursor-pointer hover:text-[#fe6019]"
                          onClick={() => navigateToProfile(post.adminId.username)}
                        >
                          {post.adminId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.reviewedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(post.type === "job" && post.jobDetails) && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#fff8f5] p-4 rounded-xl space-y-3"
                  >
                    <h4 className="font-medium text-[#fe6019] flex items-center">
                      <Briefcase size={16} className="mr-2 text-[#fe6019]" />
                      Job Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Company</p>
                        <p className="text-gray-600">{post.jobDetails.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Title</p>
                        <p className="text-gray-600">{post.jobDetails.jobTitle}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-[#fe6019] font-medium">Location</p>
                        <p className="text-gray-600">{post.jobDetails.jobLocation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(post.type === "event" && post.eventDetails) && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#fff8f5] p-4 rounded-xl space-y-3"
                  >
                    <h4 className="font-medium text-[#fe6019] flex items-center">
                      <Calendar size={16} className="mr-2 text-[#fe6019]" />
                      Event Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="col-span-2">
                        <p className="text-sm text-[#fe6019] font-medium">Event Name</p>
                        <p className="text-gray-600">{post.eventDetails.eventName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Date</p>
                        <p className="text-gray-600">
                          {new Date(post.eventDetails.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Location</p>
                        <p className="text-gray-600">{post.eventDetails.eventLocation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(post.type === "internship" && post.internshipDetails) && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#fff8f5] p-4 rounded-xl space-y-3"
                  >
                    <h4 className="font-medium text-[#fe6019] flex items-center">
                      <Clock size={16} className="mr-2 text-[#fe6019]" />
                      Internship Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Company</p>
                        <p className="text-gray-600">{post.internshipDetails.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#fe6019] font-medium">Duration</p>
                        <p className="text-gray-600">{post.internshipDetails.internshipDuration}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-[#fff8f5] p-4 rounded-xl"
                >
                  <h4 className="font-medium text-[#fe6019] mb-3 flex items-center">
                    <Users size={16} className="mr-2 text-[#fe6019]" />
                    Engagement
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-[#ffede3] rounded-lg">
                        <ThumbsUp size={16} className="text-[#fe6019]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reactions</p>
                        <p className="font-medium text-[#fe6019]">{totalReactions}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-[#ffede3] rounded-lg">
                        <MessageCircle size={16} className="text-[#fe6019]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Comments</p>
                        <p className="font-medium text-[#fe6019]">{comments.length}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostModals;