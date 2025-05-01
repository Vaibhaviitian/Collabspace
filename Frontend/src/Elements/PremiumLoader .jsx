import React from 'react';

const PremiumLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-xl z-50 flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
        
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin duration-1000"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
        
        {/* Optional text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-white text-sm font-medium">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;