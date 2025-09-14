import { useState, useEffect } from "react";
import { Briefcase, X, Plus, Calendar, Pencil, Building, Save, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Custom styles for DatePicker
const datePickerCustomStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }
  @media (min-width: 640px) {
    .react-datepicker__input-container input {
      padding: 12px;
    }
  }
  .react-datepicker__input-container input:focus {
    outline: none;
    border-color: #fe6019;
    box-shadow: 0 0 0 2px rgba(254, 96, 25, 0.2);
  }
  .react-datepicker {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    font-size: 14px;
  }
  .react-datepicker__header {
    background-color: #fe6019;
    border-bottom: 1px solid #fe6019;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header {
    color: white;
    font-weight: 600;
  }
  .react-datepicker__day-name {
    color: white;
  }
  .react-datepicker__day--selected {
    background-color: #fe6019;
    color: white;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #fed7ca;
    color: #fe6019;
  }
  .react-datepicker__day:hover {
    background-color: #fed7ca;
    color: #fe6019;
  }
`;

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
    isCurrentPosition: false,
    description: ""
  };

  const handleAddExperience = () => {
    if (editingExperience.title && editingExperience.company && editingExperience.startDate) {
      const formattedExperience = {
        ...editingExperience,
        startDate: editingExperience.startDate instanceof Date ? editingExperience.startDate.toISOString() : editingExperience.startDate,
        endDate: editingExperience.isCurrentPosition ? null : (editingExperience.endDate instanceof Date ? editingExperience.endDate.toISOString() : editingExperience.endDate),
        isCurrentPosition: editingExperience.isCurrentPosition || false,
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
        endDate: exp.isCurrentPosition ? null : (exp.endDate instanceof Date ? exp.endDate.toISOString() : exp.endDate),
        isCurrentPosition: exp.isCurrentPosition || false,
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
    return dateObj.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const cancelEditing = () => {
    setEditingExperience(null);
    setShowAddForm(false);
  };

  return (
    <>
      <style>{datePickerCustomStyles}</style>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            <Briefcase className="mr-2 text-[#fe6019]" size={20} />
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

      <div className="p-3 sm:p-4">
        {experiences.length === 0 && !showAddForm && (
          <div className="text-center py-4 sm:py-6 text-gray-500">
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
                        {formatDate(exp.startDate)} - {exp.isCurrentPosition || (!exp.endDate && !exp.isCurrentPosition) ? "Present" : formatDate(exp.endDate)}
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
          <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg p-3 sm:p-5 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Ex: Software Engineer"
                  value={editingExperience?.title || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition text-sm"
                />
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Ex: Google"
                  value={editingExperience?.company || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition text-sm"
                />
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={editingExperience?.startDate ? new Date(editingExperience.startDate) : null}
                  onChange={(date) => setEditingExperience({ ...editingExperience, startDate: date })}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select start date"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition text-sm"
                />
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={editingExperience?.endDate ? new Date(editingExperience.endDate) : null}
                  onChange={(date) => setEditingExperience({ ...editingExperience, endDate: date })}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select end date"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  disabled={editingExperience?.isCurrentPosition}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="currentPosition"
                    checked={editingExperience?.isCurrentPosition || false}
                    onChange={(e) => setEditingExperience({ 
                      ...editingExperience, 
                      isCurrentPosition: e.target.checked,
                      endDate: e.target.checked ? null : editingExperience?.endDate
                    })}
                    className="h-4 w-4 text-[#fe6019] focus:ring-[#fe6019] border-gray-300 rounded"
                  />
                  <label htmlFor="currentPosition" className="ml-2 text-xs sm:text-sm text-gray-600">
                    I currently work here
                  </label>
                </div>
              </div>
              
              <div className="col-span-1 sm:col-span-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe your responsibilities, achievements, and skills used in this role"
                  value={editingExperience?.description || ""}
                  onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition text-sm"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none w-full sm:w-auto"
                disabled={!(editingExperience?.title && editingExperience?.company && editingExperience?.startDate)}
              >
                <Save size={16} className="mr-2" />
                {editingExperience && editingExperience._id ? "Update" : "Add"}
              </button>
              <button
                onClick={cancelEditing}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-full sm:w-auto"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {isEditing && !showAddForm && experiences.length > 0 && (
          <div className="mt-3 sm:mt-4 flex justify-between">
            <button
              onClick={() => {
                setEditingExperience(emptyExperience);
                setShowAddForm(true);
              }}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Plus size={16} className="mr-2" />
              Add Another
            </button>
          </div>
        )}

        {isEditing && (
          <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingExperience(null);
                setShowAddForm(false);
                // Reset to original data if canceled
                setExperiences(userData.experience || []);
              }}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-full sm:w-auto order-2 sm:order-1"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none disabled:bg-[#ffa07a] disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2"
              disabled={isSaving}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ExperienceSection;