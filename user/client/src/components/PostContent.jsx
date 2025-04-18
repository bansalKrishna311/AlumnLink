import { motion } from "framer-motion";
import { Building, Briefcase, MapPin, Clock, Calendar } from "lucide-react";

const PostContent = ({ post }) => {
  return (
    <>
      {/* Post content text */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.1 }} 
        className="mb-4"
      >
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </motion.div>

      {/* Post image */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 -mx-4"
        >
          <img 
            src={post.image || "/placeholder.svg"} 
            alt="Post content" 
            className="w-full rounded-md shadow-sm" 
          />
        </motion.div>
      )}

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