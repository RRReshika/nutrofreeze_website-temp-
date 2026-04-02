import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight, Box, ClipboardList, Layers3, LogOut, Package, Pencil, Plus, RefreshCcw, Shield, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAdminAuth } from "../../lib/admin-auth-context";
import { adminApiBaseUrl, adminAuthStorage } from "../../lib/admin-auth";

type AdminCategory = { id: string; name: string; slug: string; sortOrder: number };
type AdminCustomer = { id: string; email: string; phone: string | null; createdAt: string; updatedAt: string; orderCount: number; wishlistCount: number };

type DashboardStats = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  inventoryCount: number;
  reservedCount: number;
  lowStockCount: number;
  recentOrders: Array<{ id: string; orderNumber: string; status: string; total: number; currency: string; createdAt: string; paymentStatus: string | null; itemCount: number }>;
};

type ProductVariant = { id: string; title: string; sku: string; price: number; currency: string; weightGrams?: number | null; inventory?: { onHand: number; reserved: number } | null };
type AdminProduct = { id: string; slug: string; title: string; description?: string | null; formFactor?: string | null; status: string; category?: { id: string; name: string; slug: string } | null; images: Array<{ url: string; alt?: string | null; sortOrder: number }>; primaryVariant: ProductVariant | null; variants: ProductVariant[] };
type AdminInventory = { variantId: string; onHand: number; reserved: number; lowStock: boolean; updatedAt: string; variant: ProductVariant; product: { id: string; title: string; slug: string; category?: { id: string; name: string; slug: string } | null; image: string | null } };
type AdminOrder = { id: string; orderNumber: string; status: string; total: number; currency: string; guestEmail: string | null; customerEmail: string | null; createdAt: string; paymentStatus: string | null; items: Array<{ productTitle: string; variantTitle: string; quantity: number; unitPrice: number; lineTotal: number }> };

type ProductFormState = {
  title: string;
  slug: string;
  description: string;
  formFactor: string;
  categoryId: string;
  status: string;
  variantTitle: string;
  sku: string;
  price: string;
  currency: string;
  weightGrams: string;
  onHand: string;
  imagesText: string;
};

type InventoryFormState = {
  variantId: string;
  onHand: string;
};

type OrderFormState = {
  orderId: string;
  status: string;
};

const SECTION_COPY = {
  overview: { label: "Dashboard", icon: Shield },
  products: { label: "Products", icon: Package },
  inventory: { label: "Inventory", icon: Box },
  orders: { label: "Orders", icon: ClipboardList },
  customers: { label: "Customers", icon: Layers3 },
} as const;

