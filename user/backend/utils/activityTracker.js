import User from "../models/user.model.js";

// Get current date in IST
export const getISTDate = (date = new Date()) => {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const istOffset = 5.5; // IST is UTC+5:30
  return new Date(utc + (istOffset * 3600000));
};

// Get date string in YYYY-MM-DD format for IST
export const getISTDateString = (date = new Date()) => {
  const istDate = getISTDate(date);
  return istDate.toISOString().split('T')[0];
};

// Track user activity
export const trackUserActivity = async (userId, activityType) => {
  try {
    if (!userId || !activityType) {
      console.log('Missing userId or activityType for activity tracking');
      return;
    }

    const today = getISTDateString();
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for activity tracking:', userId);
      return;
    }

    // Only track activity for regular users (not admin or superadmin)
    if (user.role !== 'user') {
      console.log('Skipping activity tracking for non-user role:', user.role);
      return;
    }

    // Find today's activity record
    let todayActivity = user.activityHistory.find(
      activity => activity.date.toISOString().split('T')[0] === today
    );

    if (!todayActivity) {
      // Create new activity record for today
      todayActivity = {
        date: getISTDate(),
        activities: {
          posts: 0,
          likes: 0,
          comments: 0,
          total: 0
        }
      };
      user.activityHistory.push(todayActivity);
    }

    // Increment the specific activity count
    const activityIndex = user.activityHistory.findIndex(
      activity => activity.date.toISOString().split('T')[0] === today
    );

    if (activityIndex !== -1) {
      const activities = user.activityHistory[activityIndex].activities;
      
      switch (activityType) {
        case 'post':
          activities.posts += 1;
          break;
        case 'like':
          activities.likes += 1;
          break;
        case 'comment':
          activities.comments += 1;
          break;
        default:
          console.log('Unknown activity type:', activityType);
          return;
      }
      
      // Update total
      activities.total = activities.posts + activities.likes + activities.comments;
      
      // Mark the subdocument as modified
      user.markModified('activityHistory');
      
      // Save the user
      await user.save();
      
      console.log(`Activity tracked for user ${userId}: ${activityType} on ${today}`);
    }
  } catch (error) {
    console.error('Error tracking user activity:', error);
  }
};

// Get user's contribution data for the graph
export const getUserContributions = async (userId, startDate = '2025-08-01') => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return [];
    }

    // Filter activities from the start date
    const contributions = user.activityHistory
      .filter(activity => {
        const activityDate = activity.date.toISOString().split('T')[0];
        return activityDate >= startDate;
      })
      .map(activity => ({
        date: activity.date,
        count: activity.activities.total,
        details: {
          posts: activity.activities.posts,
          likes: activity.activities.likes,
          comments: activity.activities.comments
        }
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return contributions;
  } catch (error) {
    console.error('Error getting user contributions:', error);
    return [];
  }
};

// Get contribution data by username
export const getContributionsByUsername = async (username, startDate = '2025-08-01') => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return [];
    }

    return await getUserContributions(user._id, startDate);
  } catch (error) {
    console.error('Error getting contributions by username:', error);
    return [];
  }
};
