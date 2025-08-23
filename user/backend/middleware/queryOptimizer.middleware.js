// queryOptimizer.middleware.js - Database Query Optimization for Better Performance
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

class QueryOptimizer {
  constructor() {
    this.optimizationStats = {
      queriesOptimized: 0,
      bytesReduced: 0,
      timesSaved: 0,
      optimizationsByType: new Map()
    };
    
    // Field projection configurations for different models
    this.projectionConfigs = {
      user: {
        list: 'name username profilePicture headline location createdAt',
        card: 'name username profilePicture headline location connections',
        search: 'name username profilePicture headline location skills',
        minimal: 'name username profilePicture'
      },
      post: {
        feed: 'content author images createdAt reactions.count comments.count status hashtags',
        list: 'content author createdAt reactions.count comments.count status',
        minimal: 'content author createdAt'
      },
      message: {
        conversation: 'content sender receiver createdAt isRead',
        list: 'content sender receiver createdAt isRead'
      },
      notification: {
        list: 'type message sender recipient createdAt isRead',
        unread: 'type message sender recipient createdAt'
      }
    };
    
    this.setupQueryOptimization();
  }

  // Setup automatic query optimization
  setupQueryOptimization() {
    // Override mongoose Query prototype for optimization
    const originalExec = mongoose.Query.prototype.exec;
    
    mongoose.Query.prototype.exec = function() {
      const startTime = Date.now();
      
      // Apply optimizations before execution
      this.lean(); // Use lean queries by default for read operations
      
      // Apply field projection if not already set
      if (!this.getOptions().projection && this.op !== 'save' && this.op !== 'remove') {
        const modelName = this.model.modelName.toLowerCase();
        const operation = this._determineOperationType();
        
        if (queryOptimizer.projectionConfigs[modelName] && queryOptimizer.projectionConfigs[modelName][operation]) {
          this.select(queryOptimizer.projectionConfigs[modelName][operation]);
          queryOptimizer.recordOptimization('projection', modelName, operation);
        }
      }
      
      // Limit large result sets automatically
      if (this.op === 'find' && !this.getOptions().limit) {
        this.limit(100); // Default limit to prevent memory issues
        queryOptimizer.recordOptimization('limit', this.model.modelName.toLowerCase(), 'auto-limit');
      }
      
      // Execute with optimization tracking
      return originalExec.apply(this, arguments)
        .then(result => {
          const duration = Date.now() - startTime;
          
          // Track performance improvement
          if (this.getOptions().lean) {
            queryOptimizer.optimizationStats.timesSaved += Math.max(0, 50 - duration); // Estimated time saved
          }
          
          return result;
        })
        .catch(error => {
          throw error;
        });
    };
    
    // Add helper method to determine operation type
    mongoose.Query.prototype._determineOperationType = function() {
      const url = this._pipeline ? 'aggregate' : this.op;
      
      // Determine context from calling function if possible
      if (this._context) {
        if (this._context.includes('feed')) return 'feed';
        if (this._context.includes('search')) return 'search';
        if (this._context.includes('list')) return 'list';
        if (this._context.includes('card')) return 'card';
      }
      
      return 'list'; // Default
    };
  }

  // Record optimization statistics
  recordOptimization(type, model, operation) {
    this.optimizationStats.queriesOptimized++;
    
    const key = `${type}-${model}-${operation}`;
    const count = this.optimizationStats.optimizationsByType.get(key) || 0;
    this.optimizationStats.optimizationsByType.set(key, count + 1);
  }

  // Create optimized query builders for common operations
  createOptimizedQueries() {
    return {
      // User queries
      getUsersForFeed: (limit = 20, skip = 0) => {
        return mongoose.model('User')
          .find({}, this.projectionConfigs.user.card)
          .lean()
          .limit(limit)
          .skip(skip)
          .sort({ lastActive: -1 });
      },

      getUserProfile: (username) => {
        return mongoose.model('User')
          .findOne({ username })
          .lean()
          .populate('connections', this.projectionConfigs.user.minimal);
      },

      searchUsers: (searchTerm, limit = 10) => {
        return mongoose.model('User')
          .find({
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { username: { $regex: searchTerm, $options: 'i' } },
              { headline: { $regex: searchTerm, $options: 'i' } }
            ]
          }, this.projectionConfigs.user.search)
          .lean()
          .limit(limit);
      },

      // Post queries
      getPostsForFeed: (userId, limit = 20, skip = 0) => {
        return mongoose.model('Post')
          .find({ 
            $or: [
              { author: { $in: userId } }, // User's own posts
              { status: 'approved' } // Approved posts
            ]
          }, this.projectionConfigs.post.feed)
          .lean()
          .populate('author', this.projectionConfigs.user.minimal)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);
      },

