import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../stores/authStore";
import {
  getErrorMessage,
  getValidationErrors,
  type FormErrors,
} from "../utils/apiError";

import { usePageTitle } from "../utils/usePageTitle";

export function RegisterPage() {
  usePageTitle("Create Account");
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");

    if (password !== confirmPassword) {
      setFieldErrors({ confirm_password: "must match password" });
      return;
    }

    try {
      await register(email, password);
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFieldErrors(getValidationErrors(error));
      setFormError(
        getErrorMessage(error, "Unable to register. Please try again."),
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-950">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start tracking your personal finances
          </p>
        </div>

        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
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
              placeholder="minimum 8 characters"
              autoComplete="new-password"
            />
            {fieldErrors.password ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Confirm Password
            </span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="repeat password"
              autoComplete="new-password"
            />
            {fieldErrors.confirm_password ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.confirm_password}
              </span>
            ) : null}
          </label>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-blue-700" to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
