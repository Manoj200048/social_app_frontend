import React, { useState, useEffect } from "react";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/planApi";
import Modal from "react-modal";
import "./PlansPage.css";
Modal.setAppElement("#root");

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    localStorage.setItem("userId", 1);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPlans();
      setPlans(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch plans. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return <div></div>;
};

export default PlansPage;
