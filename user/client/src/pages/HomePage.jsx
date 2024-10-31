import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const HomePage = () => {
    const queryClient = useQueryClient();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [searchQuery, setSearchQuery] = useState("");
    const [offset, setOffset] = useState(0);
    const [initialLimit] = useState(3); // Fixed limit for each load
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("all");

    const { data: recommendedUsers, refetch, isFetching } = useQuery({
        queryKey: ["recommendedUsers", searchQuery, offset, initialLimit],
        queryFn: async () => {
            setIsLoading(true);
            const res = await axiosInstance.get("/users/suggestions", {
                params: { search: searchQuery, offset, limit: offset + initialLimit },
            });
            setIsLoading(false);
            return res.data;
        },
        keepPreviousData: true,
    });

    const { data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/posts");
            return res.data;
        },
    });

    const handleShowMore = () => {
        setOffset((prevOffset) => prevOffset + initialLimit);
    };

    // Debounce search to reduce API calls
    const debouncedSearch = debounce((query) => {
        setOffset(0);
        setSearchQuery(query);
    }, 300);

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const filteredPosts = selectedType === "all" ? posts : posts?.filter(post => post.type === selectedType);

    const isMoreUsersAvailable = recommendedUsers?.length >= offset + initialLimit && !isFetching;

    useEffect(() => {
        refetch();
    }, [searchQuery, offset, initialLimit]);

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
                    {isFetching ? (
                        <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
                    ) : recommendedUsers?.length > 0 ? (
                        recommendedUsers.map((user) => (
                            <RecommendedUser key={user._id} user={user} />
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">No users found</div>
                    )}
                    {isMoreUsersAvailable && (
                        <button 
                            onClick={handleShowMore} 
                            className='mt-2 text-blue-500' 
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Show More"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
    