const STATUS_OPTIONS = ["DRAFT", "ACTIVE", "ARCHIVED"];
const ORDER_STATUS_OPTIONS = ["PENDING_PAYMENT", "PAID", "FULFILLING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const emptyProductForm = (categoryId = ""): ProductFormState => ({
  title: "",
  slug: "",
  description: "",
  formFactor: "",
  categoryId,
  status: "ACTIVE",
  variantTitle: "Default",
  sku: "",
  price: "",
  currency: "SGD",
  weightGrams: "",
  onHand: "0",
  imagesText: "",
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[()\/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const API_BASE_URL = adminApiBaseUrl;

async function adminFetch<T>(path: string, options: RequestInit = {}) {
  const token = adminAuthStorage.getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const rawMessage = typeof payload?.message === "string" ? payload.message : `Request failed (${response.status})`;
    const friendlyMessage = rawMessage.includes("Cannot GET")
      ? "Admin data endpoint is unavailable right now"
      : rawMessage;

    throw new Error(friendlyMessage);
  }

  return payload as T;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { admin, isLoading, logout } = useAdminAuth();
  const [section, setSection] = useState<keyof typeof SECTION_COPY>("overview");
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [inventory, setInventory] = useState<AdminInventory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm());
  const [inventoryForm, setInventoryForm] = useState<InventoryFormState>({ variantId: "", onHand: "0" });
  const [orderForm, setOrderForm] = useState<OrderFormState>({ orderId: "", status: "PENDING_PAYMENT" });

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate("/admin/login", { replace: true });
    }
  }, [admin, isLoading, navigate]);

  const loadData = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsPageLoading(true);
    }
    try {
      const [dashboardData, productsData, inventoryData, ordersData, categoriesData] = await Promise.all([
        adminFetch<DashboardStats>("/admin/dashboard"),
        adminFetch<{ products: AdminProduct[] }>("/admin/products"),
        adminFetch<{ items: AdminInventory[] }>("/admin/inventory"),
        adminFetch<{ orders: AdminOrder[] }>("/admin/orders"),
        fetch(`${API_BASE_URL}/catalog/categories`).then(async (response) => {
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.message || `Request failed (${response.status})`);
          return payload as AdminCategory[];
        }),
      ]);

      const customersResponse = await fetch(`${API_BASE_URL}/admin/customers`, {
        headers: {
          Authorization: `Bearer ${adminAuthStorage.getAccessToken() || ""}`,
        },
      });

      if (customersResponse.ok) {
        const customersPayload = (await customersResponse.json()) as { customers: AdminCustomer[] };
        setCustomers(customersPayload.customers);
      } else {
        setCustomers([]);
        if (!options?.silent) {
          toast.error("Customer list could not load right now");
        }
      }

      setDashboard(dashboardData);
      setProducts(productsData.products);
      setInventory(inventoryData.items);
      setOrders(ordersData.orders);
      setCategories(categoriesData);
      if (!productForm.categoryId && categoriesData[0]) {
        setProductForm((current) => ({ ...current, categoryId: categoriesData[0].id }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load admin data";
      if (!options?.silent) {
        toast.error(message);
      }
    } finally {
      if (!options?.silent) {
        setIsPageLoading(false);
      }
    }
  };

  useEffect(() => {
    if (admin) {
      void loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  useEffect(() => {
    if (!admin) {
      return;
    }

    let cancelled = false;

    const refreshNow = async () => {
      if (cancelled) {
        return;
      }

      await loadData({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshNow();
      }
    };

    const handleFocus = () => {
      void refreshNow();
    };

    const intervalId = window.setInterval(() => {
      void refreshNow();
    }, 30000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm(categories[0]?.id || ""));
    setProductDialogOpen(true);
  };

  const openEditProduct = (product: AdminProduct) => {
    const primaryVariant = product.primaryVariant || product.variants[0] || null;
    setEditingProductId(product.id);
    setProductForm({
      title: product.title,
      slug: product.slug,
      description: product.description || "",
      formFactor: product.formFactor || "",
      categoryId: product.category?.id || categories[0]?.id || "",
      status: product.status,
      variantTitle: primaryVariant?.title || "Default",
      sku: primaryVariant?.sku || slugify(product.slug),
      price: primaryVariant ? String(primaryVariant.price) : "",
      currency: primaryVariant?.currency || "SGD",
      weightGrams: primaryVariant?.weightGrams ? String(primaryVariant.weightGrams) : "",
      onHand: primaryVariant?.inventory?.onHand !== undefined ? String(primaryVariant.inventory.onHand) : "0",
      imagesText: product.images.map((image) => image.url).join("\n"),
    });
    setProductDialogOpen(true);
  };

  const submitProduct = async () => {
    if (!productForm.title.trim() || !productForm.categoryId || !productForm.price) {
      toast.error("Product title, category, and price are required");
      return;
    }

    const payload = {
      title: productForm.title.trim(),
      slug: productForm.slug.trim() || slugify(productForm.title),
      description: productForm.description.trim() || undefined,
      formFactor: productForm.formFactor.trim() || undefined,
      categoryId: productForm.categoryId,
      status: productForm.status,
      variant: {
        title: productForm.variantTitle.trim() || productForm.title.trim(),
        sku: productForm.sku.trim() || slugify(productForm.title),
        price: Number(productForm.price),
        currency: productForm.currency.trim() || "SGD",
        weightGrams: productForm.weightGrams ? Number(productForm.weightGrams) : undefined,
        onHand: productForm.onHand ? Number(productForm.onHand) : 0,
      },
      images: productForm.imagesText
        .split(/\n|,/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map((url, index) => ({ url, sortOrder: index })),
    };

    setIsSaving(true);
    try {
      if (editingProductId) {
        await adminFetch(`/admin/products/${editingProductId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Product updated");
      } else {
        await adminFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Product created");
      }

      setProductDialogOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (product: AdminProduct) => {
    const confirmed = window.confirm(`Delete ${product.title}? This cannot be undone.`);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await adminFetch(`/admin/products/${product.id}`, { method: "DELETE" });
      toast.success("Product deleted");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product");
    } finally {
      setIsSaving(false);
    }
  };

  const openInventoryDialog = (item: AdminInventory) => {
    setInventoryForm({ variantId: item.variantId, onHand: String(item.onHand) });
    setInventoryDialogOpen(true);
  };

  const submitInventory = async () => {
    if (!inventoryForm.variantId) return;

    setIsSaving(true);
    try {
      await adminFetch(`/admin/inventory/${inventoryForm.variantId}`, {
        method: "PUT",
        body: JSON.stringify({ onHand: Number(inventoryForm.onHand) }),
      });
      toast.success("Inventory updated");
      setInventoryDialogOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update inventory");
    } finally {
      setIsSaving(false);
    }
  };

  const openOrderDialog = (order: AdminOrder) => {
    setOrderForm({ orderId: order.id, status: order.status });
    setOrderDialogOpen(true);
  };

  const submitOrderStatus = async () => {
    if (!orderForm.orderId) return;

    setIsSaving(true);
    try {
      await adminFetch(`/admin/orders/${orderForm.orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: orderForm.status }),
      });
      toast.success("Order status updated");
      setOrderDialogOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order status");
    } finally {
      setIsSaving(false);
    }
  };

  const overviewCards = useMemo(() => ([
    { label: "Total Products", value: dashboard?.totalProducts ?? 0, icon: Package },
    { label: "Total Orders", value: dashboard?.totalOrders ?? 0, icon: ClipboardList },
    { label: "Total Customers", value: dashboard?.totalCustomers ?? 0, icon: Layers3 },
    { label: "Low Stock Items", value: dashboard?.lowStockCount ?? 0, icon: TriangleAlert },
  ]), [dashboard]);

  if (isLoading || (!admin && !isLoading)) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f0e8] text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}>
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600">Loading admin session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}>
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-black/5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a78bfa]">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {admin?.firstName}.
            </h1>
            <p className="mt-2 text-sm text-slate-600">Secure catalog control for products, stock, and order operations.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-400/50 hover:bg-teal-50"
            >
              <RefreshCcw size={15} />
              Refresh
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate("/admin/login", { replace: true });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl shadow-black/5">
            <div className="space-y-2">
              {(Object.entries(SECTION_COPY) as Array<[keyof typeof SECTION_COPY, typeof SECTION_COPY[keyof typeof SECTION_COPY]]>).map(([key, copy]) => {
                const Icon = copy.icon;
                const active = section === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSection(key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? "bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white" : "bg-slate-50 text-slate-800 hover:bg-slate-100"}`}
                  >
                    <Icon size={17} />
                    <span className="text-sm font-semibold">{copy.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Access</p>
              <p className="mt-3 text-sm text-slate-700">Roles: {admin?.roles.join(", ")}</p>
              <p className="mt-2 text-sm text-slate-700">Permissions: {admin?.permissions.length ?? 0}</p>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} className="border-slate-200 bg-white text-slate-900">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</CardTitle>
                      <Icon size={16} className="text-[#7c3aed]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-black tracking-tight">{card.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {section === "overview" && dashboard && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="border-slate-200 bg-white text-slate-900">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">System snapshot</CardTitle>
                    <CardDescription className="text-slate-600">Live stats from the catalog, stock, and paid orders.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Total categories</p>
                      <p className="mt-2 text-3xl font-black">{dashboard.totalCategories}</p>
                    </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Reserved stock</p>
                      <p className="mt-2 text-3xl font-black">{dashboard.reservedCount}</p>
                    </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Total customers</p>
                      <p className="mt-2 text-3xl font-black">{dashboard.totalCustomers}</p>
                    </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Revenue from paid orders</p>
                      <p className="mt-2 text-3xl font-black">${dashboard.totalRevenue.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                  <Card className="border-slate-200 bg-white text-slate-900">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">Recent orders</CardTitle>
                      <CardDescription className="text-slate-600">Latest customer activity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dashboard.recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#7c3aed]">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {section === "products" && (
              <Card className="border-slate-200 bg-white text-slate-900">
                <CardHeader className="flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black">Product management</CardTitle>
                    <CardDescription className="text-slate-600">Create, edit, and remove catalog items.</CardDescription>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateProduct}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    <Plus size={15} />
                    New product
                  </button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Image</TableHead>
                        <TableHead className="text-slate-500">Product</TableHead>
                        <TableHead className="text-slate-500">Category</TableHead>
                        <TableHead className="text-slate-500">Price</TableHead>
                        <TableHead className="text-slate-500">Stock</TableHead>
                        <TableHead className="text-slate-500">Status</TableHead>
                        <TableHead className="text-slate-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const primaryVariant = product.primaryVariant || product.variants[0];
                        const imageUrl = product.images[0]?.url || "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=120&q=80";
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img src={imageUrl} alt={product.title} className="h-14 w-14 rounded-2xl border border-slate-200 object-cover" />
                            </TableCell>
                            <TableCell className="text-slate-900">
                              <div>
                                <p className="font-semibold">{product.title}</p>
                                <p className="text-xs text-slate-500">{product.slug}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-700">{product.category?.name || "Uncategorized"}</TableCell>
                            <TableCell className="text-slate-700">{primaryVariant ? `${primaryVariant.currency} ${primaryVariant.price.toFixed(2)}` : "-"}</TableCell>
                            <TableCell className="text-slate-700">{primaryVariant?.inventory?.onHand ?? 0}</TableCell>
                            <TableCell className="text-slate-700">{product.status}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => openEditProduct(product)} className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-100">
                                  <Pencil size={14} />
                                </button>
                                <button type="button" onClick={() => deleteProduct(product)} className="rounded-full border border-rose-500/20 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {isPageLoading && <p className="mt-4 text-sm text-slate-500">Loading products...</p>}
                </CardContent>
              </Card>
            )}

            {section === "inventory" && (
              <Card className="border-slate-200 bg-white text-slate-900">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Inventory management</CardTitle>
                  <CardDescription className="text-slate-600">Monitor stock levels and adjust counts for each variant.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Product</TableHead>
                        <TableHead className="text-slate-500">Variant</TableHead>
                        <TableHead className="text-slate-500">On hand</TableHead>
                        <TableHead className="text-slate-500">Reserved</TableHead>
                        <TableHead className="text-slate-500">Low stock</TableHead>
                        <TableHead className="text-slate-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.variantId}>
                          <TableCell className="text-slate-900">
                            <div>
                              <p className="font-semibold">{item.product.title}</p>
                              <p className="text-xs text-slate-500">{item.product.category?.name || "Uncategorized"}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">{item.variant.title}</TableCell>
                          <TableCell>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.onHand < 10 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                              {item.onHand}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-700">{item.reserved}</TableCell>
                          <TableCell>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.lowStock ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                              {item.lowStock ? "Low stock" : "Healthy"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button type="button" onClick={() => openInventoryDialog(item)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#6d28d9]">
                              <ArrowUpRight size={14} />
                              Adjust
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {section === "orders" && (
              <Card className="border-slate-200 bg-white text-slate-900">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Order monitoring</CardTitle>
                  <CardDescription className="text-slate-600">Review every customer order and move fulfillment forward.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Order</TableHead>
                        <TableHead className="text-slate-500">Customer</TableHead>
                        <TableHead className="text-slate-500">Total</TableHead>
                        <TableHead className="text-slate-500">Status</TableHead>
                        <TableHead className="text-slate-500">Payment</TableHead>
                        <TableHead className="text-slate-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="text-slate-900">
                            <div>
                              <p className="font-semibold">{order.orderNumber}</p>
                              <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">{order.customerEmail || order.guestEmail || "Guest"}</TableCell>
                          <TableCell className="text-slate-700">{order.currency} {order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-slate-700">{order.status}</TableCell>
                          <TableCell className="text-slate-700">{order.paymentStatus || "Pending"}</TableCell>
                          <TableCell>
                            <button type="button" onClick={() => openOrderDialog(order)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#6d28d9]">
                              <Pencil size={14} />
                              Update
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {section === "customers" && (
              <Card className="border-slate-200 bg-white text-slate-900">
                <CardHeader className="flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black">Customer view</CardTitle>
                    <CardDescription className="text-slate-600">List of customers with order counts for quick oversight.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Email</TableHead>
                        <TableHead className="text-slate-500">Phone</TableHead>
                        <TableHead className="text-slate-500">Orders</TableHead>
                        <TableHead className="text-slate-500">Wishlist</TableHead>
                        <TableHead className="text-slate-500">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="text-slate-900 font-semibold">{customer.email}</TableCell>
                          <TableCell className="text-slate-700">{customer.phone || "-"}</TableCell>
                          <TableCell className="text-slate-700">{customer.orderCount}</TableCell>
                          <TableCell className="text-slate-700">{customer.wishlistCount}</TableCell>
                          <TableCell className="text-slate-700">{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {customers.length === 0 && <p className="mt-4 text-sm text-slate-500">No customers found.</p>}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-white text-slate-900 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{editingProductId ? "Edit product" : "Create product"}</DialogTitle>
            <DialogDescription className="text-slate-600">Manage the main product fields, its first variant, and image URLs.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <Input value={productForm.title} onChange={(event) => setProductForm((current) => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value), sku: current.sku || slugify(event.target.value) }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Slug</span>
              <Input value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <Select value={productForm.categoryId} onValueChange={(value) => setProductForm((current) => ({ ...current, categoryId: value }))}>
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <Textarea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} className="min-h-28 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Status</span>
              <Select value={productForm.status} onValueChange={(value) => setProductForm((current) => ({ ...current, status: value }))}>
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Form factor</span>
              <Input value={productForm.formFactor} onChange={(event) => setProductForm((current) => ({ ...current, formFactor: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Variant title</span>
              <Input value={productForm.variantTitle} onChange={(event) => setProductForm((current) => ({ ...current, variantTitle: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">SKU</span>
              <Input value={productForm.sku} onChange={(event) => setProductForm((current) => ({ ...current, sku: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Price</span>
              <Input type="number" step="0.01" min="0" value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Currency</span>
              <Input value={productForm.currency} onChange={(event) => setProductForm((current) => ({ ...current, currency: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Weight (grams)</span>
              <Input type="number" min="0" value={productForm.weightGrams} onChange={(event) => setProductForm((current) => ({ ...current, weightGrams: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Starting stock</span>
              <Input type="number" min="0" value={productForm.onHand} onChange={(event) => setProductForm((current) => ({ ...current, onHand: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Image URLs</span>
              <Textarea value={productForm.imagesText} onChange={(event) => setProductForm((current) => ({ ...current, imagesText: event.target.value }))} placeholder="One URL per line" className="min-h-28 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
            </label>
          </div>

          <DialogFooter>
            <button type="button" onClick={() => setProductDialogOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={() => void submitProduct()} disabled={isSaving} className="rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? "Saving..." : "Save product"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inventoryDialogOpen} onOpenChange={setInventoryDialogOpen}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Update inventory</DialogTitle>
            <DialogDescription className="text-slate-600">Set the current on-hand count for the selected variant.</DialogDescription>
          </DialogHeader>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">On-hand quantity</span>
            <Input type="number" min="0" value={inventoryForm.onHand} onChange={(event) => setInventoryForm((current) => ({ ...current, onHand: event.target.value }))} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
          </label>
          <DialogFooter>
            <button type="button" onClick={() => setInventoryDialogOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={() => void submitInventory()} disabled={isSaving} className="rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? "Saving..." : "Update stock"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Update order status</DialogTitle>
            <DialogDescription className="text-slate-600">Move the order through the fulfillment pipeline.</DialogDescription>
          </DialogHeader>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <Select value={orderForm.status} onValueChange={(value) => setOrderForm((current) => ({ ...current, status: value }))}>
              <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-slate-900">
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <DialogFooter>
            <button type="button" onClick={() => setOrderDialogOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={() => void submitOrderStatus()} disabled={isSaving} className="rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
              {isSaving ? "Saving..." : "Save status"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
