import api from "../axios";
import {
  Deparment,
  DepartmentCreateParams,
  DepartmentGetParams,
  DepartmentUpdateParams,
} from "../types/deparments";
import { PaginatedData } from "../types/general";

export const departmentsService = {
  getDepartments: async (
    params?: DepartmentGetParams
  ): Promise<PaginatedData<Deparment>> => {
    try {
      const response = await api.get<PaginatedData<Deparment>>(
        "/secondary-organizations/all/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  createDepartment: async (
    params: DepartmentCreateParams
  ): Promise<Deparment> => {
    try {
      const response = await api.post<Deparment>(
        "/secondary-organizations/create/",
        params
      );
      return response.data;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  },

  updateDepartment: async (
    params: DepartmentUpdateParams
  ): Promise<Deparment> => {
    try {
      const response = await api.put<Deparment>(
        `/secondary-organizations/${params.id}/`,
        params
      );
      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  },

  deleteDepartment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/secondary-organizations/${id}/`);
    } catch (error) {
      console.error("Error deleting department:", error);
      throw error;
    }
  },
};
