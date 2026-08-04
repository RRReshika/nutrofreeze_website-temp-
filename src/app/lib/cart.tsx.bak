import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authStorage } from "./auth";
import { useAuth } from "./auth-context";

const CART_STORAGE_KEY = "neutrofreeze_cart";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const PRODUCT_IMAGE_MAP: [RegExp, string][] = [
  [/custard\s*apple/i, "/images/Custard%20apple/PC%20Custard%20apple.png"],
  [/black\s*jamun/i, "/images/Jamun/PC%20Jamun.png"],
  [/jamun/i, "/images/Jamun/PC%20Jamun.png"],
  [/chikoo|sapota/i, "/images/Chikoo/PC%20chikoo%20.png"],
  [/pink.*guava|white.*guava|guava/i, "/images/Guava/PC%20Pink%20guava.png"],
  [/jackfruit|jack\s*fruit/i, "/images/Jack%20Fruit/PC%20Jackfruit%20.png"],
  [/blueberry/i, "/images/Blueberry/PC%20Blueberry.png"],
  [/strawberry/i, "/images/Strawberry/PC%20strawberry.png"],
  [/raspberry/i, "/images/Raspberry/PC%20raspberry.png"],
  [/pineapple/i, "/images/Pineapple/PC%20Pineapple.png"],
  [/papaya/i, "/images/Papaya/PC%20papaya%20.png"],
  [/kiwi/i, "/images/Kiwi/PC%20Kiwi.png"],
  [/mango/i, "/images/Mango/PC%20Mango.png"],
  [/banana/i, "/images/Banana/PC%20Banana.png"],
  [/amla|gooseberry/i, "/images/Amla/PC%20Amla.png"],
  [/bitter\s*gourd/i, "/images/Bitter%20gourd/PC%20Bitter%20guord.png"],
  [/green\s*pea/i, "/images/GREEN%20Peas/PC%20Green%20peas%20.png"],
  [/green\s*bell|green\s*pepper|capsicum/i, "/images/_GREEN%20Bellpepper/PC%20green%20bell%20pepper.png"],
  [/red\s*bell|red\s*pepper/i, "/images/red%20Bellpepper/PC%20red%20bell%20pepper.png"],
  [/sweet\s*potato/i, "/images/Potato/PC%20potato%20.png"],
  [/potato/i, "/images/Potato/PC%20potato%20.png"],
  [/carrot/i, "/images/Carrot/PC%20Carrot.png"],
  [/corn/i, "/images/corn/PC%20corn.png"],
  [/zucchini/i, "/images/zucchini/PC%20zucchini.png"],
  [/apple/i, "/images/APPLE/PC%20Apple%20.png"],
];

export function resolveProductImage(title: string, serverImage?: string | null): string {
  // Always prefer local mapped images — server URLs are often null or point to nowhere
  for (const [regex, path] of PRODUCT_IMAGE_MAP) {
    if (regex.test(title)) return path;
  }
  if (serverImage && !serverImage.includes("unsplash.com")) return serverImage;
  return "";
}

type CartProduct = {
  id: string;
  title: string;
  slug?: string;
  image: string;
};

type CartVariant = {
  id: string;
  title: string;
  sku: string;
  weightGrams?: number | null;
  currency?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: CartProduct;
  variant: CartVariant;
};

export type CartSnapshot = {
  id: string | null;
  customerId: string | null;
  itemCount: number;
  subtotal: number;
  items: CartItem[];
};

export type AddToCartInput = {
  productId: string;
  productTitle: string;
  productSlug?: string;
  variantId: string;
  variantTitle: string;
  variantSku: string;
  unitPrice: number;
  currency?: string;
  image: string;
  weightGrams?: number | null;
};

