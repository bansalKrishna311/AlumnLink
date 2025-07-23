import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Plus, 
  Bell,
  ArrowUpRight,
  Calendar,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';

const LeadDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [followUpLeads, setFollowUpLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, recentResponse, followUpResponse] = await Promise.all([
        axiosInstance.get('/leads/stats'),
        axiosInstance.get('/leads?limit=5&sortBy=createdAt&sortOrder=desc'),
        axiosInstance.get('/leads/follow-up')
      ]);

      setStats(statsResponse.data);
      setRecentLeads(recentResponse.data.leads);
      setFollowUpLeads(followUpResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Proposal Sent': 'bg-purple-100 text-purple-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Won': 'bg-emerald-100 text-emerald-800',
      'Lost': 'bg-red-100 text-red-800',
      'Nurturing': 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your sales pipeline and activities</p>
        </div>
        <Link
          to="/lead-management"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Manage Leads
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                <p className="text-xs text-gray-500 mt-1">Active pipeline</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pipeline value</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Win rate
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Follow-ups Due</p>
                <p className="text-3xl font-bold text-gray-900">{stats.followUpsRequired}</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
              <Link 
                to="/lead-management"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No recent leads</p>
                <p className="text-sm text-gray-400">New leads will appear here</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{lead.fullName}</h3>
                      {lead.company && (
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(lead.createdAt), 'MMM dd')}
                        </span>
                      </div>
                    </div>
                    {lead.estimatedValue > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(lead.estimatedValue)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Follow-up Reminders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Follow-up Reminders
              </h2>
              {followUpLeads.length > 0 && (
                <span className="flex items-center gap-1 text-orange-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {followUpLeads.length} due
                </span>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {followUpLeads.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No follow-ups due</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              followUpLeads.map((lead) => (
                <div key={lead._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{lead.fullName}</h3>
                      {lead.company && (
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`text-xs font-medium ${
                          new Date(lead.nextFollowUp) < new Date() 
                            ? 'text-red-600' 
                            : 'text-orange-600'
                        }`}>
                          Due {format(new Date(lead.nextFollowUp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/lead-management?select=${lead._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Follow up
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Lead Sources */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Lead Sources
            </h3>
            <div className="space-y-3">
              {stats.leadsBySource.slice(0, 3).map((source, index) => (
                <div key={source._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{source._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(source.count / stats.leadsBySource[0].count) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {source.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Types */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Distribution</h3>
            <div className="space-y-3">
              {stats.leadsByType.slice(0, 3).map((type, index) => (
                <div key={type._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{type._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(type.count / stats.leadsByType[0].count) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {type.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Won Deals:</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.byStatus.find(s => s._id === 'Won')?.count || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Pipeline:</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.byStatus.filter(s => !['Won', 'Lost'].includes(s._id)).reduce((sum, s) => sum + s.value, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Deal Size:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(stats.totalLeads > 0 ? stats.totalValue / stats.totalLeads : 0)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeadDashboard;
