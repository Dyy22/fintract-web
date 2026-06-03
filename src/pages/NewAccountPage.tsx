import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useAccountStore } from "../stores/accountStore";
import {
  getErrorMessage,
  getValidationErrors,
  type FormErrors,
} from "../utils/apiError";

import { usePageTitle } from "../utils/usePageTitle";

export function NewAccountPage() {
  usePageTitle("Add Account");
  const navigate = useNavigate();
  const { accountTypes, fetchAccountTypes, createAccount, isLoading } =
    useAccountStore();
  const [name, setName] = useState("");
  const [accountTypeID, setAccountTypeID] = useState("");
  const [balance, setBalance] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAccountTypes();
  }, [fetchAccountTypes]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");

    const errors: FormErrors = {};
    if (!name.trim()) errors.name = "is required";
    if (!accountTypeID) errors.account_type_id = "is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await createAccount(name, Number(accountTypeID), Number(balance) || 0);
      navigate("/accounts", { replace: true });
    } catch (error) {
      setFieldErrors(getValidationErrors(error));
      setFormError(getErrorMessage(error, "Unable to create account."));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Add Account</h1>
        <p className="text-sm text-slate-500">
          Add a new bank, e-wallet, cash, gold, or brokerage account.
        </p>
      </div>
      <Card>
        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="BCA Savings"
            />
            {fieldErrors.name && (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.name}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Account Type
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={accountTypeID}
              onChange={(e) => setAccountTypeID(e.target.value)}
            >
              <option value="">Select account type</option>
              {accountTypes.map((type) => {
                const label =
                  type.name === "ewallet"
                    ? "E-Wallet"
                    : type.name
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <option key={type.id} value={type.id}>
                    {label}
                  </option>
                );
              })}
            </select>
            {fieldErrors.account_type_id && (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.account_type_id}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Initial Balance
            </span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="5000000"
            />
            {fieldErrors.balance && (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.balance}
              </span>
            )}
          </label>
          <div className="flex justify-end gap-2">
            <Link to="/accounts">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
