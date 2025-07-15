import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisible) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > maxVisible) {
          pages.push('...');
        }
        for (let i = Math.max(totalPages - maxVisible + 1, 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <motion.button
        className="p-2 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-[#fff5f0] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={index} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <motion.button
            key={page}
            className={`h-8 w-8 rounded-md border text-sm font-medium ${
              currentPage === page 
                ? 'bg-[#fe6019] text-white border-[#fe6019]' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-[#fff5f0]'
            }`}
            onClick={() => onPageChange(page)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        )
      ))}

      <motion.button
        className="p-2 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-[#fff5f0] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

export default Pagination;