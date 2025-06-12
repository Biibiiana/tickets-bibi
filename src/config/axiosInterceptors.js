// src/config/axiosInterceptors.js
import axios from "axios";
import { AuthService } from "../services/AuthService";

const setup = async () => {
  axios.interceptors.request.use(async config => {
    const token = AuthService.getJwtToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }, error => {
    return Promise.reject(error);
  });
};

export default setup;