import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const EditModal = ({ isOpen, onClose, type, id, initialData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    adminType: '',
    assignedCourses: []
  });
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        username: initialData.username || '',
        location: initialData.location || '',
        adminType: initialData.adminType || '',
        assignedCourses: initialData.assignedCourses || []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        location: formData.location,
        adminType: formData.adminType,
        assignedCourses: formData.assignedCourses
      };

      // Use existing admin route
      const response = await fetch(`/api/admin/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      const result = await response.json();
      toast.success(`${type} updated successfully!`);
      onUpdate(result.admin); // Use result.admin as per controller response
      onClose();
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    if (newCourse.trim() && !formData.assignedCourses.includes(newCourse.trim())) {
      setFormData(prev => ({
        ...prev,
        assignedCourses: [...prev.assignedCourses, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setFormData(prev => ({
      ...prev,
      assignedCourses: prev.assignedCourses.filter(course => course !== courseToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Edit {type}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Type
            </label>
            <select
              value={formData.adminType}
              onChange={(e) => setFormData(prev => ({ ...prev, adminType: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Type</option>
              <option value="institute">Institute</option>
              <option value="school">School</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Courses
            </label>
            
            {/* Add new course */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Add new course"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCourse())}
              />
              <button
                type="button"
                onClick={handleAddCourse}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            {/* Display existing courses */}
            <div className="space-y-1">
              {formData.assignedCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm">{course}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(course)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
