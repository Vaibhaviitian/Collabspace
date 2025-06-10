import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFile, FaUserCircle, FaSearch, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import PremiumLoader from "../Elements/PremiumLoader ";

const Dashboard = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("myProjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = {
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    avatar: `https://ui-avatars.com/api/?name=${localStorage.getItem(
      "username"
    )}&background=0ea5e9&color=fff&rounded=true&size=128`,
  };

  const user_id = localStorage.getItem("itemhai").toString();
  const runkardo = () => {
    localStorage.clear();
    location.reload();
    navigate('/');
  };
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const myDocsResponse = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/my_docs`,
        { user_id }
      );
      setMyProjects(myDocsResponse.data.docs);

      const allDocsResponse = await axios.get(
        `${import.meta.env.VITE_API_KEY}/api/user/all_docs`
      );

      const updatedSharedProjects = [];
      allDocsResponse?.data?.data.forEach((item) => {
        item.collaborators.forEach((req_id) => {
          if (
            req_id.user.toString() === user_id &&
            req_id.permission === "edit"
          ) {
            updatedSharedProjects.push({ ...item, action: "edit" });
          } else if (
            req_id.user.toString() === user_id &&
            req_id.permission === "view"
          ) {
            updatedSharedProjects.push({ ...item, action: "view" });
          }
        });
      });

      setSharedProjects(updatedSharedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/collabs/delete_doc`,
        { id }
      );
      toast.info(response.data.message);
      setMyProjects(myProjects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId, action = "edit") => {
    navigate(`/api/new/FluxDocs/${projectId}`, { state: { action } });
  };

  const filteredProjects =
    activeTab === "myProjects"
      ? myProjects.filter((project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : sharedProjects.filter((project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          {activeTab === "myProjects" ? "My Projects" : "Shared with Me"}
        </h1>

        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </motion.div>

          <Link
            to="/doc-editing"
            className="flex items-center space-x-2 px-6 py-2 bg-green-400 text-black rounded-lg font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>New Project</span>
          </Link>

          <button
            className="flex items-center space-x-2 px-6 py-2 bg-red-400 text-black rounded-lg font-medium"
            onClick={runkardo}
          >
            {" "}
            Logout{" "}
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex border-b border-gray-800 mb-6"
      >
        <button
          onClick={() => setActiveTab("myProjects")}
          className={`px-6 py-3 font-medium relative ${
            activeTab === "myProjects"
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Projects
          {activeTab === "myProjects" && (
            <motion.div
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("sharedProjects")}
          className={`px-6 py-3 font-medium relative ${
            activeTab === "sharedProjects"
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Shared with Me
          {activeTab === "sharedProjects" && (
            <motion.div
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      </motion.div>

      {/* Content Area */}
      <div className="min-h-[60vh]">
        {loading ? (
          <div className="flex justify-center items-center h-full py-20">
            <PremiumLoader />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-gray-400"
          >
            <FaFile className="w-16 h-16 mb-4 opacity-30" />
            <h3 className="text-xl mb-2">No projects found</h3>
            <p className="mb-6">
              {searchQuery
                ? "Try a different search term"
                : activeTab === "myProjects"
                ? "Create your first project"
                : "No projects shared with you yet"}
            </p>
            {!searchQuery && activeTab === "myProjects" && (
              <Link
                to="/doc-editing"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium"
              >
                Create New Project
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() =>
                      handleProjectClick(project._id, project.action)
                    }
                    className="p-6 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg truncate">
                        {project.title}
                      </h3>
                      {activeTab === "sharedProjects" && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            project.action === "edit"
                              ? "bg-green-900 text-green-300"
                              : "bg-blue-900 text-blue-300"
                          }`}
                        >
                          {project.action} access
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-400 mb-4">
                      <div className="flex items-center mb-1">
                        <span className="w-24">Owner:</span>
                        <span className="font-medium text-gray-300">
                          {project.owner?.username || "Me"}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="w-24">Created:</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24">Modified:</span>
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 px-6 py-3 bg-gray-900/50 flex justify-between items-center">
                    {activeTab === "myProjects" ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/api/new/FluxDocs/${project._id}`, {
                              state: { action: "edit" },
                            });
                          }}
                          className="text-sm px-4 py-1 bg-cyan-600 rounded-md"
                        >
                          Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project._id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/api/new/FluxDocs/${project._id}`, {
                            state: { action: project.action },
                          });
                        }}
                        className={`text-sm px-4 py-1 rounded-md ${
                          project.action === "edit"
                            ? "bg-cyan-600"
                            : "bg-gray-700"
                        }`}
                      >
                        {project.action === "edit" ? "Edit" : "View"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
