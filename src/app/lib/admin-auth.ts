import { API_BASE_URL } from "./auth";

const ADMIN_ACCESS_TOKEN_KEY = "neutrofreeze_admin_access_token";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
};

export type AdminAuthResponse = {
  admin: AdminUser;
  accessToken: string;
};

export const adminAuthStorage = {
  getAccessToken() {
    return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  },
  setToken(accessToken: string) {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken);
  },
  clear() {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  },
};

export const adminApiBaseUrl = API_BASE_URL;