      getPostsByUser: (authorId, limit = 20) => {
        return mongoose.model('Post')
          .find({ author: authorId }, this.projectionConfigs.post.list)
          .lean()
          .populate('author', this.projectionConfigs.user.minimal)
          .sort({ createdAt: -1 })
          .limit(limit);
      },

      // Message queries
      getConversations: (userId, limit = 20) => {
        return mongoose.model('Message')
          .aggregate([
            {
              $match: {
                $or: [{ sender: userId }, { receiver: userId }]
              }
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $group: {
                _id: {
                  $cond: [
                    { $eq: ['$sender', userId] },
                    '$receiver',
                    '$sender'
                  ]
                },
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                  $sum: {
                    $cond: [
                      { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'participant',
                pipeline: [
                  { $project: { name: 1, username: 1, profilePicture: 1 } }
                ]
              }
            },
            {
              $limit: limit
            }
          ]);
      },

      // Notification queries
      getUserNotifications: (userId, limit = 20, unreadOnly = false) => {
        const filter = { recipient: userId };
        if (unreadOnly) filter.isRead = false;
        
        return mongoose.model('Notification')
          .find(filter, this.projectionConfigs.notification.list)
          .lean()
          .populate('sender', this.projectionConfigs.user.minimal)
          .sort({ createdAt: -1 })
          .limit(limit);
      }
    };
  }

  // Bulk operations optimizer
  createBulkOperations() {
    return {
      // Efficient bulk user updates
      bulkUpdateUsers: (updates) => {
        const bulkOps = updates.map(update => ({
          updateOne: {
            filter: { _id: update.userId },
            update: { $set: update.data },
            upsert: false
          }
        }));
        
        return mongoose.model('User').bulkWrite(bulkOps, { ordered: false });
      },

      // Efficient bulk notification creation
      bulkCreateNotifications: (notifications) => {
        return mongoose.model('Notification').insertMany(notifications, { ordered: false });
      },

      // Efficient bulk read marking
      bulkMarkAsRead: (notificationIds, userId) => {
        return mongoose.model('Notification').updateMany(
          { _id: { $in: notificationIds }, recipient: userId },
          { $set: { isRead: true, readAt: new Date() } }
        );
      }
    };
  }

  // Get optimization statistics
  getStats() {
    const optimizationTypes = {};
    for (const [key, count] of this.optimizationStats.optimizationsByType.entries()) {
      optimizationTypes[key] = count;
    }
    
    return {
      ...this.optimizationStats,
      bytesReduced: `${Math.round(this.optimizationStats.bytesReduced / 1024)}KB`,
      optimizationTypes
    };
  }

  // Performance analysis for queries
  analyzeQueryPerformance(model, operation, duration, resultSize) {
    const analysis = {
      model,
      operation,
      duration,
      resultSize,
      efficiency: 'good',
      recommendations: []
    };
    
    // Analyze performance
    if (duration > 1000) {
      analysis.efficiency = 'poor';
      analysis.recommendations.push('Consider adding database indexes');
      analysis.recommendations.push('Use field projection to reduce data transfer');
    } else if (duration > 500) {
      analysis.efficiency = 'fair';
      analysis.recommendations.push('Consider query optimization');
    }
    
    if (resultSize > 1000) {
      analysis.recommendations.push('Implement pagination to reduce result size');
    }
    
    if (resultSize > 100 && !operation.includes('lean')) {
      analysis.recommendations.push('Use lean queries for read-only operations');
    }
    
    return analysis;
  }
}

// Create singleton instance
const queryOptimizer = new QueryOptimizer();

// Middleware to add query optimization context
export const queryOptimizationMiddleware = (context) => {
  return (req, res, next) => {
    // Add context to request for query optimization
    req.queryContext = context;
    
    // Store original query methods to add context
    const originalQuery = mongoose.Query.prototype.exec;
    req.optimizedQueries = queryOptimizer.createOptimizedQueries();
    req.bulkOperations = queryOptimizer.createBulkOperations();
    
    next();
  };
};

// Specific optimization middleware for different routes
export const optimizationStrategies = {
  feed: queryOptimizationMiddleware('feed'),
  search: queryOptimizationMiddleware('search'),
  profile: queryOptimizationMiddleware('profile'),
  list: queryOptimizationMiddleware('list'),
  card: queryOptimizationMiddleware('card')
};

export { queryOptimizer };
export default queryOptimizer;
