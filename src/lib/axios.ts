import { useAuthStore } from "@/auth";
import { APIResponses } from "@/network/api-types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = useAuthStore.getState().user;
    if (user) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to notify all subscribers
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/v1/login"
    ) {
      if (isRefreshing) {
        // Queue the request until the token is refreshed
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint
        const { data } = await axios.get<APIResponses["refresh"]>(
          `${import.meta.env.VITE_API_BASE_URL}/v1/refresh`,
          {
            withCredentials: true,
          },
        );

        const newToken = data.data.accessToken;
        useAuthStore.getState().setUser({
          accessToken: newToken,
        });

        // Notify all subscribers with the new token
        onRefreshed(newToken);

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token errors (e.g., logout the user)
        console.log("refresh failed, logging out");
        useAuthStore.getState().clearUser();
        refreshSubscribers = [];
        isRefreshing = false;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Reject other errors
    return Promise.reject(error);
  },
);
