import api from "../axios";
import { PaginatedData } from "../types/general";
import {
  Organization,
  OrganizationCreateParams,
  OrganizationsGetParams,
  OrganizationUpdateParams,
} from "../types/organizations";

export const organizationsService = {
  getOrganizations: async (
    params?: OrganizationsGetParams
  ): Promise<PaginatedData<Organization>> => {
    try {
      const response = await api.get<PaginatedData<Organization>>(
        "/organizations/all/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },

  createOrganization: async (
    params: OrganizationCreateParams
  ): Promise<Organization> => {
    try {
      const response = await api.post<Organization>(
        "/organizations/create/",
        params
      );
      return response.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  updateOrganization: async (
    params: OrganizationUpdateParams
  ): Promise<Organization> => {
    try {
      const response = await api.patch<Organization>(
        `/organizations/${params.id}/`,
        params
      );
      return response.data;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  },

  deleteOrganization: async (id: string): Promise<void> => {
    try {
      await api.delete(`/organizations/${id}/`);
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  },
};
