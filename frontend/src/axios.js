import axios from "axios";

const api = axios.create({
  baseURL: "https://loan-planner.onrender.com",
});

export default api;

