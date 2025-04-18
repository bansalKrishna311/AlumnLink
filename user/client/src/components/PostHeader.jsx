import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { X, Globe } from "lucide-react";

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
  getPostTypeIcon 
}) => {
  const isOwner = authUser?._id === post.author?._id;

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