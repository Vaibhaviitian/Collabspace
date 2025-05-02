import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import { motion, AnimatePresence } from "framer-motion"; // Fixed import
import "quill/dist/quill.snow.css";
import "./Editors.css";
import { io } from "socket.io-client";
import { useFetcher, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import PremiumLoader from "../Elements/PremiumLoader ";
function Editor() {
  const [quill, setQuill] = useState(null);
  const { id: docid } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [access, setAccess] = useState(false);
  const [collaborators, setCollaborators] = useState(["👑", "👨", "👩"]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState();

  // socket ka bhaang bhosda

  useEffect(() => {
    const s = io("http://localhost:1000");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!quill || !socket) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== "user") return; // only send if user typed

      const content = quill.getContents();
      socket.emit("quill-content-save", { content, docid });
    };

    const handleBroadcast = (delta) => {
      quill.setContents(delta);
    };

    quill.on("text-change", handleTextChange);
    socket.on("broadcast-content", handleBroadcast);

    // 🧹 CLEANUP to avoid multiple listeners
    return () => {
      quill.off("text-change", handleTextChange);
      socket.off("broadcast-content", handleBroadcast);
    };
  }, [quill, socket, docid,access]);

  // live user ki galich panti
  useEffect(() => {
    if (!socket) return;
    const handleUserJoined = (username) => {
      console.log(username);
      toast.success(`${username.username} joined the doc`);
    };

    const handleUserLeft = (username) => {
      toast.info(`${username} left the doc`);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users); // [{ socketId, username }]
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, access]);

  useEffect(() => {
    if (!socket || !docid) return;
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    console.log(access);
    socket.emit("join-room", { docid, username, email, access }); // 🔥 join the room using docid
    // console.log(docid);
  }, [socket, access]);

  // socket ka bhaang bhosda

  const [showCollaborators, setShowCollaborators] = useState(false);
  const ToolbarOptions = [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
  ];
  const checking_owner = async () => {
    setLoad(true);
    const response = await axios.post(
      "http://localhost:1000/api/user/getting_doc_content",
      {
        docid,
      }
    );
    // console.log(response);
    if (response.status === 200) {
      const currentUserId = localStorage.getItem("itemhai").toString();
      const doc = response.data.doc;

      const isOwner = doc.owner.toString() === currentUserId;
      const isCollaborator = doc.collaborators.some(
        (item) =>
          item.user.toString() === currentUserId && item.permission === "edit"
      );
      setTitle(response.data.doc.title);
      setAccess(isOwner || isCollaborator);
    }
    setLoad(false);
  };

  useEffect(() => {
    checking_owner();
  }, []);

  useEffect(()=>{
    console.log(access);
  },[access]);

  const check_for_title = async () => {
    try {
      const response = await axios.post(
        `http://localhost:1000/api/user/gettitle`,
        { docid }
      );
      // console.log(response.data.data);
      setIsOpen(!response.data.data);
      setLoad(false);
    } catch (error) {
      toast.error(`internal Error ${error.response.data.message}`);
      setLoad(false);
      console.error("Error prescense of title:", error);
    }
  };

  useEffect(() => {
    check_for_title();
  }, [docid]);

  const initializeQuill = useCallback(
    (wrapper) => {
      if (wrapper == null) return;

      wrapper.innerHTML = "";

      const editor = document.createElement("div");
      wrapper.append(editor);

      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: ToolbarOptions },
      });
      setQuill(q);
      if (access) {
        // console.log("access hai ");
        q.enable();
      } else {
        // console.log("access nahi hai  ");
        q.disable();
      }
    },
    [access]
  );

  const handleSubmit = async (e) => {
    // console.log("sstysa");
    e.preventDefault();
    setAccess(true);
    setIsOpen(false);
    try {
      // console.log("in creating a doc");
      const response = await axios.post(
        "http://localhost:1000/api/user/saving-the-doc",
        {
          title,
          docid,
          user_id: localStorage.getItem("itemhai"),
        }
      );
      // console.log(response);
      if (response.status === 200) {
        // setInitiator(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      // console.log("Quill content changed");
      setIsSaving(true);
      const timeout = setTimeout(() => setIsSaving(false), 3000);
      return () => clearTimeout(timeout);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  const data = async () => {
    // console.log("aaya hu data function mein");
    try {
      const response = await axios.post(
        `http://localhost:1000/api/user/getting_doc_content`,
        { docid }
      );
      // console.log(response.data.data);
      if (response.status === 200) {
        // console.log("ab false karunga");
        setLoad(false);
        // toast.success(response.data.message);
        const content = response.data.data;
        // console.log("Content before setting:", content);
        if (!quill) {
          console.log("Quill not initialized yet");
          return;
        }
        try {
          quill.setContents(content);
          // console.log("Content set successfully", quill.getContents());
        } catch (error) {
          console.error("Error setting content:", error);
          quill.setContents({
            ops: [{ insert: content?.ops?.[0]?.insert || content || "" }],
          });
        }
      } else {
        setLoad(false);
      }
    } catch (error) {
      // toast.error(`internal Errors : ${error.response.data.message}`);
      console.error("Error while continous saving:", error);
    }
  };

  useEffect(() => {
    // console.log(access);
    console.log("onlone user");
    console.log(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    if (quill) {
      // console.log("Quill is ready, fetching data...");
      data();
    }
  }, [docid, quill]); // Add quill as dependency

  return (
    <>
      {load && <PremiumLoader />}
      <div className="mt-10 mb-10 min-h-[calc(100vh-10rem)]">
        {/* 1. Custom Controls Bar - Sticky at top */}

        <div className="sticky top-0 z-20 bg-gray-900 border-b border-gray-700 px-6 py-3 shadow-lg backdrop-blur-sm bg-opacity-90">
  <div className="flex items-center justify-between">
    {/* Left Side - Title with Animated Icon */}
    <motion.div 
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </motion.div>
      <motion.h2 
        className="text-2xl font-semibold text-white truncate max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {title || "Untitled Document"}
      </motion.h2>
    </motion.div>

    {/* Right Side - Controls */}
    <motion.div 
      className="flex items-center space-x-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Save Status with Glow Effect */}
      <motion.div
        className={`flex items-center px-3 py-1.5 rounded-lg ${
          isSaving ? "bg-yellow-900/50" : "bg-green-900/50"
        } backdrop-blur-sm border ${
          isSaving ? "border-yellow-500/30" : "border-green-500/30"
        }`}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className={`w-2.5 h-2.5 rounded-full mr-2 ${
            isSaving ? "bg-yellow-400" : "bg-green-400"
          }`}
          animate={{
            scale: isSaving ? [1, 1.2, 1] : 1,
            boxShadow: isSaving 
              ? "0 0 8px rgba(234, 179, 8, 0.6)" 
              : "0 0 8px rgba(74, 222, 128, 0.4)"
          }}
          transition={isSaving ? { repeat: Infinity, duration: 1.5 } : {}}
        />
        <span className={`text-sm ${
          isSaving ? "text-yellow-300" : "text-green-300"
        }`}>
          {isSaving ? "Auto-saving..." : "All changes saved"}
        </span>
      </motion.div>


      {/* Collaborators - Floating Avatars */}
      <motion.div className="relative" whileHover={{ scale: 1.05 }}>
        <motion.button
          onClick={() => setShowCollaborators(!showCollaborators)}
          className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700"
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 3).map((user, i) => (
              <motion.div
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ y: -4 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </motion.div>
            ))}
            {onlineUsers.length > 3 && (
              <motion.div 
                className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-gray-300"
                whileHover={{ scale: 1.1 }}
              >
                +{onlineUsers.length - 3}
              </motion.div>
            )}
          </div>
          <motion.div
            animate={{ rotate: showCollaborators ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.button>

        {/* Animated Dropdown */}
        <AnimatePresence>
          {showCollaborators && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">
                  Live Collaborators ({onlineUsers.length})
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {onlineUsers.map((user, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center px-4 py-3 hover:bg-gray-700/50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3 font-medium text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.access ? "Can edit" : "View only"}
                      </div>
                    </div>
                    {user.access ? (
                      <motion.div 
                        className="text-green-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-5 h-5"
                        >
                          <path 
                            fill="currentColor"
                            d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" 
                          />
                        </svg>
                      </motion.div>
                    ) : (
                      <div className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 550 550"
                          className="w-5 h-5"
                        >
                          <path 
                            fill="currentColor"
                            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" 
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  </div>
</div>

        {/* 2. Quill Editor with sticky toolbar */}
        <div className="editor-container mt-3">
          <div ref={initializeQuill}></div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Title:</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
}

export { Editor };
