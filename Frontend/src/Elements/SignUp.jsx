import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isload, setIsload] = useState(false);
  const navigate = useNavigate();

  const handleregister = async (e) => {
    try {
      e.preventDefault();
      setIsload(true);
      const response = await axios.post(
        "http://localhost:1000/api/user/Register",
        { username, email, password }
      );
      toast.success(response.data.message);
      setIsload(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setIsload(false);
    }
  };

  // Smoother animation variants
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
        transition={{ duration: 2 }}
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
            Create Your Account
          </motion.h2>
          <motion.p 
            variants={item}
            className="text-gray-400 mt-2"
          >
            Join our community
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form 
          className="space-y-5"
          onSubmit={handleregister}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Username */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter username"
              whileFocus={{
                boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)"
              }}
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Create password"
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
                  Creating account...
                </div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Login Link */}
        <motion.div 
          className="mt-6 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Sign in
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

export default SignUpPage;