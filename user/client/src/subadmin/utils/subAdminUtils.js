// SubAdmin Navigation Items Configuration
export const subAdminNavItems = [
  { title: "Dashboard", url: "/subadmin", icon: "Home" },
  { title: "Manage User Requests", url: "/userrequests", icon: "UserCheck" },
  { title: "Manage Alumni", url: "/manage-alumni", icon: "Users" },
  { title: "Rejected Requests", url: "/rejected-requests", icon: "UserX" },
  { title: "Make Post", url: "/post-creation", icon: "FileText" },
  { title: "Sub-Admin Posts", url: "/adminposts", icon: "MessageSquare" },
  { title: "Rejected Posts", url: "/rejected-posts", icon: "UserX" },
  { title: "Post Request", url: "/postrequest", icon: "MessageSquare" },
];

// SubAdmin Permissions
export const subAdminPermissions = {
  canManageUsers: true,
  canCreatePosts: true,
  canViewAnalytics: true,
  canManageContent: true,
  canAccessAdminFeatures: false, // Limited admin access
};

// Format hierarchy name utility
export const formatHierarchyName = (hierarchy) => {
  if (!hierarchy) return 'Alumni';
  return hierarchy.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
