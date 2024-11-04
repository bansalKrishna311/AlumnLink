import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader, Eye, EyeOff, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import SignupImage from "../../../public/Login.png";
import icon from "../../../public/login-icon.webp";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password strength and criteria
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };
  const strength = getStrength();

  const getColor = (strength) => {
  if (strength === 0) return "bg-[#4c3300]"; // Darker shade
if (strength === 1) return "bg-[#805500]"; // Slightly lighter shade
if (strength === 2) return "bg-[#b37500]"; // Mid-tone shade
if (strength === 3) return "bg-[#dda700]"; // Base color you provided
return "bg-[#ffcc33]"; // Lightest shade, for maximum strength
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="flex items-center justify-center h-screen lg:h-[95vh] p-2 w-full lg:w-[60vw] m-auto lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-lg bg-white">
      <div className="flex flex-col lg:flex-row w-full h-full max-w-4xl overflow-hidden">
        {/* Left Side - Image Section */}
        <div className="w-full lg:w-1/2 h-[200px] lg:h-full hidden lg:block">
          <img
            src={SignupImage}
            alt="Visual Representation"
            className="w-full h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px]"
          />
        </div>

        {/* Right Side - SignUp Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 lg:p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl"
        >
          <div className="w-full">
            <div className="flex items-center mb-4 lg:mb-6 justify-center">
              <motion.img
                className="w-8 lg:w-10 mr-2"
                src={icon}
                alt="Hand waving"
                animate={{
                  rotate: [0, 15, 0, -15, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
                style={{ transformOrigin: "70% 70%" }}
              />
              <h2 className="text-xl lg:text-2xl font-medium text-center text-gray-800">
                Create Your Account!
              </h2>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBD200]"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBD200]"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBD200]"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBD200]"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Password strength</span>
                  <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
                </div>

                <div className="flex space-x-1">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                      ${index < strength ? getColor(strength) : "bg-gray-600"}`}
                    />
                  ))}
                </div>

                {/* Password Criteria */}
                <div className="mt-2 space-y-1">
                  {criteria.map((item) => (
                    <div key={item.label} className="flex items-center text-xs">
                      {item.met ? (
                        <Check className="size-4 text-[#FBD200] mr-2" />
                      ) : (
                        <X className="size-4 text-[#FBD200] mr-2" />
                      )}
                      <span className={item.met ? "text-[#D69E00]" : "text-gray-400"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 lg:py-3 px-4 bg-[#DFDFDF] text-slate-600 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 lg:w-6 lg:h-6 animate-spin mx-auto" />
                ) : (
                  "Agree & Join"
                )}
              </motion.button>
            </form>

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-sm lg:text-md text-gray-600 border-2 border-opacity-20 p-2 lg:p-3 rounded-full border-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
