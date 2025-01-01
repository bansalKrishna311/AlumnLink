import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader, Check, X, MessageSquare, Calendar, Briefcase } from "lucide-react";

const PostRequests = () => {
  const [selectedType, setSelectedType] = useState("all");
  const queryClient = useQueryClient();

  // Fetch pending posts
  const { data: pendingPosts, isLoading } = useQuery({
    queryKey: ["pendingPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/admin/pending");
      return res.data;
    }
  });

  // Handle post review mutation
  const { mutate: reviewPost, isPending: isReviewing } = useMutation({
    mutationFn: async ({ postId, status, feedback }) => {
      const res = await axiosInstance.post(`/posts/admin/${postId}/review`, {
        status,
        feedback
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post review completed successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to review post");
    }
  });

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "discussion":
        return <MessageSquare className="w-5 h-5 text-orange-500" />;
      case "event":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "job":
        return <Briefcase className="w-5 h-5 text-purple-500" />;
      case "internship":
        return <Briefcase className="w-5 h-5 text-green-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case "discussion":
        return "bg-orange-100 text-orange-800";
      case "event":
        return "bg-blue-100 text-blue-800";
      case "job":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReview = (postId, status) => {
    const feedback = document.getElementById(`feedback-${postId}`).value;
    reviewPost({ postId, status, feedback });
  };

  const filteredPosts = pendingPosts?.filter(post => 
    selectedType === "all" || post.type === selectedType
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Post Approval Requests</h1>
        
        {/* Type filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedType === "all" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            All
          </button>
          {["discussion", "event", "job", "internship"].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                ${selectedType === type 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No pending posts to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author.profilePicture || "/avatar.png"}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{post.author.name}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getPostTypeColor(post.type)}`}>
                  {getPostTypeIcon(post.type)}
                  <span className="capitalize">{post.type}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="mt-4 rounded-lg max-h-96 w-auto"
                  />
                )}
              </div>

              {/* Additional details based on post type */}
              {post.type === "job" && (
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Company:</strong> {post.jobDetails.companyName}</p>
                  <p><strong>Title:</strong> {post.jobDetails.jobTitle}</p>
                  <p><strong>Location:</strong> {post.jobDetails.jobLocation}</p>
                </div>
              )}
              {post.type === "internship" && (
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Company:</strong> {post.internshipDetails.companyName}</p>
                  <p><strong>Duration:</strong> {post.internshipDetails.internshipDuration}</p>
                </div>
              )}
              {post.type === "event" && (
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Event:</strong> {post.eventDetails.eventName}</p>
                  <p><strong>Date:</strong> {new Date(post.eventDetails.eventDate).toLocaleString()}</p>
                  <p><strong>Location:</strong> {post.eventDetails.eventLocation}</p>
                </div>
              )}

              <textarea
                id={`feedback-${post._id}`}
                placeholder="Add feedback (optional)"
                className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleReview(post._id, "rejected")}
                  disabled={isReviewing}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleReview(post._id, "approved")}
                  disabled={isReviewing}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostRequests;