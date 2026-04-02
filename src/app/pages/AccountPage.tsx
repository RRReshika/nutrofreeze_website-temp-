import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, LogOut, Mail, MapPin, ShoppingBag, Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../lib/auth-context";
import { API_BASE_URL, authStorage } from "../lib/auth";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: string;
    title: string;
    slug: string;
    image?: string | null;
    category?: { id: string; name: string; slug: string } | null;
  };
  variant: {
    id: string;
    title: string;
    sku: string;
    weightGrams?: number | null;
  };
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  paymentStatus: string | null;
  items: OrderItem[];
};

export function AccountPage() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        const response = await fetch(`${API_BASE_URL}/customers/orders`, {
          headers: {
            Authorization: `Bearer ${authStorage.getAccessToken() || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load orders (${response.status})`);
        }

        const data = (await response.json()) as Order[];
        if (isActive) {
          setOrders(data);
        }
      } catch {
        if (isActive) {
          setOrders([]);
        }
      } finally {
        if (isActive) {
          setOrdersLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">Checking your account...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Account</p>
            <h1 className="mt-4 text-4xl font-black text-slate-950" style={{ fontFamily: "'Syne', sans-serif" }}>Sign in to view your profile.</h1>
            <p className="mt-4 max-w-xl text-slate-600">Your cart, orders, and wishlist sync after you sign in.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signin" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white no-underline">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="relative overflow-hidden bg-[#0f172a] px-8 py-10 text-white sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(94,234,212,0.25),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(124,58,237,0.22),_transparent_40%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">Your account</p>
                <h1 className="mt-4 text-4xl font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{displayName}</h1>
                <div className="mt-4 flex items-center gap-2 text-white/80">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate("/", { replace: true });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid gap-6 p-8 lg:grid-cols-[1fr_1fr] lg:p-10">
            <section className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700"><MapPin size={14} /> Profile</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white p-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</span>
                  <span className="mt-1 block text-base font-semibold text-slate-950">{displayName}</span>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</span>
                  <span className="mt-1 block text-base font-semibold text-slate-950">{user.email}</span>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</span>
                  <span className="mt-1 block text-base font-semibold text-slate-950">{user.phone || "Not provided"}</span>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Loyalty points</span>
                  <span className="mt-1 block text-base font-semibold text-slate-950">{user.loyaltyAccount?.pointsBalance ?? 0}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700"><Heart size={14} /> Wishlist</p>
              {user.wishlist?.length ? (
                <div className="mt-4 space-y-3">
                  {user.wishlist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                      <img src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=100&q=80"} alt={item.product.title} className="h-14 w-14 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.product.title}</p>
                        <p className="text-xs text-slate-500">Saved to wishlist</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-600">Your wishlist is empty.</div>
              )}
            </section>
          </div>

          <div className="border-t border-slate-200 p-8 lg:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700"><ShoppingBag size={14} /> Order history</p>
            {ordersLoading ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No orders yet.</div>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-950">{order.currency} {order.total.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">{order.status}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-2xl bg-white p-3">
                          <img src={item.product.image || "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=80&q=80"} alt={item.product.title} className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{item.product.title}</p>
                            <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
