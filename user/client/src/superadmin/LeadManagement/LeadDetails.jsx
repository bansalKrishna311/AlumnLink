import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  MessageSquare, 
  Clock,
  Globe,
  Linkedin,
  Tag,
  Plus,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';

const LeadDetails = ({ lead, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(lead.notes || []);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('Note');
  const [status, setStatus] = useState(lead.status);
  const [lostReason, setLostReason] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState(
    lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().slice(0, 16) : ''
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setNotes(lead.notes || []);
    setStatus(lead.status);
  }, [lead]);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Qualified': 'bg-green-100 text-green-800 border-green-200',
      'Proposal Sent': 'bg-purple-100 text-purple-800 border-purple-200',
      'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Won': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Lost': 'bg-red-100 text-red-800 border-red-200',
      'Nurturing': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-600 border-gray-200',
      'Medium': 'bg-blue-100 text-blue-600 border-blue-200',
      'High': 'bg-orange-100 text-orange-600 border-orange-200',
      'Critical': 'bg-red-100 text-red-600 border-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-600 border-gray-200';
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

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setSubmitting(true);
      const response = await axiosInstance.post(`/leads/${lead._id}/notes`, {
        content: newNote.trim(),
        type: noteType
      });

      setNotes(prev => [...prev, response.data.note]);
      setNewNote('');
      toast.success('Note added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async () => {
    try {
      setSubmitting(true);
      await axiosInstance.put(`/leads/${lead._id}/status`, {
        status,
        lostReason: status === 'Lost' ? lostReason : undefined
      });

      toast.success('Status updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const setFollowUp = async () => {
    if (!nextFollowUp) return;

    try {
      setSubmitting(true);
      await axiosInstance.put(`/leads/${lead._id}/follow-up`, {
        nextFollowUp: new Date(nextFollowUp).toISOString()
      });

      toast.success('Follow-up reminder set successfully');
      onUpdate();
    } catch (error) {
      console.error('Error setting follow-up:', error);
      toast.error('Failed to set follow-up reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const getNoteIcon = (type) => {
    const icons = {
      'Note': MessageSquare,
      'Call': Phone,
      'Email': Mail,
      'Meeting': Calendar,
      'Follow-up': Clock
    };
    const Icon = icons[type] || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 h-full overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Name and Basic Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{lead.fullName}</h3>
            {lead.jobTitle && lead.company && (
              <p className="text-gray-600">{lead.jobTitle} at {lead.company}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(lead.priority)}`}>
              {lead.priority} Priority
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {lead.leadType}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{lead.phone}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              )}
              {lead.linkedIn && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-gray-400" />
                  <a
                    href={lead.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Lead Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Lead Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Source:</span>
                <div className="text-gray-900">{lead.leadSource}</div>
              </div>
              <div>
                <span className="text-gray-500">Industry:</span>
                <div className="text-gray-900">{lead.industry || 'Not specified'}</div>
              </div>
              <div>
                <span className="text-gray-500">Company Size:</span>
                <div className="text-gray-900">{lead.companySize}</div>
              </div>
              <div>
                <span className="text-gray-500">Timeline:</span>
                <div className="text-gray-900">{lead.timeline}</div>
              </div>
              {lead.estimatedValue > 0 && (
                <div>
                  <span className="text-gray-500">Estimated Value:</span>
                  <div className="text-gray-900 font-medium">{formatCurrency(lead.estimatedValue)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Interested Services */}
          {lead.interestedServices && lead.interestedServices.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Interested Services</h4>
              <div className="flex flex-wrap gap-2">
                {lead.interestedServices.map(service => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {lead.requirements && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Requirements</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{lead.requirements}</p>
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h4>
            
            {/* Update Status */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                <div className="flex gap-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Nurturing">Nurturing</option>
                  </select>
                  <button
                    onClick={updateStatus}
                    disabled={submitting || status === lead.status}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    Update
                  </button>
                </div>
                {status === 'Lost' && (
                  <input
                    type="text"
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value)}
                    placeholder="Reason for losing the lead..."
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                )}
              </div>
            </div>

            {/* Set Follow-up */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Set Follow-up Reminder</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={setFollowUp}
                  disabled={submitting || !nextFollowUp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                >
                  Set
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Notes & Activity</h4>
            
            {/* Add Note */}
            <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Note">Note</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={addNote}
                disabled={submitting || !newNote.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              ) : (
                notes.map((note, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNoteIcon(note.type)}
                        <span className="text-sm font-medium text-gray-900">{note.type}</span>
                        <span className="text-xs text-gray-500">
                          by {note.addedBy?.fullName || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(note.addedAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lead Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span>Created:</span>
                <div>{format(new Date(lead.createdAt), 'MMM dd, yyyy HH:mm')}</div>
              </div>
              <div>
                <span>Last Updated:</span>
                <div>{format(new Date(lead.updatedAt), 'MMM dd, yyyy HH:mm')}</div>
              </div>
              {lead.lastContactDate && (
                <div>
                  <span>Last Contact:</span>
                  <div>{format(new Date(lead.lastContactDate), 'MMM dd, yyyy')}</div>
                </div>
              )}
              {lead.nextFollowUp && (
                <div>
                  <span>Follow-up Due:</span>
                  <div className={new Date(lead.nextFollowUp) < new Date() ? 'text-red-600 font-medium' : ''}>
                    {format(new Date(lead.nextFollowUp), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadDetails;
