import api from "../axios";
import { MonitoringApiResponse } from "../types/monitoring";

export const monitoringService = {
  getMonitoring: async (params: {
    no_page?: boolean;
  }): Promise<MonitoringApiResponse> => {
    try {
      const response = await api.get("/journal/monitoring-by-organizations/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monitoring:", error);
      throw error;
    }
  },
};
