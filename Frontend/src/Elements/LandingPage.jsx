import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function LandingPage() {
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureCardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };
  useEffect(()=>{
    console.log(import.meta.env.VITE_API_KEY);
  },[])
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-950/90 z-0"></div>
        
        <motion.div 
          className="hero-content relative z-10 max-w-7xl w-full text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CREATE</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">TOGETHER</span>
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 text-xl sm:text-2xl md:text-3xl font-medium"
            variants={containerVariants}
          >
            {["FROM", "ANY", "CORNER", "OF", "THE", "WORLD"].map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          <motion.p 
            className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            The ultimate platform for creative collaboration across borders. Bring your ideas to life with seamless teamwork.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link 
              to='/dashboard' 
              className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 overflow-hidden text-lg font-medium rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              Get Started
              <svg 
                className="ml-3 w-5 h-5 transition-all duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900">
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "50+", label: "Countries" },
            { number: "24/7", label: "Support" },
            { number: "99.9%", label: "Uptime" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              variants={itemVariants}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Features</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-400">
              Everything you need to collaborate effectively and bring ideas to life
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Real-time Collaboration",
                description: "Work simultaneously with your team members from anywhere in the world with live updates and synchronization."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Intuitive Tools",
                description: "Powerful yet easy-to-use creative tools that help you bring your ideas to life without the learning curve."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Reliable Infrastructure",
                description: "Enterprise-grade infrastructure ensuring your work is always available and secure."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Version History",
                description: "Never lose work with automatic versioning and the ability to restore previous versions."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Enterprise Security",
                description: "End-to-end encryption and advanced security features to protect your intellectual property."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
                title: "Cloud Integration",
                description: "Seamless integration with all major cloud storage providers for easy file management."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                variants={featureCardVariants}
              >
                <div className="w-12 h-12 mb-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Users Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform transformed how our distributed team collaborates. The real-time features are game-changing.",
                author: "Sarah Johnson",
                role: "Creative Director, Pixel & Grain"
              },
              {
                quote: "I've tried every collaboration tool out there, but none come close to the seamless experience here.",
                author: "Michael Chen",
                role: "Lead Developer, NovaTech"
              },
              {
                quote: "Our productivity increased by 40% after switching to this platform. Worth every penny.",
                author: "Emma Rodriguez",
                role: "Product Manager, Stellar Solutions"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="text-gray-300 mb-6 italic">"{testimonial.quote}"</div>
                <div className="font-medium text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-950 to-gray-900">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Transform</span> Your Workflow?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Join thousands of creative professionals who are already collaborating smarter and faster.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to='/dashboard' 
              className="inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 text-lg font-medium rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300"
            >
              Start Your Free Trial
              <svg 
                className="ml-3 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage; 