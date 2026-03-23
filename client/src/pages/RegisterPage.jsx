import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "buyer", label: "Buyer — browse & contact sellers" },
  { value: "seller", label: "Seller — list products & services" },
];

// Mirror of backend validatePasswordStrength
const PASSWORD_RULES = [
  { re: /.{8,}/, label: "At least 8 characters" },
  { re: /[A-Z]/, label: "One uppercase letter" },
  { re: /[a-z]/, label: "One lowercase letter" },
  { re: /\d/, label: "One number" },
  { re: /[^A-Za-z0-9]/, label: "One special character" },
];

function PasswordStrengthMeter({ password }) {
  const passed = PASSWORD_RULES.filter((r) => r.re.test(password)).length;
  const pct = (passed / PASSWORD_RULES.length) * 100;
  const color =
    pct <= 20
      ? "bg-red-400"
      : pct <= 60
        ? "bg-yellow-400"
        : pct < 100
          ? "bg-blue-400"
          : "bg-green-500";

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full rounded bg-gray-200">
        <div
          className={`h-1.5 rounded transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-500 mt-1">
        {PASSWORD_RULES.map((r) => (
          <li
            key={r.label}
            className={r.re.test(password) ? "text-green-600" : ""}
          >
            {r.re.test(password) ? "✓" : "○"} {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  }

  function clientValidate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    const failedRules = PASSWORD_RULES.filter((r) => !r.re.test(form.password));
    if (failedRules.length) {
      errs.password = `Password needs: ${failedRules.map((r) => r.label).join(", ")}`;
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const errs = clientValidate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      saveSession(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.rules?.length) {
        setFieldErrors({
          password: `Password needs: ${err.rules.join(", ")}`,
        });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <span className="text-brand-600 text-3xl font-extrabold tracking-tight">
            MarketMap
          </span>
          <span className="text-gray-700 text-3xl font-extrabold tracking-tight">
            {" "}
            Ethiopia
          </span>
          <p className="mt-2 text-sm text-gray-500">Create your account</p>
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

          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                fieldErrors.name ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Abebe Bikila"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I want to…
            </label>
            <div className="flex gap-3">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex-1 cursor-pointer rounded-lg border px-3 py-3 text-xs font-medium transition-colors ${
                    form.role === r.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-300 text-gray-600 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={form.role === r.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {r.label}
                </label>
              ))}
            </div>
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
                autoComplete="new-password"
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
            {form.password && (
              <PasswordStrengthMeter password={form.password} />
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                fieldErrors.confirmPassword
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              Sign in
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
