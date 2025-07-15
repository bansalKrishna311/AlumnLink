import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" 
		? "http://localhost:4000/api/v1" 
		: "http://139.59.66.21:4000/api/v1",
	withCredentials: true,
});
