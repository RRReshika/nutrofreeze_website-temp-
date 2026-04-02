import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Lock, Mail, Phone } from "lucide-react";
import { useAuth } from "../lib/auth-context";

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await signUp({ email, password, phone: phone || undefined });
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-black/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 sm:p-12 lg:p-16" style={{ background: "linear-gradient(160deg, #ecfeff 0%, #fff 45%, #f5f0e8 100%)" }}>
            <Link to="/signin" className="inline-flex items-center gap-2 text-slate-700 no-underline hover:text-slate-900">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            <div className="mt-10 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">Customer signup</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Create your account.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Sign up to save your cart, wishlist, and order history across devices.
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c3aed]"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Phone size={15} />
                    Phone number
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c3aed]"
                    placeholder="Optional"
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c3aed]"
                    placeholder="At least 8 characters"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Lock size={15} />
                    Confirm password
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c3aed]"
                    placeholder="Repeat your password"
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
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#6d28d9] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                Already have an account? <Link to="/signin" className="font-semibold text-[#7c3aed] underline-offset-4 hover:underline">Sign in here</Link>.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(94,234,212,0.3),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(124,58,237,0.28),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(109,40,217,0.14),_transparent_30%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c4b5fd]">Join NutroFreeze</p>
                <h2 className="mt-4 max-w-sm text-4xl font-black tracking-tight">
                  Save favorites, track orders, and checkout faster.
                </h2>
              </div>

              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                {[
                  ["Fast checkout", "Your details stay saved"],
                  ["Wishlist sync", "Keep products for later"],
                  ["Order history", "Review every purchase"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c4b5fd]">{title}</p>
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
