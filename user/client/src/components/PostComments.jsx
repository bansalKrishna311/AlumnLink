import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader, CornerDownRight, X } from "lucide-react";

const PostComments = ({ 
  showComments, 
  comments, 
  authUser, 
  newComment, 
  setNewComment, 
  handleAddComment, 
  isAddingComment,
  handleAddReply,
  isAddingReply,
  postId
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const submitReply = async (e, commentId) => {
    e.preventDefault();
    if (!replyContent.trim() || isAddingReply) return;

    const success = await handleAddReply(e, commentId, replyContent);
    if (success) {
      setReplyContent("");
      setReplyingTo(null);
    }
  };
  
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
                        
                        {/* Reply button */}
                        <button
                          onClick={() => handleReplyClick(comment._id)}
                          className="text-xs text-gray-500 mt-1 flex items-center hover:text-[#fe6019] transition-colors"
                        >
                          <CornerDownRight size={12} className="mr-1" /> Reply
                        </button>
                        
                        {/* Replies section */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-4 mt-2 border-l-2 border-gray-100 pl-3">
                            {comment.replies.map((reply, replyIndex) => (
                              <div key={reply._id || replyIndex} className="mb-2">
                                <div className="flex items-start">
                                  <img
                                    src={reply.user?.profilePicture || "/avatar.png"}
                                    alt={reply.user?.name}
                                    className="w-5 h-5 rounded-full mr-1.5 flex-shrink-0 border border-gray-200"
                                  />
                                  <div>
                                    <div className="flex items-center">
                                      <span className="font-medium text-gray-800 text-xs mr-1.5">{reply.user?.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(reply.createdAt))}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-xs">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Reply form */}
                        {replyingTo === comment._id && (
                          <motion.form
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={(e) => submitReply(e, comment._id)}
                            className="flex items-center mt-2 ml-4"
                          >
                            <div className="flex-shrink-0 mr-1">
                              <img
                                src={authUser?.profilePicture || "/avatar.png"}
                                alt={authUser?.name}
                                className="w-5 h-5 rounded-full border border-gray-200"
                              />
                            </div>
                            <div className="relative flex-grow">
                              <div className="flex">
                                <input
                                  type="text"
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Write a reply..."
                                  className="w-full pl-2 pr-10 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={cancelReply}
                                  className="ml-1 text-gray-400 hover:text-gray-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="submit"
                                className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-[#fe6019] text-white p-1 rounded-full hover:bg-[#fe6019]/90 transition-colors"
                                disabled={isAddingReply || !replyContent.trim()}
                              >
                                {isAddingReply ? <Loader size={10} className="animate-spin" /> : <Send size={10} />}
                              </motion.button>
                            </div>
                          </motion.form>
                        )}
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