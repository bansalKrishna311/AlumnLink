import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "https://alumnlink-1.onrender.com/api/v1" : "/api/v1",
	withCredentials: true,
});
