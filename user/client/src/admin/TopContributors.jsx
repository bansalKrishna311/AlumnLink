import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Flame, MessageSquare, Heart, FileText, Users, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';

const TopContributors = ({ className = "" }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Set default dates to current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(startOfMonth.toISOString().split('T')[0]);
    setEndDate(endOfMonth.toISOString().split('T')[0]);
    
    // Initial fetch with default dates
    const initialFetch = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/users/contributions/analytics');
        setAnalytics(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contribution analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initialFetch();
  }, []); // Empty dependency array is correct here for initial setup

  const fetchContributionAnalytics = async (customStartDate = null, customEndDate = null) => {
    try {
      setRefreshing(true);
      let url = '/users/contributions/analytics';
      
      const start = customStartDate || startDate;
      const end = customEndDate || endDate;
      
      if (start && end) {
        url += `?startDate=${start}&endDate=${end}`;
      }
      
      const response = await axiosInstance.get(url);
      setAnalytics(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contribution analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      setLoading(true);
      fetchContributionAnalytics(startDate, endDate);
    }
  };

  const handleRefresh = () => {
    fetchContributionAnalytics();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="bg-gradient-to-r from-[#fe6019] to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Top Contributors This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="w-12 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200`}>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-600">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <Users className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg font-medium">Admin Access Required</p>
            <p className="text-sm">You need admin privileges to view contribution analytics</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { overview, topContributors, dateRange, adminInfo } = analytics || {};

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Info Header */}
      {adminInfo && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-blue-700">
              <Users className="w-5 h-5" />
              <div>
                <p className="font-medium">
                  {adminInfo.role === 'superadmin' ? 'Super Admin Dashboard' : `${adminInfo.adminType || 'Admin'} Dashboard`}
                </p>
                <p className="text-sm text-blue-600">
                  Viewing contributions for {adminInfo.role === 'superadmin' ? 'all users' : `${adminInfo.adminType || 'your'} users`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleDateRangeChange}
                className="bg-[#fe6019] hover:bg-orange-600 text-white"
                disabled={!startDate || !endDate || refreshing}
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Apply Filter'
                )}
              </Button>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {dateRange && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Current Range:</strong> {dateRange.display}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Overview Stats */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-[#fe6019] to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Contribution Overview - {dateRange?.display || 'Loading...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{overview?.activeUsers || 0}</div>
              <div className="text-sm text-blue-600">Active Users</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">{overview?.totalContributions || 0}</div>
              <div className="text-sm text-green-600">Total Contributions</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{overview?.totalPosts || 0}</div>
              <div className="text-sm text-purple-600">Posts Created</div>
            </div>
            
            <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="w-8 h-8 mx-auto mb-2 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-pink-900">{overview?.totalLikes || 0}</div>
              <div className="text-sm text-pink-600">Likes Given</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-[#fe6019] to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top Contributors - {dateRange?.display || 'Loading...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {topContributors && topContributors.length > 0 ? (
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <motion.div
                  key={contributor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all duration-200 ${
                    contributor.rank <= 3 ? 'border-2 border-orange-200 bg-orange-50/50' : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankColor(contributor.rank)}`}>
                    {getRankIcon(contributor.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#fe6019] flex items-center justify-center text-white font-bold overflow-hidden">
                      {contributor.profilePicture ? (
                        <img 
                          src={contributor.profilePicture} 
                          alt={contributor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        contributor.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <Link 
                        to={`/profile/${contributor.username}`}
                        className="font-semibold text-gray-900 hover:text-[#fe6019] transition-colors"
                      >
                        {contributor.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">@{contributor.username}</p>
                        {contributor.adminType && (
                          <Badge variant="outline" className="text-xs">
                            {contributor.adminType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contribution Stats */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#fe6019]">{contributor.totalContributions}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="flex items-center gap-1 text-purple-600">
                        <FileText className="w-3 h-3" />
                        {contributor.totalPosts}
                      </div>
                      <div className="flex items-center gap-1 text-pink-600">
                        <Heart className="w-3 h-3" />
                        {contributor.totalLikes}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <MessageSquare className="w-3 h-3" />
                        {contributor.totalComments}
                      </div>
                    </div>
                  </div>

                  {/* Winner Badge for Top 3 */}
                  {contributor.rank <= 3 && (
                    <div className="ml-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          contributor.rank === 1 ? 'border-yellow-400 text-yellow-700 bg-yellow-50' :
                          contributor.rank === 2 ? 'border-gray-400 text-gray-700 bg-gray-50' :
                          'border-orange-400 text-orange-700 bg-orange-50'
                        }`}
                      >
                        {contributor.rank === 1 ? '🥇 Winner' : 
                         contributor.rank === 2 ? '🥈 2nd Place' : 
                         '🥉 3rd Place'}
                      </Badge>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No contributions yet this month</p>
              <p className="text-sm">Contributions will appear here as users become active</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-blue-700">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="font-medium">Recognition Program</p>
              <p className="text-sm text-blue-600">
                Top contributors will be eligible for monthly rewards and recognition
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopContributors;
