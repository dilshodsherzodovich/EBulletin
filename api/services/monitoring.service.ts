import api from "../axios";
import { MonitoringApiResponse } from "../types/monitoring";

export const monitoringService = {
  getMonitoring: async (): Promise<MonitoringApiResponse> => {
    try {
      const response = await api.get("/journal/monitoring-by-organizations/");
      return response.data;
    } catch (error) {
      console.error("Error fetching monitoring:", error);
      throw error;
    }
  },
};
