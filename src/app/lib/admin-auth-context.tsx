import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminApiBaseUrl, adminAuthStorage, type AdminAuthResponse, type AdminUser } from "./admin-auth";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<AdminUser | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const clearAdminState = () => {
  adminAuthStorage.clear();
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateAdmin = async (accessToken?: string) => {
    const token = accessToken || adminAuthStorage.getAccessToken();
    if (!token) {
      setAdmin(null);
      return null;
    }

    const response = await fetch(`${adminApiBaseUrl}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Unable to load admin session (${response.status})`);
    }

    const data = (await response.json()) as AdminUser;
    setAdmin(data);
    return data;
  };

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      try {
        const token = adminAuthStorage.getAccessToken();
        if (!token) {
          if (isActive) setAdmin(null);
          return;
        }

        await hydrateAdmin(token);
      } catch {
        clearAdminState();
        if (isActive) setAdmin(null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${adminApiBaseUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Unable to log in");
    }

    const auth = data as AdminAuthResponse;
    adminAuthStorage.setToken(auth.accessToken);
    setAdmin(auth.admin);
  };

  const logout = async () => {
    clearAdminState();
    setAdmin(null);
  };

  const value = useMemo<AdminAuthContextValue>(() => ({
    admin,
    isLoading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
    refreshAdmin: async () => {
      try {
        return await hydrateAdmin();
      } catch {
        clearAdminState();
        setAdmin(null);
        return null;
      }
    },
  }), [admin, isLoading]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
