import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShieldAlert, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "../../lib/admin-auth-context";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { admin, isLoading, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, isLoading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      toast.success("Admin session started");
      navigate("/admin/dashboard", { replace: true });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to log in";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl shadow-black/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 sm:p-12 lg:p-16" style={{ background: "linear-gradient(160deg, #ecfeff 0%, #fff 45%, #fff7ed 100%)" }}>
            <div className="max-w-2xl">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 no-underline hover:text-slate-900">
                <ArrowLeft size={16} />
                Back to store
              </Link>

              <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-700">
                <ShieldAlert size={14} />
                Admin Access
              </div>

              <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Manage products, inventory, and orders from one secure panel.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Only users with admin roles can enter the dashboard. All requests are checked with JWT plus server-side role and permission validation.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Products", "Create, edit, delete"],
                  ["Inventory", "Track stock levels"],
                  ["Orders", "Monitor fulfillment"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.28),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(109,40,217,0.24),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.12),_transparent_30%)]" />
            <div className="relative z-10 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#c4b5fd]">Admin sign in</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Access the control room.</h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                This dashboard is isolated from customer auth. Use your admin credentials only.
              </p>

              <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/85">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#a78bfa]"
                    placeholder="admin@company.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/85">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#a78bfa]"
                    placeholder="••••••••"
                    required
                  />
                </label>

                {error && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LogIn size={16} />
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/55">
                If you do not have admin access, return to the storefront and sign in as a customer instead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
