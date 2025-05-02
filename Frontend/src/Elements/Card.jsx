import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function Card({ title, ownerid, docid }) {
  const [ownername, setOwnername] = useState("");
  const [owneremail, setOwneremail] = useState("");
  const user_id = localStorage.getItem("itemhai")?.toString() || "";
  const [status, setStatus] = useState("Request To collaborate");
  const [isLoading, setIsLoading] = useState(false);
  const permission = "edit";

  const ownerabout = async () => {
    try {
      const response = await axios.post(
        `http://localhost:1000/api/user/anyuser`,
        { user_id: ownerid }
      );
      if (response.status === 200) {
        setOwnername(response.data.data[0].username);
        setOwneremail(response.data.data[0].email);
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
    }
  };

  useEffect(() => {
    ownerabout();
    status_of_req();
  }, []);

  const sending_request = async () => {
    setIsLoading(true);
    setStatus("pending......");
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/sending_request",
        { user_id, doc_id: docid, permission }
      );
      toast.success(`${response?.data?.message}`);
    } catch (error) {
      toast.error("Error sending request");
      setStatus("Request To collaborate");
    } finally {
      setIsLoading(false);
    }
  };

  const status_of_req = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/user/status_of_req",
        { docid, user_id }
      );
      if (response.status === 200) {
        setStatus(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching request status:", error);
    }
  };

  if (ownerid.toString() === user_id) {
    return null;
  }

  const statusConfig = {
    "Request To collaborate": {
      text: "Request Collaboration",
      className: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700",
      onClick: sending_request
    },
    "pending......": {
      text: "Request Pending",
      className: "bg-gradient-to-r from-amber-600 to-yellow-600 cursor-not-allowed",
      disabled: true
    },
    "accepted": {
      text: "Access Granted",
      className: "bg-gradient-to-r from-green-600 to-emerald-600 cursor-not-allowed",
      disabled: true
    },
    "rejected": {
      text: "Request Denied",
      className: "bg-gradient-to-r from-red-600 to-rose-600 cursor-not-allowed",
      disabled: true
    }
  };

  const currentStatus = statusConfig[status] || statusConfig["Request To collaborate"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start border border-gray-700 hover:border-cyan-500 transition-all"
    >
      <div className="w-full md:w-3/4">
        <h3 className="text-xl font-semibold text-white mb-2">
          <span className="text-cyan-400 font-medium">Document:</span> {title || "Untitled"}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300">
          <p>
            <span className="font-medium text-gray-400">Owner:</span> {ownername || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-400">Email:</span> {owneremail || "N/A"}
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/4 mt-4 md:mt-0 md:text-right">
        <motion.button
          whileHover={!currentStatus.disabled ? { scale: 1.03 } : {}}
          whileTap={!currentStatus.disabled ? { scale: 0.97 } : {}}
          onClick={currentStatus.onClick}
          disabled={currentStatus.disabled || isLoading}
          className={`w-full md:w-auto text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all ${currentStatus.className} ${
            isLoading ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing</span>
            </span>
          ) : (
            currentStatus.text
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Card;