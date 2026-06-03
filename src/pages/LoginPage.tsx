import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../stores/authStore";
import {
  getErrorMessage,
  getValidationErrors,
  type FormErrors,
} from "../utils/apiError";
import { usePageTitle } from "../utils/usePageTitle";

type LocationState = {
  from?: {
    pathname?: string;
  };
  message?: string;
};

export function LoginPage() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const redirectTo = locationState?.from?.pathname ?? "/dashboard";
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFieldErrors(getValidationErrors(error));
      setFormError(
        getErrorMessage(error, "Unable to login. Please try again."),
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md border-2 border-border bg-secondary-background p-8 shadow-shadow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Fintrack</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Private personal finance tracker
          </p>
        </div>

        {locationState?.message ? (
          <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
            {locationState.message}
          </div>
        ) : null}
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
            {formError}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              autoComplete="email"
            />
            {fieldErrors.email ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {fieldErrors.password ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link className="font-medium text-blue-700" to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
