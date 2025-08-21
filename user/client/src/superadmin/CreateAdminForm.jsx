import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User, Lock, Mail, Plus, X } from "lucide-react";
import Input from "../pages/auth/components/Input"; // Adjust the import path as needed

const CreateAdminForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState("institute"); // Default type
  const [location, setLocation] = useState(""); // Added state for location
  const [assignedCourses, setAssignedCourses] = useState([]); // Added state for courses
  const [courseInput, setCourseInput] = useState(""); // Added state for course input
  const queryClient = useQueryClient();

  const { mutate: createAdmin, isLoading } = useMutation({
    mutationFn: (adminData) => axiosInstance.post("/auth/signup", adminData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Admin created successfully");
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setAdminType("institute"); // Reset to default type
      setLocation(""); // Reset location
      setAssignedCourses([]); // Reset courses
      setCourseInput(""); // Reset course input
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (assignedCourses.length === 0) {
      toast.error("Please add at least one course for the admin");
      return;
    }
    
    createAdmin({ 
      name, 
      username, 
      email, 
      password, 
      role: "admin", 
      adminType, 
      location,
      assignedCourses 
    });
  };

  const addCourse = () => {
    if (courseInput.trim() && !assignedCourses.includes(courseInput.trim())) {
      setAssignedCourses([...assignedCourses, courseInput.trim()]);
      setCourseInput("");
    } else if (assignedCourses.includes(courseInput.trim())) {
      toast.error("Course already added");
    }
  };

  const removeCourse = (courseToRemove) => {
    setAssignedCourses(assignedCourses.filter(course => course !== courseToRemove));
  };

  const handleCourseKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCourse();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Create Admin</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <Input
            icon={User}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            icon={User}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Wrap location and adminType in a flex container */}
          <div className="flex gap-4 mb-4">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input w-full"
            >
              <option value="" disabled>
                Select your location
              </option>
              {[
                "Bengaluru",
                "Hyderabad",
                "Pune",
                "Chennai",
                "Mumbai",
                "Delhi NCR",
                "Kolkata",
                "Ahmedabad",
                "Jaipur",
                "Thiruvananthapuram",
                "Lucknow",
                "Indore",
                "Chandigarh",
                "Nagpur",
              ].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              value={adminType}
              onChange={(e) => setAdminType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>
                Select Admin Type
              </option>
              <option value="institute">Institute</option>
              <option value="corporate">Corporate</option>
              <option value="school">School</option>
            </select>
          </div>

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Assigned Courses Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Courses *
            </label>
            
            {/* Display added courses */}
            {assignedCourses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {assignedCourses.map((course, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => removeCourse(course)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Course input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyPress={handleCourseKeyPress}
                placeholder="Enter course name (e.g., Computer Science, Marketing)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {assignedCourses.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Add at least one course that this admin will manage
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminForm;
