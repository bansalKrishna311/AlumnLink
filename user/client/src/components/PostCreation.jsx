import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, Hash } from "lucide-react";
import Select from 'react-select';
import MentionDropdown from "./MentionDropdown";
import { useTrendingTags } from "@/hooks/useAppData";

const PostCreation = ({ user, selectedPostType, closeModal }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [type, setType] = useState(selectedPostType || "discussion");
  const [selectedLinks, setSelectedLinks] = useState(null);

  // Existing state variables
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [internshipDuration, setInternshipDuration] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // Add state for hashtag detection and suggestion
  const [hashtagDropdownVisible, setHashtagDropdownVisible] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState("");
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [popularHashtags, setPopularHashtags] = useState([
    "alumni", "jobs", "networking", "events", "opportunities", "tech", "business", "career"
  ]);
  
  const [mentionDropdownVisible, setMentionDropdownVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState([]);
  const contentRef = useRef(null);

  const queryClient = useQueryClient();

  // Fetch trending hashtags using Zustand store
  const { data: trendingTags } = useTrendingTags();

  useEffect(() => {
    if (trendingTags && trendingTags.length > 0) {
      setPopularHashtags(prev => {
        // Process trending tags data properly
        const processedTags = trendingTags.map(tag => 
          typeof tag === 'string' ? tag : tag.tag?.replace('#', '') || tag
        );
        // Combine trending tags with existing popular hashtags, removing duplicates
        const combined = [...new Set([...processedTags, ...prev])];
        return combined.slice(0, 10); // Limit to 10 hashtags
      });
    }
  }, [trendingTags]);

  // Fetch user links
  const { data: userLinks } = useQuery({
    queryKey: ['userLinks'],
    queryFn: async () => {
      const response = await axiosInstance.get("/links");
      return response.data.map(link => ({
        value: link.user._id,
        label: `${link.user.name} - ${link.courseName} (Batch ${link.batch})`,
        linkData: {
          userId: link.user._id,
          batch: link.batch,
          course: link.courseName,
          rollNumber: link.rollNumber
        }
      }));
    }
  });

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      resetForm();
      toast.success(
        data.status === "pending" 
          ? "Post submitted for review. You'll be notified once it's approved." 
          : "Post created successfully"
      );
      if (data.status === "approved") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
      if (user.isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      }
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create post");
    },
  });

  useEffect(() => {
    if (selectedPostType) setType(selectedPostType);
  }, [selectedPostType]);

  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);


  const handlePostCreation = async () => {
    if (!selectedLinks) {
    toast.error("Please select a relevant link before submitting.");
    return;
  }
  
  try {
    const postData = {
      content,
      type,
      links: selectedLinks ? [selectedLinks.value] : []
    };

    if (images.length > 0) {
      postData.images = await Promise.all(images.map(readFileAsDataURL));
    }

    // Add type-specific details — stringified!
    const detailsMap = {
      job: { jobDetails: JSON.stringify({ companyName, jobTitle, jobLocation }) },
      internship: { internshipDetails: JSON.stringify({ companyName, internshipDuration }) },
      event: { eventDetails: JSON.stringify({ eventName, eventDate, eventLocation }) },
    };

    Object.assign(postData, detailsMap[type] || {});
    
    createPostMutation(postData);
  } catch (error) {
    console.error("Error in handlePostCreation:", error);
  }
};


  const resetForm = () => {
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setType("discussion");
    setSelectedLinks([]);
    setCompanyName("");
    setJobTitle("");
    setJobLocation("");
    setInternshipDuration("");
    setEventName("");
    setEventDate("");
    setEventLocation("");
  };

  const handleFileButtonClick = () => document.getElementById("fileInput").click();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    Promise.all(files.map(readFileAsDataURL)).then(setImagePreviews);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);

    // Logic to detect mentions and show dropdown
    const mentionMatch = value.match(/@\w*$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[0].substring(1));
      setMentionDropdownVisible(true);
      setHashtagDropdownVisible(false); // Hide hashtag dropdown when showing mentions
    } else {
      setMentionDropdownVisible(false);
      
      // Logic to detect hashtags and show suggestions
      const hashtagMatch = value.match(/#\w*$/);
      if (hashtagMatch) {
        const query = hashtagMatch[0].substring(1).toLowerCase();
        setHashtagQuery(query);
        
        // Filter hashtag suggestions based on query
        const suggestions = popularHashtags
          .filter(tag => tag.toLowerCase().includes(query))
          .slice(0, 5); // Limit to 5 suggestions
        
        setHashtagSuggestions(suggestions);
        setHashtagDropdownVisible(true);
      } else {
        setHashtagDropdownVisible(false);
      }
    }
  };

  const handleHashtagSelect = (hashtag) => {
    const cursorPosition = contentRef.current.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    const hashtagMatch = textBeforeCursor.match(/#\w*$/);

    if (hashtagMatch) {
      const newTextBeforeCursor = textBeforeCursor.replace(/#\w*$/, `#${hashtag} `);
      setContent(newTextBeforeCursor + textAfterCursor);
    }
    setHashtagDropdownVisible(false);
  };

  const handleMentionSelect = (user) => {
    const cursorPosition = contentRef.current.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@\w*$/);

    if (mentionMatch) {
      const newTextBeforeCursor = textBeforeCursor.replace(/@\w*$/, `@${user.name} `);
      setContent(newTextBeforeCursor + textAfterCursor);
      setMentionDropdownVisible(false);
    }
  };

  const renderAdditionalInputs = () => {
    const inputs = {
      job: (
        <>
          <input
            type="text"
            placeholder="Company Name"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Location"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
        </>
      ),
      internship: (
        <>
          <input
            type="text"
            placeholder="Company Name"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Internship Duration"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={internshipDuration}
            onChange={(e) => setInternshipDuration(e.target.value)}
          />
        </>
      ),
      event: (
        <>
          <input
            type="text"
            placeholder="Event Name"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <input
            type="datetime-local"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event Location"
            className="w-full p-2 rounded-lg mb-2 border border-gray-300"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </>
      ),
    };

    return (
      <>
        {inputs[type]}
        <Select
          options={userLinks}
          value={selectedLinks}
          onChange={(selectedOption) => setSelectedLinks(selectedOption)}
          className={`mb-4 ${!selectedLinks ? 'border border-red-500 rounded-md' : ''}`}
          placeholder="Select relevant links..."
          isSearchable={false}
        />
      </>
    );
  };

  const getButtonGradient = () => {
    return `bg-[#fe6019] hover:bg-[#fe6019]/90 text-white`;
  };

  const getInputBackground = () => {
    return `bg-[#fe6019]/5 border-[#fe6019]/20 border focus:border-[#fe6019]/50`;
  };

  const getStatusBadge = () => (
    <div className="mb-4 p-2 bg-[#fe6019]/10 border border-[#fe6019]/30 rounded-lg text-sm text-[#fe6019]">
      Note: Your post will be reviewed by an admin before being published.
    </div>
  );

  return (
    <>
      {selectedPostType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-8 overflow-y-auto max-h-[90vh]"
          
          >
            <div
              className={`text-xl font-semibold mb-4 text-white py-2 px-4 rounded-lg ${getButtonGradient()}`}
            >
              Create a Post
            </div>

            {!user.isAdmin && getStatusBadge()}

            <div className="flex items-start space-x-3 mb-4">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-[#fe6019]/50 object-cover"
              />
              <div className="w-full">
                <textarea
                  placeholder="What's on your mind?"
                  className={`w-full p-3 rounded-lg focus:outline-none resize-none min-h-[100px] transition duration-200 ${getInputBackground()}`}
                  value={content}
                  onChange={handleContentChange}
                  ref={contentRef}
                />
                
                {/* Hashtag suggestions */}
                {hashtagDropdownVisible && hashtagSuggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-1 max-h-40 overflow-y-auto z-10">
                    {hashtagSuggestions.map((tag, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleHashtagSelect(tag)}
                      >
                        <Hash size={16} className="text-[#fe6019] mr-2" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Popular hashtags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {popularHashtags.slice(0, 6).map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      className="px-2 py-1 bg-[#fe6019]/10 text-[#fe6019] rounded-full text-xs hover:bg-[#fe6019]/20 transition-colors flex items-center"
                      onClick={() => {
                        setContent((prev) => `${prev} #${tag} `);
                        contentRef.current.focus();
                      }}
                    >
                      <Hash size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {mentionDropdownVisible && (
              <MentionDropdown
                query={mentionQuery}
                users={mentionUsers}
                onSelect={handleMentionSelect}
                visible={mentionDropdownVisible}
                position={{
                  top: 150,  // Position below the content textarea
                  left: 60   // Offset from left edge
                }}
              />
            )}

            {imagePreviews.length > 0 && (
  <div className="relative mt-2 mb-4">
    <div className="grid grid-cols-3 gap-2">
      {/* Large main image (first image) */}
      <div className="col-span-3 sm:col-span-2 row-span-2">
        <img
          src={imagePreviews[0]}
          alt="Main"
          className="w-full h-full object-cover rounded-lg border border-[#fe6019]/20"
          style={{ aspectRatio: '16/9', maxHeight: '300px' }}
        />
      </div>

      {/* Up to 3 small images (thumbnails) */}
      <div className="grid grid-cols-1 gap-2">
        {imagePreviews.slice(1, 4).map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index + 2}`}
            className="w-full h-full object-cover rounded-lg border border-[#fe6019]/20"
            style={{ aspectRatio: '4/3', maxHeight: '95px' }}
          />
        ))}

        {/* Show "+X" badge if more images exist */}
        {imagePreviews.length > 4 && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg text-gray-700 font-semibold border border-[#fe6019]/20 text-sm">
            +{imagePreviews.length - 4} more
          </div>
        )}
      </div>
    </div>
  </div>
)}


            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              onClick={handleFileButtonClick}
              className="flex items-center space-x-2 mb-4 p-2 rounded-lg text-[#fe6019] hover:bg-[#fe6019]/10 transition-colors"
            >
              <Image size={20} className="text-[#fe6019]" />
              <span>Upload Photo</span>
            </button>

            {renderAdditionalInputs()}

            <button
              onClick={handlePostCreation}
              disabled={isPending}
              className={`w-full py-2 rounded-lg transition duration-300 flex justify-center items-center ${getButtonGradient()}`}
            >
              {isPending ? <Loader className="animate-spin" /> : "Submit Post"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreation;