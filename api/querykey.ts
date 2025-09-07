export const queryKeys = {
  auth: {
    login: "auth-login",
    logout: "auth-logout",
  },
  organizations: {
    list: "organizations",
    create: "create-organization",
    edit: "edit-organization",
    delete: "delete-organization",
  },
  departments: {
    list: "departments",
    create: "create-department",
    edit: "edit-department",
    delete: "delete-department",
  },
} as const;
