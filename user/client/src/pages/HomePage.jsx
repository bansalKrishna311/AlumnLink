import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users, Loader } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const HomePage = () => {
    const queryClient = useQueryClient();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [searchQuery, setSearchQuery] = useState("");
    const [offset, setOffset] = useState(0);
    const [initialLimit] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("all");
    const [recommendedUsers, setRecommendedUsers] = useState([]);

    const { data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/posts");
            return res.data;
        },
    });

    const fetchRecommendedUsers = async (newOffset = 0) => {
        setIsLoading(true);
        const res = await axiosInstance.get("/users/suggestions", {
            params: { search: searchQuery, offset: newOffset, limit: initialLimit },
        });
        setIsLoading(false);
        setRecommendedUsers((prev) => (newOffset === 0 ? res.data : [...prev, ...res.data]));
    };

    const handleShowMore = () => {
        const newOffset = offset + initialLimit;
        setOffset(newOffset);
        fetchRecommendedUsers(newOffset);
    };

    const debouncedSearch = debounce((query) => {
        setOffset(0);
        setSearchQuery(query);
        setRecommendedUsers([]);
    }, 300);

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const filteredPosts = selectedType === "all" ? posts : posts?.filter(post => post.type === selectedType);

    useEffect(() => {
        fetchRecommendedUsers();
    }, [searchQuery]);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
                <PostCreation user={authUser} />

                <div className='flex space-x-4 mb-4'>
                    {["all", "discussion", "job", "internship", "event", "personal", "other"].map((type) => (
                        <div
                            key={type}
                            className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-200 ${selectedType === type ? 'bg-gray-300 font-semibold' : ''}`}
                            onClick={() => handleTypeChange(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    ))}
                </div>

                {filteredPosts?.map((post) => (
                    <Post key={post._id} post={post} />
                ))}

                {filteredPosts?.length === 0 && (
                    <div className='bg-white rounded-lg shadow p-8 text-center'>
                        <div className='mb-6'>
                            <Users size={64} className='mx-auto text-blue-500' />
                        </div>
                        <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
                        <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
                    </div>
                )}
            </div>

            <div className='col-span-1 lg:col-span-1 hidden lg:block'>
                <div className='bg-secondary rounded-lg shadow p-4'>
                    <h2 className='font-semibold mb-4'>People you may know</h2>
                    <input
                        type="text"
                        placeholder="Search users..."
                        onChange={handleSearch}
                        className="mb-4 p-2 border rounded w-full"
                    />
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 flex justify-center">
                            <Loader size={24} className="animate-spin" />
                            <span className="ml-2">Loading suggestions...</span>
                        </div>
                    ) : recommendedUsers?.length > 0 ? (
                        recommendedUsers.map((user) => (
                            <RecommendedUser key={user._id} user={user} />
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">No users found</div>
                    )}
                    {recommendedUsers?.length % initialLimit === 0 && recommendedUsers.length > 0 && (
                        <motion.button
                            onClick={handleShowMore}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                            className={`mt-2 px-4 py-2 flex items-center justify-center transition 
                                ${isLoading ? 'cursor-not-allowed text-gray-400' : 'text-blue-500 hover:text-blue-700'}
                                ease-in-out duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader size={16} className="animate-spin mr-2" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                "Show More"
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
