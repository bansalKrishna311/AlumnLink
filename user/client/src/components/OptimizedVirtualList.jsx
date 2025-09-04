import React, { useState, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

/**
 * High-performance virtualized list using react-virtuoso
 * Optimized for AlumnLink's large datasets
 */
const OptimizedVirtualList = ({
  items = [],
  renderItem,
  estimatedItemSize = 120,
  className = "",
  style = {},
  onEndReached,
  endReachedThreshold = 500,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 VirtualList: Rendering ${items.length} items`);
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`⚡ VirtualList: Render completed in ${(endTime - startTime).toFixed(2)}ms`);
      };
    }
  }, [items.length]);

  const handleEndReached = async () => {
    if (isLoading || !onEndReached) return;
    
    setIsLoading(true);
    try {
      await onEndReached();
    } finally {
      setIsLoading(false);
    }
  };

  const itemRenderer = (index) => {
    const item = memoizedItems[index];
    if (!item) return null;
    
    return (
      <div key={item.id || item._id || index}>
        {renderItem(item, index)}
      </div>
    );
  };

  if (memoizedItems.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`} style={style}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  return (
    <div className={className} style={{ height: '100%', ...style }}>
      <Virtuoso
        data={memoizedItems}
        itemContent={itemRenderer}
        endReached={onEndReached ? handleEndReached : undefined}
        overscan={5}
        increaseViewportBy={200}
        {...props}
      />
      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#fe6019]"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedVirtualList;
