import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Target, Award } from 'lucide-react';

const LeadStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const statusData = stats.byStatus.map(item => ({
    name: item._id,
    value: item.count,
    revenue: item.totalValue
  }));

  const sourceData = stats.leadsBySource.map(item => ({
    name: item._id,
    value: item.count
  }));

  const typeData = stats.leadsByType.map(item => ({
    name: item._id,
    value: item.count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Lead Analytics
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{stats.totalLeads}</div>
            <div className="text-sm text-blue-600">Total Leads</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{stats.conversionRate}%</div>
            <div className="text-sm text-green-600">Conversion Rate</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-900">{formatCurrency(stats.totalValue)}</div>
            <div className="text-sm text-purple-600">Total Value</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-900">{stats.followUpsRequired}</div>
            <div className="text-sm text-orange-600">Follow-ups Due</div>
          </div>
        </div>

        {/* Leads by Status */}
        {statusData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Leads by Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'value' ? `${value} leads` : formatCurrency(value),
                      name === 'value' ? 'Count' : 'Revenue'
                    ]}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Lead Sources Pie Chart */}
        {sourceData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Lead Sources</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {sourceData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700 truncate">{item.name}</span>
                  <span className="text-gray-500">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Types */}
        {typeData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Lead Types</h3>
            <div className="space-y-2">
              {typeData.map((item, index) => {
                const percentage = ((item.value / stats.totalLeads) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Insights */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quick Insights
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Deal Size:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(stats.totalLeads > 0 ? stats.totalValue / stats.totalLeads : 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Won Deals:</span>
              <span className="font-medium text-green-600">
                {statusData.find(s => s.name === 'Won')?.value || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Pipeline:</span>
              <span className="font-medium text-blue-600">
                {statusData.filter(s => !['Won', 'Lost'].includes(s.name)).reduce((sum, s) => sum + s.value, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top Source:</span>
              <span className="font-medium text-gray-900">
                {sourceData.length > 0 ? sourceData[0].name : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Performance Score</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {Math.min(100, Math.round((parseFloat(stats.conversionRate) + (stats.followUpsRequired === 0 ? 20 : 0)) * 1.2))}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadStats;