type CartContextValue = {
  cart: CartSnapshot;
  isReady: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: AddToCartInput, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const emptyCart = (): CartSnapshot => ({
  id: null,
  customerId: null,
  itemCount: 0,
  subtotal: 0,
  items: [],
});

const normalizeCart = (payload: any): CartSnapshot => {
  if (!payload) return emptyCart();

  const items: CartItem[] = Array.isArray(payload.items)
    ? payload.items.map((item: any) => ({
      id: item.id,
      productId: item.product?.id || item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice ?? item.variant?.price ?? 0),
      lineTotal: Number(item.lineTotal ?? Number(item.unitPrice ?? item.variant?.price ?? 0) * item.quantity),
      product: {
        id: item.product?.id || item.productId,
        title: item.product?.title || item.productTitle || "Product",
        slug: item.product?.slug,
        image: resolveProductImage(
          item.product?.title || item.productTitle || "",
          item.product?.image || item.product?.images?.[0]?.url || item.image,
        ),
      },
      variant: {
        id: item.variant?.id || item.variantId,
        title: item.variant?.title || item.variantTitle || "Variant",
        sku: item.variant?.sku || item.variantSku || "",
        weightGrams: item.variant?.weightGrams,
        currency: item.variant?.currency,
      },
    }))
    : [];

  const itemCount = typeof payload.itemCount === "number"
    ? payload.itemCount
    : items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = typeof payload.subtotal === "number"
    ? payload.subtotal
    : items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: payload.id ?? null,
    customerId: payload.customerId ?? null,
    itemCount,
    subtotal,
    items,
  };
};

const readStoredCart = (): CartSnapshot | null => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? normalizeCart(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeStoredCart = (cart: CartSnapshot) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const mergeItem = (cart: CartSnapshot, input: AddToCartInput, quantity: number) => {
  const existing = cart.items.find((item) => item.variantId === input.variantId);
  const nextItems = existing
    ? cart.items.map((item) =>
      item.variantId === input.variantId
        ? {
          ...item,
          quantity: item.quantity + quantity,
          lineTotal: Number((item.unitPrice * (item.quantity + quantity)).toFixed(2)),
        }
        : item,
    )
    : [
      ...cart.items,
      {
        id: `${input.variantId}-${Date.now()}`,
        productId: input.productId,
        variantId: input.variantId,
        quantity,
        unitPrice: input.unitPrice,
        lineTotal: Number((input.unitPrice * quantity).toFixed(2)),
        product: {
          id: input.productId,
          title: input.productTitle,
          slug: input.productSlug,
          image: input.image,
        },
        variant: {
          id: input.variantId,
          title: input.variantTitle,
          sku: input.variantSku,
          weightGrams: input.weightGrams,
          currency: input.currency,
        },
      },
    ];

  const subtotal = nextItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    ...cart,
    items: nextItems,
    itemCount: nextItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [cart, setCart] = useState<CartSnapshot>(emptyCart);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const stored = readStoredCart();
    if (stored && !user) {
      setCart(stored);
    }

    const accessToken = authStorage.getAccessToken();
    if (!accessToken || !user) {
      setIsReady(true);
      return;
    }

    const loadServerCart = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.cart) {
            setCart(normalizeCart(data.cart));
          }
        }
      } catch {
        if (!stored) {
          setCart(emptyCart());
        }
      } finally {
        setIsReady(true);
      }
    };

    void loadServerCart();
  }, [user, isAuthLoading]);

  useEffect(() => {
    if (!isReady) return;
    writeStoredCart(cart);
  }, [cart, isReady]);

  const applyLocalUpdate = (updater: (current: CartSnapshot) => CartSnapshot) => {
    setCart((current) => updater(current));
  };

  const addItem = async (input: AddToCartInput, quantity = 1) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken || !user) {
      throw new Error("User must be logged in to add items to cart");
    }

    const response = await fetch(`${API_BASE_URL}/customers/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ variantId: input.variantId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Unable to add item to cart");
    }

    setCart(normalizeCart(await response.json()));
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken || !user) {
      throw new Error("User must be logged in to update cart");
    }

    const response = await fetch(`${API_BASE_URL}/customers/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ variantId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Unable to update cart item");
    }

    setCart(normalizeCart(await response.json()));
  };

  const removeItem = async (variantId: string) => {
    await updateQuantity(variantId, 0);
  };

  const clearCart = async () => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken || !user) {
      setCart(emptyCart());
      return;
    }

    const response = await fetch(`${API_BASE_URL}/customers/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to clear cart");
    }

    setCart(normalizeCart(await response.json()));
  };

  const value = useMemo<CartContextValue>(() => ({
    cart,
    isReady,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((current) => !current),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [cart, isReady, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
