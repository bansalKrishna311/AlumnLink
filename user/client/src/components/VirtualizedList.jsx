import React, { useState, useEffect, useMemo, useRef } from 'react';

const VirtualizedList = ({
  items = [],
  itemHeight = 120, // Default height for notification items
  containerHeight = 600, // Height of the visible container
  renderItem,
  overscan = 5, // Extra items to render outside viewport
  className = "",
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  // Calculate which items should be visible
  const visibleItems = useMemo(() => {
    const containerHeightNum = typeof containerHeight === 'string' 
      ? parseInt(containerHeight) 
      : containerHeight;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeightNum) / itemHeight) + overscan
    );

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }

    return {
      items: visibleItems,
      startIndex,
      endIndex,
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  // Handle scroll events
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Optimize scroll handling with throttling
  useEffect(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) return;

    let ticking = false;
    const throttledHandleScroll = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollElement.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  const totalHeight = items.length * itemHeight;
  const containerStyle = typeof containerHeight === 'string' 
    ? { height: containerHeight }
    : { height: `${containerHeight}px` };

  return (
    <div
      ref={scrollElementRef}
      className={`virtualized-list ${className}`}
      style={{
        ...containerStyle,
        overflowY: 'auto',
        position: 'relative',
      }}
      {...props}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems.items.map(({ index, item, style }) => (
          <div key={item.id || item._id || index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;
