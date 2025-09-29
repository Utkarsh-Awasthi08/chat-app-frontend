import axios from "axios";
export const baseURL = "https://chat-app-backend-2-3hez.onrender.com/";
export const httpClient = axios.create({
  baseURL: baseURL,
});
