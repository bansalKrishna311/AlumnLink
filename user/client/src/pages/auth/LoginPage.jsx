import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff, User, Lock,Linkedin  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Login from "/Login.png";
import icon from "/login-icon.webp";
import Input from "./components/Input"; // Adjust the import path as needed

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleLinkedin = () => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
      redirect_uri: 'http://localhost:4000/api/v1/auth/linkedinCallback',
      scope: "openid email profile",
    
    })
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  return (
    <div className="flex items-center justify-center h-screen lg:h-[95vh] p-2 w-full lg:w-[52vw] m-auto my-4 lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-lg bg-white ">
      <div className="flex flex-col lg:flex-row w-full h-full max-w-4xl overflow-hidden ">
        <div className="w-full lg:w-1/2 h-[200px] lg:h-full hidden lg:block">
          <img
            src={Login}
            alt="Visual Representation"
            className="w-[25vw] h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px]"
          />
        </div>

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
              <h2 className="text-xl lg:text-1xl font-medium text-center text-gray-800">
                Welcome Back to AlumnLink!
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                icon={User}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

<div className="relative">
  <Input
    icon={Lock}
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff className="w-5 h-5" color="#CF9400" /> : <Eye className="w-5 h-5" color="#CF9400" />}
  </button>
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
                  "Login"
                )}
              </motion.button>
            </form>

            <div className="mt-4 flex justify-start pl-4">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline flex items-center"
                disabled={isForgotLoading}
              >
                {isForgotLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  "Forgot Password?"
                )}
              </button>
            </div>

            <div className="flex justify-center mt-6 mb-2">
              <span className="bg-gray-200 h-px w-full my-auto"></span>
              <span className="px-4 text-sm text-gray-500">or</span>
              <span className="bg-gray-200 h-px w-full my-auto"></span>
            </div>

            
            <div className="mt-4 flex justify-center">
              <motion.button 
                onClick={handleLinkedin} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-2 lg:py-3 px-4 bg-[#0A66C2] text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CF9400] transition duration-200 shadow-md"
              >
                <Linkedin className="w-5 h-5" />
                <span>Continue with LinkedIn</span>
              </motion.button>
            </div>

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-sm lg:text-md text-gray-600 border-2 border-opacity-20 p-2 lg:p-3 rounded-full border-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
