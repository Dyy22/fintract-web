import { useEffect, useState } from "react";
import { Card } from "../components/common/Card";
import { SkeletonCard } from "../components/common/Skeleton";
import { useReportStore } from "../stores/reportStore";
import { formatIDR } from "../utils/format";

import { usePageTitle } from "../utils/usePageTitle";

export function ReportsPage() {
  usePageTitle("Reports");
  const {
    netWorth,
    activeAccounts,
    totalSpending,
    spendingCategories,
    isLoadingWorth,
    isLoadingSpending,
    spendingStartDate,
    spendingEndDate,
    fetchNetWorth,
    fetchSpending,
  } = useReportStore();

  const [localStartDate, setLocalStartDate] = useState(spendingStartDate);
  const [localEndDate, setLocalEndDate] = useState(spendingEndDate);

  const isLoading = isLoadingWorth || isLoadingSpending;

  useEffect(() => {
    fetchNetWorth();
    fetchSpending(spendingStartDate, spendingEndDate);
  }, [fetchNetWorth, fetchSpending, spendingStartDate, spendingEndDate]);

  function handleApply() {
    fetchSpending(localStartDate, localEndDate);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Reports</h1>
        <p className="text-sm text-slate-500">
          Analyze net worth and spending by category.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <Card>
            <p className="text-sm font-medium text-slate-500">Net Worth</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {netWorth !== null ? formatIDR(netWorth) : "-"}
            </p>
            {activeAccounts.length > 0 && (
              <div className="mt-4 space-y-2">
                {activeAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600">{account.name}</span>
                    <span className="font-semibold text-slate-950">
                      {formatIDR(account.balance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500 mb-4">
              Spending by Category
            </p>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>

            {totalSpending !== null && totalSpending > 0 ? (
              <>
                <p className="mt-6 text-3xl font-bold text-red-600">
                  {formatIDR(totalSpending)}
                </p>
                <p className="mt-1 text-sm text-slate-500">total spending</p>
                <div className="mt-4 space-y-3">
                  {spendingCategories.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-950">
                          {category.name}
                        </span>
                        <span className="font-semibold text-slate-950">
                          {formatIDR(category.amount)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No spending data for this period. Add expense transactions to
                see category breakdown.
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
