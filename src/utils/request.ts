import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const publicRequest = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
});

const privateRequest = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
   headers: { "Content-Type": "application/json" },
});

export { publicRequest, privateRequest };
