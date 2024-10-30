import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { useState } from "react";

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [searchQuery, setSearchQuery] = useState("");
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("all"); // State for the selected post type

    const { data: recommendedUsers, refetch } = useQuery({
        queryKey: ["recommendedUsers", searchQuery, offset, limit],
        queryFn: async () => {
            setIsLoading(true);
            const res = await axiosInstance.get("/users/suggestions", {
                params: { search: searchQuery, offset, limit },
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
        setLimit((prevLimit) => prevLimit + 3);
        refetch();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setOffset(0);
        setLimit(3);
        refetch();
    };

    const handleTypeChange = (type) => {
        setSelectedType(type); // Update selected type
    };

    // Filter posts based on the selected type
    const filteredPosts = selectedType === "all" ? posts : posts?.filter(post => post.type === selectedType);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
                <PostCreation user={authUser} />

                {/* Post Type Filters */}
                <div className='flex space-x-4 mb-4'>
                    {["all", "discussion", "job", "internship", "event"].map((type) => (
                        <div
                            key={type}
                            className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-200 ${selectedType === type ? 'bg-gray-300 font-semibold' : ''}`}
                            onClick={() => handleTypeChange(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    ))}
                </div>

                {/* Display Filtered Posts */}
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

            {recommendedUsers?.length > 0 && (
                <div className='col-span-1 lg:col-span-1 hidden lg:block'>
                    <div className='bg-secondary rounded-lg shadow p-4'>
                        <h2 className='font-semibold mb-4'>People you may know</h2>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="mb-4 p-2 border rounded"
                        />
                        {recommendedUsers?.map((user) => (
                            <RecommendedUser key={user._id} user={user} />
                        ))}
                        <button 
                            onClick={handleShowMore} 
                            className='mt-2 text-blue-500' 
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Show More"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
