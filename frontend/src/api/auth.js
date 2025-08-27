import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // ✅ backend ka base URL
});

// Register
export const registerUser = (userData) => API.post("/register", userData);

// Login
export const loginUser = (userData) => API.post("/login", userData);
