import axios from "axios";
export const baseURL = "https://chat-app-backend-92sf.onrender.com";
export const httpClient = axios.create({
  baseURL: baseURL,
});
