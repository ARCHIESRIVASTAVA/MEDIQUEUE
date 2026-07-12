import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://mediqueue-wf8j.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;