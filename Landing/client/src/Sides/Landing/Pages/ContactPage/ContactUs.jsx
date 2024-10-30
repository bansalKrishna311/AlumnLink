import React, { useState } from 'react';
import { FiArrowRight } from "react-icons/fi"; // Import the FiArrowRight icon
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import the toast function

const ContactForm = () => {
  const navigate = useNavigate(); // Create a navigate instance

  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    Email: '',
    Message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitted(true); // Mark the form as submitted

    // Custom validation
    const { Name, Phone, Email, Message } = formData;
    if (!Name || !Phone || !Email || !Message) {
      toast.error("Please fill in all fields."); // Error message for missing fields
      return;
    }

    try {
      // Send form data to the specified action URL
      await fetch(event.target.action, {
        method: 'POST',
        body: new URLSearchParams(formData), // Sending data as URL-encoded
      });
      
      // Show a success toast notification
      toast.success("We'll Contact you Soon!!"); // Success message

      // Clear form after successful submission
      setFormData({
        Name: '',
        Phone: '',
        Email: '',
        Message: '',
      });

      // Navigate to the root path after submission
      navigate('/'); // Redirect to the root path
    } catch (error) {
      // Show an error toast notification if something goes wrong
      toast.error("There was an error submitting the form."); // Error message
    } finally {
      setIsSubmitted(false); // Reset submission state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="p-8 rounded-lg bg-white border border-gray-300 shadow-lg w-full max-w-6xl"
        method='post'
        action='https://script.google.com/macros/s/AKfycbw54DoF1_yIZSHWNuhiw-u_CDJ62-lBhYxgEWlrhpkOpd1rnRxQUxsZR-28qk8SlY_6/exec'
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-2">Schedule a Call</h2>
        <p className="text-gray-600 mb-6">
          Please drop your details here and our customer advisor will reach out to you for demo and other details.
        </p>

        {/* Flex Container for Name, Phone, and Email */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            name='Name'
            type="text"
            placeholder="Name"
            className={`flex-1 px-4 py-4 border ${isSubmitted && !formData.Name ? 'border-red-500' : 'border-gray-300'} caret-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:shadow-outline transition duration-200 ease-in-out`}
            value={formData.Name}
            onChange={handleChange}
          />
          <input
            name='Phone'
            type="tel"
            placeholder="Phone Number"
            pattern="[0-9]{10}" // Pattern for 10-digit phone numbers
            required // Make the field required
            className={`flex-1 px-4 py-4 border ${isSubmitted && !formData.Phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:shadow-outline transition duration-200 ease-in-out`}
            value={formData.Phone}
            onChange={handleChange}
          />
          <input
            name='Email'
            type="email"
            placeholder="Email Address"
            className={`flex-1 px-4 py-4 border ${isSubmitted && !formData.Email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:shadow-outline transition duration-200 ease-in-out`}
            value={formData.Email}
            onChange={handleChange}
          />
        </div>

        {/* Textarea for Message */}
        <div className="mb-4">
          <textarea
            name='Message'
            placeholder="Enter your message"
            rows="4"
            className={`w-full px-4 py-2 border ${isSubmitted && !formData.Message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:shadow-outline transition duration-200 ease-in-out`}
            value={formData.Message}
            onChange={handleChange}
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit" // Set button type to submit
          className="justify-center group btn rounded-full max-w-lg transition-transform duration-300 ease-in-out hover:bg-secondary hover:text-white bg-started text-white flex items-center px-8 py-3 relative shadow-md"
        >
          <span className="group-hover:translate-x-40 text-center transition duration-500">
            Get Started
          </span>
          <div className="-translate-x-40 group-hover:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            <FiArrowRight className="h-5 w-5" />
          </div>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
