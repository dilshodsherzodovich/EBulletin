export interface Department {
  id: string;
  name: string;
  organization_id: string;
  organization: string;
  created: string;
  updated: string;
  is_active: boolean;
}

export interface DepartmentGetParams {
  page?: number;
}

export interface DepartmentCreateParams {
  name: string;
  organization_id: string;
  is_active?: boolean;
}

export interface DepartmentUpdateParams {
  id: string;
  name: string;
  organization_id: string;
}
