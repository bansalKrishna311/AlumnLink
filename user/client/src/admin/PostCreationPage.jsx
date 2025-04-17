import React, { useState, useCallback, useEffect } from 'react';
import { Image, PlusCircle, Calendar, MapPin, Briefcase, Award, MessageCircle, X } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import banner from '../../public/images/admin banner.jpg'

const POST_TYPES = {
  discussion: { 
    color: 'bg-blue-600', 
    icon: <MessageCircle className="mr-2" size={18} />,
    title: 'Start a Discussion',
    description: 'Share ideas, ask questions, or start a conversation'
  },
  job: { 
    color: 'bg-emerald-600', 
    icon: <Briefcase className="mr-2" size={18} />,
    title: 'Post a Job',
    description: 'Share job opportunities with the community'
  },
  internship: { 
    color: 'bg-purple-600', 
    icon: <Award className="mr-2" size={18} />,
    title: 'Share an Internship',
    description: 'Help students find valuable work experience'
  },
  event: { 
    color: 'bg-amber-600', 
    icon: <Calendar className="mr-2" size={18} />,
    title: 'Announce an Event',
    description: 'Promote upcoming community events or webinars'
  }
};

const CreatePostPage = () => {
  const [formState, setFormState] = useState({
    showForm: false,
    type: '',
    content: '',
    image: null,
    jobDetails: {
      companyName: '',
      jobTitle: '',
      jobLocation: ''
    },
    internshipDetails: {
      companyName: '',
      internshipDuration: ''
    },
    eventDetails: {
      eventName: '',
      eventDate: '',
      eventLocation: ''
    },
    isSuccess: false,
    timestamp: '',
    formErrors: {}
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateForm = () => {
    const errors = {};
    
    if (!formState.content?.trim()) {
      errors.content = "Content is required";
    }
    
    if (formState.type === 'job') {
      if (!formState.jobDetails.companyName?.trim()) errors.companyName = "Company name is required";
      if (!formState.jobDetails.jobTitle?.trim()) errors.jobTitle = "Job title is required";
      if (!formState.jobDetails.jobLocation?.trim()) errors.jobLocation = "Location is required";
    }
    
    if (formState.type === 'internship') {
      if (!formState.internshipDetails.companyName?.trim()) errors.companyName = "Company name is required";
      if (!formState.internshipDetails.internshipDuration?.trim()) errors.internshipDuration = "Duration is required";
    }
    
    if (formState.type === 'event') {
      if (!formState.eventDetails.eventName?.trim()) errors.eventName = "Event name is required";
      if (!formState.eventDetails.eventDate) errors.eventDate = "Date is required";
      if (!formState.eventDetails.eventLocation?.trim()) errors.eventLocation = "Location is required";
    }
    
    return errors;
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        },
        formErrors: {
          ...prev.formErrors,
          [child]: '' // Clear error when field is edited
        }
      }));
    } else {
      setFormState(prev => ({ 
        ...prev, 
        [name]: value,
        formErrors: {
          ...prev.formErrors,
          [name]: '' // Clear error when field is edited
        }
      }));
    }
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setFormState(prev => ({ ...prev, image: file }));
    }
  }, [previewUrl]);

  const handleOpenForm = useCallback((postType) => {
    setFormState(prev => ({
      ...prev,
      type: postType,
      showForm: true,
      formErrors: {}
    }));
  }, []);

  const resetForm = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setFormState(prev => ({
      ...prev,
      showForm: false,
      content: '',
      image: null,
      jobDetails: { companyName: '', jobTitle: '', jobLocation: '' },
      internshipDetails: { companyName: '', internshipDuration: '' },
      eventDetails: { eventName: '', eventDate: '', eventLocation: '' },
      formErrors: {}
    }));
  }, [previewUrl]);

  const handleSubmitPost = useCallback(async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({
        ...prev,
        formErrors: errors
      }));
      return;
    }

    const { content, type, image } = formState;

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('type', type);

      if (image) {
        formData.append('image', image);
      }

      if (type === 'job') {
        formData.append('jobDetails', JSON.stringify(formState.jobDetails));
      }
      if (type === 'internship') {
        formData.append('internshipDetails', JSON.stringify(formState.internshipDetails));
      }
      if (type === 'event') {
        formData.append('eventDetails', JSON.stringify(formState.eventDetails));
      }

      const response = await axiosInstance.post('/posts/admin/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setFormState(prev => ({
          ...prev,
          isSuccess: true,
          timestamp: new Date().toLocaleString()
        }));
        setTimeout(() => {
          setFormState(prev => ({ ...prev, isSuccess: false }));
        }, 5000);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  }, [formState, resetForm, validateForm]);

  const renderFormFields = useCallback(() => {
    const { type, formErrors } = formState;

    return (
      <>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content*
          </label>
          <textarea
            id="content"
            name="content"
            value={formState.content}
            onChange={handleInputChange}
            placeholder={`Write your ${type} details here...`}
            rows="4"
            className={`w-full p-3 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
        </div>

        {type === 'job' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company-name"
                  name="jobDetails.companyName"
                  placeholder="e.g. Acme Corporation"
                  value={formState.jobDetails.companyName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.companyName && <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>}
            </div>
            
            <div>
              <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                type="text"
                id="job-title"
                name="jobDetails.jobTitle"
                placeholder="e.g. Senior Software Engineer"
                value={formState.jobDetails.jobTitle}
                onChange={handleInputChange}
                className={`w-full p-3 border ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.jobTitle && <p className="mt-1 text-sm text-red-600">{formErrors.jobTitle}</p>}
            </div>
            
            <div>
              <label htmlFor="job-location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="job-location"
                  name="jobDetails.jobLocation"
                  placeholder="e.g. New York, NY (Remote/Hybrid/On-site)"
                  value={formState.jobDetails.jobLocation}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.jobLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.jobLocation && <p className="mt-1 text-sm text-red-600">{formErrors.jobLocation}</p>}
            </div>
          </div>
        )}

        {type === 'internship' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="int-company-name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="int-company-name"
                  name="internshipDetails.companyName"
                  placeholder="e.g. Tech Innovations Inc."
                  value={formState.internshipDetails.companyName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.companyName && <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>}
            </div>
            
            <div>
              <label htmlFor="internship-duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="internship-duration"
                  name="internshipDetails.internshipDuration"
                  placeholder="e.g. 3 months (Summer 2025)"
                  value={formState.internshipDetails.internshipDuration}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.internshipDuration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.internshipDuration && <p className="mt-1 text-sm text-red-600">{formErrors.internshipDuration}</p>}
            </div>
          </div>
        )}

        {type === 'event' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name*
              </label>
              <input
                type="text"
                id="event-name"
                name="eventDetails.eventName"
                placeholder="e.g. Annual Tech Conference"
                value={formState.eventDetails.eventName}
                onChange={handleInputChange}
                className={`w-full p-3 border ${formErrors.eventName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.eventName && <p className="mt-1 text-sm text-red-600">{formErrors.eventName}</p>}
            </div>
            
            <div>
              <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date & Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="event-date"
                  name="eventDetails.eventDate"
                  value={formState.eventDetails.eventDate}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.eventDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.eventDate && <p className="mt-1 text-sm text-red-600">{formErrors.eventDate}</p>}
            </div>
            
            <div>
              <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
                Event Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="event-location"
                  name="eventDetails.eventLocation"
                  placeholder="e.g. Conference Center, 123 Main St, or Virtual (Zoom)"
                  value={formState.eventDetails.eventLocation}
                  onChange={handleInputChange}
                  className={`w-full pl-10 p-3 border ${formErrors.eventLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.eventLocation && <p className="mt-1 text-sm text-red-600">{formErrors.eventLocation}</p>}
            </div>
          </div>
        )}
      </>
    );
  }, [formState, handleInputChange]);
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Header */}
      <div
  className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 text-white py-12"
  style={{
    backgroundImage: "url('/images/admin banner.jpg'), linear-gradient(to right, #3b0764, #581c87, #3b0764)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay',
  }}
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Share with the Community
      </h1>
      <p className="text-lg text-blue-100 mb-8">
        Create and publish content to connect, engage, and collaborate with our growing network
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {!formState.showForm && (
          <button 
            onClick={() =>
              window.scrollTo({
                top: document.getElementById('post-types').offsetTop - 20,
                behavior: 'smooth',
              })
            }
            className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-md hover:bg-blue-50 transition duration-300 flex items-center"
          >
            <PlusCircle size={18} className="mr-2" /> Create a Post
          </button>
        )}
      </div>
    </div>
  </div>
