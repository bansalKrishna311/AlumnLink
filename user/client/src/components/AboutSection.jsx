import { useState, useEffect } from "react";
import { Edit2, Save, User, X, Check, Info, FileText } from "lucide-react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData?.about || "");
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 2000;

  useEffect(() => {
    setAbout(userData?.about || "");
    setCharCount(userData?.about?.length || 0);
  }, [userData?.about]);

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxCharCount) {
      setAbout(text);
      setCharCount(text.length);
    }
  };

  const handleSave = () => {
    onSave({ about });
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="mr-2 text-[#fe6019]"  size={22} />
            About
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
        {about ? (
          !isEditing ? (
            <div className="text-gray-700 whitespace-pre-line">{about}</div>
          ) : (
            <div>
              <div className="relative">
                <textarea
                  value={about}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition resize-none"
                  rows="6"
                  placeholder="Describe your professional background, accomplishments, interests, and skills..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {charCount}/{maxCharCount}
                </div>
              </div>

              <div className="mt-4 bg-[#fff1eb] border border-[#ffdfce] rounded-lg p-3 text-sm text-[#e04e0a] flex items-start">
                <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>
                  Your about section is like your professional summary. Keep it concise, highlight your expertise, and share what makes you unique in your field.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
                >
                  <Save size={16} className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-8 px-4">
            {!isEditing ? (
              <>
                <FileText size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 mb-2">No information available</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"

                  >
                    <Edit2 size={16} className="mr-2" />
                    Add About Section
                  </button>
                )}
              </>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <textarea
                    value={about}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe6019] focus:border-[#fe6019] transition resize-none"
                    rows="6"
                    placeholder="Describe your professional background, accomplishments, interests, and skills..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {charCount}/{maxCharCount}
                  </div>
                </div>

                <div className="mt-4 bg-[#fff1eb] border border-[#ffdfce] rounded-lg p-3 text-sm text-[#e04e0a] flex items-start">
                  <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>
                    A complete about section makes your profile more discoverable. Focus on your professional journey, achievements, and what you're passionate about.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#fe6019] hover:bg-[#e04e0a] focus:outline-none"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSection;