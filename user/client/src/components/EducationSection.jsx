import { useState } from "react";
import { School, X, Plus, Calendar, Pencil, BookOpen, Save, ChevronDown, ChevronUp, Clock, Edit } from "lucide-react";
import DatePicker from "react-datepicker"; // You'll need to install this package
import "react-datepicker/dist/react-datepicker.css";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: null,
    endDate: null,
    isCurrentlyStudying: false,
    description: ""
  });
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState(null);

  const handleAddEducation = () => {
    if (newEducation.school && newEducation.fieldOfStudy && newEducation.startDate) {
      if (editingEducationId) {
        // Update existing education
        setEducations(educations.map(edu => 
          edu._id === editingEducationId ? { ...newEducation, _id: editingEducationId } : edu
        ));
        setEditingEducationId(null);
      } else {
        // Add new education
        setEducations([...educations, { ...newEducation, _id: Date.now().toString() }]);
      }
      
      // Reset form
      setNewEducation({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: null,
        endDate: null,
        isCurrentlyStudying: false,
        description: ""
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu._id !== id));
    if (editingEducationId === id) {
      setEditingEducationId(null);
      setShowAddForm(false);
    }
  };

  const handleEditEducation = (education) => {
    setNewEducation({
      ...education,
      startDate: education.startDate ? new Date(education.startDate) : null,
      endDate: education.endDate ? new Date(education.endDate) : null,
    });
    setEditingEducationId(education._id);
    setShowAddForm(true);
  };

  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
    setShowAddForm(false);
    setEditingEducationId(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleCurrentlyStudyingChange = (e) => {
    const isChecked = e.target.checked;
    setNewEducation({ 
      ...newEducation, 
      isCurrentlyStudying: isChecked,
      endDate: isChecked ? null : newEducation.endDate
    });
  };

  const cancelEdit = () => {
    setNewEducation({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null,
      endDate: null,
      isCurrentlyStudying: false,
      description: ""
    });
    setShowAddForm(false);
    setEditingEducationId(null);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <School className="mr-2 text-[#fe6019]"  size={22} />
            Education
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
        {educations.length === 0 && !showAddForm && (
          <div className="text-center py-6 text-gray-500">
            <School size={32} className="mx-auto mb-3 text-gray-400" />
            <p>No education history added yet</p>
            {isEditing && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
              >
                <Plus size={16} className="mr-2" />
                Add Education
              </button>
            )}
          </div>
        )}

        {educations.length > 0 && (
          <div className="space-y-5">
            {educations.map((edu) => (
              <div
                key={edu._id}
                className={`bg-white rounded-lg ${
                  isEditing ? "border border-gray-200 shadow-sm" : ""
                }`}
              >
                <div className="p-4 flex justify-between">
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                      <BookOpen className="text-[#fe6019]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                      <p className="text-gray-800">
                        {edu.degree ? `${edu.degree}, ` : ""}
                        {edu.fieldOfStudy}
                      </p>
                      <div className="text-gray-500 text-sm flex items-center mt-1">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 
                          <span className="flex items-center text-[#fe6019] font-medium">
                            <Clock size={14} className="mx-1" /> Present
                          </span> : 
                          formatDate(edu.endDate) || "Present"}
                      </div>
                      
                      {edu.description && (
                        <div>
                          <button 
                            onClick={() => toggleExpand(edu._id)} 
                            className="text-[#fe6019] text-sm font-medium flex items-center mt-2 hover:text-[#e04e0a] transition"
                          >
                            {expandedId === edu._id ? (
                              <>Less <ChevronUp size={14} className="ml-1" /></>
                            ) : (
                              <>More <ChevronDown size={14} className="ml-1" /></>
                            )}
                          </button>
                          
                          {expandedId === edu._id && (
                            <p className="text-gray-600 text-sm mt-2 pr-4">{edu.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-start">
                      <button
                        onClick={() => handleEditEducation(edu)}
                        className="text-[#fe6019] hover:text-[#e04e0a] transition p-1 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center mr-1"
                        aria-label="Edit education"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu._id)}
                        className="text-gray-500 hover:text-red-600 transition p-1 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        aria-label="Delete education"
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
              {editingEducationId ? (
                <>
                  <Edit size={18} className="mr-2" />
                  Edit Education
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Education
                </>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input
                  type="text"
                  placeholder="Ex: Stanford University"
                  value={newEducation.school}
                  onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  placeholder="Ex: Bachelor's"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="Ex: Computer Science"
                  value={newEducation.fieldOfStudy}
                  onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={newEducation.startDate}
                  onChange={(date) => setNewEducation({ ...newEducation, startDate: date })}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select start date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={newEducation.endDate}
                  onChange={(date) => setNewEducation({ ...newEducation, endDate: date })}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select end date"
                  disabled={newEducation.isCurrentlyStudying}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition ${newEducation.isCurrentlyStudying ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              
              <div className="col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    checked={newEducation.isCurrentlyStudying}
                    onChange={handleCurrentlyStudyingChange}
                    className="rounded border-gray-300 text-[#fe6019] shadow-sm focus:border-[#fe6019] focus:ring focus:ring-[#fe6019] focus:ring-opacity-50 mr-2"
                  />
                  I am currently studying here
                </label>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  placeholder="Activities, accomplishments, etc."
                  value={newEducation.description}
                  onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddEducation}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
              >
                {editingEducationId ? (
                  <>
                    <Save size={16} className="mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add
                  </>
                )}
              </button>
              <button
                onClick={cancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {isEditing && !showAddForm && educations.length > 0 && (
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setShowAddForm(true)}
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
                setShowAddForm(false);
                setEditingEducationId(null);
                // Reset to original data if cancel
                setEducations(userData.education || []);
              }}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationSection;