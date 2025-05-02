import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold">
                F
              </div>
              <span className="text-xl font-bold text-white">Collab Space</span>
            </motion.div>
            <p className="mt-4 text-gray-400">
              Collaborate seamlessly with your team.
            </p>
          </div>

          {/* Links Columns - Add your links here */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {/* Replace these with your actual links */}
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/docs" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </motion.li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {/* Replace these with your actual links */}
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </motion.li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {/* Replace these with your actual links */}
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FluxDocs. All rights reserved.
          </p>
          
          {/* Social Links - Add your social links here */}
          <div className="mt-4 md:mt-0 flex space-x-6">
            {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">{social}</span>
                <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center">
                  {social.charAt(0)}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;