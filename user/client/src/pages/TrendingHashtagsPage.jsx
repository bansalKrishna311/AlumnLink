import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, TrendingUp, Loader, Search, ArrowRight } from "lucide-react";
import { useTrendingTags, useOptimizedSearch } from "@/hooks/useAppData";

const TrendingHashtagsPage = () => {
  const navigate = useNavigate();
  
  // Use Zustand store for trending tags
  const { data: trendingTags, isLoading } = useTrendingTags();
  
  // Use optimized search hook
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredTags,
  } = useOptimizedSearch(trendingTags || [], ['tag']);
  
  const handleHashtagClick = (tag) => {
    const cleanTag = typeof tag === 'string' ? tag : tag.tag || '';
    navigate(`/hashtag/${cleanTag.replace('#', '')}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <TrendingUp className="text-[#fe6019] mr-2" size={24} />
          <span>Trending Hashtags</span>
        </h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-[#fe6019]" size={30} />
        </div>
      ) : (
        <>
          {/* Top trending tags section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Trending</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(filteredTags || []).slice(0, 3).map((tag, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleHashtagClick(tag.tag)}
                >
                  <div className={`h-2 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Hash className="text-[#fe6019] mr-2" size={18} />
                        <span className="font-medium text-[#fe6019]">{tag.tag.replace('#', '')}</span>
                      </div>
                      <span className="bg-[#fe6019]/10 text-[#fe6019] text-xs font-medium px-2 py-1 rounded-full">
                        {tag.count} posts
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <TrendingUp 
                          size={14} 
                          className={tag.trend === 'up' ? 'text-green-500 mr-1' : tag.trend === 'down' ? 'text-red-500 mr-1' : 'text-gray-500 mr-1'} 
                        />
                        <span>{tag.trend === 'up' ? 'Trending up' : tag.trend === 'down' ? 'Trending down' : 'Stable'}</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* All trending tags grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">All Hashtags</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(filteredTags || []).slice(3).map((tag, index) => (
                <div 
                  key={index}
                  onClick={() => handleHashtagClick(tag.tag)}
                  className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <Hash className="text-[#fe6019] mr-2" size={14} />
                    <span className="font-medium">{tag.tag.replace('#', '')}</span>
                  </div>
                  <span className="text-xs text-gray-500">{tag.count}</span>
                </div>
              ))}
            </div>
            
            {filteredTags && filteredTags.length === 0 && (
              <div className="text-center py-10">
                <Hash className="mx-auto text-gray-400 mb-3" size={40} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hashtags found</h3>
                <p className="text-gray-500">
                  Try a different search term or create a new post with a hashtag!
                </p>
              </div>
            )}
          </div>
          
          {/* Create a new post with hashtag CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#fe6019]/10 to-[#fe6019]/5 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a new conversation</h3>
                <p className="text-gray-600">Create a post with a hashtag to join the discussion or start a new trend.</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-4 md:mt-0 bg-[#fe6019] text-white px-6 py-2 rounded-lg hover:bg-[#fe6019]/90 transition-colors flex items-center"
              >
                Create Post
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingHashtagsPage;