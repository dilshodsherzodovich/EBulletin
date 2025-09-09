import { Organization } from "./organizations";
import { UserData } from "./user";

export interface BulletinDeadline {
  id: number;
  period_type: string;
  custom_deadline: string | null;
  day_of_month: number | null;
  day_of_week: number | null;
  month: number | null;
  interval: number;
  period_start: string;
  current_deadline: string;
}

export interface BulletinColumn {
  id: number;
  name: string;
  type: string;
  journal: string;
  order: number;
  classificator: string | null;
}

export interface Bulletin {
  id: string;
  name: string;
  created: string;
  updated: string;
  description: string;
  deadline: BulletinDeadline;
  columns: BulletinColumn[];
  main_organizations_list: Pick<
    Organization,
    "id" | "name" | "secondary_organizations"
  >[];
  employees_list: Pick<UserData, "id" | "first_name" | "last_name">[];
  user_info: {
    id: string;
    username: string;
    full_name: string;
  };
}

export interface BulletinCreateBody {
  name: string;
  description: string;
  deadline: BulletinDeadline;
  columns: BulletinColumn[];
  organizations: string[];
  main_organizations: string[];
  responsible_employees: string[];
}
