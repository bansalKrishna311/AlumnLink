import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Building, Briefcase, MapPin, Clock, Calendar, Hash } from "lucide-react";

const PostContent = ({ post }) => {
  const [formattedContent, setFormattedContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (post && post.content) {
      // Format content to handle hashtags
      const content = formatContent(post.content);
      setFormattedContent(content);
    }
  }, [post]);

  const formatContent = (content) => {
    if (!content) return "";

    // Replace URLs with clickable links
    let formatted = content.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
    );

    // Replace mentions with clickable links
    formatted = formatted.replace(
      /@\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="/profile/$2" class="text-[#fe6019] hover:underline">@$1</a>'
    );

    // Replace hashtags with clickable elements
    formatted = formatted.replace(
      /#(\w+)/g,
      '<a href="/hashtag/$1" class="text-[#fe6019] hover:underline group inline-flex items-center">#$1</a>'
    );

    return formatted;
  };

  const handleHashtagClick = (hashtag, e) => {
    e.preventDefault();
    navigate(`/hashtag/${hashtag}`);
  };

  return (
    <>
      <div className="mb-4">
        {post.image && (
          <div className="mb-3 mt-2">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto rounded-lg object-cover max-h-96"
            />
          </div>
        )}
        
        <div
          className="whitespace-pre-wrap break-words mt-1 text-gray-800 text-base"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
          onClick={(e) => {
            // Handle clicks on hashtags
            if (e.target.tagName === "A" && e.target.href.includes("/hashtag/")) {
              const hashtag = e.target.href.split("/hashtag/")[1];
              handleHashtagClick(hashtag, e);
            }
          }}
        />
      </div>

      {/* Post type specific details */}
      {post.type === "internship" && post.internshipDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-50 p-3 rounded-md mb-4 border border-purple-100 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <Building size={16} className="text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-700">Internship Opportunity</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-gray-700">
              <Building size={14} className="mr-2 text-purple-500" />
              <span>
                <strong>Company:</strong> {post.internshipDetails.companyName}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock size={14} className="mr-2 text-purple-500" />
              <span>
                <strong>Duration:</strong> {post.internshipDetails.internshipDuration}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {post.type === "job" && post.jobDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <Briefcase size={16} className="text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-700">Job Opportunity</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center text-gray-700">
              <Building size={14} className="mr-2 text-blue-500" />
              <span>{post.jobDetails.companyName}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Briefcase size={14} className="mr-2 text-blue-500" />
              <span>{post.jobDetails.jobTitle}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin size={14} className="mr-2 text-blue-500" />
              <span>{post.jobDetails.jobLocation}</span>
            </div>
          </div>
        </motion.div>
      )}

      {post.type === "event" && post.eventDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 p-3 rounded-md mb-4 border border-orange-100 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <Calendar size={16} className="text-orange-600 mr-2" />
            <h4 className="font-medium text-orange-700">Upcoming Event</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center text-gray-700">
              <Calendar size={14} className="mr-2 text-orange-500" />
              <span>{post.eventDetails.eventName}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock size={14} className="mr-2 text-orange-500" />
              <span>{new Date(post.eventDetails.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin size={14} className="mr-2 text-orange-500" />
              <span>{post.eventDetails.eventLocation}</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PostContent;