</div>


      {/* Success Message */}
      {formState.isSuccess && (
        <div className="fixed top-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fadeIn">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Post created successfully at {formState.timestamp}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Post Type Selection */}
        {!formState.showForm && (
          <div id="post-types" className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Post Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(POST_TYPES).map(([type, { color, icon, title, description }]) => (
                <div 
                  key={type}
                  onClick={() => handleOpenForm(type)}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className={`${color} p-4 text-white flex items-center justify-center`}>
                    {icon}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Form */}
        {formState.showForm && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className={`${POST_TYPES[formState.type].color} p-4 flex justify-between items-center`}>
              <div className="flex items-center text-white">
                {POST_TYPES[formState.type].icon}
                <h2 className="text-xl font-bold">{POST_TYPES[formState.type].title}</h2>
              </div>
              <button 
                onClick={resetForm}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {renderFormFields()}

              <div className="mt-6 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Image (Optional)
                </label>
                <div className="flex items-center">
                  <label className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-blue-600 hover:bg-blue-50 transition duration-300`}>
                    <Image size={18} />
                    <span className="text-sm font-medium">
                      {formState.image ? 'Change Image' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <div className="relative w-full max-w-md">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                          setFormState(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 mr-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPost}
                  className={`px-6 py-2 ${POST_TYPES[formState.type].color} text-white rounded-md hover:opacity-90 transition duration-300 flex items-center`}
                >
                  <PlusCircle size={18} className="mr-2" />
                  Publish {formState.type.charAt(0).toUpperCase() + formState.type.slice(1)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Guidelines */}
        {!formState.showForm && (
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Guidelines</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  When creating posts, please remember to follow our community guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Be respectful and professional in all communications</li>
                  <li>Provide accurate and relevant information</li>
                  <li>Avoid discriminatory language or content</li>
                  <li>Only share opportunities that are legitimate and verified</li>
                  <li>Include all necessary details to make your post useful to the community</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  All posts are reviewed by moderators before being published to ensure quality and adherence to guidelines.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Community</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3">
                  <img 
                    src="/api/placeholder/400/300" 
                    alt="Community illustration" 
                    className="w-full h-auto rounded-lg shadow-sm" 
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <p className="text-gray-700 mb-4">
                    Our platform connects professionals, students, and enthusiasts in a collaborative environment where knowledge sharing and networking thrive.
                  </p>
                  <p className="text-gray-700">
                    By posting quality content, you contribute to our collective growth and help build a valuable resource for everyone in our community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;