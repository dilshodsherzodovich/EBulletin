export const queryKeys = {
  auth: {
    login: "auth-login",
    logout: "auth-logout",
  },
  users: {
    all: "users-all",
    detail: (id: string) => `users-detail-${id}`,
  },
} as const;
