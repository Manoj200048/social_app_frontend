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