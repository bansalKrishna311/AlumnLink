import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader } from "lucide-react";

const PostComments = ({ 
  showComments, 
  comments, 
  authUser, 
  newComment, 
  setNewComment, 
  handleAddComment, 
  isAddingComment 
}) => {
  return (
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
                className="w-full pl-3 pr-10 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#fe6019] text-white p-1.5 rounded-full hover:bg-[#fe6019]/90 transition-colors"
                disabled={isAddingComment || !newComment.trim()}
              >
                {isAddingComment ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostComments;