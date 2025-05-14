import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" 
		? "http://localhost:4000/api/v1" // Use your local development URL here
		// : "https://alumnlink-1.onrender.com/api/v1", // Use your production URL here
		: "http://139.59.66.21:4000/api/v1", // Use your production URL here
	withCredentials: true,
});
