import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion ,AnimatePresence} from "framer-motion";

export default function NotificationTabs() {
  const [activeTab, setActiveTab] = useState("sent");
  const [sentNotifications, setSentNotifications] = useState([]);
  const [incomingNotifications, setIncomingNotifications] = useState([]);
  const user_id = localStorage.getItem("itemhai");

  // API calls remain exactly the same
  const incomingNotifications_handler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/my_requests",
        { user_id }
      );
      setIncomingNotifications(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sentNotifications_handler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/sended_requests",
        { user_id }
      );
      setSentNotifications(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptingrequest = async (request_id) => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/handling_request",
        { user_id, request_id, action: "accepted" }
      );
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.message);
    }
  };

  const rejectingrequest = async (request_id) => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/handling_request",
        { action: "rejected", request_id, user_id }
      );
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.message);
    }
  };

  useEffect(() => {
    incomingNotifications_handler();
    sentNotifications_handler();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
      {/* Header with gradient text */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
      >
        Notifications
      </motion.h1>

      {/* Tabs - Dark Theme */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex space-x-1 bg-gray-800 shadow rounded-lg p-1 border border-gray-700">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === "sent" 
                ? "bg-gray-700 text-white shadow" 
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Requests
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === "incoming" 
                ? "bg-gray-700 text-white shadow" 
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests
          </button>
        </div>
      </motion.div>

      {/* Notifications Container - Dark Card */}
      <motion.div 
        className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 max-w-4xl mx-auto overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Sent Requests Tab */}
        {activeTab === "sent" && (
          <>
            {sentNotifications.length > 0 ? (
              sentNotifications.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-900/50 text-teal-400 font-semibold border border-teal-800">
                      {item.owner.username[0]}
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">
                        Sent request to{" "}
                        <span className="font-bold text-white">
                          {item.owner.username} ({item.owner.email})
                        </span>{" "}
                        for doc collaboration
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{new Date(item.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400 border  border-yellow-800"
                          : item.status === "accepted"
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : "bg-red-900/30 text-red-400 border border-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No Sent Requests
              </div>
            )}
          </>
        )}

        {/* Incoming Requests Tab */}
        {activeTab === "incoming" && (
          <>
            {incomingNotifications.length > 0 ? (
              incomingNotifications.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-900/50 text-purple-400 font-semibold border border-purple-800">
                      {item.requester.username[0]}
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">
                        <span className="text-white">{item.sender}</span> request by{" "}
                        <span className="font-bold text-white">
                          {item.requester.username} ({item.requester.email})
                        </span>{" "}
                        for edit access
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{new Date(item.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0">
                    <span
                      className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                          : item.status === "accepted"
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : "bg-red-900/30 text-red-400 border border-red-800"
                      }`}
                    >
                      {item.status}
                    </span>

                    {item.status === "pending" && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => acceptingrequest(item._id)}
                          className="px-3 py-1.5 bg-green-900/50 text-green-400 font-medium rounded-md border border-green-800 hover:bg-green-800/30 transition"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => rejectingrequest(item._id)}
                          className="px-3 py-1.5 bg-red-900/50 text-red-400 font-medium rounded-md border border-red-800 hover:bg-red-800/30 transition"
                        >
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No Incoming Requests
              </div>
            )}
          </>
        )}
      </motion.div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}