import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Post from "../components/Post";

const HomePage = () => {
    const { data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/posts");
            return res.data;
        },
    });

    return (
        <div className='flex justify-center'>
            <div className='col-span-1 lg:col-span-2 w-[80vh] overflow-x-auto mx-80'>
                {posts?.map((post) => (
                    <Post key={post._id} post={post} />
                ))}

                {posts?.length === 0 && (
                    <div className='bg-white rounded-lg shadow p-8 text-center'>
                        <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
                        <p className='text-gray-600'>Link with others to start seeing posts in your feed!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;