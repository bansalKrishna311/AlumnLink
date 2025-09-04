import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flame, Award, TrendingUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const ContributionGraph = ({ username, isOwnProfile, activityHistory = [], className = "" }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const queryClient = useQueryClient();

  // Listen for real-time activity updates
  useEffect(() => {
    const handleActivityUpdate = () => {
      // Force refresh of user profile data when activities are updated
      queryClient.invalidateQueries(['authUser']); // For own profile
      queryClient.invalidateQueries(['userProfile', username]); // For viewing others' profiles
    };

    // Listen for mutation success events that indicate new activities
    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === 'updated' && event.mutation.state.status === 'success') {
        const mutationKey = event.mutation.options.mutationKey;
        
        if (mutationKey && Array.isArray(mutationKey)) {
          // Check if this is an activity-related mutation
          const isActivityMutation = mutationKey.some(key => 
            typeof key === 'string' && (
              key.includes('createPost') || 
              key.includes('reactToPost') || 
              key.includes('likePost') ||
              key.includes('createComment') ||
              key.includes('replyToComment')
            )
          );
          
          if (isActivityMutation) {
            // Delay the update slightly to ensure backend has processed the activity
            setTimeout(handleActivityUpdate, 1000);
          }
        }
      }
    });

    return unsubscribe;
  }, [username, queryClient]);
  useEffect(() => {
    const handleUserActivity = (event) => {
      const { username: activityUsername } = event.detail;
      
      // Refresh user data if it's for this user
      if (activityUsername === username) {
        queryClient.invalidateQueries(['authUser']); // For own profile
        queryClient.invalidateQueries(['userProfile', username]); // For viewing others' profiles
      }
    };

    window.addEventListener('userActivity', handleUserActivity);
    
    return () => {
      window.removeEventListener('userActivity', handleUserActivity);
    };
  }, [username, queryClient]);

  // Get IST timezone offset
  const getISTDate = useCallback((date = new Date()) => {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const istOffset = 5.5; // IST is UTC+5:30
    return new Date(utc + (istOffset * 3600000));
  }, []);

  // Generate dates from August 1, 2025 to end of next year (2026) for future-proofing
  const generateDateRange = useCallback(() => {
    const startDate = new Date('2025-08-01T00:00:00.000Z');
    const currentDate = getISTDate();
    const currentYear = currentDate.getFullYear();
    
    // If we're in 2025, show till end of 2025
    // If we're in 2026 or later, show till end of that year
    const endYear = currentYear >= 2026 ? currentYear : 2025;
    const endDate = new Date(endYear, 11, 31); // End of the target year
    
    const dates = [];
    
    let currentDatePointer = new Date(startDate);
    while (currentDatePointer <= endDate) {
      dates.push(new Date(currentDatePointer));
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
    
    return dates;
  }, [getISTDate]);

  const dateRange = useMemo(() => generateDateRange(), [generateDateRange]);

  // Create a map of date strings to activity counts from activityHistory
  const activityMap = useMemo(() => {
    const map = {};
    activityHistory.forEach(activity => {
      const date = getISTDate(new Date(activity.date));
      const dateStr = date.toISOString().split('T')[0];
      map[dateStr] = activity.activities.total || 0;
    });
    return map;
  }, [activityHistory, getISTDate]);

  // Calculate intensity based on activity count
  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  // Get color class based on intensity
  const getColorClass = (intensity, isFuture = false) => {
    if (isFuture) {
      return 'bg-gray-50 border border-gray-200'; // Future dates styling
    }
    
    const colors = [
      'bg-gray-100 hover:bg-gray-200', // 0 activities
      'bg-orange-200 hover:bg-orange-300', // 1-2 activities - using theme orange
      'bg-orange-400 hover:bg-orange-500', // 3-5 activities - using theme orange
      'bg-orange-600 hover:bg-orange-700', // 6-10 activities - using theme orange
      'bg-[#fe6019] hover:bg-orange-800'  // 11+ activities - using exact theme color
    ];
    return colors[intensity];
  };

  // Calculate streaks
  const calculateStreaks = useCallback(() => {
    const today = getISTDate();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak (working backwards from today)
    let checkDate = new Date(today);
    let hasActivity = false;
    
    while (checkDate >= new Date('2025-08-01')) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const activityCount = activityMap[dateStr] || 0;
      
      if (activityCount > 0) {
        currentStreak++;
        hasActivity = true;
      } else {
        // If we haven't found any activity yet and this is the first gap, it's okay
        // But if we already had activity and now there's a gap, break the streak
        if (hasActivity) {
          break;
        }
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Calculate longest streak (only count days up to today)
    dateRange.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      // Only count activities up to today for streak calculation
      if (date <= today && activityMap[dateStr] > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else if (date <= today) {
        tempStreak = 0;
      }
    });
    
    return { currentStreak, longestStreak };
  }, [activityMap, dateRange, getISTDate]);

  const { currentStreak, longestStreak } = useMemo(() => calculateStreaks(), [calculateStreaks]);

  // Calculate total contributions (only count up to today)
  const totalContributions = useMemo(() => {
    const today = getISTDate();
    return Object.entries(activityMap).reduce((sum, [dateStr, count]) => {
      const date = new Date(dateStr);
      return date <= today ? sum + count : sum;
    }, 0);
  }, [activityMap, getISTDate]);

  // Group dates by weeks
  const weekGroups = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    
    dateRange.forEach((date, index) => {
      const dayOfWeek = date.getDay(); // 0 = Sunday
      
      if (index === 0) {
        // Fill empty days at the beginning of the first week
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(null);
        }
      }
      
      currentWeek.push(date);
      
      if (dayOfWeek === 6 || index === dateRange.length - 1) {
        // End of week (Saturday) or last date
        if (index === dateRange.length - 1) {
          // Fill empty days at the end of the last week
          while (currentWeek.length < 7) {
            currentWeek.push(null);
          }
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  }, [dateRange]);

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMonthLabels = () => {
    const months = [];
    const firstDate = dateRange[0];
    const lastDate = dateRange[dateRange.length - 1];
    
    let currentMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    
    while (currentMonth <= lastDate) {
      months.push({
        name: currentMonth.toLocaleDateString('en-US', { month: 'short' }),
        date: new Date(currentMonth)
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return months;
  };

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-2">
            <Calendar className="mr-2 text-[#fe6019]" size={20} />
            {isOwnProfile ? "Your Contributions" : `${username}'s Contributions`}
          </h2>
          <p className="text-sm text-gray-600">
            {totalContributions} contributions since August 1, 2025
            {new Date().getFullYear() > 2025 ? ` to ${new Date().getFullYear()}` : ''}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
            <Flame size={16} className="text-[#fe6019]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#fe6019]">{currentStreak}</div>
              <div className="text-xs text-orange-600">Current Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
            <Award size={16} className="text-[#fe6019]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#fe6019]">{longestStreak}</div>
              <div className="text-xs text-orange-600">Longest Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
            <TrendingUp size={16} className="text-[#fe6019]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#fe6019]">{totalContributions}</div>
              <div className="text-xs text-orange-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 ml-8">
            {getMonthLabels().map((month, index) => (
              <div key={index} className="text-xs text-gray-500 w-16 text-center">
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Day labels and grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-gray-500 w-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="h-3 flex items-center justify-end pr-1">
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>
            
            {/* Contribution grid */}
            <div className="flex gap-1">
              {weekGroups.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dayIndex) => {
                    if (!date) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }
                    
                    const dateStr = date.toISOString().split('T')[0];
                    const count = activityMap[dateStr] || 0;
                    const intensity = getIntensity(count);
                    const isSelected = selectedDay === dateStr;
                    const today = getISTDate();
                    const isFuture = date > today;
                    
                    return (
                      <motion.div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                          isFuture ? 'cursor-default' : 'cursor-pointer'
                        } ${getColorClass(intensity, isFuture)} ${
                          isSelected ? 'ring-2 ring-[#fe6019] ring-offset-1' : ''
                        }`}
                        whileHover={isFuture ? {} : { scale: 1.2 }}
                        whileTap={isFuture ? {} : { scale: 0.95 }}
                        onMouseEnter={() => setHoveredDay(dateStr)} // Allow hover for all dates
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => !isFuture && setSelectedDay(isSelected ? null : dateStr)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-orange-200" />
            <div className="w-3 h-3 rounded-sm bg-orange-400" />
            <div className="w-3 h-3 rounded-sm bg-orange-600" />
            <div className="w-3 h-3 rounded-sm bg-[#fe6019]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="font-medium">
              {(() => {
                const hoveredDate = new Date(hoveredDay);
                const today = getISTDate();
                const isFuture = hoveredDate > today;
                
                if (isFuture) {
                  return 'No contributions';
                }
                
                const count = activityMap[hoveredDay] || 0;
                return `${count} contribution${count !== 1 ? 's' : ''}`;
              })()}
            </div>
            <div className="text-gray-300">
              {formatDateShort(new Date(hoveredDay))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContributionGraph;
