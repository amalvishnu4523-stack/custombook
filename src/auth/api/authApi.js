import axiosInstance from "../../api/axiosInstance";

// SIGN UP API
export const signupUser = async (data) => {
  const response = await axiosInstance.post("/api/accounts/register/", data);
  return response.data;
};

// SIGN IN API
export const signinUser = async (data) => {
  const response = await axiosInstance.post("/api/accounts/login/", data);
  return response.data;
};

// GET STATES BY COUNTRY
export const getStatesByCountry = async (countryCode) => {
  const response = await axiosInstance.get(`/api/accounts/states/?country=${countryCode}`);
  return response.data;
};
