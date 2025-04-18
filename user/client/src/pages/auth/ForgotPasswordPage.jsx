import { motion } from "framer-motion";
import { useState } from "react";
import Input from "./components/Input";
import { Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "/login/3.png"; // Same visual asset
import icon from "/login-icon.webp";
import { axiosInstance } from "@/lib/axios";
import Doodles from "./components/Doodles";

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
    <div className="relative min-h-screen flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
      <Doodles />
      <div className="relative w-full lg:w-[52vw] m-auto z-10">
        <div className="flex items-center justify-center h-[95vh] p-2 my-4 lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-2xl bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row w-full h-full max-w-4xl overflow-hidden relative z-10">
            <div className="w-full lg:w-1/2 h-[200px] lg:h-full hidden lg:block relative group">
              <motion.img
                src={Login}
                alt="Visual Representation"
                className="w-[25vw] h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px] transition-transform duration-500"
                whileHover={{ scale: 1.02 }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#fe6019]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 lg:p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl relative z-10"
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
                  <motion.h2 
                    className="text-xl lg:text-1xl font-medium text-center text-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Reset Your Password
                  </motion.h2>
                </div>

                {!isSubmitted ? (
                  <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Input
                      icon={Mail}
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(254, 96, 25, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 lg:py-3 px-4 bg-[#fe6019] text-white font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe6019] transition-all duration-200 relative overflow-hidden"
                      type="submit"
                      disabled={isLoading}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0"
                        whileHover={{ opacity: 0.1 }}
                        transition={{ duration: 0.2 }}
                      />
                      {isLoading ? (
                        <Loader className="w-5 h-5 lg:w-6 lg:h-6 animate-spin mx-auto" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-16 h-16 bg-[#fe6019] rounded-full flex items-center justify-center mx-auto mb-4 relative"
                    >
                      <Mail className="h-8 w-8 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#fe6019]"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                    <motion.p 
                      className="text-gray-500 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      If an account exists for {email}, you will receive a password reset link shortly.
                    </motion.p>
                  </motion.div>
                )}

                <motion.div 
                  className="mt-4 lg:mt-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm lg:text-md text-gray-600 border-2 border-opacity-20 p-2 lg:p-3 rounded-full border-slate-500">
                    Back to Login?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Login
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

export default ForgotPasswordPage;
