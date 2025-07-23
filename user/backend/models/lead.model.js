import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Company Information
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 50
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', 'Not specified'],
    default: 'Not specified'
  },
  
  // Lead Details
  leadSource: {
    type: String,
    enum: ['Website', 'Social Media', 'Email Campaign', 'Referral', 'Cold Call', 'Event', 'Partnership', 'Organic Search', 'Paid Ads', 'Other'],
    required: true
  },
  leadType: {
    type: String,
    enum: ['Institute', 'Corporate', 'School', 'Individual', 'Partnership', 'Vendor'],
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurturing'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Financial Information
  estimatedValue: {
    type: Number,
    min: 0,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3
  },
  
  // Interest and Requirements
  interestedServices: [{
    type: String,
    enum: [
      'Alumni Network Platform',
      'Student Management System',
      'Corporate Training',
      'Recruitment Services',
      'Event Management',
      'Custom Development',
      'Consulting',
      'Integration Services',
      'Support & Maintenance'
    ]
  }],
  requirements: {
    type: String,
    maxlength: 1000
  },
  timeline: {
    type: String,
    enum: ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months', 'Not specified'],
    default: 'Not specified'
  },
  
  // Communication
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['Note', 'Call', 'Email', 'Meeting', 'Follow-up'],
      default: 'Note'
    }
  }],
  
  // Assignment and Ownership
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Follow-up and Scheduling
  nextFollowUp: {
    type: Date
  },
  lastContactDate: {
    type: Date
  },
  
  // Conversion Tracking
  conversionDate: {
    type: Date
  },
  lostReason: {
    type: String,
    maxlength: 200
  },
  
  // Additional Data
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  customFields: {
    type: Map,
    of: String
  },
  
  // Social Media & Web Presence
  website: {
    type: String,
    trim: true
  },
  linkedIn: {
    type: String,
    trim: true
  },
  
  // Location
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Tracking
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: {
    type: Date
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Memory-optimized sparse indexes
leadSchema.index({ email: 1 }, { unique: true, sparse: true });
leadSchema.index({ status: 1, isActive: 1 }, { sparse: true });
leadSchema.index({ priority: 1 }, { sparse: true });
leadSchema.index({ leadType: 1 }, { sparse: true });
leadSchema.index({ assignedTo: 1 }, { sparse: true });
leadSchema.index({ nextFollowUp: 1 }, { sparse: true });
leadSchema.index({ createdAt: -1 }, { background: true });
// Compound index for common queries
leadSchema.index({ isActive: 1, status: 1, priority: 1 }, { sparse: true });
// Text search only on essential fields
leadSchema.index({ firstName: 'text', lastName: 'text', email: 'text' }, { sparse: true });

// Virtual for full name
leadSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for days since creation
leadSchema.virtual('daysSinceCreated').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days until follow-up
leadSchema.virtual('daysUntilFollowUp').get(function() {
  if (!this.nextFollowUp) return null;
  return Math.floor((this.nextFollowUp - new Date()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update lastContactDate when notes are added
leadSchema.pre('save', function(next) {
  if (this.isModified('notes') && this.notes.length > 0) {
    this.lastContactDate = new Date();
  }
  next();
});

// Static method to get lead statistics
leadSchema.statics.getStats = async function(filter = {}) {
  const pipeline = [
    { $match: { isActive: true, ...filter } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$estimatedValue' }
      }
    }
  ];
  
  const stats = await this.aggregate(pipeline);
  
  const totalLeads = await this.countDocuments({ isActive: true, ...filter });
  const totalValue = await this.aggregate([
    { $match: { isActive: true, ...filter } },
    { $group: { _id: null, total: { $sum: '$estimatedValue' } } }
  ]);
  
  return {
    totalLeads,
    totalValue: totalValue[0]?.total || 0,
    byStatus: stats
  };
};

// Static method to get leads requiring follow-up
leadSchema.statics.getFollowUpRequired = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    isActive: true,
    nextFollowUp: { $lte: today },
    status: { $nin: ['Won', 'Lost'] }
  }).populate('assignedTo', 'fullName email').sort({ nextFollowUp: 1 });
};

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
