import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PremiumLoader from "./PremiumLoader ";

const Privateroutes = ({ children }) => {
  const Authorization = localStorage.getItem("token");
  const [isverified, setIsverified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handlingverification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/user/checkforauthentication",
        {
          Authorization,
        }
      );
      // console.log(response);

      if (response.data.success) {
        setIsverified(true);
        // toast.success("Token verified! Welcome to your private area.");
      } else {
        setIsverified(false);
        toast.error("Unauthorized access. Please log in.");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setIsverified(false);
      toast.error("Session timeout , Token has been expired,Login again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlingverification();
  }, []);

  useEffect(() => {
    if (!isLoading && !isverified) {
      navigate("/login");
    }
  }, [isLoading, isverified, navigate]);

  if (isLoading) {
    return (
      <PremiumLoader/>
    );
  }

  return (
    <>
      <ToastContainer />
      {isverified ? children : null}
    </>
  );
};

export default Privateroutes;
