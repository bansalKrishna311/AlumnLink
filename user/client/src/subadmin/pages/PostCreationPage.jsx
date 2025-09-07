import React, { useState, useRef, useEffect } from 'react';
import { Image, Calendar, Briefcase, Award, MessageCircle, X, Loader, FileText, TrendingUp, Bell, Users, AlertCircle, Check, ExternalLink, BarChart2, ChevronRight, Search, Filter, Info, Bookmark, Edit } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSubAdmin } from '../context/SubAdminContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const POST_TYPES = {
  discussion: { 
    color: 'bg-[#fe6019]', 
    icon: <MessageCircle size={18} />,
    title: 'Discussion',
    description: 'Start conversations with your network'
  },
  job: { 
    color: 'bg-[#fe6019]', 
    icon: <Briefcase size={18} />,
    title: 'Job',
    description: 'Share job opportunities'
  },
  internship: { 
    color: 'bg-[#fe6019]', 
    icon: <Award size={18} />,
    title: 'Internship',
    description: 'Post internship programs'
  },
  event: { 
    color: 'bg-[#fe6019]', 
    icon: <Calendar size={18} />,
    title: 'Event',
    description: 'Announce upcoming events'
  },
  other: { 
    color: 'bg-[#fe6019]', 
    icon: <FileText size={18} />,
    title: 'Other',
    description: 'Share any other announcement'
  }
};

