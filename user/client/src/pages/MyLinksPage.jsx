import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SelfLinks from '../components/SelfLinks';

const MyLinksPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="sticky top-0 z-10 bg-secondary p-4 shadow-md">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-1 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-[#fe6019]" />
          </button>
          <h1 className="text-xl font-bold text-[#fe6019]">My Alma Matters</h1>
        </div>
      </div>
      
      <div className="p-4">
        <SelfLinks />
      </div>
    </motion.div>
  );
};

export default MyLinksPage;