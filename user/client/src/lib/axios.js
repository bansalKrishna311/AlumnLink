import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" 
		? "https://api.alumnlink.com/api/v1" 
		: "https://api.alumnlink.com/api/v1",
	withCredentials: true,
});
