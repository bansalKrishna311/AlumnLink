// Hierarchy levels (lower number = higher privilege)
export const HIERARCHY_LEVELS = {
  MANAGEMENT: 1,
  HOD: 2,
  FACULTY: 3,
  ALUMNI: 4
};

// Map string hierarchy to levels
export const getHierarchyLevel = (hierarchy) => {
  if (!hierarchy) {
    console.log('No hierarchy provided, defaulting to ALUMNI level');
    return HIERARCHY_LEVELS.ALUMNI;
  }
  
  const normalizedHierarchy = hierarchy.toLowerCase();
  console.log('Processing hierarchy:', hierarchy, 'normalized:', normalizedHierarchy);
  
  // Management levels (highest access)
  if (normalizedHierarchy.includes('management') || 
      normalizedHierarchy.includes('principal') ||
      normalizedHierarchy.includes('director')) {
    console.log('Detected MANAGEMENT level');
    return HIERARCHY_LEVELS.MANAGEMENT;
  }
  
  // HOD levels
  if (normalizedHierarchy.includes('hod') || 
      normalizedHierarchy.includes('head') ||
      normalizedHierarchy.includes('manager')) {
    console.log('Detected HOD level');
    return HIERARCHY_LEVELS.HOD;
  }
  
  // Faculty levels
  if (normalizedHierarchy.includes('faculty') || 
      normalizedHierarchy.includes('teacher') ||
      normalizedHierarchy.includes('professor') ||
      normalizedHierarchy.includes('instructor') ||
      normalizedHierarchy.includes('team_lead')) {
    console.log('Detected FACULTY level');
    return HIERARCHY_LEVELS.FACULTY;
  }
  
  // Default to alumni level for students, employees, alumni
  console.log('Defaulting to ALUMNI level for hierarchy:', hierarchy);
  return HIERARCHY_LEVELS.ALUMNI;
};

// Define page permissions based on hierarchy
export const PAGE_PERMISSIONS = {
  // Management can access everything
  '/subadmin/dashboard': HIERARCHY_LEVELS.FACULTY, // Faculty and above
  '/subadmin/manage-users': HIERARCHY_LEVELS.HOD, // HOD and above (legacy)
  '/subadmin/manage-alumni': HIERARCHY_LEVELS.FACULTY, // Faculty and above
  '/subadmin/network-requests': HIERARCHY_LEVELS.FACULTY, // Faculty and above
  '/subadmin/rejected-requests': HIERARCHY_LEVELS.HOD, // HOD and above
  '/subadmin/post-creation': HIERARCHY_LEVELS.FACULTY, // Faculty and above
  '/subadmin/admin-posts': HIERARCHY_LEVELS.FACULTY, // Faculty and above
  '/subadmin/rejected-posts': HIERARCHY_LEVELS.HOD, // HOD and above
  '/subadmin/post-requests': HIERARCHY_LEVELS.HOD, // HOD and above
  '/subadmin/analytics': HIERARCHY_LEVELS.MANAGEMENT, // Management only
  '/subadmin/system-settings': HIERARCHY_LEVELS.MANAGEMENT, // Management only
};

// Check if user has access to a specific page
export const hasPageAccess = (userHierarchy, pagePath) => {
  const userLevel = getHierarchyLevel(userHierarchy);
  const requiredLevel = PAGE_PERMISSIONS[pagePath];
  
  if (requiredLevel === undefined) {
    return true; // Allow access if not specified
  }
  
  console.log(`Access Check: User Level: ${userLevel} (${userHierarchy}), Required Level: ${requiredLevel}, Path: ${pagePath}`);
  
  return userLevel <= requiredLevel;
};

// Get user-friendly hierarchy name
export const getHierarchyDisplayName = (hierarchy) => {
  if (!hierarchy) return 'Alumni';
  
  const normalizedHierarchy = hierarchy.toLowerCase();
  
  if (normalizedHierarchy.includes('management')) return 'Management';
  if (normalizedHierarchy.includes('hod')) return 'Head of Department';
  if (normalizedHierarchy.includes('faculty')) return 'Faculty';
  
  return hierarchy.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Get accessible navigation items based on user hierarchy
export const getAccessibleNavItems = (userHierarchy) => {
  const userLevel = getHierarchyLevel(userHierarchy);
  
  const allNavItems = [
    { title: "Dashboard", url: "/subadmin/dashboard", icon: "Home", requiredLevel: HIERARCHY_LEVELS.FACULTY },
    { title: "Manage User Requests", url: "/subadmin/network-requests", icon: "Users", requiredLevel: HIERARCHY_LEVELS.FACULTY },
    { title: "Manage Alumni", url: "/subadmin/manage-alumni", icon: "GraduationCap", requiredLevel: HIERARCHY_LEVELS.FACULTY },
    { title: "Rejected Requests", url: "/subadmin/rejected-requests", icon: "UserX", requiredLevel: HIERARCHY_LEVELS.HOD },
    { title: "Make Post", url: "/subadmin/post-creation", icon: "PlusCircle", requiredLevel: HIERARCHY_LEVELS.FACULTY },
    { title: "Admin Posts", url: "/subadmin/admin-posts", icon: "FileText", requiredLevel: HIERARCHY_LEVELS.FACULTY },
    { title: "Rejected Posts", url: "/subadmin/rejected-posts", icon: "FileX", requiredLevel: HIERARCHY_LEVELS.HOD },
    { title: "Post Request", url: "/subadmin/post-requests", icon: "MessageSquare", requiredLevel: HIERARCHY_LEVELS.HOD },
    { title: "Analytics", url: "/subadmin/analytics", icon: "BarChart3", requiredLevel: HIERARCHY_LEVELS.MANAGEMENT },
    { title: "System Settings", url: "/subadmin/system-settings", icon: "Settings", requiredLevel: HIERARCHY_LEVELS.MANAGEMENT },
  ];
  
  return allNavItems.filter(item => userLevel <= item.requiredLevel);
};
