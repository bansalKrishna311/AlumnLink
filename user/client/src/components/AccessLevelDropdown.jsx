import React from 'react';
import { ChevronDown, Shield, Users, Settings, Crown, Star } from 'lucide-react';

const AccessLevelDropdown = ({ 
  selectedLevel, 
  onLevelChange, 
  disabled = false, 
  className = "",
  showLabels = true 
}) => {
  const accessLevels = [
    { value: 'level0', label: 'Member', description: 'Basic network access', icon: Users, color: 'text-gray-600' },
    { value: 'level1', label: 'Moderator', description: 'Can moderate posts, view members', icon: Shield, color: 'text-blue-600' },
    { value: 'level2', label: 'Manager', description: 'Can approve/reject requests, assign roles', icon: Users, color: 'text-green-600' },
    { value: 'level3', label: 'Editor', description: 'Can edit network settings, manage events', icon: Settings, color: 'text-purple-600' },
    { value: 'level4', label: 'Admin', description: 'Full network admin, manage other admins', icon: Crown, color: 'text-orange-600' },
    { value: 'level5', label: 'Superadmin', description: 'System-wide control, override all', icon: Star, color: 'text-red-600' }
  ];

  const selectedLevelData = accessLevels.find(level => level.value === selectedLevel) || accessLevels[0];
  const IconComponent = selectedLevelData.icon;

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-10 text-sm font-medium bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          appearance-none cursor-pointer transition-all duration-200
          ${disabled ? 'opacity-60' : 'hover:border-gray-400'}
        `}
      >
        {accessLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} - {level.description}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      {showLabels && (
        <div className="mt-2 flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${selectedLevelData.color}`} />
          <span className={`text-sm font-medium ${selectedLevelData.color}`}>
            {selectedLevelData.label}
          </span>
          <span className="text-xs text-gray-500">
            {selectedLevelData.description}
          </span>
        </div>
      )}
    </div>
  );
};

export default AccessLevelDropdown;
