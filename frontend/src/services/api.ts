import axios from "axios";

import type { Activity } from "@/types/activityType";

const API_BASE_URL = "http://localhost:8888/api"

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    config.headers["X-User-ID"] = userId;
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export const getActivities = async () => {
  return await api.get("/activities");
};

export const addActivity = async (activity: Activity) => {
  return await api.post("/activities", activity);
};

export const getActivityDetails = async (id: string) => {
  return await api.get(`/activities/${id}`);
};

export const getActivityRecommendations = async (id: string) => {
  return await api.get(`/recommendations/activity/${id}`);
};
