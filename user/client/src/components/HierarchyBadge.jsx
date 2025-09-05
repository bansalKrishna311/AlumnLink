import { Crown, Shield, Users, UserCog, GraduationCap, Briefcase } from 'lucide-react';

const HierarchyBadge = ({ hierarchy, size = 'sm', showIcon = true, className = '' }) => {
  // Format hierarchy display name
  const formatHierarchyName = (hierarchy) => {
    if (!hierarchy) return 'Alumni';
    return hierarchy.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get hierarchy icon based on level
  const getHierarchyIcon = (hierarchy) => {
    const lowerHierarchy = hierarchy?.toLowerCase() || '';
    const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
    
    if (lowerHierarchy.includes('management') || lowerHierarchy.includes('director')) {
      return <Crown size={iconSize} className="text-yellow-600" />;
    } else if (lowerHierarchy.includes('hod') || lowerHierarchy.includes('principal')) {
      return <Shield size={iconSize} className="text-purple-600" />;
    } else if (lowerHierarchy.includes('faculty') || lowerHierarchy.includes('lead')) {
      return <Users size={iconSize} className="text-blue-600" />;
    } else if (lowerHierarchy.includes('student') || lowerHierarchy.includes('alumni')) {
      return <GraduationCap size={iconSize} className="text-green-600" />;
    } else if (lowerHierarchy.includes('employee')) {
      return <Briefcase size={iconSize} className="text-gray-600" />;
    } else {
      return <UserCog size={iconSize} className="text-gray-600" />;
    }
  };

  // Get hierarchy color based on level
  const getHierarchyColor = (hierarchy) => {
    const lowerHierarchy = hierarchy?.toLowerCase() || '';
    
    if (lowerHierarchy.includes('management') || lowerHierarchy.includes('director')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100';
    } else if (lowerHierarchy.includes('hod') || lowerHierarchy.includes('principal')) {
      return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100';
    } else if (lowerHierarchy.includes('faculty') || lowerHierarchy.includes('lead')) {
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
    } else if (lowerHierarchy.includes('student') || lowerHierarchy.includes('alumni')) {
      return 'bg-green-50 text-green-700 border-green-200 ring-green-100';
    } else if (lowerHierarchy.includes('employee')) {
      return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100';
    } else {
      return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100';
    }
  };

  // Get size classes
  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'px-1.5 py-0.5 text-xs';
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-2.5 py-1.5 text-sm';
      case 'lg':
        return 'px-3 py-2 text-base';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  const colorClasses = getHierarchyColor(hierarchy);
  const sizeClasses = getSizeClasses(size);
  const icon = getHierarchyIcon(hierarchy);
  const displayName = formatHierarchyName(hierarchy);

  return (
    <span className={`
      inline-flex items-center space-x-1 rounded-full border font-medium ring-1 ring-inset
      ${colorClasses} ${sizeClasses} ${className}
    `}>
      {showIcon && icon}
      <span>{displayName}</span>
    </span>
  );
};

export default HierarchyBadge;
