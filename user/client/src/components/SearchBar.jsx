import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = memo(({
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceDelay = 300,
  className = "",
  showClearButton = true,
  initialValue = "",
  disabled = false,
  size = "md", // sm, md, lg
  icon = true
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback((value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, debounceDelay);
  }, [onSearch, debounceDelay]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle clear
  const handleClear = useCallback(() => {
    setSearchValue("");
    if (onClear) {
      onClear();
    } else if (onSearch) {
      onSearch("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onClear, onSearch]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue);
      }
    }
  }, [handleClear, onSearch, searchValue]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Update internal state when initialValue changes
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  // Size variants
  const sizeClasses = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-lg"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch 
              className={`text-gray-400 transition-colors duration-200 ${
                isFocused ? 'text-[#fe6019]' : ''
              }`}
              size={iconSizes[size]}
            />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            block w-full 
            ${icon ? 'pl-10' : 'pl-4'} 
            ${showClearButton && searchValue ? 'pr-10' : 'pr-4'}
            ${sizeClasses[size]}
            border border-gray-200 rounded-lg 
            focus:ring-2 focus:ring-[#fe6019] focus:border-transparent 
            transition-all duration-200 
            bg-white shadow-sm
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            placeholder-gray-400
            ${isFocused ? 'shadow-md border-[#fe6019]' : 'hover:border-gray-300'}
          `}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {showClearButton && searchValue && !disabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <FaTimes size={iconSizes[size] - 2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Focus Ring Animation */}
      <motion.div
        className={`absolute inset-0 border-2 border-[#fe6019] rounded-lg pointer-events-none ${
          isFocused ? 'opacity-20' : 'opacity-0'
        }`}
        animate={{ opacity: isFocused ? 0.2 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;