/**
 * Server-side Search Utility for Alumni Connections
 * 
 * This utility provides optimized search functionality for the backend
 * to handle search queries across all alumni connection data with pagination.
 */

/**
 * Build MongoDB search query for alumni connections
 * @param {string} searchTerm - The search term from the client
 * @returns {Object} MongoDB query object
 */
const buildSearchQuery = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
    return {};
  }

  const searchRegex = new RegExp(searchTerm.trim(), 'i'); // Case insensitive
  const searchTerms = searchTerm.trim().split(/\s+/);
  
  // Create search conditions for multiple fields
  const searchConditions = [];

  // Direct field searches
  searchConditions.push(
    { rollNumber: searchRegex },
    { batch: searchRegex },
    { courseName: searchRegex }
  );

  // User populated field searches
  searchConditions.push(
    { 'user.name': searchRegex },
    { 'user.username': searchRegex },
    { 'user.email': searchRegex },
    { 'user.location': searchRegex }
  );

  // Multi-term search for better matching
  if (searchTerms.length > 1) {
    const multiTermConditions = searchTerms.map(term => {
      const termRegex = new RegExp(term.trim(), 'i');
      return {
        $or: [
          { 'user.name': termRegex },
          { 'user.username': termRegex },
          { rollNumber: termRegex },
          { batch: termRegex },
          { courseName: termRegex },
          { 'user.location': termRegex }
        ]
      };
    });
    
    // All terms should match (AND operation)
    return { $and: multiTermConditions };
  }

  return { $or: searchConditions };
};

/**
 * Advanced search with aggregation pipeline for better performance
 * @param {string} searchTerm - Search query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Array} Aggregation pipeline
 */
const buildSearchAggregation = (searchTerm, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const pipeline = [];

  // Lookup user data
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  });

  // Unwind user array
  pipeline.push({
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true
    }
  });

  // Add search stage if search term exists
  if (searchTerm && searchTerm.trim()) {
    const searchQuery = buildSearchQuery(searchTerm);
    if (Object.keys(searchQuery).length > 0) {
      pipeline.push({ $match: searchQuery });
    }
  }

  // Add sorting for better relevance
  if (searchTerm && searchTerm.trim()) {
    // Sort by relevance - exact matches first
    const exactMatchSort = {};
    const searchRegex = new RegExp(`^${searchTerm.trim()}$`, 'i');
    
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $sum: [
            { $cond: [{ $regexMatch: { input: '$user.name', regex: searchRegex } }, 100, 0] },
            { $cond: [{ $regexMatch: { input: '$rollNumber', regex: searchRegex } }, 90, 0] },
            { $cond: [{ $regexMatch: { input: '$user.username', regex: searchRegex } }, 80, 0] },
            { $cond: [{ $regexMatch: { input: '$batch', regex: searchRegex } }, 70, 0] },
            { $cond: [{ $regexMatch: { input: '$courseName', regex: searchRegex } }, 60, 0] },
            { $cond: [{ $regexMatch: { input: '$user.location', regex: searchRegex } }, 50, 0] }
          ]
        }
      }
    });
    
    pipeline.push({ $sort: { relevanceScore: -1, createdAt: -1 } });
  } else {
    // Default sorting when no search
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  return pipeline;
};

/**
 * Get total count for search results
 * @param {string} searchTerm - Search query
 * @returns {Array} Count aggregation pipeline
 */
const buildCountAggregation = (searchTerm) => {
  const pipeline = [];

  // Lookup user data
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  });

  // Unwind user array
  pipeline.push({
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true
    }
  });

  // Add search stage if search term exists
  if (searchTerm && searchTerm.trim()) {
    const searchQuery = buildSearchQuery(searchTerm);
    if (Object.keys(searchQuery).length > 0) {
      pipeline.push({ $match: searchQuery });
    }
  }

  // Count results
  pipeline.push({ $count: 'total' });

  return pipeline;
};

/**
 * Express.js route handler example for search functionality
 */
const searchLinksHandler = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build aggregation pipelines
    const searchPipeline = buildSearchAggregation(search, pageNum, limitNum);
    const countPipeline = buildCountAggregation(search);

    // Execute both queries in parallel
    const [results, countResult] = await Promise.all([
      LinkRequest.aggregate(searchPipeline),
      LinkRequest.aggregate(countPipeline)
    ]);

    const totalCount = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    // Set pagination headers
    res.set({
      'X-Total-Count': totalCount.toString(),
      'X-Total-Pages': totalPages.toString(),
      'X-Current-Page': pageNum.toString(),
      'X-Per-Page': limitNum.toString()
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
};

/**
 * Utility for text highlighting on server-side (if needed)
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with HTML highlight tags
 */
const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const searchTerms = searchTerm.trim().split(/\s+/);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};

module.exports = {
  buildSearchQuery,
  buildSearchAggregation,
  buildCountAggregation,
  searchLinksHandler,
  highlightText
};
