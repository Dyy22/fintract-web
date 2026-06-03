import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Skeleton } from "../components/common/Skeleton";
import { useAccountStore } from "../stores/accountStore";
import { useTransactionStore } from "../stores/transactionStore";
import { formatDate, transactionAmountLabel } from "../utils/format";

import { usePageTitle } from "../utils/usePageTitle";

export function TransactionsPage() {
  usePageTitle("Transactions");
  const { accounts, fetchAccounts } = useAccountStore();
  const {
    transactions,
    isLoading,
    filters,
    limit,
    offset,
    setFilters,
    fetchTransactions,
    nextPage,
    prevPage,
  } = useTransactionStore();
  const [localStartDate, setLocalStartDate] = useState(
    filters.start_date ?? "",
  );
  const [localEndDate, setLocalEndDate] = useState(filters.end_date ?? "");
  const [localType, setLocalType] = useState(filters.type ?? "");
  const [localAccountID, setLocalAccountID] = useState(
    filters.account_id ?? "",
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    fetchTransactions(undefined, limit, offset);
  }, [fetchTransactions, limit, offset]);

  function handleApply() {
    setFilters({
      start_date: localStartDate,
      end_date: localEndDate,
      type: localType || undefined,
      account_id: localAccountID || undefined,
    });
    fetchTransactions(
      {
        start_date: localStartDate,
        end_date: localEndDate,
        type: localType || undefined,
        account_id: localAccountID || undefined,
      },
      limit,
      0,
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Transactions</h1>
          <p className="text-sm text-slate-500">
            View, filter, and paginate your transaction history.
          </p>
        </div>
        <Link to="/transactions/new">
          <Button>Add Transaction</Button>
        </Link>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={localAccountID}
            onChange={(e) => setLocalAccountID(e.target.value)}
          >
            <option value="">All accounts</option>
            {accounts
              .filter((a) => a.is_active)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={localType}
            onChange={(e) => setLocalType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
          <Button type="button" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Card>
          <Skeleton className="h-4 w-20" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : transactions.length === 0 ? (
        <Card>
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-950">
              No transactions found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try changing filters or add a new transaction.
            </p>
            <Link to="/transactions/new">
              <Button className="mt-4">Add Transaction</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Account</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-100 text-sm"
                    >
                      <td className="py-3 text-slate-500">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 capitalize">{tx.type}</td>
                      <td className="py-3">{tx.account?.name ?? "-"}</td>
                      <td className="py-3">
                        {tx.category?.name ??
                          (tx.type === "transfer" ? "-" : "Uncategorized")}
                      </td>
                      <td className="py-3 text-slate-500">
                        {tx.description || "-"}
                      </td>
                      <td
                        className={`py-3 text-right font-semibold ${tx.type === "expense" ? "text-red-600" : "text-green-600"}`}
                      >
                        {transactionAmountLabel(tx.type, tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                      {tx.type}
                    </span>
                    <span
                      className={`text-sm font-semibold ${tx.type === "expense" ? "text-red-600" : "text-green-600"}`}
                    >
                      {transactionAmountLabel(tx.type, tx.amount)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-950">
                    {tx.category?.name ?? tx.type}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {tx.account?.name ? `${tx.account.name} • ` : ""}
                    {formatDate(tx.date)}
                  </p>
                  {tx.description ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {tx.description}
                    </p>
                  ) : null}
                  {tx.type === "transfer" && tx.transfer_account_id ? (
                    <p className="mt-1 text-xs text-slate-500">
                      →{" "}
                      {accounts.find((a) => a.id === tx.transfer_account_id)
                        ?.name ?? "Destination"}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {offset + 1}–{offset + transactions.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="neutral"
                onClick={prevPage}
                disabled={offset === 0}
              >
                Previous
              </Button>
              <Button
                variant="neutral"
                onClick={nextPage}
                disabled={transactions.length < limit}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
