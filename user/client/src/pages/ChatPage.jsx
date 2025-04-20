import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  ArrowLeft, 
  UserCircle2, 
  Send, 
  Image, 
  Paperclip,
  ExternalLink
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageContent, setMessageContent] = useState("");
  
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: conversation, isLoading } = useQuery({
    queryKey: ["conversation", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/messages/${username}`);
      return response.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

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

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (username && conversation?.messages?.length) {
      markAsRead();
    }
  }, [username, conversation?.messages?.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageContent.trim() && !isSending) {
      sendMessage(messageContent.trim());
    }
  };

  const goBack = () => {
    navigate("/messages");
  };

  const goToProfile = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {authUser && (
            <Sidebar user={authUser} />
          )}
          
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
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
                
                <button
                  onClick={goToProfile}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="View profile"
                >
                  <ExternalLink size={16} className="text-gray-600" />
                </button>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#fe6019]"></div>
                  </div>
                ) : conversation?.messages?.length > 0 ? (
                  <div className="space-y-4">
                    {conversation.messages.map((message) => {
                      const isOwnMessage = message.sender._id === authUser?._id;
                      
                      return (
                        <div 
                          key={message._id} 
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              isOwnMessage 
                                ? 'bg-[#fe6019] text-white' 
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
              
              {/* Message input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
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
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;