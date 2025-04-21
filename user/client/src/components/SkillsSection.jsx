import { useState } from "react";
import { X, PlusCircle, Edit2, Save, CheckCircle2, Lightbulb, Search } from "lucide-react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "HTML", "CSS", 
    "Product Management", "UI/UX Design", "Leadership", "Communication",
    "Project Management", "Data Analysis", "Machine Learning", "SQL",
    "Marketing", "Sales", "Customer Service", "Content Writing"
  ];

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDeleteSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    onSave({ skills });
    setIsEditing(false);
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

  const selectSuggestion = (suggestion) => {
    setNewSkill(suggestion);
    setSearchTerm(suggestion);
    setSuggestions([]);
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
        )}

        {isEditing && (
          <div className="mt-6">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#fe6019] focus-within:border-[#fe6019] bg-white">
                <div className="pl-3 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  className="flex-grow p-3 pl-2 focus:outline-none rounded-lg"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill}
                  className={`mr-1 p-2 rounded-lg transition ${
                    newSkill
                      ? "text-[#fe6019] hover:bg-[#fff1eb]"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <PlusCircle size={20} />
                </button>
              </div>
              
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      >
                        <PlusCircle size={14} className="mr-2 text-[#fe6019]" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Press Enter or click the + button to add a skill
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;