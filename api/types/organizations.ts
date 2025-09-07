import { PaginatedData } from "./general";

export type OrganizationType =
  | "hukumat"
  | "vazirlik"
  | "qo'mita"
  | "bo'lim"
  | "agentlik"
  | "byuro";

export interface Organization {
  id: string;
  name: string;
  type?: OrganizationType;
  parent: Organization;
  children: string[];
  is_active?: boolean;
}

export interface OrganizationsGetParams {
  page?: number;
}

export interface OrganizationCreateParams {
  name: string;
  parent_id?: string;
  children?: string[];
  is_active?: boolean;
  type: OrganizationType;
}

export interface OrganizationUpdateParams {
  id: string;
  name?: string;
  parent_id?: string;
  children?: string[];
  is_active?: boolean;
}
