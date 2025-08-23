import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Filter, Download, Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadList from './LeadList';
import LeadForm from './LeadForm';
import LeadDetails from './LeadDetails';
import LeadStats from './LeadStats';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { useComprehensiveCleanup } from '../../utils/memoryCleanup';

const LeadManagement = React.memo(() => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    leadType: '',
    leadSource: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    limit: 20 // Increased for fewer requests
  });

  // Memory cleanup utilities
  const { addTimer, addURL, addElement } = useComprehensiveCleanup();

  // Memoized filter parameters to prevent unnecessary API calls
  const filterParams = useMemo(() => {
    const params = new URLSearchParams({
      page: pagination.current.toString(),
      limit: pagination.limit.toString()
    });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return params.toString();
  }, [filters, pagination.current, pagination.limit]);

  // Debounced fetch function
  const fetchLeads = useCallback(async (page = pagination.current) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axiosInstance.get(`/leads?${params}`);
      setLeads(response.data.leads);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // Memoized stats fetch
  const fetchStats = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/leads/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads();
    }, 300); // Debounce API calls
    
    // Register timer for cleanup
    addTimer(timeoutId, 'timeout');
    
    return () => clearTimeout(timeoutId);
  }, [filterParams, addTimer]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCreateLead = useCallback(() => {
    setEditingLead(null);
    setShowForm(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setEditingLead(lead);
    setShowForm(true);
  }, []);

  const handleLeadSaved = useCallback(() => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads(pagination.current);
    fetchStats();
  }, [fetchLeads, fetchStats, pagination.current]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const exportLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        export: 'true'
      });
      
      const response = await axiosInstance.get(`/leads?${params}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Register URL and element for cleanup
      addURL(url);
      
      // Clean up immediately since we're done with these
      window.URL.revokeObjectURL(url);
      
      toast.success('Leads exported successfully');
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Failed to export leads');
    }
  }, [filters]);

  // Memoized stats cards
  const statsCards = useMemo(() => {
    if (!stats) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalValue?.toLocaleString() || 0}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.followUpsRequired}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }, [stats]);

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600 mt-1">Manage and track your sales leads</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportLeads}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateLead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {statsCards}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Nurturing">Nurturing</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={filters.leadType}
              onChange={(e) => handleFilterChange('leadType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Institute">Institute</option>
              <option value="Corporate">Corporate</option>
              <option value="School">School</option>
              <option value="Individual">Individual</option>
              <option value="Partnership">Partnership</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Lead List */}
        <div className="xl:col-span-2">
          <LeadList
            leads={leads}
            loading={loading}
            pagination={pagination}
            onPageChange={fetchLeads}
            onSelectLead={setSelectedLead}
            onEditLead={handleEditLead}
            selectedLead={selectedLead}
          />
        </div>

        {/* Lead Details or Stats */}
        <div className="xl:col-span-1">
          {selectedLead ? (
            <LeadDetails
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
              onUpdate={() => {
                fetchLeads(pagination.current);
                fetchStats();
              }}
            />
          ) : (
            <LeadStats stats={stats} />
          )}
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onClose={() => setShowForm(false)}
          onSave={handleLeadSaved}
        />
      )}
    </div>
  );
});

LeadManagement.displayName = 'LeadManagement';

export default LeadManagement;
