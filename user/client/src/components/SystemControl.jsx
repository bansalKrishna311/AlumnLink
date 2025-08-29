import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Activity, 
  Shield, 
  Database, 
  Server, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  RefreshCw,
  Power,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Archive,
  Lock,
  Unlock
} from 'lucide-react';
import { useNetworkAccess } from '@/hooks/useNetworkAccess';
import AccessControl from './AccessControl';

const SystemControl = () => {
  const { accessLevel, hasAccess } = useNetworkAccess();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    server: 'operational',
    cache: 'active',
    security: 'enabled'
  });
  const [metrics, setMetrics] = useState({
    activeUsers: 1250,
    totalRequests: 15420,
    errorRate: 0.02,
    responseTime: 145
  });
  const [logs, setLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock system logs
  useEffect(() => {
    const mockLogs = [
      { id: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5), level: 'info', message: 'System backup completed successfully', category: 'backup' },
      { id: 2, timestamp: new Date(Date.now() - 1000 * 60 * 10), level: 'warning', message: 'High memory usage detected', category: 'performance' },
      { id: 3, timestamp: new Date(Date.now() - 1000 * 60 * 15), level: 'error', message: 'Database connection timeout', category: 'database' },
      { id: 4, timestamp: new Date(Date.now() - 1000 * 60 * 20), level: 'info', message: 'Security scan completed - no threats found', category: 'security' },
      { id: 5, timestamp: new Date(Date.now() - 1000 * 60 * 25), level: 'info', message: 'Cache cleared and refreshed', category: 'cache' }
    ];
    setLogs(mockLogs);
  }, []);

  const refreshSystemStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
      case 'enabled':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'disabled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'info':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, requiredLevel: 'level2' },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, requiredLevel: 'level3' },
    { id: 'security', label: 'Security', icon: Shield, requiredLevel: 'level4' },
    { id: 'maintenance', label: 'Maintenance', icon: Settings, requiredLevel: 'level4' },
    { id: 'logs', label: 'System Logs', icon: Database, requiredLevel: 'level3' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Control</h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage system performance, security, and maintenance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Access Level: <span className="font-semibold">{accessLevel}</span>
              </span>
              <button
                onClick={refreshSystemStatus}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => (
              <AccessControl key={tab.id} requiredLevel={tab.requiredLevel}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              </AccessControl>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <AccessControl requiredLevel="level2">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
                
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Database</p>
                        <p className="text-2xl font-bold text-gray-900">Healthy</p>
                      </div>
                      <Database className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Server</p>
                        <p className="text-2xl font-bold text-gray-900">Operational</p>
                      </div>
                      <Server className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cache</p>
                        <p className="text-2xl font-bold text-gray-900">Active</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Security</p>
                        <p className="text-2xl font-bold text-gray-900">Enabled</p>
                      </div>
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Users</span>
                        <span className="font-semibold">{metrics.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Requests</span>
                        <span className="font-semibold">{metrics.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Error Rate</span>
                        <span className="font-semibold">{(metrics.errorRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-semibold">{metrics.responseTime}ms</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {logs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            log.level === 'info' ? 'bg-blue-500' : 
                            log.level === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm text-gray-600 flex-1">{log.message}</span>
                          <span className="text-xs text-gray-400">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AccessControl>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <AccessControl requiredLevel="level3">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Monitoring</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">CPU Usage</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Memory Usage</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Disk Usage</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Network I/O</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">High Memory Usage</p>
                          <p className="text-xs text-yellow-600">Memory usage is above 80%</p>
                        </div>
                        <span className="text-xs text-yellow-600">2 min ago</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">Backup Completed</p>
                          <p className="text-xs text-green-600">Daily backup completed successfully</p>
                        </div>
                        <span className="text-xs text-green-600">1 hour ago</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">Scheduled Maintenance</p>
                          <p className="text-xs text-blue-600">Maintenance window in 2 hours</p>
                        </div>
                        <span className="text-xs text-blue-600">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccessControl>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <AccessControl requiredLevel="level4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Controls</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">Firewall Protection</span>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">SSL/TLS Encryption</span>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Enabled
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Eye className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Intrusion Detection</span>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Monitoring
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">Access Control</span>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Enforced
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Shield className="w-4 h-4" />
                        <span>Run Security Scan</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export Security Logs</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <AlertTriangle className="w-4 h-4" />
                        <span>View Threats</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Security Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AccessControl>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <AccessControl requiredLevel="level4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Maintenance</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Tasks</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Database className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Database Optimization</span>
                        </div>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                          Run
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Archive className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">Log Cleanup</span>
                        </div>
                        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                          Run
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-700">Cache Refresh</span>
                        </div>
                        <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                          Run
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <Trash2 className="w-5 h-5 text-red-600" />
                          <span className="text-gray-700">Temp Files Cleanup</span>
                        </div>
                        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                          Run
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Controls</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Power className="w-4 h-4" />
                        <span>Restart Services</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Update System</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <Clock className="w-4 h-4" />
                        <span>Schedule Maintenance</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <BarChart3 className="w-4 h-4" />
                        <span>Performance Tuning</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AccessControl>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <AccessControl requiredLevel="level3">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Logs</h2>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        All
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Info
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Warning
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Error
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Search logs..."
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.timestamp.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogLevelColor(log.level)}`}>
                                {log.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.category}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {log.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                View
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                Export
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {logs.length} of {logs.length} logs
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">1</span>
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </AccessControl>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SystemControl;
