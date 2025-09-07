# SubAdmin Module

This directory contains all SubAdmin related components, pages, hooks, and utilities with hierarchy-based access control.

## Structure

```
subadmin/
├── components/              # SubAdmin specific components
│   ├── SubAdminSidebar.jsx     # Navigation sidebar with dynamic menu
│   ├── SubAdminProtectedRoute.jsx  # Route protection wrapper
│   └── AccessDenied.jsx        # Access denied page
├── pages/                   # SubAdmin pages
│   ├── Dashboard.jsx           # Main dashboard wrapper
│   ├── SubAdminDashboardPage.jsx  # Dashboard content
│   └── ManageUsers.jsx         # User management page
├── hooks/                   # SubAdmin custom hooks
│   └── useSubAdmin.js          # Authentication and stats hooks
├── utils/                   # SubAdmin utilities
│   ├── subAdminUtils.js        # General utilities
│   └── accessControl.js       # Hierarchy-based access control
└── index.js                # Module exports
```

## Hierarchy-Based Access Control

### Hierarchy Levels
- **Management** (Level 1): Full access to all features
- **HOD** (Level 2): Access to user management and content moderation
- **Faculty** (Level 3): Basic content management and user requests
- **Alumni** (Level 4): Limited access

### Page Permissions
- `/subadmin/dashboard` - Faculty and above
- `/subadmin/manage-users` - HOD and above
- `/subadmin/manage-alumni` - Faculty and above
- `/subadmin/network-requests` - Faculty and above
- `/subadmin/post-creation` - Faculty and above
- `/subadmin/admin-posts` - Faculty and above
- `/subadmin/post-requests` - HOD and above
- `/subadmin/rejected-posts` - HOD and above
- `/subadmin/rejected-requests` - HOD and above
- `/subadmin/analytics` - Management only
- `/subadmin/system-settings` - Management only

## Usage

```jsx
import { SubAdminDashboard, SubAdminSidebar } from '@/subadmin';
// or
import SubAdminDashboard from '@/subadmin/pages/Dashboard';
```

## Routes

All SubAdmin routes are prefixed with `/subadmin/` and include:

- `/subadmin` - Main dashboard
- `/subadmin/dashboard` - Dashboard (Faculty+)
- `/subadmin/manage-users` - User management (HOD+)
- `/subadmin/manage-alumni` - Alumni management (Faculty+)
- `/subadmin/network-requests` - Network requests (Faculty+)
- `/subadmin/post-creation` - Create posts (Faculty+)
- `/subadmin/admin-posts` - View admin posts (Faculty+)
- `/subadmin/post-requests` - Post requests (HOD+)
- `/subadmin/rejected-posts` - Rejected posts (HOD+)
- `/subadmin/rejected-requests` - Rejected requests (HOD+)
- `/subadmin/analytics` - Analytics (Management only)
- `/subadmin/system-settings` - System settings (Management only)

## Features

- **Hierarchy-Based Access**: Dynamic navigation and page access based on user hierarchy
- **Protected Routes**: Automatic redirection to access denied page for unauthorized users
- **Reusable Components**: Modular components for easy maintenance
- **Custom Hooks**: Authentication and stats management
- **Clean Architecture**: Separate from main admin and pages directories

## Access Control Implementation

```jsx
// Check if user has access to a page
import { hasPageAccess } from '@/subadmin/utils/accessControl';

const canAccess = hasPageAccess(userHierarchy, '/subadmin/manage-users');

// Get accessible navigation items
import { getAccessibleNavItems } from '@/subadmin/utils/accessControl';

const navItems = getAccessibleNavItems(userHierarchy);
```
