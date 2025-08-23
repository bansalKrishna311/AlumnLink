// indexOptimizer.js - Database Index Optimization for Production Performance
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Message from '../models/message.model.js';
import Notification from '../models/notification.model.js';
import Lead from '../models/lead.model.js';
import logger from '../utils/logger.js';

class IndexOptimizer {
  constructor() {
    this.indexedCollections = new Set();
  }

  // Apply all optimized indexes
  async optimizeAllIndexes() {
    try {
      logger.info('🔧 Starting database index optimization...');
      
      await this.optimizeUserIndexes();
      await this.optimizePostIndexes();
      await this.optimizeMessageIndexes();
      await this.optimizeNotificationIndexes();
      await this.optimizeLeadIndexes();
      
      logger.info('✅ Database index optimization completed successfully');
      return { success: true, optimized: Array.from(this.indexedCollections) };
    } catch (error) {
      logger.error('❌ Database index optimization failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Optimize User collection indexes
  async optimizeUserIndexes() {
    try {
      const collection = User.collection;
      
      // Compound index for search functionality
      await collection.createIndex(
        { username: 1, name: 1, location: 1 },
        { name: 'user_search_compound' }
      );
      
      // Text index for search across name, username, headline, skills
      await collection.createIndex(
        { 
          name: 'text', 
          username: 'text', 
          headline: 'text', 
          skills: 'text',
          'experience.company': 'text',
          'education.school': 'text'
        },
        { 
          name: 'user_full_text_search',
          weights: {
            name: 10,
            username: 8,
            headline: 5,
            skills: 3,
            'experience.company': 2,
            'education.school': 1
          }
        }
      );
      
      // Location-based queries
      await collection.createIndex(
        { location: 1, createdAt: -1 },
        { name: 'user_location_recent' }
      );
      
      // Skills-based queries (multikey index)
      await collection.createIndex(
        { skills: 1 },
        { name: 'user_skills' }
      );
      
      // Connection-related queries
      await collection.createIndex(
        { connections: 1 },
        { name: 'user_connections' }
      );
      
      // Auth-related sparse indexes
      await collection.createIndex(
        { resetPasswordToken: 1 },
        { name: 'user_reset_token', sparse: true }
      );
      
      this.indexedCollections.add('users');
      logger.info('✅ User indexes optimized');
    } catch (error) {
      logger.error('❌ User index optimization failed:', error);
    }
  }

  // Optimize Post collection indexes
  async optimizePostIndexes() {
    try {
      const collection = Post.collection;
      
      // Most common query: recent posts by author
      await collection.createIndex(
        { author: 1, createdAt: -1 },
        { name: 'post_author_recent' }
      );
      
      // Feed queries: approved posts, recent first
      await collection.createIndex(
        { status: 1, createdAt: -1 },
        { name: 'post_feed_main' }
      );
      
      // Admin queries: pending posts
      await collection.createIndex(
        { status: 1, createdAt: 1 },
        { name: 'post_admin_pending' }
      );
      
      // Text search across content
      await collection.createIndex(
        { content: 'text' },
        { name: 'post_content_search' }
      );
      
      // Hashtag-based queries
      await collection.createIndex(
        { hashtags: 1, createdAt: -1 },
        { name: 'post_hashtags' }
      );
      
      // Like/reaction queries
      await collection.createIndex(
        { 'reactions.user': 1 },
        { name: 'post_reactions_user' }
      );
      
      // Comment queries
      await collection.createIndex(
        { 'comments.user': 1, 'comments.createdAt': -1 },
        { name: 'post_comments_user' }
      );
      
      // Bookmark queries
      await collection.createIndex(
        { bookmarkedBy: 1 },
        { name: 'post_bookmarks' }
      );
      
      this.indexedCollections.add('posts');
      logger.info('✅ Post indexes optimized');
    } catch (error) {
      logger.error('❌ Post index optimization failed:', error);
    }
  }

  // Optimize Message collection indexes
  async optimizeMessageIndexes() {
    try {
      const collection = Message.collection;
      
      // Conversation queries (most frequent)
      await collection.createIndex(
        { participants: 1, createdAt: -1 },
        { name: 'message_conversation' }
      );
      
      // Sender-receiver queries
      await collection.createIndex(
        { sender: 1, receiver: 1, createdAt: -1 },
        { name: 'message_sender_receiver' }
      );
      
      // Unread message queries
      await collection.createIndex(
        { receiver: 1, isRead: 1, createdAt: -1 },
        { name: 'message_unread' }
      );
      
      // Message search
      await collection.createIndex(
        { content: 'text' },
        { name: 'message_content_search' }
      );
      
      this.indexedCollections.add('messages');
      logger.info('✅ Message indexes optimized');
    } catch (error) {
      logger.error('❌ Message index optimization failed:', error);
    }
  }

  // Optimize Notification collection indexes
  async optimizeNotificationIndexes() {
    try {
      const collection = Notification.collection;
      
      // User notification queries (most frequent)
      await collection.createIndex(
        { recipient: 1, createdAt: -1 },
        { name: 'notification_user_recent' }
      );
      
      // Unread notifications
      await collection.createIndex(
        { recipient: 1, isRead: 1, createdAt: -1 },
        { name: 'notification_unread' }
      );
      
      // Notification type queries
      await collection.createIndex(
        { recipient: 1, type: 1, createdAt: -1 },
        { name: 'notification_type' }
      );
      
      this.indexedCollections.add('notifications');
      logger.info('✅ Notification indexes optimized');
    } catch (error) {
      logger.error('❌ Notification index optimization failed:', error);
    }
  }

  // Optimize Lead collection indexes (if exists)
  async optimizeLeadIndexes() {
    try {
      // Check if Lead model exists
      if (!Lead) {
        logger.info('ℹ️ Lead model not found, skipping lead indexes');
        return;
      }
      
      const collection = Lead.collection;
      
      // Lead status and priority queries
      await collection.createIndex(
        { status: 1, priority: 1, createdAt: -1 },
        { name: 'lead_status_priority' }
      );
      
      // Lead assignment queries
      await collection.createIndex(
        { assignedTo: 1, status: 1, createdAt: -1 },
        { name: 'lead_assigned' }
      );
      
      // Lead search by company/person
      await collection.createIndex(
        { 
          'personalInfo.name': 'text',
          'companyInfo.name': 'text',
          'personalInfo.email': 'text'
        },
        { name: 'lead_search' }
      );
      
      // Follow-up date queries
      await collection.createIndex(
        { nextFollowUp: 1, status: 1 },
        { name: 'lead_followup', sparse: true }
      );
      
      this.indexedCollections.add('leads');
      logger.info('✅ Lead indexes optimized');
    } catch (error) {
      logger.warn('⚠️ Lead index optimization skipped:', error.message);
    }
  }

  // Get current index information
  async getIndexInfo() {
    try {
      const indexInfo = {};
      
      for (const collectionName of this.indexedCollections) {
        const collection = mongoose.connection.db.collection(collectionName);
        const indexes = await collection.indexes();
        indexInfo[collectionName] = indexes.map(idx => ({
          name: idx.name,
          key: idx.key,
          size: idx.size || 'unknown'
        }));
      }
      
      return indexInfo;
    } catch (error) {
      logger.error('❌ Failed to get index information:', error);
      return {};
    }
  }

  // Monitor index usage and performance
  async analyzeIndexPerformance() {
    try {
      const performance = {};
      
      for (const collectionName of this.indexedCollections) {
        const collection = mongoose.connection.db.collection(collectionName);
        
        // Get index statistics
        const stats = await collection.aggregate([
          { $indexStats: {} }
        ]).toArray();
        
        performance[collectionName] = stats.map(stat => ({
          name: stat.name,
          accesses: stat.accesses,
          usageCount: stat.accesses?.ops || 0
        }));
      }
      
      return performance;
    } catch (error) {
      logger.error('❌ Index performance analysis failed:', error);
      return {};
    }
  }

  // Drop unused indexes
  async cleanupUnusedIndexes() {
    try {
      const performance = await this.analyzeIndexPerformance();
      const cleanupResults = [];
      
      for (const [collectionName, indexes] of Object.entries(performance)) {
        const collection = mongoose.connection.db.collection(collectionName);
        
        for (const index of indexes) {
          // Drop indexes with very low usage (but keep essential ones)
          if (index.usageCount < 10 && !index.name.includes('_id') && !index.name.includes('unique')) {
            try {
              await collection.dropIndex(index.name);
              cleanupResults.push(`Dropped unused index: ${collectionName}.${index.name}`);
              logger.info(`🗑️ Dropped unused index: ${collectionName}.${index.name}`);
            } catch (dropError) {
              logger.warn(`⚠️ Could not drop index ${index.name}:`, dropError.message);
            }
          }
        }
      }
      
      return cleanupResults;
    } catch (error) {
      logger.error('❌ Index cleanup failed:', error);
      return [];
    }
  }
}

// Create singleton instance
const indexOptimizer = new IndexOptimizer();

export default indexOptimizer;
