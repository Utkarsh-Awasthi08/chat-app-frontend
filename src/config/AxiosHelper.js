import axios from "axios";
export const baseURL = "https://chat-app-backend-3-lgwt.onrender.com/";
export const httpClient = axios.create({
  baseURL: baseURL,
});
