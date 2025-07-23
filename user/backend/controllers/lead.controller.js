import Lead from '../models/lead.model.js';
import { validationResult } from 'express-validator';

// Get all leads with filtering, sorting, and pagination - Memory Optimized
export const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      leadType,
      leadSource,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      export: exportData
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (leadType) filter.leadType = leadType;
    if (leadSource) filter.leadSource = leadSource;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Optimized search query - only essential fields
    if (search) {
      filter.$text = { $search: search };
    }

    // Handle CSV export with streaming for large datasets
    if (exportData === 'true') {
      // Use lean() for minimal memory usage and select only needed fields
      const leads = await Lead.find(filter)
        .select('firstName lastName email phone company jobTitle leadType leadSource status priority estimatedValue createdAt lastContactDate nextFollowUp')
        .populate('assignedTo', 'fullName', null, { lean: true })
        .lean()
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .limit(1000); // Limit export to prevent memory issues

      // Generate CSV with minimal memory footprint
      const csvHeaders = [
        'Name', 'Email', 'Phone', 'Company', 'Job Title', 'Lead Type',
        'Lead Source', 'Status', 'Priority', 'Estimated Value',
        'Created Date', 'Last Contact', 'Next Follow-up', 'Assigned To'
      ];

      const csvRows = leads.map(lead => [
        `${lead.firstName} ${lead.lastName}`,
        lead.email,
        lead.phone || '',
        lead.company || '',
        lead.jobTitle || '',
        lead.leadType,
        lead.leadSource,
        lead.status,
        lead.priority,
        lead.estimatedValue || 0,
        new Date(lead.createdAt).toLocaleDateString(),
        lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : '',
        lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : '',
        lead.assignedTo?.fullName || ''
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => 
          row.map(field => 
            typeof field === 'string' && field.includes(',') 
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
      return res.send(csvContent);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 50); // Cap limit to prevent memory issues
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Use lean queries and minimal population for better memory efficiency
    const leads = await Lead.find(filter)
      .select('-notes -customFields') // Exclude heavy fields from list view
      .populate('assignedTo', 'fullName email', null, { lean: true })
      .populate('createdBy', 'fullName email', null, { lean: true })
      .lean()
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count efficiently
    const total = await Lead.countDocuments(filter);

    // Add computed fields efficiently
    const optimizedLeads = leads.map(lead => ({
      ...lead,
      fullName: `${lead.firstName} ${lead.lastName}`,
      daysSinceCreated: Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))
    }));

    res.json({
      leads: optimizedLeads,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limitNum),
        count: total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

// Get a single lead by ID - Memory Optimized
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'fullName email avatar phone', null, { lean: true })
      .populate('createdBy', 'fullName email', null, { lean: true })
      .populate('notes.addedBy', 'fullName email avatar', null, { lean: true })
      .lean();

    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Add computed fields
    const optimizedLead = {
      ...lead,
      fullName: `${lead.firstName} ${lead.lastName}`,
      daysSinceCreated: Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24)),
      daysUntilFollowUp: lead.nextFollowUp ? 
        Math.floor((new Date(lead.nextFollowUp) - new Date()) / (1000 * 60 * 60 * 24)) : null
    };

    res.json(optimizedLead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Error fetching lead', error: error.message });
  }
};

// Create a new lead
export const createLead = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    // Check if lead with email already exists
    const existingLead = await Lead.findOne({ 
      email: req.body.email.toLowerCase(),
      isActive: true 
    });
    
    if (existingLead) {
      return res.status(409).json({ 
        message: 'Lead with this email already exists' 
      });
    }

    const leadData = {
      ...req.body,
      createdBy: req.user.id,
      email: req.body.email.toLowerCase()
    };

    const lead = new Lead(leadData);
    await lead.save();

    // Populate the created lead for response
    await lead.populate('createdBy', 'fullName email');
    if (lead.assignedTo) {
      await lead.populate('assignedTo', 'fullName email avatar');
    }

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
};

// Update a lead
export const updateLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // If email is being changed, check for duplicates
    if (req.body.email && req.body.email.toLowerCase() !== lead.email) {
      const existingLead = await Lead.findOne({ 
        email: req.body.email.toLowerCase(),
        isActive: true,
        _id: { $ne: req.params.id }
      });
      
      if (existingLead) {
        return res.status(409).json({ 
          message: 'Lead with this email already exists' 
        });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key === 'email') {
        lead[key] = req.body[key].toLowerCase();
      } else if (key !== 'createdBy') { // Prevent changing creator
        lead[key] = req.body[key];
      }
    });

    await lead.save();

    // Populate for response
    await lead.populate('assignedTo', 'fullName email avatar');
    await lead.populate('createdBy', 'fullName email');

    res.json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
};

