import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { TextField } from "../components/ui/Field";
import { DEMO_LOGIN, useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { validateEmail, validateName, validatePassword, validatePhone } from "../utils/validate";

const EMPTY = { name: "", email: "", phone: "", password: "", confirm: "" };

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const { user, login, signup } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  useDocumentTitle(isLogin ? "Log in" : "Sign up");

  useEffect(() => {
    setForm(EMPTY);
    setErrors({});
    setBanner("");
    setShowPassword(false);
  }, [mode]);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  function set(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: isLogin ? (form.password ? "" : "Enter your password") : validatePassword(form.password),
    };
    if (!isLogin) {
      nextErrors.name = validateName(form.name, "full name");
      nextErrors.phone = validatePhone(form.phone);
      nextErrors.confirm = form.confirm === form.password ? "" : "Passwords do not match";
    }
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setPending(true);
    const result = isLogin
      ? await login({ email: form.email, password: form.password })
      : await signup({
          name: form.name,
          email: form.email,
          phone: form.phone.replace(/\s+/g, ""),
          password: form.password,
        });
    setPending(false);
    if (!result.ok) setBanner(result.error);
  }

  async function useDemo() {
    setForm((current) => ({ ...current, email: DEMO_LOGIN.email, password: DEMO_LOGIN.password }));
    setErrors({});
    setBanner("");
    setPending(true);
    const result = await login({ email: DEMO_LOGIN.email, password: DEMO_LOGIN.password });
    setPending(false);
    if (!result.ok) setBanner(result.error);
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-6xl items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <section className="relative hidden overflow-hidden rounded-[2rem] p-10 text-cream lg:flex lg:flex-col lg:justify-between">
        <img src="/bus-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.16em] text-marigold uppercase">Your account</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight">
            Keep your name and number on this device.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            Signup stores the account in this browser so checkout can prefill the contact fields. Tickets stay in the tab
            you booked them in.
          </p>
        </div>
        <p className="relative text-sm text-white/75">Passwords are hashed before they are saved locally.</p>
      </section>
      <section className="animate-rise rounded-[2rem] border border-line bg-cream p-6 sm:p-8">
        <h1 className="font-serif text-3xl tracking-tight lg:hidden">{isLogin ? "Log in" : "Create an account"}</h1>
        <h2 className="hidden font-serif text-3xl tracking-tight lg:block">{isLogin ? "Welcome back" : "Create an account"}</h2>
        <p className="mt-2 text-sm text-muted">
          {isLogin ? "Use the demo account, or the email you signed up with." : "A name, mobile number, and password are enough."}
        </p>
        {isLogin ? (
          <div className="animate-rise mt-4 rounded-2xl border border-dashed border-canopy/40 bg-mist px-4 py-3 text-sm">
            <p className="font-semibold text-ink">Demo login</p>
            <p className="mt-1 text-muted">
              Email <span className="font-semibold text-ink">{DEMO_LOGIN.email}</span>
            </p>
            <p className="text-muted">
              Password <span className="font-semibold text-ink">{DEMO_LOGIN.password}</span>
            </p>
            <button type="button" onClick={useDemo} disabled={pending} className="mt-2 text-sm font-semibold text-canopy hover:text-forest">
              Sign in with these details
            </button>
          </div>
        ) : null}
        <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
          {banner ? (
            <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-medium text-clay">
              {banner}
            </p>
          ) : null}
          {!isLogin ? (
            <TextField id="auth-name" label="Full name" autoComplete="name" value={form.name} error={errors.name} onChange={(event) => set("name", event.target.value)} />
          ) : null}
          <TextField
            id="auth-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            error={errors.email}
            onChange={(event) => set("email", event.target.value)}
          />
          {!isLogin ? (
            <TextField
              id="auth-phone"
              label="Mobile number"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
          ) : null}
          <div className="relative">
            <TextField
              id="auth-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={form.password}
              error={errors.password}
              onChange={(event) => set("password", event.target.value)}
              className="pr-12"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-10 right-3 grid h-5 w-5 place-items-center text-muted"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {!isLogin ? (
            <TextField
              id="auth-confirm"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirm}
              error={errors.confirm}
              onChange={(event) => set("confirm", event.target.value)}
            />
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link to={`${isLogin ? "/signup" : "/login"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-forest">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </section>
    </div>
  );
}
