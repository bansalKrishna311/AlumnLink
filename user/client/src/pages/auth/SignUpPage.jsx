import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import SignupImage from "../../../public/Login.png";
import icon from "../../../public/login-icon.webp";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
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
