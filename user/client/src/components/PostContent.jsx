import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Building, Briefcase, MapPin, Clock, Calendar, Hash, ArrowLeftCircle, ArrowRightCircle, XCircle } from "lucide-react";

const PostContent = ({ post }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [formattedContent, setFormattedContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
  };

  // Modal navigation
  const showPrev = () => {
    setModalIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  };
  const showNext = () => {
    setModalIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  };
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
      {/* Modal for image viewer (photos only, Lucide icons, improved UI) */}
      {modalOpen && ((post.images && post.images.length > 0) || post.image) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full max-w-3xl h-[80vh] bg-black rounded-xl shadow-2xl flex items-center justify-center">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
              onClick={closeModal}
              aria-label="Close"
            >
              <XCircle size={36} />
            </button>
            {/* Left Arrow */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-10"
              onClick={showPrev}
              aria-label="Previous"
              disabled={((post.images && post.images.length === 1) || (!post.images && post.image))}
              style={{ opacity: ((post.images && post.images.length === 1) || (!post.images && post.image)) ? 0.5 : 1 }}
            >
              <ArrowLeftCircle size={44} />
            </button>
            {/* Image */}
            <img
              src={post.images && post.images.length > 0 ? post.images[modalIndex] : post.image}
              alt={`Image ${modalIndex + 1}`}
              className="max-h-[70vh] max-w-[90vw] object-contain rounded-lg shadow-lg border-2 border-white"
              style={{ margin: '0 auto', background: '#222' }}
            />
            {/* Right Arrow */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 z-10"
              onClick={showNext}
              aria-label="Next"
              disabled={((post.images && post.images.length === 1) || (!post.images && post.image))}
              style={{ opacity: ((post.images && post.images.length === 1) || (!post.images && post.image)) ? 0.5 : 1 }}
            >
              <ArrowRightCircle size={44} />
            </button>
            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black/70 px-4 py-1 rounded-full text-base font-semibold shadow">
              {post.images && post.images.length > 0 ? (modalIndex + 1) + ' / ' + post.images.length : '1 / 1'}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        {/* Post description above images */}
        <div className="whitespace-pre-wrap break-words mb-3 text-gray-800 text-base">
          {(() => {
            const plainText = post.content || "";
            if (!showFullContent && plainText.length > 500) {
              // Truncate and add Read more
              const truncated = plainText.slice(0, 500);
              // Format truncated content
              const formattedTruncated = formatContent(truncated);
              return <>
                <span dangerouslySetInnerHTML={{ __html: formattedTruncated }} />
                <span className="text-blue-500 cursor-pointer ml-2" onClick={() => setShowFullContent(true)}>
                  ...Read more
                </span>
              </>;
            } else if (showFullContent && plainText.length > 500) {
              // Show full content with Hide link
              return <>
                <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
                <span className="text-blue-500 cursor-pointer ml-2" onClick={() => setShowFullContent(false)}>
                  Hide
                </span>
              </>;
            } else {
              // Show full formatted content (short post)
              return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
            }
          })()}
        </div>
        {/* Custom layout for multiple images: first image large, others in row below with borders and '+N' overlay */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3 mt-2 flex flex-col items-center">
            <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-gray-300 bg-white flex flex-col justify-center">
              {/* First image large at top */}
              <div className="w-full flex items-center justify-center border-b border-gray-200" style={{ minHeight: '260px', background: '#f9f9f9' }}>
                <img
                  src={post.images[0]}
                  alt="Post main img"
                  className="object-contain w-full h-full cursor-pointer"
                  style={{ maxHeight: '320px', width: '100%' }}
                  onClick={() => { setModalIndex(0); setModalOpen(true); }}
                />
              </div>
              {/* Remaining images in a row below */}
              {post.images.length > 1 && (
                <div className="flex flex-row gap-2 p-2 justify-center items-center bg-white">
                  {post.images.slice(1, 4).map((img, idx) => {
                    const isLastThumb = idx === 2 && post.images.length > 4;
                    return (
                      <div key={idx} className="relative border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50" style={{ width: '110px', height: '90px' }}>
                        <img
                          src={img}
                          alt={`Post img ${idx+2}`}
                          className="object-contain w-full h-full cursor-pointer"
                          onClick={() => { setModalIndex(idx+1); setModalOpen(true); }}
                        />
                        {isLastThumb && (
                          <div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold cursor-pointer"
                            onClick={() => { setModalIndex(idx+1); setModalOpen(true); }}
                          >
                            +{post.images.length - 4}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Fallback for legacy single image field */}
        {(!post.images || post.images.length === 0) && post.image && (
          <div className="mb-3 mt-2 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-contain cursor-pointer"
              style={{ display: 'block', width: '100%', height: '100%' }}
              onClick={() => {
                setModalIndex(0);
                setModalOpen(true);
              }}
            />
          </div>
        )}
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