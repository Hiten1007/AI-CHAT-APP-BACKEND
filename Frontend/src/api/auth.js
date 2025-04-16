import axiosInstance from "../lib/axios";

export const loginUser = async (data) => {
  const res = await axiosInstance.post('/api/auth/login', data, { withCredentials: true });
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axiosInstance.post('/api/auth/signup', data, { withCredentials: true });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get('/api/auth/me', { withCredentials: true });
  return res.data;
};
