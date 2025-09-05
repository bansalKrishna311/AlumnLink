import { Link } from "react-router-dom";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { X, Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostHeader = ({ 
  post, 
  authUser, 
  showOptionsMenu, 
  setShowOptionsMenu, 
  setShowPostDetails, 
  handleDeletePost, 
  isDeletingPost, 
  optionsMenuRef, 
  getPostTypeBadgeColor, 
  getPostTypeIcon,
  handleBookmarkPost,
  isBookmarking,
  isBookmarked
}) => {
  const navigate = useNavigate();
  const isOwner = authUser?._id === post.author?._id;
  const isAdminAuthor = post.author?.headline === "AlumnLink Admin" || post.author?.headline === "AlumnLink superadmin";
  
  // Determine the admin status text
  let adminStatusText = null;
  
  // Check if this post was created by SubAdmin on behalf of someone else
  if (post.createdBy && post.onBehalfOf && post.createdBy._id !== post.onBehalfOf._id) {
    adminStatusText = `Admin Announcement by ${post.createdBy.name}`;
  } else if ((isAdminAuthor && !post.adminId) || (post.adminId && post.adminId._id === post.author?._id)) {
    adminStatusText = "Admin Announcement";
  } else if (post.adminId) {
    adminStatusText = `Posted for  ${post.adminId.name}`;
  }

  // Remove the separate subAdminStatusText since we merged it with adminStatusText

  return (
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
          {/* First row: Author name and post type */}
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
          
          {/* Second row: Admin status and time */}
          <div className="flex items-center text-xs text-gray-500">
            {adminStatusText && (
              <div className="flex items-center mr-2">
                <CheckCircle size={10} className="text-green-500 mr-1" />
                {adminStatusText.startsWith("Posted for") ? (
                  <>
                    Posted for <Link to={`/profile/${post.adminId?.username}`} className="text-[#fe6019] hover:underline">{post.adminId?.name}</Link>
                  </>
                ) : adminStatusText.startsWith("Admin Announcement by") ? (
                  <span className="text-green-600">
                    Admin Announcement by <Link to={`/profile/${post.createdBy?.username}`} className="text-[#fe6019] hover:underline">{post.createdBy?.name}</Link>
                  </span>
                ) : (
                  adminStatusText
                )}
              </div>
            )}
            
            <span className="mx-1 text-gray-300">•</span>
            
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
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
              className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                onClick={() => {
                  setShowPostDetails(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 flex items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Globe size={15} className="mr-2.5 text-gray-500" />
                View Post Details
              </motion.button>

              {!isOwner && (
                <motion.button
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  onClick={() => {
                    navigate(`/messages/${post.author?.username}`);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  <MessageSquare size={15} className="mr-2.5 text-gray-500" />
                  Message {post.author?.name.split(' ')[0]}
                </motion.button>
              )}

              <motion.button
                whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                onClick={() => {
                  handleBookmarkPost();
                  setShowOptionsMenu(false);
                }}
                disabled={isBookmarking}
                className="w-full text-left px-4 py-2.5 flex items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                {isBookmarking ? (
                  <div className="mr-2.5 animate-spin">⏳</div>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`mr-2.5 h-[15px] w-[15px] ${isBookmarked ? "fill-[#fe6019] text-[#fe6019]" : "fill-none text-gray-500"}`} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
                {isBookmarked ? "Unsave Post" : "Save Post"}
              </motion.button>

              {isOwner && (
                <motion.button
                  whileHover={{ backgroundColor: "rgba(254, 226, 226, 1)" }}
                  onClick={handleDeletePost}
                  className="w-full text-left px-4 py-2.5 flex items-center text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  {isDeletingPost ? (
                    <div className="mr-2.5 animate-spin">⏳</div>
                  ) : (
                    <X size={15} className="mr-2.5" />
                  )}
                  Delete Post
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostHeader;