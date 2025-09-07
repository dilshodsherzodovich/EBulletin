export interface Deparment {
  id: string;
  name: string;
  organization_id: string;
  organization: string;
  created: string;
  uodated: string;
}

export interface DepartmentGetParams {
  page?: number;
}

export interface DepartmentCreateParams {
  name: string;
  organization_id: string;
}

export interface DepartmentUpdateParams {
  id: string;
  name: string;
  organization_id: string;
}
