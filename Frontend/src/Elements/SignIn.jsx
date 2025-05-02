import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isload, setIsload] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    try {
      e.preventDefault();
      setIsload(true);
      const response = await axios.post(
        "http://localhost:1000/api/user/login",
        { email, password }
      );
      
      localStorage.setItem("itemhai", response.data.user._id);
      localStorage.setItem("token", response.data.jwttoken);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("email", response.data.user.email);
      
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      setIsload(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            variants={item}
            className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-10 h-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
              />
            </svg>
          </motion.div>

          <motion.h2 
            variants={item}
            className="text-3xl font-bold text-white"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            variants={item}
            className="text-gray-400 mt-2"
          >
            Sign in to continue
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handlelogin}
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* Email */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <motion.input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your email"
              whileFocus={{
                boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)"
              }}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <motion.input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your password"
              whileFocus={{
                boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)"
              }}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={item}>
            <motion.button
              type="submit"
              className="w-full px-6 py-3 text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isload}
            >
              {isload ? (
                <div className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>


        </motion.form>

        {/* Sign Up Link */}
        <motion.div 
          className="mt-6 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don't have an account?{" "}
          <Link 
            to="/signup" 
            className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Sign up
          </Link>
        </motion.div>
      </motion.div>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        toastStyle={{ backgroundColor: '#1F2937', color: '#E5E7EB' }} 
      />
    </div>
  );
}

export default SignInPage;