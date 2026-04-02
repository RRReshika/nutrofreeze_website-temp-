import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useAuth } from "../lib/auth-context";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)" }}>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/95 shadow-2xl shadow-black/20 lg:grid-cols-[1.05fr_0.95fr]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}>
          <div className="p-8 sm:p-12 lg:p-16" style={{ background: "linear-gradient(160deg, #fff7ed 0%, #fff 45%, #f0fdf4 100%)" }}>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-700 no-underline">
              <ArrowLeft size={16} />
              Back home
            </Link>

            <div className="mt-10 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Customer login</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Sign in to your account.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Use your customer email and password to access your cart, wishlist, and order history.
              </p>

              <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail size={15} />
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Lock size={15} />
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
                    placeholder="Your password"
                    required
                  />
                </label>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                New here? You can register through the API and then use the same sign in form.
              </p>

              <p className="mt-3 text-sm text-slate-600">
                Need an account? <Link to="/signup" className="font-semibold text-teal-700 underline-offset-4 hover:underline">Create one here</Link>.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Admin user? <Link to="/admin/login" className="font-semibold text-slate-800 underline-offset-4 hover:underline">Sign in to the admin dashboard</Link>.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.35),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(124,58,237,0.28),_transparent_40%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">NutroFreeze</p>
                <h2 className="mt-4 max-w-sm text-4xl font-black tracking-tight">
                  One login for your cart, wishlist, and checkout.
                </h2>
              </div>

              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                {[
                  ["Cart", "Saved across sessions"],
                  ["Wishlist", "Keep favorites ready"],
                  ["Orders", "Review your history"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-200">{title}</p>
                    <p className="mt-3 text-sm leading-6 text-white/75">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
