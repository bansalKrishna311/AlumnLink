import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import SelfLinks from "../components/SelfLinks";
import { Users } from 'lucide-react';
import { useAuthUser, usePosts } from "@/hooks/useAppData";

const HomePage = () => {
  const { data: authUser } = useAuthUser();
  const [selectedType, setSelectedType] = useState("all");

  const { data: posts, isLoading } = usePosts();

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredPosts =
    selectedType === "all"
      ? posts
      : posts?.filter((post) => post.type === selectedType);

  const postTypes = [
    { id: "all", label: "All" },
    { id: "discussion", label: "Discussion" },
    { id: "job", label: "Job" },
    { id: "internship", label: "Internship" },
    { id: "event", label: "Event" },
    { id: "personal", label: "Personal" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 max-w-8xl mx-auto">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
        <div>
          <PostCreation user={authUser} />
        </div>

        <div className="flex space-x-2 mb-4 overflow-x-auto py-2 scrollbar-hide">
          {postTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95
                ${selectedType === type.id 
                  ? 'bg-[#fe6019] text-white shadow-lg' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
            >

              
              {type.label}
            </button>
          ))}
        </div>

        <div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-40 w-full" />
                ))}
              </div>
            </div>
          ) : filteredPosts?.length ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post._id}>
                  <Post post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-[#fe6019]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                No Posts Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Link with others to start seeing posts in your feed!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-1">
        <SelfLinks />
      </div>
    </div>
  );
};

export default HomePage;

