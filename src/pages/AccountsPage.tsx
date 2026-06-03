import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { Skeleton } from "../components/common/Skeleton";
import { usePageTitle } from "../utils/usePageTitle";
import { useAccountStore } from "../stores/accountStore";
import { formatIDR } from "../utils/format";

export function AccountsPage() {
  usePageTitle("Accounts");
  const {
    accounts,
    isLoading,
    fetchAccounts,
    fetchAccountTypes,
    updateAccount,
    deactivateAccount,
    hardDeleteAccount,
  } = useAccountStore();
  const [editID, setEditID] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deactivateID, setDeactivateID] = useState<string | null>(null);
  const [deleteID, setDeleteID] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    fetchAccountTypes();
    fetchAccounts();
  }, [fetchAccountTypes, fetchAccounts]);

  async function handleSaveEdit(accountID: string) {
    if (!editName.trim()) return;
    setIsSavingEdit(true);
    try {
      await updateAccount(accountID, { name: editName.trim() });
    } finally {
      setEditID(null);
      setIsSavingEdit(false);
    }
  }

  async function handleDeactivate() {
    if (!deactivateID) return;
    await deactivateAccount(deactivateID);
    setDeactivateID(null);
  }

  async function handleDelete() {
    if (!deleteID) return;
    await hardDeleteAccount(deleteID);
    setDeleteID(null);
  }

  function startEdit(accountID: string, currentName: string) {
    setEditID(accountID);
    setEditName(currentName);
  }

  const totalBalance = accounts
    .filter((account) => account.is_active)
    .reduce((sum, account) => sum + account.balance, 0);

  function actionButtons(account: {
    id: string;
    name: string;
    is_active: boolean;
  }) {
    if (editID === account.id) {
      return (
        <div className="flex gap-2">
          <button
            className="text-sm font-medium text-blue-700 disabled:opacity-50"
            onClick={() => handleSaveEdit(account.id)}
            disabled={isSavingEdit}
          >
            Save
          </button>
          <button
            className="text-sm font-medium text-slate-500"
            onClick={() => setEditID(null)}
          >
            Cancel
          </button>
        </div>
      );
    }
    if (!account.is_active) {
      return (
        <div className="flex gap-2">
          <button
            className="text-sm font-medium text-green-700"
            onClick={() => updateAccount(account.id, { isActive: true })}
          >
            Activate
          </button>
          <button
            className="text-sm font-medium text-red-600"
            onClick={() => setDeleteID(account.id)}
          >
            Delete
          </button>
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          className="text-sm font-medium text-blue-700"
          onClick={() => startEdit(account.id, account.name)}
        >
          Edit
        </button>
        <button
          className="text-sm font-medium text-red-600"
          onClick={() => setDeactivateID(account.id)}
        >
          Deactivate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Accounts</h1>
          <p className="text-sm text-slate-500">
            Manage bank accounts, e-wallets, cash, gold, and broker balances.
          </p>
        </div>
        <Link to="/accounts/new">
          <Button>Add Account</Button>
        </Link>
      </div>

      {accounts.length > 0 ? (
        <Card>
          <p className="text-sm font-medium text-slate-500">Total Balance</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {formatIDR(totalBalance)}
          </p>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-48" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : accounts.length === 0 ? (
        <Card>
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-950">No accounts yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Add your first account to track your net worth and transactions.
            </p>
            <Link to="/accounts/new">
              <Button className="mt-4">Add Account</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    className={`border-b border-slate-100 text-sm ${!account.is_active ? "text-slate-400" : ""}`}
                  >
                    <td className="py-3">
                      {editID === account.id ? (
                        <input
                          className="rounded-lg border border-slate-300 px-2 py-1"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{account.name}</span>
                      )}
                    </td>
                    <td className="py-3 capitalize">{account.type}</td>
                    <td className="py-3 font-semibold">
                      {formatIDR(account.balance)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${account.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {account.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">{actionButtons(account)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  {editID === account.id ? (
                    <input
                      className="rounded-lg border border-slate-300 px-2 py-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="font-semibold text-slate-950">
                      {account.name}
                    </p>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${account.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {account.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-xs capitalize text-slate-500">
                  {account.type}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {formatIDR(account.balance)}
                </p>
                <div className="mt-3">{actionButtons(account)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(deactivateID)}
        title="Deactivate Account"
        message="Deactivated accounts still appear in reports and keep their transaction history, but will be excluded from net worth."
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateID(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteID)}
        title="Delete Account Permanently"
        message="This permanently removes the account and all its transaction history. This action cannot be undone."
        buttonLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteID(null)}
      />
    </div>
  );
}
