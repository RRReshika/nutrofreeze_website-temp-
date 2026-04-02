import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE_URL, authStorage, type AuthResponse, type AuthenticatedCustomer } from "./auth";

type AuthContextValue = {
  user: AuthenticatedCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: { email: string; password: string; phone?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthenticatedCustomer | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const clearAuthState = () => {
  authStorage.clear();
};

const normalizeError = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = async (accessToken?: string) => {
    const token = accessToken || authStorage.getAccessToken();
    if (!token) {
      setUser(null);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/customers/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Unable to load session (${response.status})`);
    }

    const data = (await response.json()) as AuthenticatedCustomer;
    setUser(data);
    return data;
  };

  const refreshSession = async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      clearAuthState();
      setUser(null);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/customers/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Unable to refresh session (${response.status})`);
    }

    const data = (await response.json()) as AuthResponse;
    authStorage.setTokens(data.accessToken, data.refreshToken);
    return hydrateUser(data.accessToken);
  };

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      try {
        const accessToken = authStorage.getAccessToken();
        if (!accessToken) {
          if (isActive) setUser(null);
          return;
        }

        await hydrateUser(accessToken);
      } catch {
        try {
          await refreshSession();
        } catch {
          clearAuthState();
          if (isActive) setUser(null);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/customers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Unable to log in");
    }

    const auth = data as AuthResponse;
    authStorage.setTokens(auth.accessToken, auth.refreshToken);
    await hydrateUser(auth.accessToken);
  };

  const signUp = async (input: { email: string; password: string; phone?: string }) => {
    const response = await fetch(`${API_BASE_URL}/customers/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Unable to sign up");
    }

    const auth = data as AuthResponse;
    authStorage.setTokens(auth.accessToken, auth.refreshToken);
    await hydrateUser(auth.accessToken);
  };

  const signOut = async () => {
    const refreshToken = authStorage.getRefreshToken();

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/customers/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // ignore logout network failures and clear locally
      }
    }

    clearAuthState();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    signIn,
    signUp,
    signOut,
    refreshUser: async () => {
      try {
        return await hydrateUser();
      } catch {
        try {
          return await refreshSession();
        } catch {
          clearAuthState();
          setUser(null);
          return null;
        }
      }
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
