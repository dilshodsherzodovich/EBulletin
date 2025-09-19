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
  id: string;
  name: string;
  type: "number" | "text" | "date" | "classificator";
  journal?: string;
  order: number;
  classificator?: string | null;
  classificatorId?: string;
  classificatorName?: string;
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
  rows: BulletinRow[];
  upload_history: BulletinFile[];
}

export interface BulletinCreateBody {
  name: string;
  description: string;
  deadline: BulletinDeadline;
  columns: BulletinColumn[];
  organizations: string[];
  main_organizations: string[];
  responsible_employees: string[];
  type_of_journal_display?: string;
}

// Updated to match the actual bulletinDetail API response
export interface BulletinRow {
  id: string;
  order: number;
  values: Record<string, string | number | Date>;
}

// For individual cell data (used in create requests)
export interface BulletinRowCell {
  column: string;
  value: string | number | Date;
}

export interface BulletinCreateRow {
  journal: string;
  values: BulletinRowCell[];
}

export interface BulletinFile {
  id: string;
  status: "on_time" | "late" | "not_submitted";
  upload_file: string | null;
  upload_at: string;
  deadline: string;
  editable: boolean;
  user_info: {
    id: string;
    username: string;
    full_name: string;
  };
}

export interface BulletinFileUpdateRequest {
  editable: boolean;
  journal?: string;
  upload_file?: File;
}
