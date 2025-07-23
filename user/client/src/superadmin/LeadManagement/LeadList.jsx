import React, { useMemo, useCallback } from 'react';
import { Edit, Eye, Calendar, MapPin, Building2, Phone, Mail, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Memoized individual lead item component
const LeadItem = React.memo(({ lead, index, selectedLead, onSelectLead, onEditLead }) => {
  const handleSelect = useCallback(() => onSelectLead(lead), [lead, onSelectLead]);
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEditLead(lead);
  }, [lead, onEditLead]);

  const statusColor = useMemo(() => {
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
    return colors[lead.status] || 'bg-gray-100 text-gray-800';
  }, [lead.status]);

  const priorityColor = useMemo(() => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-600',
      'Medium': 'bg-blue-100 text-blue-600',
      'High': 'bg-orange-100 text-orange-600',
      'Critical': 'bg-red-100 text-red-600'
    };
    return colors[lead.priority] || 'bg-gray-100 text-gray-600';
  }, [lead.priority]);

  const formattedValue = useMemo(() => {
    if (!lead.estimatedValue) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(lead.estimatedValue);
  }, [lead.estimatedValue]);

  const isSelected = selectedLead?._id === lead._id;
  const isFollowUpOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();

  // Handle different data structures for backward compatibility
  const leadName = lead.personalInfo 
    ? `${lead.personalInfo.firstName} ${lead.personalInfo.lastName}` 
    : lead.fullName;
  const leadEmail = lead.personalInfo?.email || lead.email;
  const leadPhone = lead.personalInfo?.phone || lead.phone;
  const companyName = lead.companyInfo?.name || lead.company;
  const jobTitle = lead.personalInfo?.jobTitle || lead.jobTitle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }} // Reduced delay for faster animations
      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Lead Name and Company */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {leadName}
            </h3>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {lead.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
                {lead.priority}
              </span>
            </div>
          </div>

          {/* Company and Job Title */}
          {companyName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4" />
              <span>{companyName}</span>
              {jobTitle && <span>• {jobTitle}</span>}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span className="truncate">{leadEmail}</span>
            </div>
            {leadPhone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{leadPhone}</span>
              </div>
            )}
          </div>

          {/* Lead Type and Source */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{lead.leadType}</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{lead.leadSource}</span>
            {lead.estimatedValue > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{formattedValue}</span>
              </div>
            )}
          </div>

          {/* Follow-up and Last Contact */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>Created {format(new Date(lead.createdAt), 'MMM dd, yyyy')}</span>
            {lead.lastContactDate && (
              <span>Last contact {format(new Date(lead.lastContactDate), 'MMM dd, yyyy')}</span>
            )}
            {lead.nextFollowUp && (
              <div className={`flex items-center gap-1 ${
                isFollowUpOverdue ? 'text-red-600' : 'text-orange-600'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>Follow-up {format(new Date(lead.nextFollowUp), 'MMM dd')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleSelect}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Requirements Preview */}
      {lead.requirements && (
        <div className="mt-3 text-sm text-gray-600">
          <p className="line-clamp-2">{lead.requirements}</p>
        </div>
      )}
    </motion.div>
  );
});

LeadItem.displayName = 'LeadItem';

// Memoized pagination component
const PaginationControls = React.memo(({ pagination, onPageChange }) => {
  const handlePrevious = useCallback(() => {
    onPageChange(pagination.current - 1);
  }, [pagination.current, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(pagination.current + 1);
  }, [pagination.current, onPageChange]);

  const pageNumbers = useMemo(() => {
    const visiblePages = 5;
    const start = Math.max(1, pagination.current - Math.floor(visiblePages / 2));
    const end = Math.min(pagination.total, start + visiblePages - 1);
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination.current, pagination.total]);

  if (pagination.total <= 1) return null;

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.current * pagination.limit, pagination.count)} of{' '}
          {pagination.count} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={pagination.current === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {/* Page numbers */}
          <div className="flex gap-1">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pageNum === pagination.current
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={pagination.current === pagination.total}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

const LeadList = React.memo(({ 
  leads, 
  loading, 
  pagination, 
  onPageChange, 
  onSelectLead, 
  onEditLead, 
  selectedLead 
}) => {
  // Memoized lead items to prevent unnecessary re-renders
  const leadItems = useMemo(() => {
    return leads.map((lead, index) => (
      <LeadItem
        key={lead._id}
        lead={lead}
        index={index}
        selectedLead={selectedLead}
        onSelectLead={onSelectLead}
        onEditLead={onEditLead}
      />
    ));
  }, [leads, selectedLead, onSelectLead, onEditLead]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Leads ({pagination.count || 0})</h2>
      </div>

      {/* Lead List */}
      <div className="divide-y divide-gray-200">
        {leads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No leads found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or add a new lead</p>
          </div>
        ) : (
          leadItems
        )}
      </div>

      {/* Pagination */}
      <PaginationControls 
        pagination={pagination} 
        onPageChange={onPageChange} 
      />
    </div>
  );
});

LeadList.displayName = 'LeadList';

export default LeadList;