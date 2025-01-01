import React, { useState, useCallback } from 'react';
import { Image } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

const POST_TYPES = {
  discussion: { color: 'from-orange-400 to-yellow-400', bgColor: 'from-orange-200 to-yellow-200' },
  job: { color: 'from-indigo-400 to-purple-400', bgColor: 'from-indigo-200 to-purple-200' },
  internship: { color: 'from-green-700 to-green-500', bgColor: 'from-green-400 to-green-200' },
  event: { color: 'from-blue-600 to-blue-400', bgColor: 'from-blue-300 to-blue-100' },
  other: { color: 'from-pink-500 to-pink-300', bgColor: 'from-pink-300 to-pink-100' }
};

const CreatePostPage = () => {
  const [formState, setFormState] = useState({
    showForm: false,
    type: '',
    title: '',
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
    timestamp: ''
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState(prev => ({ ...prev, image: file }));
    }
  }, []);

  const handleOpenForm = useCallback((postType) => {
    setFormState(prev => ({
      ...prev,
      type: postType,
      showForm: true
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      showForm: false,
      title: '',
      content: '',
      image: null,
      jobDetails: { companyName: '', jobTitle: '', jobLocation: '' },
      internshipDetails: { companyName: '', internshipDuration: '' },
      eventDetails: { eventName: '', eventDate: '', eventLocation: '' }
    }));
  }, []);

  const handleSubmitPost = useCallback(async () => {
    const { title, content, type, image } = formState;

    if (!title?.trim() || !content?.trim() || !type) {
      alert('Post title, content, and type are required!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
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

      const response = await axiosInstance.post('/admin-posts/create', formData, {
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
        resetForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  }, [formState, resetForm]);

  const renderFormFields = useCallback(() => {
    const { type } = formState;

    return (
      <>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          placeholder="Enter post title"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <textarea
          name="content"
          value={formState.content}
          onChange={handleInputChange}
          placeholder={`Write your ${type}...`}
          rows="3"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />

        {type === 'job' && (
          <>
            <input
              type="text"
              name="jobDetails.companyName"
              placeholder="Company Name"
              value={formState.jobDetails.companyName}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="jobDetails.jobTitle"
              placeholder="Job Title"
              value={formState.jobDetails.jobTitle}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="jobDetails.jobLocation"
              placeholder="Job Location"
              value={formState.jobDetails.jobLocation}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
          </>
        )}

        {type === 'internship' && (
          <>
            <input
              type="text"
              name="internshipDetails.companyName"
              placeholder="Company Name"
              value={formState.internshipDetails.companyName}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="internshipDetails.internshipDuration"
              placeholder="Duration"
              value={formState.internshipDetails.internshipDuration}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
          </>
        )}

        {type === 'event' && (
          <>
            <input
              type="text"
              name="eventDetails.eventName"
              placeholder="Event Name"
              value={formState.eventDetails.eventName}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="datetime-local"
              name="eventDetails.eventDate"
              value={formState.eventDetails.eventDate}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="eventDetails.eventLocation"
              placeholder="Event Location"
              value={formState.eventDetails.eventLocation}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
          </>
        )}
      </>
    );
  }, [formState, handleInputChange]);

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="text-center lg:text-left lg:ml-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-300 to-gray-900 text-transparent bg-clip-text mb-4">
          Create a Post
        </h1>
        <p className="text-gray-600">Share your ideas, opportunities, and events with the community.</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
        {Object.entries(POST_TYPES).map(([type, { color }]) => (
          <button
            key={type}
            onClick={() => handleOpenForm(type)}
            className={`w-36 h-10 px-3 py-2 text-white rounded-full shadow-md hover:opacity-90 transition duration-300 bg-gradient-to-r ${color}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {formState.showForm && (
        <div className="mt-8 mx-auto lg:ml-4 max-w-md lg:max-w-lg">
          <div className={`p-6 rounded-lg shadow-md bg-gradient-to-r ${POST_TYPES[formState.type].bgColor}`}>
            <h2 className="text-xl font-bold mb-4 capitalize text-center lg:text-left text-white">
              Create a {formState.type}
            </h2>

            {renderFormFields()}

            <div className="mb-4">
              <label className="flex items-center space-x-2 mb-4 cursor-pointer">
                <Image size={20} color="red" />
                <span className="text-blue-600 hover:underline">
                  {formState.image ? 'Change Photo' : 'Upload Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {formState.image && (
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Preview:</p>
                  <img
                    src={URL.createObjectURL(formState.image)}
                    alt="Uploaded Preview"
                    className="max-w-full h-auto rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitPost}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:opacity-90 transition duration-300"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}

      {formState.isSuccess && (
        <div className="mt-6 mx-auto lg:ml-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-md text-center lg:text-left max-w-md">
          <p>Your post was successfully created!</p>
          <p><strong>Timestamp:</strong> {formState.timestamp}</p>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;

