export const queryKeys = {
  auth: {
    login: "auth-login",
    logout: "auth-logout",
  },

  users: {
    all: "users-all",
    detail: (id: string) => `users-detail-${id}`,
  },
  organizations: {
    list: "organizations",
    create: "create-organization",
    edit: "edit-organization",
    delete: "delete-organization",
  },
  classificators: {
    list: "classificators-list",
    create: "create-classificator",
    edit: "edit-classificator",
    delete: "delete-classificator",
  },
} as const;
