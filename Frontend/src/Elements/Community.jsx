import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Community() {
  const [data, setdata] = useState([]);
  // Function to fetch all documents
  const getting_alldocs = async () => {
    try {
      console.log(import.meta.env.VITE_API_KEY);
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/api/user/all_docs`
      );
      console.log(response);
      if (response) {
        setdata(response.data.data);
      }
      // console.log(response);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    getting_alldocs();
  }, []);
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
        <div className="bg-teal-600 text-white p-6 rounded-t-lg">
          <h2 className="text-3xl font-semibold text-center">
            FluxDocs Collaboration Community
          </h2>
          <p className="mt-2 text-lg text-center">
            Explore documents and collaborate with your friends
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {data && data.length > 0 ? (
              data.map((card) => {
                // console.log(card);
                return (
                  <Card
                    docid={card?._id || `card-${index}`}
                    title={card?.title || "Untitled"}
                    ownerid={card?.owner || "--- ----"}
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-900 text-2xl font-extrabold mb-4">
                  No documents found
                </div>
                <p className="text-gray-700 max-w-md text-center">
                  It looks like you don't have any documents yet. Create a new
                  one to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Community;
