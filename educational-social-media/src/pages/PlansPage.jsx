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

  const handleCreate = () => {
    setCurrentPlan({
      topic: "",
      resources: [""],
      timeline: 30,
      description: "",
      steps: [""],
      user: { id: userId },
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setCurrentPlan({
      ...plan,
      resources: [...plan.resources],
      steps: [...plan.steps],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(id);
        fetchPlans();
      } catch (err) {
        console.error("Failed to delete plan:", err);
        setError("Failed to delete plan. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div className="empty-state">Loading plans...</div>;
  }

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h1>Learning Plans</h1>
        {userId && (
          <button className="btn btn-primary" onClick={handleCreate}>
            Create New Plan
          </button>
        )}
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <p>No learning plans found.</p>
          {userId && (
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Your First Plan
            </button>
          )}
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.topic}</h3>
              <div className="plan-meta">
                <span>{plan.timeline} minutes</span>
                <span>By User #{plan.user.id}</span>
              </div>
              <p>{plan.description}</p>
              {userId && userId == plan.user.id && (
                <div className="plan-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(plan)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansPage;
