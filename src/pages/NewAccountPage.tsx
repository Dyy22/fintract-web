import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { NeoAlert } from "../components/common/NeoAlert";
import { NeoInput } from "../components/common/NeoInput";
import { NeoPageHeader } from "../components/common/NeoPageHeader";
import { NeoSelect } from "../components/common/NeoSelect";
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

  const accountTypeOptions = [
    { value: "", label: "Select account type" },
    ...accountTypes.map((type) => ({
      value: String(type.id),
      label:
        type.name === "ewallet"
          ? "E-Wallet"
          : type.name
              .replace(/_/g, " ")
              .replace(/\b\w/g, (character) => character.toUpperCase()),
    })),
  ];

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
      <NeoPageHeader
        title="Add Account"
        description="Add a new bank, e-wallet, cash, gold, or brokerage account."
        eyebrow="New balance source"
        icon="➕"
      />
      <Card>
        {formError && (
          <NeoAlert className="mb-4" variant="danger">
            {formError}
          </NeoAlert>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <NeoInput
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
            <NeoSelect
              className="mt-1"
              value={accountTypeID}
              options={accountTypeOptions}
              onChange={(value) => setAccountTypeID(value)}
              placeholder="Select account type"
            />
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
            <NeoInput
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
