import { Bulletin, BulletinCreateBody } from "../types/bulleten";
import api from "@/api/axios";
import { PaginatedData } from "../types/general";

export const bulletinService = {
  getBulletins: async ({
    page = 1,
  }: {
    page: number;
  }): Promise<PaginatedData<Bulletin>> => {
    try {
      const response = await api.get("/journal/all/", {
        params: {
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bulletins:", error);
      throw error;
    }
  },

  createBulletin: async (body: BulletinCreateBody): Promise<Bulletin> => {
    try {
      const response = await api.post<Bulletin>("/journal/create/", body);
      return response.data;
    } catch (error) {
      console.error("Error creating bulletin:", error);
      throw error;
    }
  },

  updateBulletin: async (
    id: string,
    body: BulletinCreateBody
  ): Promise<Bulletin> => {
    try {
      const response = await api.patch<Bulletin>(`/journal/${id}/`, body);
      return response.data;
    } catch (error) {
      console.error("Error updating bulletin:", error);
      throw error;
    }
  },

  deleteBulletin: async (id: string): Promise<void> => {
    try {
      await api.delete(`/journal/${id}/`);
    } catch (error) {
      console.error("Error deleting bulletin:", error);
      throw error;
    }
  },

  getBulletin: async (id: string): Promise<Bulletin> => {
    try {
      const response = await api.get(`/journal/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bulletin:", error);
      throw error;
    }
  },
};
