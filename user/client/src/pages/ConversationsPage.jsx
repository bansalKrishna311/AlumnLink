import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MessageCircle, Search, RefreshCw, UserCircle2 } from "lucide-react";

const ConversationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Fetch existing conversations
  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/messages/conversations");
      return response.data;
    },
  });

  const filteredConversations = conversations?.filter(conversation => 
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshConversations = () => {
    refetch();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar with only recent chats */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Recent conversations for quick access */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <MessageCircle className="mr-2 text-[#fe6019]" size={18} />
                  Recent Chats
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#fe6019]"></div>
                  </div>
                ) : filteredConversations?.length > 0 ? (
                  filteredConversations.slice(0, 5).map((conversation) => (
                    <Link
                      key={conversation.user._id}
                      to={`/messages/${conversation.user.username}`}
                      className="block hover:bg-gray-50 transition-colors p-3"
                    >
                      <div className="flex items-center space-x-3">
                        {conversation.user.profilePicture ? (
                          <img
                            src={conversation.user.profilePicture}
                            alt={conversation.user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircle2 size={20} className="text-gray-500" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {conversation.user.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.lastMessage.content.length > 20 
                              ? conversation.lastMessage.content.substring(0, 20) + '...' 
                              : conversation.lastMessage.content}
                          </p>
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#fe6019] rounded-full">
                            {conversation.unreadCount}
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
              
              {filteredConversations?.length > 5 && (
                <div className="p-3 border-t border-gray-100">
                  <button 
                    onClick={() => navigate("/messages")} 
                    className="text-xs text-[#fe6019] hover:underline font-medium w-full text-center"
                  >
                    See all conversations
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                  <MessageCircle className="mr-2 text-[#fe6019]" size={24} />
                  Conversations
                </h1>
                <button 
                  onClick={refreshConversations} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Refresh conversations"
                >
                  <RefreshCw size={16} className="text-gray-600" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#fe6019]"></div>
                </div>
              ) : filteredConversations?.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map((conversation) => (
                    <Link
                      key={conversation.user._id}
                      to={`/messages/${conversation.user.username}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-4 flex items-center space-x-4">
                        {conversation.user.profilePicture ? (
                          <img
                            src={conversation.user.profilePicture}
                            alt={conversation.user.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircle2 size={24} className="text-gray-500" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-gray-800 truncate">
                              {conversation.user.name}
                              <span className="text-gray-500 font-normal ml-1">@{conversation.user.username}</span>
                            </h2>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <p className="text-sm text-gray-600 truncate flex-1">
                              {conversation.lastMessage.sender._id === authUser?._id ? 'You: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                            
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#fe6019] rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No conversations yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Start messaging your connections to build your network.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;