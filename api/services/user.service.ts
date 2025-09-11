import api from "../axios";
import { PaginatedData } from "../types/general";
import {
  CreateUserRequest,
  CreateUserResponse,
  UserData,
  UserDetailResponse,
} from "../types/user";

export const userService = {
  createUser: async (
    userData: CreateUserRequest
  ): Promise<CreateUserResponse> => {
    try {
      const response = await api.post<CreateUserResponse>(
        "/user/create/",
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },

  getUsers: async ({ page = 1 }: { page: number } = { page: 1 }) => {
    try {
      const response = await api.get<PaginatedData<UserData>>(
        `/user/all/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<UserDetailResponse> => {
    try {
      const response = await api.get<UserDetailResponse>(`/user/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  },

  updateUser: async (
    id: string,
    userData: Partial<CreateUserRequest>
  ): Promise<UserDetailResponse> => {
    try {
      const response = await api.patch<UserDetailResponse>(
        `/user/${id}/`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  deleteUser: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/user/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  },
};
