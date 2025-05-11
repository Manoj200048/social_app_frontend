import apiClient from "./axiosConfig";

// Learning Plans
export const getAllPlans = async () => {
  try {
    const response = await apiClient.get("/learning-plans");
    return response;
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error;
  }
};

export const getPlanById = async (id) => {
  try {
    const response = await apiClient.get(`/learning-plans/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching plan with ID ${id}:`, error);
    throw error;
  }
};

export const getPlansByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/learning-plans/user/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching plans for user ID ${userId}:`, error);
    throw error;
  }
};