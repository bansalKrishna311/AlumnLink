import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import Login from '../../assets/Login.png'; // You might want to replace this with a suitable image for SignUp
import icon from '../../assets/login-icon.webp'; // Using the same icon as in the LoginPage

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex items-center justify-center h-full lg:h-[90vh] p-2 lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-lg bg-white">
			<div className="flex flex-col lg:flex-row w-full h-full max-w-6xl overflow-hidden">
				{/* Left Side - Image Section */}
				<div className="w-full lg:w-1/2 h-full hidden lg:block">
					<img
						src={Login} // Change this if you have a specific signup image
						alt="Visual Representation"
						className="w-[26vw] h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px]"
					/>
				</div>

				{/* Right Side - Signup Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl"
				>
					<div className="w-full lg:w-[26vw]">
						<div className="flex items-center mb-6 justify-center">
							<img className="w-10 me-2" src={icon} alt="" />
							<h2 className="text-2xl font-medium text-center text-gray-800">
								Create Account
							</h2>
						</div>

						<form onSubmit={handleSignUp}>
							<Input
								icon={User}
								type="text"
								placeholder="Full Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<Input
								icon={Mail}
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								icon={Lock}
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
							<PasswordStrengthMeter password={password} />

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-3 px-4 bg-[#DFDFDF] text-slate-600 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Sign Up"}
							</motion.button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-md text-gray-600 border-2 border-opacity-20 p-3 rounded-full border-slate-500">
								Already have an account?{" "}
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

export default SignUpPage;
