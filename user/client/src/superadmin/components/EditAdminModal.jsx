import { useState, useEffect } from 'react';
import { axiosInstance } from "../../lib/axios";
import { toast } from 'react-hot-toast';
import { X, Save, Loader } from 'lucide-react';

const EditAdminModal = ({ isOpen, onClose, admin, onUpdate, adminType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    assignedCourses: []
  });
  const [newCourse, setNewCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const locations = [
    "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi NCR", 
    "Kolkata", "Ahmedabad", "Jaipur", "Thiruvananthapuram", "Lucknow", 
    "Indore", "Chandigarh", "Nagpur"
  ];

  useEffect(() => {
    if (admin && isOpen) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        username: admin.username || '',
        location: admin.location || '',
        assignedCourses: admin.assignedCourses || []
      });
    }
  }, [admin, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCourse = () => {
    if (newCourse.trim() && !formData.assignedCourses.includes(newCourse.trim())) {
      setFormData(prev => ({
        ...prev,
        assignedCourses: [...prev.assignedCourses, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const removeCourse = (courseToRemove) => {
    setFormData(prev => ({
      ...prev,
      assignedCourses: prev.assignedCourses.filter(course => course !== courseToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin?._id) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/admin/admin/${admin._id}`, {
        ...formData,
        adminType: admin.adminType // Keep the original admin type
      });
      
      toast.success(`${adminType} updated successfully!`);
      onUpdate(response.data.admin);
      onClose();
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error(error.response?.data?.message || `Failed to update ${adminType}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit {adminType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {adminType} Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${adminType.toLowerCase()} name`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned Courses Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Courses
            </label>
            
            {/* Add new course */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course name and press Enter"
              />
              <button
                type="button"
                onClick={addCourse}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Course list */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.assignedCourses.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No courses assigned</p>
              ) : (
                formData.assignedCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span className="text-sm">{course}</span>
                    <button
                      type="button"
                      onClick={() => removeCourse(course)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update {adminType}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
