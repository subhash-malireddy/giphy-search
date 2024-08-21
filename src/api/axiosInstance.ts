import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs/search",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
