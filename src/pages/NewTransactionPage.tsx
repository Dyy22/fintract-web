import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useAccountStore } from "../stores/accountStore";
import { useCategoryStore } from "../stores/categoryStore";
import { useTransactionStore } from "../stores/transactionStore";
import {
  getErrorMessage,
  getValidationErrors,
  type FormErrors,
} from "../utils/apiError";

type TransactionType = "expense" | "income" | "transfer";

import { usePageTitle } from "../utils/usePageTitle";

export function NewTransactionPage() {
  usePageTitle("Add Transaction");
  const navigate = useNavigate();
  const { accounts, fetchAccounts } = useAccountStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { createTransaction, isLoading } = useTransactionStore();

  const [type, setType] = useState<TransactionType>("expense");
  const [accountID, setAccountID] = useState("");
  const [transferAccountID, setTransferAccountID] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, [fetchAccounts, fetchCategories]);

  const filteredCategories = categories.filter(
    (c) => c.type === type || type === "transfer",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");

    const errors: FormErrors = {};
    if (!accountID) errors.account_id = "is required";
    if (!amount || Number(amount) <= 0)
      errors.amount = "must be greater than 0";
    if (type === "transfer") {
      if (!transferAccountID) errors.transfer_account_id = "is required";
    } else {
      if (!categoryID) errors.category_id = "is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload: Record<string, unknown> = {
      type,
      account_id: accountID,
      amount: Number(amount),
      date: `${date}T12:00:00Z`,
      description,
    };

    if (type === "transfer") {
      payload.transfer_account_id = transferAccountID;
    } else {
      payload.category_id = categoryID;
    }

    try {
      await createTransaction(payload);
      navigate("/transactions", { replace: true });
    } catch (error) {
      setFieldErrors(getValidationErrors(error));
      setFormError(getErrorMessage(error, "Unable to create transaction."));
    }
  }

  const typeOptions: { key: TransactionType; label: string }[] = [
    { key: "expense", label: "Expense" },
    { key: "income", label: "Income" },
    { key: "transfer", label: "Transfer" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Add Transaction</h1>
        <p className="text-sm text-slate-500">
          Create income, expense, or transfer records.
        </p>
      </div>

      <Card>
        {formError ? (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((opt) => (
              <Button
                key={opt.key}
                type="button"
                variant={type === opt.key ? "default" : "neutral"}
                onClick={() => {
                  setType(opt.key);
                  setCategoryID("");
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              {type === "transfer" ? "Source Account" : "Account"}
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={accountID}
              onChange={(e) => setAccountID(e.target.value)}
            >
              <option value="">Select account</option>
              {accounts
                .filter((a) => a.is_active)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
            {fieldErrors.account_id ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.account_id}
              </span>
            ) : null}
          </label>

          {type === "transfer" ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Destination Account
              </span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={transferAccountID}
                onChange={(e) => setTransferAccountID(e.target.value)}
              >
                <option value="">Select destination account</option>
                {accounts
                  .filter((a) => a.is_active && a.id !== accountID)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
              </select>
              {fieldErrors.transfer_account_id ? (
                <span className="mt-1 block text-sm text-red-600">
                  {fieldErrors.transfer_account_id}
                </span>
              ) : null}
            </label>
          ) : null}

          {type !== "transfer" ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Category
              </span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
              >
                <option value="">Select category</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id ? (
                <span className="mt-1 block text-sm text-red-600">
                  {fieldErrors.category_id}
                </span>
              ) : null}
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
            />
            {fieldErrors.amount ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.amount}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {fieldErrors.date ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.date}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lunch"
              rows={3}
            />
            {fieldErrors.description ? (
              <span className="mt-1 block text-sm text-red-600">
                {fieldErrors.description}
              </span>
            ) : null}
          </label>

          <div className="flex justify-end gap-2">
            <Link to="/transactions">
              <Button variant="neutral" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Transaction"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
