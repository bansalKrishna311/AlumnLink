import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader, Eye, EyeOff, Check, X } from "lucide-react";
import Input from "./components/Input";
import ResetImage from "/login/1.png";
import { axiosInstance } from "@/lib/axios";
import Doodles from "./components/Doodles";

const PasswordResetPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: resetPassword, isLoading } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setTimeout(() => navigate("/login"), 3000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetPassword({ password });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const getStrength = () => {
    return criteria.reduce((acc, curr) => (curr.met ? acc + 1 : acc), 0);
  };

  const strength = getStrength();

  const getColor = (strength) => {
    const colors = ["bg-[#4c3300]", "bg-[#805500]", "bg-[#b37500]", "bg-[#dda700]", "bg-[#ffcc33]"];
    return colors[strength] || "bg-gray-600";
  };

  const getStrengthText = (strength) =>
    ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength] || "Very Weak";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
      <Doodles />
      <div className="relative w-full lg:w-[60vw] m-auto z-10">
        <div className="flex items-center justify-center h-[95vh] p-2 my-4 lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-2xl bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row w-full h-full max-w-4xl overflow-hidden relative z-10">
            <div className="w-full lg:w-1/2 h-[200px] lg:h-full hidden lg:block relative group">
              <motion.img
                src={ResetImage}
                alt="Reset Visual"
                className="w-full h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px]"
                whileHover={{ scale: 1.02 }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#fe6019]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 lg:p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl relative z-10"
            >
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#fe6019] to-[#ff8c00] text-transparent bg-clip-text">
                  Reset Password
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    icon={showPassword ? EyeOff : Eye}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    onIconClick={togglePasswordVisibility}
                  />
                  <Input
                    icon={showPassword ? EyeOff : Eye}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Password strength</span>
                      <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
                            index < strength ? `bg-[#fe6019]${strength === 5 ? '' : '/'+ ((strength/5)*100)}` : "bg-gray-200"
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 space-y-1">
                      {criteria.map((item) => (
                        <motion.div 
                          key={item.label} 
                          className="flex items-center text-xs"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.met ? (
                            <Check className="size-4 text-[#fe6019] mr-2" />
                          ) : (
                            <X className="size-4 text-[#fe6019] mr-2" />
                          )}
                          <span className={item.met ? "text-[#fe6019]" : "text-gray-400"}>
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#fe6019] text-white font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe6019] transition duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Set New Password"}
                  </motion.button>
                </form>

                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-gray-600">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
