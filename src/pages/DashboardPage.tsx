import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useAccountStore } from "../stores/accountStore";
import { useReportStore } from "../stores/reportStore";
import { useTransactionStore } from "../stores/transactionStore";
import { SkeletonCard } from "../components/common/Skeleton";
import { usePageTitle } from "../utils/usePageTitle";
import { formatDate, formatIDR, transactionAmountLabel } from "../utils/format";

export function DashboardPage() {
  usePageTitle("Dashboard");
  const {
    accounts,
    isLoading: loadingAccounts,
    fetchAccounts,
  } = useAccountStore();
  const {
    netWorth,
    totalSpending,
    isLoadingWorth,
    isLoadingSpending,
    fetchNetWorth,
    fetchSpending,
    spendingStartDate,
    spendingEndDate,
  } = useReportStore();
  const {
    transactions,
    isLoading: loadingTx,
    fetchRecent,
  } = useTransactionStore();

  const isLoading =
    loadingAccounts || isLoadingWorth || isLoadingSpending || loadingTx;

  useEffect(() => {
    fetchAccounts();
    fetchNetWorth();
    fetchRecent();
    fetchSpending(spendingStartDate, spendingEndDate);
  }, [
    fetchAccounts,
    fetchNetWorth,
    fetchRecent,
    fetchSpending,
    spendingStartDate,
    spendingEndDate,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of your net worth, accounts, and recent activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/accounts">
            <Button variant="secondary">Manage Accounts</Button>
          </Link>
          <Link to="/transactions/new">
            <Button>Add Transaction</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <SkeletonCard />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : null}

      {!isLoading && netWorth !== null ? (
        <>
          <Card>
            <p className="text-sm font-medium text-slate-500">Net Worth</p>
            <p className="mt-2 text-4xl font-bold text-slate-950">
              {formatIDR(netWorth)}
            </p>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <p className="font-semibold text-slate-950">Account Balances</p>
              {accounts?.length === 0 ? (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">No accounts yet.</p>
                  <Link to="/accounts">
                    <Button variant="secondary" className="mt-3">
                      Add Account
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {accounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-950">
                          {account.name}
                        </p>
                        <p className="text-xs text-slate-500">{account.type}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-950">
                        {formatIDR(account.balance)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <p className="font-semibold text-slate-950">
                Spending This Month
              </p>
              {totalSpending === null || totalSpending === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No spending this month.
                </p>
              ) : (
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {formatIDR(totalSpending)}
                </p>
              )}
            </Card>

            <Card>
              <p className="font-semibold text-slate-950">
                Recent Transactions
              </p>
              {transactions.length === 0 ? (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">
                    No recent transactions.
                  </p>
                  <Link to="/transactions/new">
                    <Button variant="secondary" className="mt-3">
                      Add Transaction
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-950">
                          {tx.category?.name ?? tx.description ?? tx.type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tx.account?.name} • {formatDate(tx.date)}
                        </p>
                      </div>
                      <p
                        className={`ml-2 whitespace-nowrap text-sm font-semibold ${tx.type === "expense" ? "text-red-600" : "text-green-600"}`}
                      >
                        {transactionAmountLabel(tx.type, tx.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {transactions.length > 5 ? (
                <Link
                  to="/transactions"
                  className="mt-3 block text-sm font-medium text-blue-700"
                >
                  View all transactions
                </Link>
              ) : null}
            </Card>
          </div>
        </>
      ) : null}

      {!isLoading && netWorth === null ? (
        <Card>
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-950">No accounts yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Add your first account to start tracking your net worth.
            </p>
            <Link to="/accounts">
              <Button className="mt-4">Add Account</Button>
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
