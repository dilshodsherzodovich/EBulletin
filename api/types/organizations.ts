import { Department } from "./deparments";

export type OrganizationType =
  | "hukumat"
  | "vazirlik"
  | "qo'mita"
  | "Quyi tashkilot"
  | "agentlik"
  | "byuro";

export interface Organization {
  id: string;
  name: string;
  type?: OrganizationType;
  parent: Organization;
  children: string[];
  created: string;
  is_active?: boolean;
  secondary_organizations: Department[];
}

export interface OrganizationsGetParams {
  page?: number;
  no_page?: boolean;
}

export interface OrganizationCreateParams {
  name: string;
  parent_id?: string;
  children?: string[];
  is_active?: boolean;
  type?: OrganizationType;
}

export interface OrganizationUpdateParams {
  id: string;
  name?: string;
  parent_id?: string;
  children?: string[];
  is_active?: boolean;
}
