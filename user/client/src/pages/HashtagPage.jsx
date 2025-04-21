import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import Post from "../components/Post";
import { ArrowLeft, Hash, Loader } from "lucide-react";

const HashtagPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["hashtagPosts", tag],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/hashtag/${tag}`);
      return response.data;
    }
  });
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBackClick}
          className="p-2 mr-3 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <Hash className="text-[#fe6019] mr-2" size={24} />
          <span>{tag}</span>
        </h1>
      </div>
      
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin text-[#fe6019]" size={30} />
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Error loading posts.</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <Hash className="mx-auto text-gray-400 mb-3" size={40} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
            <p className="text-gray-500">
              Be the first to use <span className="text-[#fe6019]">#{tag}</span> in a post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashtagPage;