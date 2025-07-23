# Lead Management System

A comprehensive lead management system for AlumnLink superadmins to track, manage, and nurture sales leads and prospects.

## Features

### 📊 Lead Dashboard
- Overview of key metrics (Total leads, conversion rate, pipeline value)
- Recent leads display
- Follow-up reminders
- Performance analytics
- Quick insights and statistics

### 🎯 Lead Management
- Complete CRUD operations for leads
- Advanced filtering and search
- Lead status tracking
- Priority management
- Lead assignment
- Bulk operations

### 📝 Lead Information
- **Personal Information**: Name, email, phone, contact details
- **Company Details**: Company name, job title, industry, company size
- **Lead Classification**: Type (Institute/Corporate/School/etc.), source, priority
- **Financial Tracking**: Estimated value, currency
- **Requirements**: Services interested, timeline, custom requirements
- **Communication**: Notes, call logs, email tracking, meeting records
- **Follow-up Management**: Automated reminders, scheduling

### 📈 Analytics & Reporting
- Conversion rate tracking
- Lead source analysis
- Lead type distribution
- Performance metrics
- Pipeline value tracking
- Export functionality (CSV)

## API Endpoints

### Lead Management
- `GET /api/v1/leads` - Get all leads with filtering and pagination
- `GET /api/v1/leads/:id` - Get single lead by ID
- `POST /api/v1/leads` - Create new lead
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Archive lead (soft delete)

### Lead Actions
- `POST /api/v1/leads/:id/notes` - Add note to lead
- `PUT /api/v1/leads/:id/status` - Update lead status
- `PUT /api/v1/leads/:id/follow-up` - Set follow-up reminder

### Analytics
- `GET /api/v1/leads/stats` - Get lead statistics
- `GET /api/v1/leads/follow-up` - Get leads requiring follow-up

### Bulk Operations
- `PUT /api/v1/leads/bulk/update` - Bulk update leads

## Lead Statuses

1. **New** - Recently created lead
2. **Contacted** - Initial contact made
3. **Qualified** - Lead meets criteria
4. **Proposal Sent** - Proposal/quote sent
5. **Negotiation** - In negotiation phase
6. **Won** - Successfully converted
7. **Lost** - Lead lost
8. **Nurturing** - Long-term nurturing

## Lead Types

- **Institute** - Educational institutions
- **Corporate** - Corporate clients
- **School** - Schools and K-12 institutions
- **Individual** - Individual prospects
- **Partnership** - Partnership opportunities
- **Vendor** - Vendor relationships

## Lead Sources

- Website
- Social Media
- Email Campaign
- Referral
- Cold Call
- Event
- Partnership
- Organic Search
- Paid Ads
- Other

## Priority Levels

- **Low** - Standard priority
- **Medium** - Normal follow-up required
- **High** - Important opportunity
- **Critical** - Urgent attention needed

## Data Model

### Lead Schema
```javascript
{
  // Personal Information
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String,
  
  // Company Information
  company: String,
  jobTitle: String,
  industry: String,
  companySize: Enum,
  website: String,
  linkedIn: String,
  
  // Lead Details
  leadSource: Enum (required),
  leadType: Enum (required),
  status: Enum (default: 'New'),
  priority: Enum (default: 'Medium'),
  
  // Financial
  estimatedValue: Number,
  currency: String,
  
  // Requirements
  interestedServices: [String],
  requirements: String,
  timeline: Enum,
  
  // Communication & Notes
  notes: [{
    content: String,
    addedBy: ObjectId,
    addedAt: Date,
    type: Enum
  }],
  
  // Assignment
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  
  // Follow-up
  nextFollowUp: Date,
  lastContactDate: Date,
  
  // Conversion Tracking
  conversionDate: Date,
  lostReason: String,
  
  // Additional
  tags: [String],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Metadata
  isActive: Boolean (default: true),
  archivedAt: Date,
  archivedBy: ObjectId
}
```

## Usage Instructions

### Accessing Lead Management
1. Log in as a superadmin
2. Navigate to the superadmin dashboard
3. Click on "Lead Dashboard" or "Lead Management"

### Creating a Lead
1. Click "Add Lead" button
2. Fill in required information (Name, Email, Lead Source, Lead Type)
3. Add optional details (Company, Priority, Estimated Value, etc.)
4. Select interested services
5. Add requirements and notes
6. Set follow-up reminder if needed
7. Save the lead

### Managing Leads
1. Use filters to find specific leads
2. Search by name, email, or company
3. Click on a lead to view details
4. Edit lead information as needed
5. Add notes and track communication
6. Update status as lead progresses
7. Set follow-up reminders

### Tracking Performance
1. View dashboard for key metrics
2. Monitor conversion rates
3. Track pipeline value
4. Review lead sources effectiveness
5. Export data for external analysis

## Security Features

- **Authentication**: All endpoints require valid authentication
- **Authorization**: Only superadmins can access lead management
- **Data Validation**: Comprehensive input validation
- **Soft Deletes**: Leads are archived, not permanently deleted
- **Audit Trail**: Track who created/modified leads
- **Input Sanitization**: Prevent XSS and injection attacks

## Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Pagination**: Large datasets are paginated
- **Search Optimization**: Full-text search capabilities
- **Caching**: Statistics and frequently accessed data
- **Lazy Loading**: Load details on demand

## File Structure

```
backend/
├── models/
│   └── lead.model.js           # Lead data model
├── controllers/
│   └── lead.controller.js      # Lead business logic
├── routes/
│   └── lead.route.js          # Lead API routes
└── middleware/
    └── auth.middleware.js      # Authentication middleware

frontend/
├── superadmin/
│   └── LeadManagement/
│       ├── LeadManagement.jsx  # Main management component
│       ├── LeadDashboard.jsx   # Dashboard overview
│       ├── LeadList.jsx        # Lead listing component
│       ├── LeadForm.jsx        # Lead creation/editing form
│       ├── LeadDetails.jsx     # Lead details view
│       └── LeadStats.jsx       # Statistics component
```

## Installation & Setup

1. **Backend Dependencies**:
   ```bash
   cd backend
   npm install express-validator
   ```

2. **Frontend Dependencies**:
   All required dependencies are already installed in the project.

3. **Database**:
   The Lead model will be automatically created when first lead is saved.

4. **Routes**:
   Lead routes are automatically included in the server configuration.

## Export Functionality

The system supports CSV export of leads with filtering:

- Export all leads or filtered subset
- Includes all relevant lead information
- Formatted for Excel compatibility
- Maintains data integrity

## Future Enhancements

### Planned Features
- Email integration for automated follow-ups
- Advanced reporting with charts
- Lead scoring algorithm
- Integration with external CRM systems
- Mobile app support
- Advanced workflow automation
- Custom fields management
- Team collaboration features

### Possible Integrations
- Email marketing platforms
- Calendar systems
- Video conferencing tools
- Document management
- Payment processing
- Social media platforms

## Support

For technical support or feature requests related to the Lead Management System, please contact the development team or create an issue in the project repository.

## License

This Lead Management System is part of the AlumnLink platform and follows the same licensing terms as the main project.
