import { LoginResponse } from "@/api/types/auth";
import { UserData, UserRole } from "@/api/types/user";

export type Permission =
  | "view_dashboard"
  | "view_users"
  | "create_user"
  | "edit_user"
  | "delete_user"
  | "view_departments"
  | "create_department"
  | "edit_department"
  | "delete_department"
  | "view_organizations"
  | "create_organization"
  | "edit_organization"
  | "delete_organization"
  | "view_journals"
  | "create_journal"
  | "edit_journal"
  | "delete_journal"
  | "view_journal_detail"
  | "create_journal_row"
  | "edit_journal_row"
  | "delete_journal_row"
  | "view_bulletin_files"
  | "create_bulletin_file"
  | "delete_bulletin_file"
  | "view_journal_structure"
  | "create_journal_structure"
  | "edit_journal_structure"
  | "delete_journal_structure"
  | "view_classificators"
  | "create_classificator"
  | "edit_classificator"
  | "delete_classificator";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "view_dashboard",
    "view_users",
    "create_user",
    "edit_user",
    "delete_user",
    "view_departments",
    "create_department",
    "edit_department",
    "delete_department",
    "view_organizations",
    "create_organization",
    "edit_organization",
    "delete_organization",
    "view_journals",
    "view_journal_detail",
    "create_journal",
    "edit_journal",
    "delete_journal",
    "create_journal_row",
    "edit_journal_row",
    "delete_journal_row",
    "view_bulletin_files",
    "view_journal_structure",
    "create_journal_structure",
    "edit_journal_structure",
    "delete_journal_structure",
    "view_classificators",
    "create_classificator",
    "edit_classificator",
    "delete_classificator",
  ],
  OPERATOR: [
    "view_dashboard",
    "view_journals",
    "view_journal_detail",
    "create_bulletin_file",
    "view_bulletin_files",
    "delete_bulletin_file",
  ],
  MODERATOR: [
    "view_dashboard",
    "view_users",
    "create_user",
    "edit_user",
    "delete_user",
    "view_departments",
    "create_department",
    "edit_department",
    "delete_department",
    "view_organizations",
    "create_organization",
    "edit_organization",
    "delete_organization",
    "view_journals",
    "view_journal_detail",
    "create_journal",
    "edit_journal",
    "delete_journal",
    "create_journal_row",
    "edit_journal_row",
    "delete_journal_row",
    "view_bulletin_files",
    "create_bulletin_file",
    "delete_bulletin_file",
    "view_journal_structure",
    "create_journal_structure",
    "edit_journal_structure",
    "delete_journal_structure",
    "view_classificators",
    "create_classificator",
    "edit_classificator",
    "delete_classificator",
  ],
  OBSERVER: [
    "view_dashboard",
    "view_users",
    "create_user",
    "edit_user",
    "delete_user",
    "view_departments",
    "create_department",
    "edit_department",
    "delete_department",
    "view_organizations",
    "create_organization",
    "edit_organization",
    "delete_organization",
    "view_journals",
    "view_journal_detail",
    "create_journal",
    "edit_journal",
    "delete_journal",
    "create_journal_row",
    "edit_journal_row",
    "delete_journal_row",
    "view_bulletin_files",
    "create_bulletin_file",
    "delete_bulletin_file",
    "view_journal_structure",
    "create_journal_structure",
    "edit_journal_structure",
    "delete_journal_structure",
    "view_classificators",
    "create_classificator",
    "edit_classificator",
    "delete_classificator",
  ],
};

export function hasPermission(
  user: UserData | null,
  permission: Permission
): boolean {
  if (!user) return false;
  const role = user?.role as UserRole;
  const userPermissions = ROLE_PERMISSIONS[role] || [];
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  user: UserData | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(
  user: UserData | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  return permissions.every((permission) => hasPermission(user, permission));
}

export function canAccessSection(
  user: UserData | null,
  section: string
): boolean {
  switch (section) {
    case "dashboard":
      return hasPermission(user, "view_dashboard");
    case "users":
      return hasPermission(user, "view_users");
    case "departments":
      return hasPermission(user, "view_departments");
    case "organizations":
      return hasPermission(user, "view_organizations");
    case "bulletins": {
      return hasPermission(user, "view_journals");
    }
    case "classificator": {
      return hasPermission(user, "view_classificators");
    }
    case "bulletin_detail": {
      return hasPermission(user, "view_journal_detail");
    }
    case "bulletin_structure": {
      return hasPermission(user, "view_journal_structure");
    }
    default:
      return false;
  }
}
