import axios from "axios";

import requestInterceptor from "./interceptors/requestInterceptor";

import {
  responseInterceptor,
  responseErrorInterceptor,
} from "./interceptors/responseInterceptor";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  requestInterceptor
);

// Response interceptor
axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default axiosInstance;