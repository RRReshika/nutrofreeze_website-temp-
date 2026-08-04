import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, Lock, Package, ShoppingBag, Tag } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { useCart, resolveProductImage } from "../lib/cart";
import { useAuth } from "../lib/auth-context";
import { API_BASE_URL, authStorage } from "../lib/auth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// ── Payment form ──────────────────────────────────────────────────────────────
function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setBusy(true);
        setErrorMsg(null);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/checkout?success=true` },
            redirect: "if_required",
        });
        if (error) {
            setErrorMsg(error.message ?? "Payment failed. Please try again.");
            setBusy(false);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement options={{ layout: "tabs" }} />
            {errorMsg && (
                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                    {errorMsg}
                </p>
            )}
            <motion.button
                type="submit"
                disabled={!stripe || busy}
                whileHover={{ scale: busy ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                    marginTop: "24px", width: "100%",
                    background: busy ? "#374151" : "#1c1c1e",
                    color: "white", border: "none", borderRadius: "14px",
                    padding: "16px", fontSize: "16px", fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    cursor: busy ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background 0.2s",
                }}
            >
                <Lock size={16} />
                {busy ? "Processing…" : "Pay Now"}
            </motion.button>
        </form>
    );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ orderId }: { orderId: string | null }) {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "60px 40px", background: "white", borderRadius: "24px", border: "2px solid #d1fae5", maxWidth: "460px", margin: "0 auto" }}
        >
            <CheckCircle2 size={56} color="#10b981" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "32px", color: "#1c1c1e", marginBottom: "12px" }}>
                Order Placed!
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#6b7280", lineHeight: 1.65, marginBottom: "28px" }}>
                Thank you for your purchase. We will send a confirmation email shortly.
                {orderId && <><br /><span style={{ fontWeight: 600, color: "#1c1c1e" }}>Order ID: {orderId.slice(0, 8).toUpperCase()}</span></>}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/account")}
                    style={{ background: "#1c1c1e", color: "white", border: "none", borderRadius: "12px", padding: "12px 24px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                    View Orders
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/")}
                    style={{ background: "transparent", color: "#1c1c1e", border: "2px solid #e5e7eb", borderRadius: "12px", padding: "12px 24px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                    Back to Shop
                </motion.button>
            </div>
        </motion.div>
    );
}

// ── Main CheckoutPage ─────────────────────────────────────────────────────────
export function CheckoutPage() {
    const { cart, clearCart, closeCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initError, setInitError] = useState<string | null>(null);
    const [succeeded, setSucceeded] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("success") === "true") {
            setSucceeded(true);
            void clearCart();
            closeCart();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (succeeded) return;
        if (cart.items.length === 0) { setIsLoading(false); return; }
        const init = async () => {
            setIsLoading(true);
            setInitError(null);
            try {
                const accessToken = authStorage.getAccessToken();
                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
                const body = user && accessToken
                    ? { customerId: user.id }
                    : { items: cart.items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })) };
                const res = await fetch(`${API_BASE_URL}/checkout/payment-intent`, { method: "POST", headers, body: JSON.stringify(body) });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error((data as { message?: string }).message || `Unable to start checkout (${res.status})`);
                }
                const data = (await res.json()) as { clientSecret: string; orderId: string };
                setClientSecret(data.clientSecret);
                setOrderId(data.orderId);
            } catch (err: unknown) {
                setInitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        void init();
    }, [cart.items, user, succeeded]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSuccess = useCallback(() => {
        setSucceeded(true);
        void clearCart();
        closeCart();
    }, [clearCart, closeCart]);

    const stripeOptions = clientSecret ? {
        clientSecret,
        appearance: {
            theme: "stripe" as const,
            variables: { colorPrimary: "#1c1c1e", colorBackground: "#ffffff", colorText: "#1c1c1e", fontFamily: "'DM Sans', sans-serif", borderRadius: "10px" },
        },
    } : undefined;

    const shipping = 5;
    const gst = cart.subtotal * 0.07;
    const total = cart.subtotal + gst + shipping;

    return (
        <div style={{ minHeight: "100vh", background: "#f6f3eb" }}>
            <Navbar />
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "110px 24px 60px" }}>

                {!succeeded && (
                    <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 600, color: "#6b7280", textDecoration: "none", marginBottom: "28px" }}>
                        <ArrowLeft size={16} /> Back to shopping
                    </Link>
                )}

                {!succeeded && (
                    <h1 style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "clamp(32px, 5vw, 54px)", color: "#1c1c1e", marginBottom: "32px", lineHeight: 1 }}>
                        Checkout
                    </h1>
                )}

                {succeeded && <SuccessScreen orderId={orderId} />}

                {!succeeded && cart.items.length === 0 && !isLoading && (
                    <div style={{ background: "white", borderRadius: "24px", padding: "80px 60px", textAlign: "center", border: "1px solid #e5e7eb" }}>
                        <ShoppingBag size={52} color="#d1d5db" style={{ margin: "0 auto 20px" }} />
                        <h2 style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "28px", color: "#1c1c1e", margin: "0 0 8px" }}>Your cart is empty</h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9ca3af", fontSize: "15px", margin: "0 0 28px" }}>Add some products before checking out.</p>
                        <Link to="/" style={{ display: "inline-block", background: "#1c1c1e", color: "white", padding: "14px 32px", borderRadius: "14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                            Browse Products
                        </Link>
                    </div>
                )}

                {!succeeded && cart.items.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "24px", alignItems: "start" }}>

                        {/* ── Left: Order Summary ── */}
                        <div style={{ background: "white", borderRadius: "24px", border: "1px solid #e8e4dc", overflow: "hidden" }}>
                            <div style={{ padding: "22px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#1c1c1e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Package size={16} color="white" />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", margin: 0 }}>Your Order</p>
                                    <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "20px", color: "#1c1c1e", margin: 0, lineHeight: 1.1 }}>
                                        {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                {cart.items.map((item) => {
                                    const imgSrc = resolveProductImage(item.product.title, item.product.image);
                                    const displayName = item.product.title.replace(/\s*\([^)]*\)/g, "").replace(/\/\S+/g, "").trim() || item.product.title;
                                    return (
                                        <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                                            <div style={{ width: "76px", height: "76px", borderRadius: "14px", background: "#f6f3eb", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ede9e0" }}>
                                                <img
                                                    src={imgSrc}
                                                    alt={displayName}
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                                                />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1c1c1e", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {displayName}
                                                </p>
                                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9ca3af", margin: "0 0 6px" }}>
                                                    {item.variant.title}{item.variant.weightGrams ? ` · ${item.variant.weightGrams}g` : ""}
                                                </p>
                                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6b7280", background: "#f3f4f6", borderRadius: "6px", padding: "2px 8px" }}>
                                                    qty {item.quantity}
                                                </span>
                                            </div>
                                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "#1c1c1e", flexShrink: 0 }}>
                                                ${item.lineTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ padding: "0 28px 20px" }}>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "#f9f9f7", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "10px 14px" }}>
                                        <Tag size={14} color="#9ca3af" />
                                        <input type="text" placeholder="Promo code" style={{ border: "none", background: "transparent", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#374151", width: "100%" }} />
                                    </div>
                                    <button style={{ background: "#1c1c1e", color: "white", border: "none", borderRadius: "12px", padding: "10px 18px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: "20px 28px", background: "#f9f9f7", borderTop: "1px solid #f3f4f6" }}>
                                {[
                                    { label: "Subtotal", value: `$${cart.subtotal.toFixed(2)}` },
                                    { label: "Shipping", value: `$${shipping.toFixed(2)}` },
                                    { label: "GST (7%)", value: `$${gst.toFixed(2)}` },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6b7280" }}>{label}</span>
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#374151" }}>{value}</span>
                                    </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #e5e7eb", marginTop: "4px" }}>
                                    <span style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "20px", color: "#1c1c1e" }}>Total</span>
                                    <span style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "22px", color: "#1c1c1e" }}>${total.toFixed(2)} SGD</span>
                                </div>
                            </div>

                            <div style={{ padding: "16px 28px" }}>
                                <button onClick={() => navigate("/")} style={{ width: "100%", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "11px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 600, color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                    <ArrowLeft size={14} /> Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* ── Right: Payment ── */}
                        <div style={{ background: "white", borderRadius: "24px", border: "1px solid #e8e4dc", overflow: "hidden" }}>
                            <div style={{ padding: "22px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#6D28D9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Lock size={16} color="white" />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", margin: 0 }}>Secure Checkout</p>
                                    <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "20px", color: "#1c1c1e", margin: 0, lineHeight: 1.1 }}>Payment Details</p>
                                </div>
                            </div>

                            <div style={{ padding: "24px 28px" }}>
                                {isLoading && (
                                    <div style={{ padding: "40px", textAlign: "center" }}>
                                        <div style={{ width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTopColor: "#6D28D9", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9ca3af", fontSize: "14px", margin: 0 }}>Preparing your checkout...</p>
                                    </div>
                                )}
                                {initError && (
                                    <div style={{ padding: "16px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#dc2626" }}>
                                        {initError}
                                    </div>
                                )}
                                {!isLoading && !initError && clientSecret && stripeOptions && (
                                    <Elements stripe={stripePromise} options={stripeOptions}>
                                        <PaymentForm onSuccess={handleSuccess} />
                                    </Elements>
                                )}
                            </div>

                            <div style={{ padding: "0 28px 24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {["SSL Encrypted", "Stripe Secured", "No data stored"].map((badge) => (
                                    <span key={badge} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9ca3af", background: "#f9f9f7", borderRadius: "6px", padding: "4px 10px", border: "1px solid #f3f4f6" }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
