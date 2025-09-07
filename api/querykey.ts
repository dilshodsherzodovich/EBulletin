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
} as const;