const CreatePostPage = () => {
  const queryClient = useQueryClient();
  const { targetAdminId } = useSubAdmin();
  
  console.log('🎯 PostCreationPage - targetAdminId:', targetAdminId);
  
  const [formState, setFormState] = useState({
    showForm: false,
    type: '',
    content: '',
    image: null,
    jobDetails: { companyName: '', jobTitle: '', jobLocation: '' },
    internshipDetails: { companyName: '', internshipDuration: '' },
    eventDetails: { eventName: '', eventDate: '', eventLocation: '' },
    isSuccess: false,
    isPending: false
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const modalRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch recent posts data
  const { data: recentPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: async () => {
      const response = await axiosInstance.get('/posts/admin/recent');
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching recent posts:', error);
      toast.error('Failed to load recent posts data');
    }
  });

  // Fetch trending hashtags
  const { data: trendingTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['trendingTags'],
    queryFn: async () => {
      const response = await axiosInstance.get('/posts/admin/trending-tags');
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching trending tags:', error);
      toast.error('Failed to load trending tags');
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formState.showForm && modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formState.showForm]);

  const handleCloseModal = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFormState(prev => ({ ...prev, showForm: false, image: null }));
  };

  const handleOpenForm = (postType) => {
    setFormState(prev => ({
      ...prev,
      type: postType,
      showForm: true
    }));
  };

  const handleCreatePost = async () => {
    if (!formState.content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setFormState(prev => ({ ...prev, isPending: true }));
    try {
      const formData = new FormData();
      formData.append('content', formState.content);
      formData.append('type', formState.type);
      if (formState.image) formData.append('image', formState.image);
      
      // Add target admin ID if available (for SubAdmin creating posts on behalf of admin)
      if (targetAdminId) {
        console.log('🎯 PostCreationPage - Creating post on behalf of admin:', targetAdminId);
        formData.append('onBehalfOf', targetAdminId);
      }
      
      if (formState.type === 'job') {
        formData.append('jobDetails', JSON.stringify(formState.jobDetails));
      }
      if (formState.type === 'internship') {
        formData.append('internshipDetails', JSON.stringify(formState.internshipDetails));
      }
      if (formState.type === 'event') {
        formData.append('eventDetails', JSON.stringify(formState.eventDetails));
      }

      // Build URL with adminId parameter if available
      const params = new URLSearchParams();
      if (targetAdminId) {
        params.append('adminId', targetAdminId);
      }
      const queryString = params.toString();
      const url = `/posts/admin/create${queryString ? `?${queryString}` : ''}`;

      const response = await axiosInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      queryClient.invalidateQueries(["posts"]);
      
      setFormState(prev => ({
        ...prev, 
        isPending: false, 
        showForm: false,
        content: '',
        image: null,
        jobDetails: { companyName: '', jobTitle: '', jobLocation: '' },
        internshipDetails: { companyName: '', internshipDuration: '' },
        eventDetails: { eventName: '', eventDate: '', eventLocation: '' },
      }));
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      toast.success('Announcement posted successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
      setFormState(prev => ({ ...prev, isPending: false }));
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#fe6019] to-[#f97316] text-white py-8 px-6 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Announcement Management</h1>
              <p className="text-white/80 max-w-xl">
                Create and manage announcements to keep your community informed about important updates, events, and opportunities.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                <p className="text-2xl font-bold">{recentPosts?.stats?.totalPosts || 0}</p>
                <p className="text-xs text-white/80">Total Posts</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                <p className="text-2xl font-bold">{recentPosts?.stats?.postsThisMonth || 0}</p>
                <p className="text-xs text-white/80">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-[#fe6019]/50 focus:border-[#fe6019] transition-all duration-200"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </button>
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Type</span>
            </button>
            <button className="bg-[#fe6019] hover:bg-[#fe6019]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Engagement</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-[#fe6019] text-[#fe6019]' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'create' 
                ? 'border-[#fe6019] text-[#fe6019]' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Create Announcement
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'analytics' 
                ? 'border-[#fe6019] text-[#fe6019]' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#fe6019]/5 p-4 border-b border-[#fe6019]/10">
                  <h2 className="font-semibold text-lg text-gray-800">Recent Announcements</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {isLoadingPosts ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="p-4 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))
                  ) : recentPosts?.posts?.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="inline-flex rounded-full bg-yellow-100 p-3 mb-3">
                        <Info className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No announcements yet</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Start by creating your first announcement.
                      </p>
                      <button 
                        onClick={() => setActiveTab('create')} 
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-[#fe6019] hover:bg-[#fe6019]/90"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Create Announcement
                      </button>
                    </div>
                  ) : (
                    recentPosts?.posts?.map((post) => {
                      // Calculate reactions count for this post
                      const reactionsCount = post.reactions?.length || 0;
                      const commentsCount = post.comments?.length || 0;
                      
                      // Format post date
                      const postDate = new Date(post.createdAt);
                      const formattedDate = postDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      });
                      
                      return (
                        <div key={post._id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-[#fe6019]/10 text-[#fe6019]`}>
                              {POST_TYPES[post.type]?.icon || <FileText size={16} />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 capitalize">{post.type}</span>
                                <span className="text-xs text-gray-500">
                                  {formattedDate}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-2 mb-2">{post.content}</p>
                              <div className="flex items-center gap-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  {post.views || 0} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle size={14} />
                                  {commentsCount} comments
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp size={14} />
                                  {reactionsCount} reactions
                                </span>
                              </div>
                            </div>
                            <Link 
                              to={`/adminposts/${post._id}`} 
                              className="text-[#fe6019] hover:text-[#fe6019]/80"
                            >
                              <ExternalLink size={16} />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <Link 
                    to="/adminposts" 
                    className="text-[#fe6019] hover:text-[#fe6019]/80 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    View All Announcements
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h2 className="font-semibold text-lg text-gray-800 mb-4">Engagement Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <MessageCircle size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Comments</span>
                    </div>
                    <span className="font-semibold">{recentPosts?.stats?.engagement?.totalComments?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <TrendingUp size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Reactions</span>
                    </div>
                    <span className="font-semibold">{recentPosts?.stats?.engagement?.totalReactions?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <BarChart2 size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Most Engaged</span>
                    </div>
                    <span className="font-semibold capitalize">{recentPosts?.stats?.engagement?.mostEngagedType || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Trending Tags */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-gray-800">Trending Tags</h2>
                  <TrendingUp className="h-5 w-5 text-[#fe6019]" />
                </div>
                {isLoadingTags ? (
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : trendingTags?.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No trending tags yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trendingTags?.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{tag.tag}</span>
                          {tag.trend === 'up' && <span className="text-green-500 text-xs">↑</span>}
                          {tag.trend === 'down' && <span className="text-red-500 text-xs">↓</span>}
                        </div>
                        <span className="text-sm text-gray-500">{tag.count} posts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h2 className="font-semibold text-lg text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="w-full p-2 text-left text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-[#fe6019]" />
                    Create New Announcement
                  </button>
                  <Link 
                    to="/adminposts"
                    className="block w-full p-2 text-left text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BarChart2 className="h-4 w-4 text-[#fe6019]" />
                    View All Analytics
                  </Link>
                  <button className="w-full p-2 text-left text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bookmark className="h-4 w-4 text-[#fe6019]" />
                    Saved Drafts
                  </button>
                  <Link 
                    to="/admin/post-request"
                    className="block w-full p-2 text-left text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <AlertCircle className="h-4 w-4 text-[#fe6019]" />
                    Review Pending Posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a New Announcement</h2>
              <p className="text-gray-600 mb-6">
                Choose the type of announcement you would like to create. Each type has its own format and fields.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(POST_TYPES).map(([type, { color, icon, title }]) => (
                  <div 
                    key={type}
                    onClick={() => handleOpenForm(type)}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                  >
                    <div className={`${color} p-8 text-white flex items-center justify-center group-hover:bg-[#fe6019]/90 transition-all duration-300`}>
                      <div className="transform group-hover:scale-110 transition-all duration-300">
                        {React.cloneElement(icon, { size: 30 })}
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-800 group-hover:text-[#fe6019] transition-colors duration-300">{title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Create {title.toLowerCase()} announcement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold">{recentPosts?.stats?.engagement?.totalComments?.toLocaleString() || 0}</h3>
                <p className="text-sm text-gray-500">Total Comments</p>
                <div className="mt-3 text-xs text-green-500 font-medium flex items-center">
                  <span>↑ 8% from last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mb-3">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold">{recentPosts?.stats?.engagement?.totalReactions?.toLocaleString() || 0}</h3>
                <p className="text-sm text-gray-500">Total Reactions</p>
                <div className="mt-3 text-xs text-green-500 font-medium flex items-center">
                  <span>↑ 12% from last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
                <div className="p-3 rounded-full bg-[#fe6019]/20 text-[#fe6019] mb-3">
                  <BarChart2 size={24} />
                </div>
                <h3 className="text-xl font-bold">{recentPosts?.stats?.postsThisMonth || 0}</h3>
                <p className="text-sm text-gray-500">Posts This Month</p>
                <div className="mt-3 text-xs font-medium flex items-center">
                  {recentPosts?.stats?.weeklyGrowthRate > 0 ? (
                    <span className="text-green-500">↑ {recentPosts?.stats?.weeklyGrowthRate}% this week</span>
                  ) : recentPosts?.stats?.weeklyGrowthRate < 0 ? (
                    <span className="text-red-500">↓ {Math.abs(recentPosts?.stats?.weeklyGrowthRate)}% this week</span>
                  ) : (
                    <span className="text-gray-600">∼ No change this week</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#fe6019]/5 p-4 border-b border-[#fe6019]/10">
                  <h2 className="font-semibold text-lg text-gray-800">Engagement by Post Type</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {isLoadingPosts ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex justify-between mb-1 text-sm">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-8 bg-gray-200 rounded"></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2"></div>
                        </div>
                      ))
                    ) : (
                      Object.entries(recentPosts?.stats?.engagementByType || {}).map(([type, percentage]) => (
                        <div key={type}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-700 capitalize">{type}</span>
                            <span className="text-gray-600">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#fe6019] h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#fe6019]/5 p-4 border-b border-[#fe6019]/10">
                  <h2 className="font-semibold text-lg text-gray-800">Monthly Post Activity</h2>
                </div>
                <div className="p-5">
                  {isLoadingPosts ? (
                    <div className="flex items-end h-40 gap-2">
                      {Array(12).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-t-sm animate-pulse" style={{ height: '40%' }}></div>
                          <div className="w-8 h-3 mt-1 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-end h-40 gap-2">
                      {recentPosts?.stats?.monthlyPostData?.map((data, i) => {
                        // Find the maximum count to scale the chart
                        const maxCount = Math.max(...recentPosts.stats.monthlyPostData.map(d => d.count));
                        // Calculate height percentage (min 5% for visibility)
                        const heightPercentage = maxCount > 0 
                          ? Math.max(5, (data.count / maxCount) * 100) 
                          : 5;
                        
                        return (
                          <div key={data.month} className="flex-1 flex flex-col items-center">
                            <div 
                              className={`w-full rounded-t-sm ${data.isCurrent ? 'bg-[#fe6019]' : 'bg-[#fe6019]/30'}`} 
                              style={{ height: `${heightPercentage}%` }}
                              title={`${data.count} posts in ${data.month}`}
                            ></div>
                            <span className="text-xs mt-1 text-gray-500">{data.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-[#fe6019]/5 p-4 border-b border-[#fe6019]/10">
                <h2 className="font-semibold text-lg text-gray-800">Audience Demographics</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Audience by Region</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">North America</span>
                          <span className="text-gray-600">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Europe</span>
                          <span className="text-gray-600">30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Asia</span>
                          <span className="text-gray-600">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Other</span>
                          <span className="text-gray-600">5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Audience by Interest</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Technology</span>
                          <span className="text-gray-600">38%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Business</span>
                          <span className="text-gray-600">25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Education</span>
                          <span className="text-gray-600">22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-600">Other</span>
                          <span className="text-gray-600">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#fe6019]/5 p-4 border-b border-[#fe6019]/10 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800">Top Performing Posts</h2>
                <Link to="/admin/posts" className="text-[#fe6019] hover:text-[#fe6019]/80 text-sm">View all</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {isLoadingPosts ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                          <div>
                            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5"></div>
                    </div>
                  ))
                ) : (
                  recentPosts?.stats?.topPosts?.map((post, i) => {
                    // Get engagement metrics
                    const reactions = post.reactionCount || 0;
                    const comments = post.commentCount || 0;
                    const totalEngagement = reactions + comments;
                    
                    // Create a percentage for the progress bar (relative to highest performing post)
                    const maxEngagement = Math.max(...recentPosts.stats.topPosts.map(p => 
                      (p.reactionCount || 0) + (p.commentCount || 0)
                    ));
                    const percentage = maxEngagement > 0 ? (totalEngagement / maxEngagement) * 100 : 0;
                    
                    // Format time since post
                    const timeSince = new Date(post.createdAt);
                    const now = new Date();
                    const diffDays = Math.floor((now - timeSince) / (1000 * 60 * 60 * 24));
                    
                    // Format time string
                    let timeString;
                    if (diffDays === 0) {
                      timeString = 'Today';
                    } else if (diffDays === 1) {
                      timeString = 'Yesterday';
                    } else if (diffDays < 7) {
                      timeString = `${diffDays} days ago`;
                    } else if (diffDays < 30) {
                      timeString = `${Math.floor(diffDays / 7)} weeks ago`;
                    } else {
                      timeString = `${Math.floor(diffDays / 30)} months ago`;
                    }
                    
                    // Determine icon based on post type
                    let PostIcon;
                    switch(post.type) {
                      case 'job': PostIcon = Briefcase; break;
                      case 'event': PostIcon = Calendar; break;
                      case 'internship': PostIcon = Award; break;
                      case 'discussion': PostIcon = MessageCircle; break;
                      default: PostIcon = FileText;
                    }
                    
                    return (
                      <div key={post._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#fe6019]/10 text-[#fe6019] p-2 rounded-lg">
                              <PostIcon size={16} />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                                {post.content}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Posted {timeString}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              {reactions.toLocaleString()} reactions
                            </p>
                            <p className="text-xs text-gray-500">
                              {comments.toLocaleString()} comments
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-[#fe6019] h-1.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {formState.showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300">
            <div 
              ref={modalRef}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-0 overflow-y-auto max-h-[90vh] transform transition-all duration-300 scale-100"
              style={{
                backgroundImage: "url('../../public/background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                backgroundColor: "rgba(255, 255, 255, 0.97)"
              }}
            >
              <div className="text-xl font-semibold mb-4 text-white py-3 px-5 rounded-t-xl bg-gradient-to-r from-[#fe6019] to-[#f97316] flex justify-between items-center shadow-md">
                <span className="flex items-center gap-2">
                  {POST_TYPES[formState.type]?.icon}
                  Make an Announcement
                </span>
                <button 
                  onClick={handleCloseModal} 
                  className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src="/avatar.png"
                    alt="Admin"
                    className="w-10 h-10 rounded-full border-2 border-[#fe6019]/20 shadow-sm"
                  />
                  <textarea
                    value={formState.content}
                    onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What's on your mind?"
                    className="w-full p-3 rounded-lg bg-white border-[#fe6019]/20 border resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200 shadow-sm"
                  />
                </div>
                
                {formState.type === 'job' && (
                  <div className="space-y-3 mt-3 bg-white p-4 rounded-lg border border-[#fe6019]/20 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center border-b border-[#fe6019]/10 pb-2">
                      <Briefcase size={16} className="mr-2 text-[#fe6019]" />
                      Job Details
                    </h3>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formState.jobDetails.companyName}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        jobDetails: { ...prev.jobDetails, companyName: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={formState.jobDetails.jobTitle}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        jobDetails: { ...prev.jobDetails, jobTitle: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Job Location"
                      value={formState.jobDetails.jobLocation}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        jobDetails: { ...prev.jobDetails, jobLocation: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                  </div>
                )}

                {formState.type === 'internship' && (
                  <div className="space-y-3 mt-3 bg-white p-4 rounded-lg border border-[#fe6019]/20 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center border-b border-[#fe6019]/10 pb-2">
                      <Award size={16} className="mr-2 text-[#fe6019]" />
                      Internship Details
                    </h3>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formState.internshipDetails.companyName}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        internshipDetails: { ...prev.internshipDetails, companyName: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Internship Duration"
                      value={formState.internshipDetails.internshipDuration}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        internshipDetails: { ...prev.internshipDetails, internshipDuration: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                  </div>
                )}

                {formState.type === 'event' && (
                  <div className="space-y-3 mt-3 bg-white p-4 rounded-lg border border-[#fe6019]/20 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center border-b border-[#fe6019]/10 pb-2">
                      <Calendar size={16} className="mr-2 text-[#fe6019]" />
                      Event Details
                    </h3>
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={formState.eventDetails.eventName}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        eventDetails: { ...prev.eventDetails, eventName: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                    <input
                      type="datetime-local"
                      value={formState.eventDetails.eventDate}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        eventDetails: { ...prev.eventDetails, eventDate: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Event Location"
                      value={formState.eventDetails.eventLocation}
                      onChange={(e) => setFormState(prev => ({
                        ...prev,
                        eventDetails: { ...prev.eventDetails, eventLocation: e.target.value }
                      }))}
                      className="w-full p-2.5 rounded-lg bg-[#fe6019]/5 border-[#fe6019]/20 border focus:outline-none focus:ring-2 focus:ring-[#fe6019]/30 focus:border-[#fe6019]/50 transition-all duration-200"
                    />
                  </div>
                )}

                {formState.type === 'other' && (
                  <div className="mt-3 p-4 bg-white rounded-lg border border-[#fe6019]/20 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center border-b border-[#fe6019]/10 pb-2">
                      <FileText size={16} className="mr-2 text-[#fe6019]" />
                      Other Announcement
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Use this for general announcements that don't fit the predefined categories.
                    </p>
                  </div>
                )}

                <div className="mt-4 group">
                  <label
                    htmlFor="fileInput"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#fe6019]/30 rounded-lg cursor-pointer bg-[#fe6019]/5 hover:bg-[#fe6019]/10 transition-colors duration-200 text-sm text-gray-700"
                  >
                    <Image size={20} className="text-[#fe6019]" />
                    <span>{formState.image ? 'Change Image' : 'Add photo to your announcement'}</span>
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(URL.createObjectURL(file));
                        setFormState(prev => ({ ...prev, image: file }));
                      }
                    }}
                    className="hidden"
                  />

                  {previewUrl && (
                    <div className="relative mt-3 rounded-lg overflow-hidden border border-[#fe6019]/20 shadow-sm">
                      <img src={previewUrl} alt="Preview" className="w-full h-auto" />
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                          setFormState(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-white transition-colors duration-200"
                        aria-label="Remove image"
                      >
                        <X size={16} className="text-[#fe6019]" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-gray-200">
                  <button
                    onClick={handleCreatePost}
                    disabled={formState.isPending || !formState.content.trim()}
                    className="w-full py-3 bg-gradient-to-r from-[#fe6019] to-[#f97316] text-white rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formState.isPending ? (
                      <Loader size={18} className="animate-spin mr-2" />
                    ) : (
                      <Image size={18} className="mr-2" />
                    )}
                    {formState.isPending ? 'Publishing...' : 'Publish Announcement'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;