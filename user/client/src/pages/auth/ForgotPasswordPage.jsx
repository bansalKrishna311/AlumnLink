import { motion } from "framer-motion";
import { useState } from "react";
import Input from "./components/Input";
import { Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../../../public/login/3.png"; // Same visual asset
import icon from "../../../public/login-icon.webp";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting email:", error);
      alert("Error sending password reset email");
    } finally {
      setIsLoading(false);
    }
  };

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
                Reset Your Password
              </h2>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-gray-500 mb-6">
                  If an account exists for {email}, you will receive a password reset link shortly.
                </p>
              </div>
            )}

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-sm lg:text-md text-gray-600 border-2 border-opacity-20 p-2 lg:p-3 rounded-full border-slate-500">
                Back to Login?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
