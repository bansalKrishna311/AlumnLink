import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddEvent = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
  });

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleInputChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', 'event');
    formData.append('eventDetails', JSON.stringify(eventDetails));

    images.forEach(image => formData.append('images', image));

    try {
      const response = await axios.post('/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Event created successfully!');
      navigate('/feed');
    } catch (error) {
      console.error(error);
      toast.error('Error creating event!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[700px] h-full max-w-4xl bg-white p-6 rounded-lg shadow-lg overflow-y-auto mx-80">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images:</label>
            <input
              type="file"
              id="images"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
            <div className="flex flex-wrap mt-4">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover m-2 rounded-lg shadow-lg" />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name:</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={eventDetails.eventName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={eventDetails.eventDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">Event Location:</label>
            <input
              type="text"
              id="eventLocation"
              name="eventLocation"
              value={eventDetails.eventLocation}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
