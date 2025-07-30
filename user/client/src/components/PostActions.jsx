import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, X } from "lucide-react";

const PostActions = ({ 
  post, 
  userReaction, 
  handleReactToPost, 
  totalReactions, 
  comments, 
  setShowComments, 
  showComments,
  handleSharePost, 
  isReacting, 
  getReactionEmoji, 
  getReactionText, 
  getReactionColor, 
  getReactionBgColor,
  setShowReactionsModal,
  totalCommentsCount
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const reactionPickerRef = useRef(null);
  const reactionTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (reactionTimeout.current) {
      clearTimeout(reactionTimeout.current);
    }
    setShowReactionPicker(true);
  };

  const handleMouseLeave = (event) => {
    if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.relatedTarget)) {
      reactionTimeout.current = setTimeout(() => {
        setShowReactionPicker(false);
      }, 300);
    }
  };

  return (
    <>
      {/* Post stats */}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReactionsModal(true)}
            >
              <div className="flex -space-x-1 mr-1.5">
                {Object.keys(post.reactions?.reduce((counts, reaction) => {
                  counts[reaction.type] = (counts[reaction.type] || 0) + 1;
                  return counts;
                }, {}) || {})
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
            <span className="text-gray-600">
              {totalCommentsCount > 0 && (
                <>
                  {totalCommentsCount} {totalCommentsCount === 1 ? 'comment' : 'comments'}
                  {comments.length > 0 && comments.some(c => c.replies?.length > 0) }
                </>
              )}
              {totalCommentsCount === 0 && "Comment"}
            </span>
          </div>
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
                : "text-[#fe6019] hover:bg-[#fe6019]/10"
            }`}
            disabled={isReacting}
            onClick={() => userReaction ? handleReactToPost(userReaction) : handleReactToPost("like")}
            data-reaction={userReaction || "none"}
          >
            {userReaction ? (
              <>
                <span className="mr-1.5 text-lg inline-flex items-center justify-center">{getReactionEmoji(userReaction)}</span>
                <span className="font-medium">{getReactionText(userReaction)}</span>
              </>
            ) : (
              <>
                <ThumbsUp size={16} className="mr-1.5" />
                <span>React</span>
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
                  whileHover={{ scale: 1.7 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactToPost("like")}
                  className={`p-2 rounded-full hover:bg-[#fe6019]/10 ${userReaction === "like" ? "bg-[#fe6019]/10" : ""}`}
                  title="Like"
                >
                  <span className="text-lg">👍</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.7 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactToPost("love")}
                  className={`p-2 rounded-full hover:bg-[#fe6019]/10 ${userReaction === "love" ? "bg-[#fe6019]/10" : ""}`}
                  title="Love"
                >
                  <span className="text-lg">❤️</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.7 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactToPost("sad")}
                  className={`p-2 rounded-full hover:bg-[#fe6019]/10 ${userReaction === "sad" ? "bg-[#fe6019]/10" : ""}`}
                  title="Sad"
                >
                  <span className="text-lg">😢</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.7 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactToPost("wow")}
                  className={`p-2 rounded-full hover:bg-[#fe6019]/10 ${userReaction === "wow" ? "bg-[#fe6019]/10" : ""}`}
                  title="Wow"
                >
                  <span className="text-lg">😮</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.7 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactToPost("angry")}
                  className={`p-2 rounded-full hover:bg-[#fe6019]/10 ${userReaction === "angry" ? "bg-[#fe6019]/10" : ""}`}
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
          className="flex items-center justify-center py-1.5 px-3 text-sm font-medium text-[#fe6019] rounded-md hover:bg-[#fe6019]/10 transition-colors"
        >
          <MessageCircle size={16} className="mr-1.5" />
          Comment
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSharePost}
          className="flex items-center justify-center py-1.5 px-3 text-sm font-medium text-[#fe6019] rounded-md hover:bg-[#fe6019]/10 transition-colors"
        >
          <Share2 size={16} className="mr-1.5" />
          Share
        </motion.button>
      </motion.div>
    </>
  );
};

export default PostActions;