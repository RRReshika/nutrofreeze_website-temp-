const ACCESS_TOKEN_KEY = "neutrofreeze_access_token";
const REFRESH_TOKEN_KEY = "neutrofreeze_refresh_token";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export type AuthResponse = {
  customer: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type AuthenticatedCustomer = {
  id: string;
  email: string;
  phone?: string | null;
  createdAt?: string;
  loyaltyAccount?: {
    customerId: string;
    pointsBalance: number;
    tier: string;
  } | null;
  cart?: {
    id: string;
    itemCount: number;
    subtotal: number;
    items: Array<{
      id: string;
      variantId: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      product: {
        id: string;
        title: string;
        slug?: string;
        image?: string;
      };
      variant: {
        id: string;
        title: string;
        sku: string;
        weightGrams?: number | null;
        currency?: string | null;
      };
    }>;
  } | null;
  wishlist?: Array<{
    id: string;
    productId: string;
    product: {
      id: string;
      title: string;
      slug?: string;
      images?: Array<{ url: string }>;
    };
  }>;
};

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