// Add a note to a lead
export const addNote = async (req, res) => {
  try {
    const { content, type = 'Note' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const note = {
      content: content.trim(),
      type,
      addedBy: req.user.id,
      addedAt: new Date()
    };

    lead.notes.push(note);
    lead.lastContactDate = new Date();
    await lead.save();

    // Populate the new note for response
    await lead.populate('notes.addedBy', 'fullName email avatar');
    
    const newNote = lead.notes[lead.notes.length - 1];

    res.status(201).json({
      message: 'Note added successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
};

// Update lead status
export const updateStatus = async (req, res) => {
  try {
    const { status, lostReason } = req.body;
    
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurturing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.status = status;
    
    // Handle status-specific updates
    if (status === 'Won') {
      lead.conversionDate = new Date();
      lead.lostReason = undefined;
    } else if (status === 'Lost') {
      lead.lostReason = lostReason;
      lead.conversionDate = undefined;
    }

    // Add automatic note about status change
    const note = {
      content: `Status changed to: ${status}${lostReason ? '. Reason: ' + lostReason : ''}`,
      type: 'Note',
      addedBy: req.user.id,
      addedAt: new Date()
    };
    lead.notes.push(note);

    await lead.save();

    res.json({
      message: 'Status updated successfully',
      lead: {
        _id: lead._id,
        status: lead.status,
        conversionDate: lead.conversionDate,
        lostReason: lead.lostReason
      }
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Set follow-up reminder
export const setFollowUp = async (req, res) => {
  try {
    const { nextFollowUp } = req.body;
    
    if (!nextFollowUp) {
      return res.status(400).json({ message: 'Follow-up date is required' });
    }

    const followUpDate = new Date(nextFollowUp);
    if (followUpDate < new Date()) {
      return res.status(400).json({ message: 'Follow-up date cannot be in the past' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.nextFollowUp = followUpDate;
    
    // Add note about follow-up
    const note = {
      content: `Follow-up scheduled for ${followUpDate.toDateString()}`,
      type: 'Follow-up',
      addedBy: req.user.id,
      addedAt: new Date()
    };
    lead.notes.push(note);

    await lead.save();

    res.json({
      message: 'Follow-up reminder set successfully',
      nextFollowUp: lead.nextFollowUp
    });
  } catch (error) {
    console.error('Error setting follow-up:', error);
    res.status(500).json({ message: 'Error setting follow-up', error: error.message });
  }
};

// Archive/Delete a lead (soft delete)
export const archiveLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.isActive = false;
    lead.archivedAt = new Date();
    lead.archivedBy = req.user.id;

    await lead.save();

    res.json({ message: 'Lead archived successfully' });
  } catch (error) {
    console.error('Error archiving lead:', error);
    res.status(500).json({ message: 'Error archiving lead', error: error.message });
  }
};

// Get lead statistics - Memory Optimized
export const getLeadStats = async (req, res) => {
  try {
    const { dateFrom, dateTo, assignedTo } = req.query;
    
    // Build filter for date range
    const filter = { isActive: true };
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    if (assignedTo) filter.assignedTo = assignedTo;

    // Use aggregation pipeline for memory efficiency
    const [
      totalStats,
      statusStats,
      sourceStats,
      typeStats,
      followUpCount
    ] = await Promise.all([
      // Total count and value
      Lead.aggregate([
        { $match: filter },
        { $group: { 
          _id: null, 
          totalLeads: { $sum: 1 },
          totalValue: { $sum: '$estimatedValue' },
          wonDeals: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } }
        }}
      ]),
      
      // Status breakdown
      Lead.aggregate([
        { $match: filter },
        { $group: { 
          _id: '$status', 
          count: { $sum: 1 },
          totalValue: { $sum: '$estimatedValue' }
        }},
        { $sort: { count: -1 } }
      ]),
      
      // Source breakdown - limit to top 10
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$leadSource', count: { $sum: 1 } }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Type breakdown
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$leadType', count: { $sum: 1 } }},
        { $sort: { count: -1 } }
      ]),
      
      // Follow-ups count only
      Lead.countDocuments({
        isActive: true,
        nextFollowUp: { $lte: new Date() },
        status: { $nin: ['Won', 'Lost'] }
      })
    ]);

    const stats = totalStats[0] || { totalLeads: 0, totalValue: 0, wonDeals: 0 };
    const conversionRate = stats.totalLeads > 0 ? 
      ((stats.wonDeals / stats.totalLeads) * 100).toFixed(2) : 0;

    res.json({
      totalLeads: stats.totalLeads,
      totalValue: stats.totalValue,
      conversionRate,
      followUpsRequired: followUpCount,
      byStatus: statusStats,
      leadsBySource: sourceStats,
      leadsByType: typeStats
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    res.status(500).json({ message: 'Error fetching lead statistics', error: error.message });
  }
};

// Get leads requiring follow-up - Memory Optimized
export const getFollowUpLeads = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const leads = await Lead.find({
      isActive: true,
      nextFollowUp: { $lte: today },
      status: { $nin: ['Won', 'Lost'] }
    })
    .select('firstName lastName email company nextFollowUp status')
    .populate('assignedTo', 'fullName email', null, { lean: true })
    .lean()
    .sort({ nextFollowUp: 1 })
    .limit(50); // Limit for memory efficiency

    // Add computed fullName
    const optimizedLeads = leads.map(lead => ({
      ...lead,
      fullName: `${lead.firstName} ${lead.lastName}`
    }));

    res.json(optimizedLeads);
  } catch (error) {
    console.error('Error fetching follow-up leads:', error);
    res.status(500).json({ message: 'Error fetching follow-up leads', error: error.message });
  }
};

// Bulk operations
export const bulkUpdateLeads = async (req, res) => {
  try {
    const { leadIds, updates } = req.body;
    
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'Lead IDs array is required' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Updates object is required' });
    }

    // Prevent updating certain fields
    const prohibitedFields = ['_id', 'createdBy', 'createdAt'];
    const updateFields = Object.keys(updates).filter(key => !prohibitedFields.includes(key));
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updateObject = {};
    updateFields.forEach(field => {
      updateObject[field] = updates[field];
    });

    const result = await Lead.updateMany(
      { _id: { $in: leadIds }, isActive: true },
      { $set: updateObject }
    );

    res.json({
      message: `${result.modifiedCount} leads updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating leads:', error);
    res.status(500).json({ message: 'Error bulk updating leads', error: error.message });
  }
};
