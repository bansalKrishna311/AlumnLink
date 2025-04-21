import { useState, useEffect } from "react";
import { Briefcase, X, Plus, Calendar, Pencil, Building, Save, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [editingExperience, setEditingExperience] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset experiences when userData changes
  useEffect(() => {
    setExperiences(userData.experience || []);
  }, [userData]);

  const emptyExperience = {
    title: "",
    company: "",
    startDate: null,
    endDate: null,
    description: ""
  };

  const handleAddExperience = () => {
    if (editingExperience.title && editingExperience.company && editingExperience.startDate) {
      const formattedExperience = {
        ...editingExperience,
        startDate: editingExperience.startDate instanceof Date ? editingExperience.startDate.toISOString() : editingExperience.startDate,
        endDate: editingExperience.endDate instanceof Date ? editingExperience.endDate.toISOString() : editingExperience.endDate,
        _id: editingExperience._id || Date.now().toString() + Math.random().toString(36).substr(2, 5)
      };

      if (editingExperience._id) {
        // Update existing experience
        setExperiences(experiences.map(exp => 
          exp._id === editingExperience._id ? formattedExperience : exp
        ));
      } else {
        // Add new experience
        setExperiences([...experiences, formattedExperience]);
      }
      setEditingExperience(null);
      setShowAddForm(false);
    }
  };

  const handleEditExperience = (exp) => {
    // Create a deep copy to avoid reference issues
    setEditingExperience({...exp});
    setShowAddForm(true);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp._id !== id));
    if (editingExperience && editingExperience._id === id) {
      setEditingExperience(null);
      setShowAddForm(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Format experiences to match the database model before saving
      const formattedExperiences = experiences.map(exp => ({
        _id: exp._id,
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate instanceof Date ? exp.startDate.toISOString() : exp.startDate,
        endDate: exp.endDate instanceof Date ? exp.endDate.toISOString() : exp.endDate,
        description: exp.description,
      }));
      
      // Call the onSave function with the formatted experiences
      const updatedUser = await onSave({ experience: formattedExperiences });
      
      // Update local state with the server response if available
      if (updatedUser?.experience) {
        setExperiences(updatedUser.experience);
      }
      
      setIsEditing(false);
      setShowAddForm(false);
      setEditingExperience(null);
    } catch (error) {
      console.error("Error saving experiences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const cancelEditing = () => {
    setEditingExperience(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Briefcase className="mr-2 text-[#fe6019]"  size={22} />
            Experience
          </h2>
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-[#fe6019] hover:text-[#e04e0a] font-medium text-sm transition"
            >
              <Pencil size={16} className="mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {experiences.length === 0 && !showAddForm && (
          <div className="text-center py-6 text-gray-500">
            <Briefcase size={32} className="mx-auto mb-3 text-gray-400" />
            <p>No work experience added yet</p>
            {isEditing && (
              <button
                onClick={() => {
                  setEditingExperience(emptyExperience);
                  setShowAddForm(true);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
              >
                <Plus size={16} className="mr-2" />
                Add Experience
              </button>
            )}
          </div>
        )}

        {experiences.length > 0 && (
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className={`bg-white rounded-lg ${
                  isEditing ? "border border-gray-200 shadow-sm" : ""
                }`}
              >
                <div className="p-4 flex justify-between">
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                      <Building className="text-[#fe6019]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-800">{exp.company}</p>
                      
                      <div className="text-gray-500 text-sm flex items-center mt-1">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </div>
                      
                      {exp.description && (
                        <div>
                          <button 
                            onClick={() => toggleExpand(exp._id)} 
                            className="text-[#fe6019] text-sm font-medium flex items-center mt-2 hover:text-[#e04e0a] transition"
                          >
                            {expandedId === exp._id ? (
                              <>Less <ChevronUp size={14} className="ml-1" /></>
                            ) : (
                              <>More <ChevronDown size={14} className="ml-1" /></>
                            )}
                          </button>
                          
                          {expandedId === exp._id && (
                            <p className="text-gray-600 text-sm mt-2 pr-4 whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditExperience(exp)}
                        className="text-gray-500 hover:text-[#fe6019] transition p-1 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        aria-label="Edit experience"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp._id)}
                        className="text-gray-500 hover:text-red-600 transition p-1 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        aria-label="Delete experience"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              {editingExperience && editingExperience._id ? (
                <>
                  <Pencil size={18} className="mr-2" />
                  Edit Experience
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Experience
                </>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Ex: Software Engineer"
                  value={editingExperience?.title || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Ex: Google"
                  value={editingExperience?.company || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={editingExperience?.startDate ? new Date(editingExperience.startDate) : null}
                  onChange={(date) => setEditingExperience({ ...editingExperience, startDate: date })}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select start date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={editingExperience?.endDate ? new Date(editingExperience.endDate) : null}
                  onChange={(date) => setEditingExperience({ ...editingExperience, endDate: date })}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select end date or leave blank for current position"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe your responsibilities, achievements, and skills used in this role"
                  value={editingExperience?.description || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
                disabled={!(editingExperience?.title && editingExperience?.company && editingExperience?.startDate)}
              >
                <Save size={16} className="mr-2" />
                {editingExperience && editingExperience._id ? "Update" : "Add"}
              </button>
              <button
                onClick={cancelEditing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {isEditing && !showAddForm && experiences.length > 0 && (
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setEditingExperience(emptyExperience);
                setShowAddForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Plus size={16} className="mr-2" />
              Add Another
            </button>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingExperience(null);
                setShowAddForm(false);
                // Reset to original data if canceled
                setExperiences(userData.experience || []);
              }}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none disabled:bg-[#ffa07a] disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;