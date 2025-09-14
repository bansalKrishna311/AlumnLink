import { useState } from "react";
import { X, PlusCircle, Edit2, CheckCircle2, Lightbulb, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "HTML", "CSS", 
    "Product Management", "UI/UX Design", "Leadership", "Communication",
    "Project Management", "Data Analysis", "Machine Learning", "SQL",
    "Marketing", "Sales", "Customer Service", "Content Writing"
  ];

  const handleAddSkill = async () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      setNewSkill("");
      setSearchTerm("");
      setSuggestions([]);
      
      // Auto-save the skill immediately
      try {
        setIsLoading(true);
        await onSave({ skills: updatedSkills });
        toast.success(`"${newSkill}" added successfully!`);
      } catch (error) {
        // Revert the change if save failed
        setSkills(skills);
        toast.error("Failed to add skill. Please try again.");
        console.error("Error saving skill:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDeleteSkill = async (skill) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    
    // Auto-save after deleting
    try {
      setIsLoading(true);
      await onSave({ skills: updatedSkills });
      toast.success(`"${skill}" removed successfully!`);
    } catch (error) {
      // Revert the change if save failed
      setSkills(skills);
      toast.error("Failed to remove skill. Please try again.");
      console.error("Error removing skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setNewSkill(value);
    setSearchTerm(value);
    
    if (value.length > 1) {
      const filteredSuggestions = commonSkills.filter(
        skill => skill.toLowerCase().includes(value.toLowerCase()) && !skills.includes(skill)
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = async (suggestion) => {
    if (!skills.includes(suggestion)) {
      const updatedSkills = [...skills, suggestion];
      setSkills(updatedSkills);
      setNewSkill("");
      setSearchTerm("");
      setSuggestions([]);
      
      // Auto-save the selected suggestion immediately
      try {
        setIsLoading(true);
        await onSave({ skills: updatedSkills });
        toast.success(`"${suggestion}" added successfully!`);
      } catch (error) {
        // Revert the change if save failed
        setSkills(skills);
        toast.error("Failed to add skill. Please try again.");
        console.error("Error saving skill:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Lightbulb className="mr-2 text-[#fe6019]"  size={22} />
            Skills
          </h2>
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-[#fe6019] hover:text-[#e04e0a] font-medium text-sm transition"
            >
              <Edit2 size={16} className="mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {skills.length === 0 && !isEditing ? (
          <div className="text-center py-6 text-gray-500">
            <Lightbulb size={32} className="mx-auto mb-3 text-gray-400" />
            <p>No skills added yet</p>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Skills
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            {isLoading && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center text-[#fe6019]">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span className="text-sm">Saving...</span>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className={`flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-sm font-medium ${
                  isEditing 
                    ? "pr-1 border border-gray-200" 
                    : "text-gray-700"
                }`}
              >
                <CheckCircle2 size={14} className="text-[#fe6019] mr-1.5" />
                {skill}
                {isEditing && (
                  <button 
                    onClick={() => handleDeleteSkill(skill)} 
                    className="ml-1.5 p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            </div>
          </div>
        )}        {isEditing && (
          <div className="mt-6">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#fe6019] focus-within:border-[#fe6019] bg-white">
                <div className="pl-3 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Type a skill (e.g., React, JavaScript, Python)..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  className="flex-grow p-3 pl-2 focus:outline-none rounded-lg"
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill || isLoading}
                  className={`mr-1 p-2 rounded-lg transition flex items-center ${
                    newSkill && !isLoading
                      ? "text-[#fe6019] hover:bg-[#fff1eb]"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <PlusCircle size={20} />
                  )}
                </button>
              </div>
              
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center transition-colors"
                      >
                        <PlusCircle size={14} className="mr-2 text-[#fe6019] flex-shrink-0" />
                        <span className="text-gray-800">{suggestion}</span>
                        <span className="ml-auto text-xs text-gray-500">Click to add</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span>Press Enter or click the + button to add a skill instantly</span>
              {isLoading && (
                <span className="ml-2 flex items-center text-[#fe6019]">
                  <Loader2 size={12} className="animate-spin mr-1" />
                  Saving...
                </span>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewSkill("");
                  setSearchTerm("");
                  setSuggestions([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;