import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut, Mail, ShoppingBag, Heart, Pencil, Check, X, Camera, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "../components/Navbar";
import { resolveProductImage } from "../lib/cart";
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
  const { user, isLoading, signOut, refreshUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.displayName || "");
      setEditPhone(user.phone || "");
      setEditAvatar(user.avatarUrl || "");
    }
  }, [user]);

  useEffect(() => {
    let isActive = true;
    const loadOrders = async () => {
      if (!user) { setOrders([]); setOrdersLoading(false); return; }
      try {
        setOrdersLoading(true);
        const response = await fetch(`${API_BASE_URL}/customers/orders`, {
          headers: { Authorization: `Bearer ${authStorage.getAccessToken() || ""}` },
        });
        if (!response.ok) throw new Error(`Unable to load orders (${response.status})`);
        const data = (await response.json()) as Order[];
        if (isActive) setOrders(data);
      } catch {
        if (isActive) setOrders([]);
      } finally {
        if (isActive) setOrdersLoading(false);
      }
    };
    void loadOrders();
    return () => { isActive = false; };
  }, [user]);

  const startEdit = () => {
    setEditName(user?.displayName || "");
    setEditPhone(user?.phone || "");
    setEditAvatar(user?.avatarUrl || "");
    setSaveError("");
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setSaveError(""); };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`${API_BASE_URL}/customers/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStorage.getAccessToken() || ""}`,
        },
        body: JSON.stringify({
          displayName: editName.trim() || null,
          phone: editPhone.trim() || null,
          avatarUrl: editAvatar.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      await refreshUser?.();
      setEditing(false);
    } catch {
      setSaveError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Convert uploaded file to base64 data URL for avatar preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setEditAvatar(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

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
            <h1 className="mt-4 text-4xl font-black text-slate-950" style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(52px, 8vw, 80px)", letterSpacing: "2px" }}>SIGN IN TO VIEW YOUR PROFILE</h1>
            <p className="mt-4 max-w-xl text-slate-600">Your cart, orders, and wishlist sync after you sign in.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signin" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white no-underline">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.displayName || user.email.split("@")[0];
  const avatarSrc = user.avatarUrl || "";

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden">

          {/* ── Hero banner ── */}
          <div className="relative overflow-hidden px-8 py-10 text-white sm:px-10" style={{ backgroundColor: "#231F20" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(0,178,169,0.3) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(157,124,206,0.2) 0%, transparent 40%)", pointerEvents: "none" }} />
            {[{ top: "10%", left: "4%", s: 26, d: 0 }, { top: "30%", right: "18%", s: 16, d: 0.6 }, { bottom: "15%", left: "30%", s: 18, d: 1.0 }, { bottom: "8%", right: "5%", s: 22, d: 0.3 }].map((sp, i) => (
              <motion.div key={i} style={{ position: "absolute", top: sp.top, left: (sp as any).left, right: (sp as any).right, bottom: sp.bottom, width: sp.s, height: sp.s, zIndex: 3, pointerEvents: "none" }}
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, scale: { duration: 3.5, repeat: Infinity, delay: sp.d, ease: "easeInOut" } }}>
                <svg viewBox="0 0 47 47" fill="white" opacity={0.4}><path d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z" /></svg>
              </motion.div>
            ))}
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white/20 bg-teal-700 flex items-center justify-center">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      <span style={{ fontFamily: "'Bangers', cursive", fontSize: "32px", color: "white", letterSpacing: "1px" }}>
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your account</p>
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(36px, 6vw, 70px)", lineHeight: 0.95, letterSpacing: "2px", margin: "8px 0" }}>
                    {displayName}
                  </motion.h1>
                  <div className="flex items-center gap-2 text-white/70">
                    <Mail size={14} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.div style={{ width: 80, height: 80, flexShrink: 0 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }}>
                  <svg viewBox="0 0 90 90" width={80} height={80}>
                    <circle cx="45" cy="45" r="43" fill="#00B2A9" />
                    <defs><path id="acct-spin" d="M 78,45 a 33,33 0 1,0 -66,0" /></defs>
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "45px 45px" }}>
                      <text fill="white" style={{ fontSize: "8.5px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "2px" } as React.CSSProperties}>
                        <textPath href="#acct-spin" startOffset="0%">NUTROFREEZE · PURE NUTRITION · SG ·&nbsp;</textPath>
                      </text>
                    </motion.g>
                    {[0, 45, 90, 135].map(a => <line key={a} x1="45" y1="35" x2="45" y2="55" stroke="white" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${a} 45 45)`} />)}
                    <circle cx="45" cy="45" r="4" fill="white" />
                  </svg>
                </motion.div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={startEdit}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                    <Pencil size={14} /> Edit Profile
                  </button>
                  <button type="button" onClick={async () => { await signOut(); navigate("/", { replace: true }); }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Edit Profile Modal ── */}
          <AnimatePresence>
            {editing && (
              <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl overflow-hidden"
                  initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                  <div className="px-7 pt-7 pb-3 flex items-center justify-between" style={{ backgroundColor: "#231F20" }}>
                    <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: "28px", letterSpacing: "1.5px", color: "white" }}>EDIT PROFILE</h2>
                    <button type="button" onClick={cancelEdit} className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                  </div>

                  <div className="p-7 space-y-5">
                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-200 bg-teal-700 flex items-center justify-center">
                          {editAvatar ? (
                            <img src={editAvatar} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <User size={36} color="white" />
                          )}
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 rounded-full bg-teal-600 p-2 shadow-md hover:bg-teal-700 transition-colors">
                          <Camera size={14} color="white" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </div>
                      {editAvatar && (
                        <button type="button" onClick={() => setEditAvatar("")} className="text-xs text-rose-500 hover:underline">Remove photo</button>
                      )}
                    </div>

                    {/* Display name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder={user.email.split("@")[0]}
                        maxLength={60}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+65 9XXX XXXX"
                        maxLength={20}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors"
                      />
                    </div>

                    {saveError && (
                      <p className="text-sm text-rose-600 bg-rose-50 rounded-2xl px-4 py-3">{saveError}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={cancelEdit}
                        className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button type="button" onClick={saveProfile} disabled={saving}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                        style={{ backgroundColor: "#00B2A9" }}>
                        {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Check size={16} />}
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Profile + Wishlist grid ── */}
          <div className="grid gap-6 p-8 lg:grid-cols-[1fr_1fr] lg:p-10">
            <section className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700"><User size={14} /> Profile</p>
                <button type="button" onClick={startEdit} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-colors">
                  <Pencil size={11} /> Edit
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
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
                  <span className="mt-1 block text-base font-semibold text-slate-950">{user.phone || "—"}</span>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Loyalty Points</span>
                  <span className="mt-1 block text-base font-semibold text-slate-950">{user.loyaltyAccount?.pointsBalance ?? 0}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-6">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700 mb-4"><Heart size={14} /> Wishlist</p>
              {user.wishlist?.length ? (
                <div className="space-y-3">
                  {user.wishlist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                      <img src={resolveProductImage(item.product.title, item.product.images?.[0]?.url)} alt={item.product.title} className="h-14 w-14 rounded-xl object-contain bg-[#f6f3eb]" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.product.title}</p>
                        <p className="text-xs text-slate-500">Saved to wishlist</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">Your wishlist is empty.</div>
              )}
            </section>
          </div>

          {/* ── Order history ── */}
          <div className="border-t border-slate-200 p-8 lg:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700 mb-4"><ShoppingBag size={14} /> Order History</p>
            {ordersLoading ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No orders yet.</div>
            ) : (
              <div className="space-y-4">
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
                          <img src={resolveProductImage(item.product.title, item.product.image)} alt={item.product.title} className="h-12 w-12 rounded-lg object-contain bg-[#f6f3eb]" />
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
