import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MessageCircle, Search, RefreshCw, UserCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const ConversationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {authUser && (
            <Sidebar user={authUser} />
          )}
          
          <div className="lg:col-span-3 space-y-4">
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