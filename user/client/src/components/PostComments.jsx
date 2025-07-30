import { useState, memo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader, CornerDownRight, X, Heart, Trash2 } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import MentionDropdown from "./MentionDropdown";

// Function to render mentions with highlighted styling
const renderContentWithMentions = (content, navigateToProfile) => {
  if (!content) return null;

  // Handle both old format @[username](userId) and new format @username for backward compatibility
  const oldMentionPattern = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const newMentionPattern = /@(\w+)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  let processedContent = content;

  // First, process old format mentions (for backward compatibility)
  while ((match = oldMentionPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const [, username] = match; // Only use username, ignore userId for security
    parts.push(
      <span
        key={`old-mention-${username}-${match.index}`}
        className="inline-block font-medium text-[#fe6019] cursor-pointer hover:underline"
        onClick={() => navigateToProfile(username)}
      >
        @{username}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Then process new format mentions in remaining text
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex);
    let remainingParts = [];
    let remainingLastIndex = 0;
    
    // Reset regex lastIndex
    newMentionPattern.lastIndex = 0;
    
    while ((match = newMentionPattern.exec(remainingText)) !== null) {
      if (match.index > remainingLastIndex) {
        remainingParts.push(remainingText.substring(remainingLastIndex, match.index));
      }

      const username = match[1];
      remainingParts.push(
        <span
          key={`new-mention-${username}-${match.index}`}
          className="inline-block font-medium text-[#fe6019] cursor-pointer hover:underline"
          onClick={() => navigateToProfile(username)}
        >
          @{username}
        </span>
      );

      remainingLastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (remainingLastIndex < remainingText.length) {
      remainingParts.push(remainingText.substring(remainingLastIndex));
    }

    parts.push(...remainingParts);
  }

  return parts.length > 0 ? parts : content;
};

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
  handleDeleteComment,
  handleDeleteReply,
  isDeletingComment,
  isDeletingReply,
  totalCommentsCount,
  navigateToProfile,
  postAuthorId
}) => {
  const hasLiked = comment.likes?.some(id => id.toString() === authUser?._id?.toString());
  const likeCount = comment.likes?.length || 0;

  const [mentionDropdownVisible, setMentionDropdownVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(null);
  const replyInputRef = useRef(null);

  const handleReplyChange = (e) => {
    const value = e.target.value;
    setReplyContent(value);

    const cursorPos = e.target.selectionStart;

    let mentionStart = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (value[i] === '@') {
        mentionStart = i;
        break;
      } else if (value[i] === ' ' || value[i] === '\n') {
        break;
      }
    }

    if (mentionStart !== -1) {
      const mentionText = value.substring(mentionStart + 1, cursorPos);
      setMentionQuery(mentionText);
      setMentionDropdownVisible(true);

      if (replyInputRef.current) {
        const { top, left, height } = replyInputRef.current.getBoundingClientRect();
        setCursorPosition({ top: height + 5, left: 10 });
      }
    } else {
      setMentionDropdownVisible(false);
    }
  };

  const handleReplyMentionSelect = (user) => {
    if (!user) {
      setMentionDropdownVisible(false);
      return;
    }

    const cursorPos = replyInputRef.current.selectionStart;
    const text = replyContent;
    let mentionStart = -1;

    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        mentionStart = i;
        break;
      } else if (text[i] === ' ' || text[i] === '\n') {
        break;
      }
    }

    if (mentionStart !== -1) {
      // Use secure @username format instead of exposing user ID
      const username = user.username || user.name.replace(/\s+/g, '');
      const mentionText = `@${username}`;
      
      const newText = text.substring(0, mentionStart) + 
                      mentionText + 
                      text.substring(cursorPos);

      setReplyContent(newText);

      setTimeout(() => {
        const newCursorPos = mentionStart + mentionText.length;
        replyInputRef.current.focus();
        replyInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }

    setMentionDropdownVisible(false);
  };

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
          className="w-8 h-8 rounded-full mr-2 flex-shrink-0 border border-gray-200 object-cover cursor-pointer"
          onClick={() => navigateToProfile(comment.user?.username || comment.user?.name)}
        />
        <div className="flex-grow">
          <div className="flex items-center">
            <span 
              className="font-semibold text-gray-800 mr-1.5 cursor-pointer hover:text-[#fe6019]"
              onClick={() => navigateToProfile(comment.user?.username || comment.user?.name)}
            >
              {comment.user?.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="text-gray-700 text-sm mt-1 whitespace-pre-wrap break-words">
            {renderContentWithMentions(comment.content, navigateToProfile)}
          </div>
          
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

            {/* Delete button - show for comment author, post author, or admin */}
            {(authUser?._id === comment.user?._id || 
              authUser?._id === postAuthorId || 
              authUser?.role === 'admin' || 
              authUser?.role === 'superadmin') && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-xs text-red-500 flex items-center hover:text-red-600 transition-colors"
                disabled={isDeletingComment}
              >
                {isDeletingComment ? 
                  <Loader size={14} className="mr-1 animate-spin" /> : 
                  <Trash2 size={14} className="mr-1" />
                }
                Delete
              </button>
            )}
          </div>
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 border-l-2 border-gray-100 pl-3 space-y-2">
              {comment.replies.map((reply, replyIndex) => {
                const hasLikedReply = reply.likes?.some(id => id.toString() === authUser?._id?.toString());
                const replyLikeCount = reply.likes?.length || 0;

                // Use object destructuring to safely access the user properties
                const replyUser = typeof reply.user === 'object' ? reply.user : null;
                const replyUserPicture = replyUser?.profilePicture || 
                  (reply.user === authUser?._id ? authUser?.profilePicture : "/avatar.png");

                const replyUserName = replyUser?.name || 
                  (reply.user === authUser?._id ? authUser?.name : "Unknown User");

                const replyUsername = replyUser?.username || 
                  (replyUser?.name ? replyUser.name : 
                  (reply.user === authUser?._id ? authUser?.username || authUser?.name : "unknown"));

                return (
                  <div key={reply._id || replyIndex} className="bg-gray-50 rounded-md p-2">
                    <div className="flex items-start">
                      <img
                        src={replyUserPicture}
                        alt={replyUserName}
                        className="w-6 h-6 rounded-full mr-1.5 flex-shrink-0 border border-gray-200 object-cover cursor-pointer"
                        onClick={() => navigateToProfile(replyUsername)}
                      />
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span 
                            className="font-semibold text-gray-800 text-xs mr-1.5 cursor-pointer hover:text-[#fe6019]"
                            onClick={() => navigateToProfile(replyUsername)}
                          >
                            {replyUserName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-gray-700 text-xs mt-0.5 whitespace-pre-wrap break-words">
                          {renderContentWithMentions(reply.content, navigateToProfile)}
                        </div>
                        
                        <div className="flex items-center mt-1 space-x-2">
                          <button
                            onClick={() => handleLikeReply(comment._id, reply._id)}
                            className={`text-xs flex items-center ${hasLikedReply ? 'text-[#fe6019] font-medium' : 'text-gray-500'} hover:text-[#fe6019] transition-colors`}
                            disabled={isLikingReply}
                          >
                            {hasLikedReply ? 
                              <Heart size={12} className="mr-1 fill-[#fe6019] text-[#fe6019]" /> : 
                              <Heart size={12} className="mr-1" />
                            }
                            {replyLikeCount > 0 && <span>{replyLikeCount}</span>}
                          </button>

                          {/* Delete button for replies - show for reply author, post author, or admin */}
                          {(authUser?._id === reply.user?._id || 
                            authUser?._id === reply.user || 
                            authUser?._id === postAuthorId || 
                            authUser?.role === 'admin' || 
                            authUser?.role === 'superadmin') && (
                            <button
                              onClick={() => handleDeleteReply(comment._id, reply._id)}
                              className="text-xs text-red-500 flex items-center hover:text-red-600 transition-colors"
                              disabled={isDeletingReply}
                            >
                              {isDeletingReply ? 
                                <Loader size={12} className="mr-1 animate-spin" /> : 
                                <Trash2 size={12} className="mr-1" />
                              }
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
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
                    onChange={handleReplyChange}
                    placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
                    className="w-full pl-2 pr-10 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent"
                    autoFocus
                    ref={replyInputRef}
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

                <AnimatePresence>
                  {mentionDropdownVisible && (
                    <MentionDropdown
                      query={mentionQuery}
                      visible={mentionDropdownVisible}
                      onSelect={handleReplyMentionSelect}
                      position={cursorPosition}
                    />
                  )}
                </AnimatePresence>
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
  handleDeleteComment,
  handleDeleteReply,
  isDeletingComment,
  isDeletingReply,
  totalCommentsCount,
  postAuthorId
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const navigate = useNavigate();

  const [mentionDropdownVisible, setMentionDropdownVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(null);
  const commentInputRef = useRef(null);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['mentionUsers'],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/mention-suggestions");
      return response.data;
    }
  });

  useEffect(() => {
    if (showComments) {
      setIsLoadingComments(true);
      const timer = setTimeout(() => {
        setIsLoadingComments(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [showComments]);

  const handleReplyClick = useCallback((commentId) => {
    setReplyingTo(commentId);
    setReplyContent("");
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyContent("");
  }, []);

  const submitReply = useCallback(async (e, commentId) => {
    e.preventDefault();
    if (!replyContent.trim() || isAddingReply) return;

    const success = await handleAddReply(e, commentId, replyContent);
    if (success) {
      setReplyContent("");
      setReplyingTo(null);
    }
  }, [replyContent, isAddingReply, handleAddReply]);

  const navigateToProfile = useCallback((username) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  }, [navigate]);

  const handleCommentChange = useCallback((e) => {
    const value = e.target.value;
    setNewComment(value);

    const cursorPos = e.target.selectionStart;

    let mentionStart = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (value[i] === '@') {
        mentionStart = i;
        break;
      } else if (value[i] === ' ' || value[i] === '\n') {
        break;
      }
    }

    if (mentionStart !== -1) {
      const mentionText = value.substring(mentionStart + 1, cursorPos);
      setMentionQuery(mentionText);
      setMentionDropdownVisible(true);
      
      // Calculate the exact position of the @ character for the dropdown
      if (commentInputRef.current) {
        const inputRect = commentInputRef.current.getBoundingClientRect();
        const caretCoordinates = getCaretCoordinates(commentInputRef.current, mentionStart);
        
        // Position the dropdown at the @ character
        setCursorPosition({ 
          top: inputRect.top + caretCoordinates.top + window.scrollY,
          left: inputRect.left + caretCoordinates.left - 5 // Small offset for better alignment
        });
      }
    } else {
      setMentionDropdownVisible(false);
    }
  }, [setNewComment]);

  const handleMentionSelect = useCallback((user) => {
    if (!user) {
      setMentionDropdownVisible(false);
      return;
    }

    const cursorPos = commentInputRef.current.selectionStart;
    const text = newComment;
    let mentionStart = -1;

    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        mentionStart = i;
        break;
      } else if (text[i] === ' ' || text[i] === '\n') {
        break;
      }
    }

    if (mentionStart !== -1) {
      // Use secure @username format instead of exposing user ID
      const username = user.username || user.name.replace(/\s+/g, '');
      const mentionText = `@${username}`;
      
      const newText = text.substring(0, mentionStart) + 
                      mentionText + 
                      text.substring(cursorPos);

      setNewComment(newText);

      setTimeout(() => {
        const newCursorPos = mentionStart + mentionText.length;
        commentInputRef.current.focus();
        commentInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }

    setMentionDropdownVisible(false);
  }, [newComment, setNewComment]);

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
                  {comments.length > 0 && comments.some(c => c.replies?.length > 0) }
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
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteReply={handleDeleteReply}
                    isDeletingComment={isDeletingComment}
                    isDeletingReply={isDeletingReply}
                    totalCommentsCount={totalCommentsCount}
                    navigateToProfile={navigateToProfile}
                    postAuthorId={postAuthorId}
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
                    handleDeleteComment={handleDeleteComment}
                    handleDeleteReply={handleDeleteReply}
                    isDeletingComment={isDeletingComment}
                    isDeletingReply={isDeletingReply}
                    totalCommentsCount={totalCommentsCount}
                    navigateToProfile={navigateToProfile}
                    postAuthorId={postAuthorId}
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
                className="w-8 h-8 rounded-full border border-gray-200 object-cover cursor-pointer"
                onClick={() => navigateToProfile(authUser?.username || authUser?.name)}
              />
            </div>
            <div className="relative w-full" style={{ position: "relative" }}>
              <input
                type="text"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment... (Use @ to mention)"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#fe6019] focus:border-transparent shadow-sm"
                ref={commentInputRef}
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
              
              <div className="relative w-full" style={{ position: "relative" }}>
                <AnimatePresence>
                  {mentionDropdownVisible && (
                    <MentionDropdown
                      query={mentionQuery}
                      visible={mentionDropdownVisible}
                      onSelect={handleMentionSelect}
                      users={users}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostComments;