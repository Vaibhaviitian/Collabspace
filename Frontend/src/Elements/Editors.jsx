import React, { act, useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Editors.css";
import { io } from "socket.io-client";
import { useFetcher, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PremiumLoader from "../Elements/PremiumLoader ";
function Editor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: docid } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [access, setAccess] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "You", access: "edit", avatar: "👑", active: true },
    { id: 2, name: "John", access: "edit", avatar: "👨", active: true },
    { id: 3, name: "Jane", access: "view", avatar: "👩", active: false },
  ]);

  const [initiator, setInitiator] = useState(false);
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
      `${import.meta.env.VITE_API_KEY}/api/user/getting_doc_content`,
      {
        docid,
      }
    );
    // console.log(response);
    if (response.status === 200) {
      if (
        response.data.doc.owner.toString() === localStorage.getItem("itemhai")
      ) {
        // console.log("kkklll");
        setAccess(true);
      } else {
        // console.log("lllkkk");
        setAccess(false);
      }
      setTitle(response.data.doc.title);
    }
    setLoad(false);
  };

  useEffect(() => {
    checking_owner();
  }, []);

  const check_for_title = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/gettitle`,
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

  const initializeQuill = useCallback((wrapper) => {
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
  }, [access]);


  const handleSubmit = async (e) => {
    console.log("sstysa");
    e.preventDefault();
    setIsOpen(false);
    try {
      console.log("in creating a doc");
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/saving-the-doc`,
        {
          title,
          docid,
          user_id: localStorage.getItem("itemhai"),
        }
      );
      console.log(response);
      if (response.status === 200) {
        setInitiator(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const save_doc = async () => {
    // console.log("saving doc......");
    if (!quill.getContents()) {
      toast.error("Please provide all required fields: docid and user_id.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/autosave`,
        {
          docid,
          content: quill.getContents(),
        }
      );
      // console.log(response.data.data);
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        toast.error("Error saving document.");
      }
    } catch (error) {
      toast.error(`Internal Error :${error.response.data.message}`);
      console.error("Error checking save_doc:", error);
    }
  };

  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      // console.log("Quill content changed");
      setIsSaving(true);
      const timeout = setTimeout(() => setIsSaving(false), 7000);
      return () => clearTimeout(timeout);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  useEffect(() => {
    if (quill) {
      const interval = setInterval(() => {
        save_doc();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      console.log("No content to save or title is empty.");
    }
  }, [quill, initiator]);

  const data = async () => {
    // console.log("aaya hu data function mein");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/getting_doc_content`,
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
      toast.error(`internal Error : ${error.response.data.message}`);
      console.error("Error while continous saving:", error);
    }
  };

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

        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Side - Title with Document Icon */}
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-gray-100">
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 truncate max-w-xs">
                  {title || "Untitled Document"}
                </h2>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-6">
              {/* Save Status with Animation */}
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center px-3 py-1.5 rounded-lg ${
                    isSaving ? "bg-yellow-50" : "bg-green-50"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      isSaving ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSaving ? "text-yellow-700" : "text-green-700"
                    }`}
                  >
                    {isSaving ? "Saving..." : "All changes saved"}
                  </span>
                </div>
              </div>

              {/* Share Button */}
              <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-600">Share</span>
              </button>

              {/* Collaborators */}
              <div className="relative">
                <button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex -space-x-2">
                    {collaborators.slice(0, 3).map((user) => (
                      <div
                        key={user.id}
                        className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                      >
                        {user.avatar || user.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {collaborators.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        +{collaborators.length - 3}
                      </div>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                </button>

                {showCollaborators && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Collaborators ({collaborators.length})
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {collaborators.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 font-medium text-gray-600 cursor-pointer">
                            {user.avatar || user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.access}
                            </div>
                          </div>
                          {user.active ? (
                            <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
                          ) : (
                            <div className="text-xs text-gray-400 ml-2">
                              offline
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                        + Invite people
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
      </div>
    </>
  );
}

export { Editor };
