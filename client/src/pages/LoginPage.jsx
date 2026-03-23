import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveSession } = useAuth();

  const from = location.state?.from?.pathname ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      saveSession(data);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError(
          "Incorrect email or password. If you are new, create an account first.",
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-brand-600 text-3xl font-extrabold tracking-tight">
            MarketMap
          </span>
          <span className="text-gray-700 text-3xl font-extrabold tracking-tight">
            {" "}
            Ethiopia
          </span>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white shadow-md rounded-2xl px-8 py-8 space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                fieldErrors.email ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                  fieldErrors.password ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.855-.67 1.654-1.166 2.374"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.94 17.94A9.956 9.956 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 014.186-5.285M9.88 9.88a3 3 0 104.243 4.243"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3l18 18"
      />
    </svg>
  );
}
