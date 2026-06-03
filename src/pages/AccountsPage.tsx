import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { NeoBadge } from "../components/common/NeoBadge";
import { NeoEmptyState } from "../components/common/NeoEmptyState";
import { NeoInput } from "../components/common/NeoInput";
import { NeoPageHeader } from "../components/common/NeoPageHeader";
import { NeoStatCard } from "../components/common/NeoStatCard";
import { NeoTable } from "../components/common/NeoTable";
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

  type AccountRow = (typeof accounts)[number];

  function actionButtons(account: {
    id: string;
    name: string;
    is_active: boolean;
  }) {
    if (editID === account.id) {
      return (
        <div className="flex gap-2">
          <button
            className="neo-link text-sm disabled:opacity-50"
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
          className="neo-link text-sm"
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

  const accountColumns = [
    {
      key: "name",
      header: "Name",
      cell: (account: AccountRow) =>
        editID === account.id ? (
          <NeoInput
            className="mt-0 max-w-48 px-2 py-1"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="font-medium">{account.name}</span>
        ),
    },
    {
      key: "type",
      header: "Type",
      className: "capitalize",
      cell: (account: AccountRow) => account.type,
    },
    {
      key: "balance",
      header: "Balance",
      className: "font-semibold",
      cell: (account: AccountRow) => formatIDR(account.balance),
    },
    {
      key: "status",
      header: "Status",
      cell: (account: AccountRow) => (
        <NeoBadge variant={account.is_active ? "success" : "neutral"}>
          {account.is_active ? "Active" : "Inactive"}
        </NeoBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (account: AccountRow) => actionButtons(account),
    },
  ];

  return (
    <div className="space-y-6">
      <NeoPageHeader
        title="Accounts"
        description="Manage bank accounts, e-wallets, cash, gold, and broker balances."
        eyebrow="Balance center"
        icon="🏦"
        actions={
          <Link to="/accounts/new">
            <Button>Add Account</Button>
          </Link>
        }
      />

      {accounts.length > 0 ? (
        <NeoStatCard
          label="Total Balance"
          value={formatIDR(totalBalance)}
          icon="💳"
          tone="emerald"
        />
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
          <NeoEmptyState
            title="No accounts yet"
            description="Add your first account to track your net worth and transactions."
            icon="🏦"
            action={
              <Link to="/accounts/new">
                <Button>Add Account</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card>
          <NeoTable
            columns={accountColumns}
            data={accounts}
            getRowKey={(account) => account.id}
            rowClassName={(account) =>
              !account.is_active ? "text-slate-400" : ""
            }
          />

          <div className="space-y-3 md:hidden">
            {accounts.map((account) => (
              <div key={account.id} className="neo-surface rounded-xl p-4">
                <div className="flex items-center justify-between">
                  {editID === account.id ? (
                    <NeoInput
                      className="mt-0 max-w-44 px-2 py-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="font-semibold text-slate-950 dark:text-slate-100">
                      {account.name}
                    </p>
                  )}
                  <NeoBadge variant={account.is_active ? "success" : "neutral"}>
                    {account.is_active ? "Active" : "Inactive"}
                  </NeoBadge>
                </div>
                <p className="mt-1 text-xs capitalize text-slate-500">
                  {account.type}
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950 dark:text-slate-100">
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
