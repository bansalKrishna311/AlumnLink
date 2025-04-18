import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader, CornerDownRight, X, Heart } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';

// Use memo to prevent unnecessary re-renders
const Comment = memo(({ 
  comment, 
  authUser, 
  handleReplyClick, 
  replyingTo, 
  replyContent, 
  setReplyContent, 
  submitReply, 
  cancelReply, 
  isAddingReply,
  handleLikeComment,
  handleLikeReply,
  isLikingComment,
  isLikingReply,
  totalCommentsCount
}) => {
  const hasLiked = comment.likes?.some(id => id.toString() === authUser?._id?.toString());
  const likeCount = comment.likes?.length || 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      className="mb-3 bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-start">
        <img
          src={comment.user?.profilePicture || "/avatar.png"}
          alt={comment.user?.name}
          className="w-8 h-8 rounded-full mr-2 flex-shrink-0 border border-gray-200 object-cover"
        />
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 mr-1.5">{comment.user?.name}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
          
          <div className="flex items-center mt-2 space-x-3">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`text-xs flex items-center ${hasLiked ? 'text-[#fe6019] font-medium' : 'text-gray-500'} hover:text-[#fe6019] transition-colors`}
              disabled={isLikingComment}
            >
              {hasLiked ? 
                <Heart size={14} className="mr-1 fill-[#fe6019] text-[#fe6019]" /> : 
                <Heart size={14} className="mr-1" />
              }
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            
            <button
              onClick={() => handleReplyClick(comment._id)}
              className="text-xs text-gray-500 flex items-center hover:text-[#fe6019] transition-colors"
            >
              <CornerDownRight size={14} className="mr-1" /> Reply
            </button>
          </div>
          
          {/* Replies section */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 border-l-2 border-gray-100 pl-3 space-y-2">
              {comment.replies.map((reply, replyIndex) => {
                const hasLikedReply = reply.likes?.some(id => id.toString() === authUser?._id?.toString());
                const replyLikeCount = reply.likes?.length || 0;
                
                return (
                  <div key={reply._id || replyIndex} className="bg-gray-50 rounded-md p-2">
                    <div className="flex items-start">
                      <img
                        src={reply.user?.profilePicture || "/avatar.png"}
                        alt={reply.user?.name || "User"}
                        className="w-6 h-6 rounded-full mr-1.5 flex-shrink-0 border border-gray-200 object-cover"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800 text-xs mr-1.5">
                            {typeof reply.user === 'object' && reply.user !== null ? reply.user.name : authUser?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs mt-0.5 whitespace-pre-wrap break-words">{reply.content}</p>
                        
                        <button
                          onClick={() => handleLikeReply(comment._id, reply._id)}
                          className={`text-xs flex items-center mt-1 ${hasLikedReply ? 'text-[#fe6019] font-medium' : 'text-gray-500'} hover:text-[#fe6019] transition-colors`}
                          disabled={isLikingReply}
                        >
                          {hasLikedReply ? 
                            <Heart size={12} className="mr-1 fill-[#fe6019] text-[#fe6019]" /> : 
                            <Heart size={12} className="mr-1" />
                          }
                          {replyLikeCount > 0 && <span>{replyLikeCount}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  alt={authUser?.name || "You"}
                  className="w-6 h-6 rounded-full border border-gray-200 object-cover"
                />
              </div>
              <div className="relative flex-grow">
                <div className="flex">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
                    className="w-full pl-2 pr-10 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent"
                    autoFocus
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
  );
});

const CommentsSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white p-3 rounded-md animate-pulse">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
  postId,
  handleLikeComment,
  handleLikeReply,
  isLikingComment,
  isLikingReply,
  totalCommentsCount
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    // Simulate loading comments (remove this in production and use real loading state)
    if (showComments) {
      setIsLoadingComments(true);
      const timer = setTimeout(() => {
        setIsLoadingComments(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [showComments]);

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
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              {totalCommentsCount > 0 ? (
                <>
                  {totalCommentsCount} {totalCommentsCount === 1 ? 'comment' : 'comments'} 
                  {comments.length > 0 && comments.some(c => c.replies?.length > 0) && (
                    <span className="text-xs ml-1 text-gray-500">
                      ({comments.length} {comments.length === 1 ? 'parent comment' : 'parent comments'})
                    </span>
                  )}
                </>
              ) : (
                "Comments"
              )}
            </h3>
          </div>
          
          <div className="mb-4 max-h-[400px] overflow-y-auto custom-scrollbar relative">
            {isLoadingComments ? (
              <CommentsSkeleton />
            ) : comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 text-gray-500"
              >
                <MessageCircle size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No comments yet. Be the first to comment!</p>
              </motion.div>
            ) : comments.length <= 5 ? (
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
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    authUser={authUser}
                    handleReplyClick={handleReplyClick}
                    replyingTo={replyingTo}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    submitReply={submitReply}
                    cancelReply={cancelReply}
                    isAddingReply={isAddingReply}
                    handleLikeComment={handleLikeComment}
                    handleLikeReply={handleLikeReply}
                    isLikingComment={isLikingComment}
                    isLikingReply={isLikingReply}
                    totalCommentsCount={totalCommentsCount}
                  />
                ))}
              </motion.div>
            ) : (
              <Virtuoso
                style={{ height: '400px' }}
                totalCount={comments.length}
                itemContent={(index) => (
                  <Comment
                    key={comments[index]._id}
                    comment={comments[index]}
                    authUser={authUser}
                    handleReplyClick={handleReplyClick}
                    replyingTo={replyingTo}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    submitReply={submitReply}
                    cancelReply={cancelReply}
                    isAddingReply={isAddingReply}
                    handleLikeComment={handleLikeComment}
                    handleLikeReply={handleLikeReply}
                    isLikingComment={isLikingComment}
                    isLikingReply={isLikingReply}
                    totalCommentsCount={totalCommentsCount}
                  />
                )}
              />
            )}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleAddComment}
            className="flex items-center sticky bottom-0 bg-gray-50 pt-2"
          >
            <div className="flex-shrink-0 mr-2">
              <img
                src={authUser?.profilePicture || "/avatar.png"}
                alt={authUser?.name || "You"}
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full pl-3 pr-10 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent shadow-sm"
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