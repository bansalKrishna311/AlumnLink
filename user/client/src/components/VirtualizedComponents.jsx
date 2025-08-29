import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { FixedSizeList as List, FixedSizeGrid } from 'react-window';
import { areEqual } from 'react-window';
import { debounce } from 'lodash.debounce';

// Optimized list item component
const ListItem = memo(({ index, style, data }) => {
  const item = data.items[index];
  const ItemComponent = data.itemComponent;
  
  return (
    <div style={style}>
      <ItemComponent {...item} />
    </div>
  );
}, areEqual);

// Virtual list component for large datasets
export const VirtualList = memo(({ 
  items = [], 
  itemHeight = 50, 
  height = 400, 
  itemComponent,
  overscan = 5,
  ...props 
}) => {
  const itemData = useMemo(() => ({
    items,
    itemComponent,
  }), [items, itemComponent]);

  const itemCount = items.length;

  if (itemCount === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No items to display</p>
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={overscan}
      {...props}
    >
      {ListItem}
    </List>
  );
});

// Optimized grid component
export const VirtualGrid = memo(({ 
  items = [], 
  columnCount = 3, 
  rowHeight = 200,
  columnWidth = 300,
  height = 600,
  itemComponent,
  ...props 
}) => {
  const rowCount = Math.ceil(items.length / columnCount);
  
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = items[index];
    
    if (!item) return <div style={style} />;
    
    const ItemComponent = itemComponent;
    return (
      <div style={style}>
        <ItemComponent {...item} />
      </div>
    );
  }, [items, columnCount, itemComponent]);

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      {...props}
    >
      {Cell}
    </FixedSizeGrid>
  );
});

// Lazy loading component for images
export const LazyImage = memo(({ src, alt, className, placeholder = '/placeholder.jpg' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => setIsLoaded(true);
          img.onerror = () => setIsError(true);
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={imgRef} className={className}>
      {isLoaded && !isError ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <img src={placeholder} alt={alt} className="w-full h-full object-cover opacity-50" />
      )}
    </div>
  );
});

// Optimized search component with debouncing
export const OptimizedSearch = memo(({ 
  onSearch, 
  placeholder = "Search...", 
  debounceMs = 300,
  className = ""
}) => {
  const [query, setQuery] = useState("");
  
  const debouncedSearch = useMemo(
    () => debounce(onSearch, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
});

VirtualList.displayName = 'VirtualList';
VirtualGrid.displayName = 'VirtualGrid';
LazyImage.displayName = 'LazyImage';
OptimizedSearch.displayName = 'OptimizedSearch';
