import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  ArrowLeft, 
  UserCircle2, 
  Send, 
  Image, 
  Smile,
  ExternalLink,
  Info,
  Phone,
  Video,
  MoreVertical,
  Users,
  Plus,
  Search
} from "lucide-react";
import toast from "react-hot-toast";
import { debounce } from "lodash.debounce";
import { useAuthUser, useUserConnections, useSameAdminUsers, useConversations, useOptimizedSearch } from "@/hooks/useAppData";

const ChatPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageContent, setMessageContent] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use Zustand store for efficient data management
  const { data: authUser } = useAuthUser();
  const { data: userConnections, isLoading: isLoadingConnections } = useUserConnections();
  const { data: sameAdminUsers, isLoading: isLoadingSameAdminUsers } = useSameAdminUsers();
  const { data: conversations } = useConversations();

  // Single conversation query (this still needs real-time updates)
  const { data: conversation, isLoading } = useQuery({
    queryKey: ["conversation", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/messages/${username}`);
      return response.data;
    },
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    refetchInterval: 30000, // Reduced from 10 seconds to 30 seconds
  });

  // Group connections by user name instead of by organization
  const groupedConnections = useMemo(() => {
    if (!userConnections) return {};
    
    const groups = {};
    userConnections.forEach(connection => {
      // Only include connections with accepted status
      if (connection.status === "accepted") {
        const userName = connection.name || "Unknown User";
        if (!groups[userName]) {
          groups[userName] = [];
        }
        groups[userName].push(connection);
      }
    });
    
    return groups;
  }, [userConnections]);

  // Get user names sorted alphabetically
  const userNames = useMemo(() => {
    return Object.keys(groupedConnections).sort();
  }, [groupedConnections]);

  // Use optimized search hooks for better performance
  const {
    searchQuery: sameAdminSearchQuery,
    setSearchQuery: setSameAdminSearchQuery,
    filteredData: filteredSameAdminUsers,
  } = useOptimizedSearch(sameAdminUsers || [], ['name', 'username']);

  const {
    searchQuery: connectionsSearchQuery,
    setSearchQuery: setConnectionsSearchQuery,
    filteredData: filteredConnections,
  } = useOptimizedSearch(userConnections || [], ['name', 'username']);

  const {
    searchQuery: conversationsSearchQuery,
    setSearchQuery: setConversationsSearchQuery,
    filteredData: filteredConversations,
  } = useOptimizedSearch(conversations || [], ['user.name', 'user.username']);

  // Sync all search queries
  useEffect(() => {
    setSameAdminSearchQuery(searchQuery);
    setConnectionsSearchQuery(searchQuery);
    setConversationsSearchQuery(searchQuery);
  }, [searchQuery, setSameAdminSearchQuery, setConnectionsSearchQuery, setConversationsSearchQuery]);

  // Mark messages as read when viewing conversation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.patch(`/messages/${username}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    }
  });

  // Send a new message
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (content) => {
      return await axiosInstance.post('/messages/send', {
        recipientUsername: username,
        content
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["conversation", username]);
      queryClient.invalidateQueries(["conversations"]);
      setMessageContent("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  });

  // Scroll to bottom of messages when new messages arrive - optimized
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length, scrollToBottom]);

  // Mark messages as read when viewing conversation - optimized
  useEffect(() => {
    if (username && conversation?.messages?.length) {
      const timeoutId = setTimeout(() => markAsRead(), 1000); // Debounce marking as read
      return () => clearTimeout(timeoutId);
    }
  }, [username, conversation?.messages?.length, markAsRead]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (messageContent.trim() && !isSending) {
      sendMessage(messageContent.trim());
    }
  }, [messageContent, isSending, sendMessage]);

  const goBack = useCallback(() => {
    navigate("/messages");
  }, [navigate]);

  const goToProfile = useCallback(() => {
    navigate(`/profile/${username}`);
  }, [navigate, username]);

  // Group messages by date - optimized with useMemo
  const groupMessagesByDate = useCallback((messages) => {
    if (!messages || messages.length === 0) return {};
    
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, []);
  
  const messageGroups = useMemo(() => 
    groupMessagesByDate(conversation?.messages || []),
    [conversation?.messages, groupMessagesByDate]
  );
  
  // Function to determine if a sequence of messages is from the same sender
  const isConsecutiveMessage = useCallback((messages, index) => {
    if (index === 0) return false;
    
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    
    return currentMessage.sender._id === previousMessage.sender._id;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* New sidebar with contacts and recent chats */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Search contacts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Recent conversations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <MessageCircle className="mr-2 text-[#fe6019]" size={18} />
                  Recent Chats
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                {filteredConversations?.length > 0 ? (
                  filteredConversations.map((convo) => (
                    <Link
                      key={convo.user._id}
                      to={`/messages/${convo.user.username}`}
                      className={`block transition-colors p-3 ${
                        convo.user.username === username ? 'bg-[#fe6019]/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {convo.user.profilePicture ? (
                          <img
                            src={convo.user.profilePicture}
                            alt={convo.user.name}
                            className={`w-10 h-10 rounded-full object-cover ${
                              convo.user.username === username 
                                ? 'border-2 border-[#fe6019]' 
                                : 'border border-gray-200'
                            }`}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            convo.user.username === username 
                              ? 'bg-[#fe6019]/20 text-[#fe6019]' 
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <UserCircle2 size={20} />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${
                            convo.user.username === username ? 'text-[#fe6019]' : 'text-gray-800'
                          }`}>
                            {convo.user.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {convo.lastMessage.content.length > 20 
                              ? convo.lastMessage.content.substring(0, 20) + '...' 
                              : convo.lastMessage.content}
                          </p>
                        </div>
                        
                        {convo.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#fe6019] rounded-full">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">No recent conversations</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Users linked to same admin - Replaced with user-based grouping */}
            {userNames.map((userName, userIndex) => (
              <div key={userName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 flex items-center">
                    <Users className="mr-2 text-[#fe6019]" size={18} />
                    Connections with {userName}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                  {groupedConnections[userName].filter(user => 
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((user) => (
                    <Link
                      key={user._id}
                      to={`/messages/${user.username}`}
                      className={`block transition-colors p-3 ${
                        user.username === username ? 'bg-[#fe6019]/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className={`w-10 h-10 rounded-full object-cover ${
                              user.username === username 
                                ? 'border-2 border-[#fe6019]' 
                                : 'border border-gray-200'
                            }`}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.username === username 
                              ? 'bg-[#fe6019]/20 text-[#fe6019]' 
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <UserCircle2 size={20} />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${
                            user.username === username ? 'text-[#fe6019]' : 'text-gray-800'
                          }`}>
                            {user.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            @{user.username}
                          </p>
                        </div>
                        
                        {user.username !== username && (
                          <button className="p-1.5 bg-[#fe6019]/10 text-[#fe6019] rounded-full hover:bg-[#fe6019] hover:text-white transition-colors">
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </Link>
                  ))}
                  
                  {groupedConnections[userName].length === 0 && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">No contacts available</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* All connections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <Users className="mr-2 text-[#fe6019]" size={18} />
                  Your Connections
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[250px] overflow-y-auto">
                {isLoadingConnections ? (
                  <div className="p-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#fe6019]"></div>
                  </div>
                ) : filteredConnections?.length > 0 ? (
                  filteredConnections.map((connection) => (
                    <Link
                      key={connection._id}
                      to={`/messages/${connection.username}`}
                      className={`block transition-colors p-3 ${
                        connection.username === username ? 'bg-[#fe6019]/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {connection.profilePicture ? (
                          <img
                            src={connection.profilePicture}
                            alt={connection.name}
                            className={`w-10 h-10 rounded-full object-cover ${
                              connection.username === username 
                                ? 'border-2 border-[#fe6019]' 
                                : 'border border-gray-200'
                            }`}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            connection.username === username 
                              ? 'bg-[#fe6019]/20 text-[#fe6019]' 
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <UserCircle2 size={20} />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${
                            connection.username === username ? 'text-[#fe6019]' : 'text-gray-800'
                          }`}>
                            {connection.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            @{connection.username}
                          </p>
                        </div>
                        
                        {connection.username !== username && (
                          <button className="p-1.5 bg-[#fe6019]/10 text-[#fe6019] rounded-full hover:bg-[#fe6019] hover:text-white transition-colors">
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">No connections found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center">
                  <button 
                    onClick={goBack}
                    className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft size={16} className="text-gray-600" />
                  </button>
                  
                  <div className="flex items-center cursor-pointer" onClick={goToProfile}>
                    {conversation?.otherUser?.profilePicture ? (
                      <img 
                        src={conversation.otherUser.profilePicture} 
                        alt={conversation.otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <UserCircle2 size={20} className="text-gray-500" />
                      </div>
                    )}
                    
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {conversation?.otherUser?.name || username}
                      </h2>
                      <p className="text-xs text-gray-500">
                        @{conversation?.otherUser?.username || username}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Call"
                  >
                    <Phone size={16} className="text-gray-600" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Video call"
                  >
                    <Video size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-[#fe6019]/10 text-[#fe6019]' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Info"
                  >
                    <Info size={16} />
                  </button>
                  <button
                    onClick={goToProfile}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="View profile"
                  >
                    <ExternalLink size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Main chat area with sidebar */}
              <div className="flex-1 flex overflow-hidden">
                {/* Messages area */}
                <div className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${showInfo ? 'lg:border-r' : ''}`}>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#fe6019]"></div>
                    </div>
                  ) : conversation?.messages?.length > 0 ? (
                    <div className="space-y-6">
                      {Object.keys(messageGroups).map(date => (
                        <div key={date} className="space-y-4">
                          <div className="flex justify-center">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                              {new Date(date).toLocaleDateString() === new Date().toLocaleDateString() 
                                ? 'Today' 
                                : format(new Date(date), 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          {messageGroups[date].map((message, index) => {
                            const isOwnMessage = message.sender._id === authUser?._id;
                            const isConsecutive = isConsecutiveMessage(messageGroups[date], index);
                            
                            return (
                              <div 
                                key={message._id} 
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                              >
                                {!isOwnMessage && !isConsecutive && (
                                  <div className="flex-shrink-0 mr-2">
                                    {message.sender.profilePicture ? (
                                      <img
                                        src={message.sender.profilePicture}
                                        alt={message.sender.name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <UserCircle2 size={14} className="text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div 
                                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    isOwnMessage 
                                      ? 'bg-[#fe6019] text-white rounded-tr-none' 
                                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                  } ${isConsecutive ? (isOwnMessage ? 'rounded-tr-lg mr-2' : 'rounded-tl-lg ml-10') : ''}`}
                                >
                                  <p className="text-sm break-words">{message.content}</p>
                                  <p className={`text-xs mt-1 text-right ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                                    {format(new Date(message.createdAt), 'h:mm a')}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No messages yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Send a message to start a conversation with {conversation?.otherUser?.name || username}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Info sidebar - only show on larger screens */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 300, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="hidden lg:block w-[300px] border-l border-gray-200 bg-white overflow-y-auto"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Contact Info</h3>
                      </div>
                      
                      <div className="p-4 flex flex-col items-center text-center border-b border-gray-100">
                        {conversation?.otherUser?.profilePicture ? (
                          <img 
                            src={conversation.otherUser.profilePicture} 
                            alt={conversation.otherUser.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#fe6019]/20 mb-3"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                            <UserCircle2 size={40} className="text-gray-400" />
                          </div>
                        )}
                        
                        <h2 className="text-xl font-semibold text-gray-800">
                          {conversation?.otherUser?.name || username}
                        </h2>
                        <p className="text-sm text-gray-500 mb-3">
                          @{conversation?.otherUser?.username || username}
                        </p>
                        
                        <button
                          onClick={goToProfile}
                          className="text-sm text-[#fe6019] hover:underline font-medium flex items-center"
                        >
                          View full profile
                        </button>
                      </div>
                      
                      {conversation?.otherUser?.headline && (
                        <div className="p-4 border-b border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Headline</h4>
                          <p className="text-sm text-gray-600">{conversation.otherUser.headline}</p>
                        </div>
                      )}
                      
                      {/* Shared links will go here */}
                      <div className="p-4 border-b border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Shared networks</h4>
                        {conversation?.otherUser?.Links && conversation.otherUser.Links.length > 0 ? (
                          <div className="space-y-2">
                            {conversation.otherUser.Links.slice(0, 3).map((link, index) => (
                              <div key={index} className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                                {link.courseName || "Network"} ({link.batch || "N/A"})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No shared networks found</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Image size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!messageContent.trim() || isSending}
                    className={`p-2 rounded-full ${
                      !messageContent.trim() || isSending
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#fe6019] text-white hover:bg-[#e54e0e] transition-colors'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
            
            {/* Mobile contact info - only visible on small screens when info is toggled */}
            <AnimatePresence>
              {showInfo && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Info className="mr-2 text-[#fe6019]" size={16} />
                      Contact Info
                    </h3>
                  </div>
                  
                  <div className="p-4 flex items-center border-b border-gray-100">
                    {conversation?.otherUser?.profilePicture ? (
                      <img 
                        src={conversation.otherUser.profilePicture} 
                        alt={conversation.otherUser.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#fe6019]/20 mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <UserCircle2 size={30} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {conversation?.otherUser?.name || username}
                      </h2>
                      <p className="text-sm text-gray-500">
                        @{conversation?.otherUser?.username || username}
                      </p>
                      <button
                        onClick={goToProfile}
                        className="text-xs text-[#fe6019] hover:underline font-medium mt-1 flex items-center"
                      >
                        View profile <ExternalLink size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  {conversation?.otherUser?.headline && (
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Headline</h4>
                      <p className="text-sm text-gray-600">{conversation.otherUser.headline}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Quick Access */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 lg:hidden">
              <h3 className="text-sm font-medium text-gray-700 flex items-center mb-3">
                <Users className="mr-2 text-[#fe6019]" size={14} />
                Quick Access - Other Contacts
              </h3>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {sameAdminUsers && sameAdminUsers.slice(0, 5).map((user) => (
                  <Link
                    key={user._id}
                    to={`/messages/${user.username}`}
                    className="flex-shrink-0 flex flex-col items-center w-16"
                  >
                    <div className="relative mb-1">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className={`w-12 h-12 rounded-full object-cover ${
                            user.username === username 
                              ? 'border-2 border-[#fe6019]' 
                              : 'border-2 border-gray-200 hover:border-[#fe6019]'
                          } transition-colors`}
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          user.username === username 
                            ? 'bg-[#fe6019]/20 text-[#fe6019]' 
                            : 'bg-gray-200 text-gray-500 hover:bg-[#fe6019]/10'
                        } transition-colors`}>
                          <UserCircle2 size={20} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-800 truncate w-full text-center">{user.name.split(' ')[0]}</span>
                  </Link>
                ))}
                
                <Link
                  to="/messages"
                  className="flex-shrink-0 flex flex-col items-center w-16"
                >
                  <div className="w-12 h-12 rounded-full bg-[#fe6019]/10 flex items-center justify-center hover:bg-[#fe6019]/20 transition-colors mb-1">
                    <MoreVertical size={20} className="text-[#fe6019]" />
                  </div>
                  <span className="text-xs text-gray-800 truncate w-full text-center">See all</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;