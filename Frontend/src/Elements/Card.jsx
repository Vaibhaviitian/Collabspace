import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        { user_id, doc_id:docid, permission }
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

  // Status button configuration
  const statusConfig = {
    "Request To collaborate": {
      text: "Request To collaborate",
      className: "bg-teal-500 hover:bg-teal-600",
      onClick: sending_request
    },
    "pending......": {
      text: "Pending...",
      className: "bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed",
      disabled: true
    },
    "accepted": {
      text: "Accepted",
      className: "bg-green-500 hover:bg-green-600 cursor-not-allowed",
      disabled: true
    },
    "rejected": {
      text: "Rejected",
      className: "bg-red-500 hover:bg-red-600 cursor-not-allowed",
      disabled: true
    }
  };

  const currentStatus = statusConfig[status] || statusConfig["Request To collaborate"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-between items-start border border-gray-200"
    >
      <div className="w-full md:w-3/4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          <span className="text-gray-500">Document:</span> {title || "Untitled"}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Owner:</span> {ownername || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {owneremail || "N/A"}
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/4 text-right mt-4 md:mt-0">
        <motion.button
          whileHover={!currentStatus.disabled ? { scale: 1.05 } : {}}
          whileTap={!currentStatus.disabled ? { scale: 0.95 } : {}}
          onClick={currentStatus.onClick}
          disabled={currentStatus.disabled || isLoading}
          className={`mt-4 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${currentStatus.className} ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
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