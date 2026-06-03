import { create } from "zustand";
import { api } from "../services/api";
import type { Account, SpendingCategory } from "../types";

type NetWorthResponse = {
  net_worth: number;
  accounts: Account[];
};

type SpendingResponse = {
  start_date: string;
  end_date: string;
  total_spending: number;
  categories: SpendingCategory[];
};

function firstDayOfMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

type ReportState = {
  netWorth: number | null;
  activeAccounts: Account[];
  totalSpending: number | null;
  spendingCategories: SpendingCategory[];
  isLoadingWorth: boolean;
  isLoadingSpending: boolean;
  spendingStartDate: string;
  spendingEndDate: string;
  fetchNetWorth: () => Promise<void>;
  fetchSpending: (startDate: string, endDate: string) => Promise<void>;
};

export const useReportStore = create<ReportState>((set) => ({
  netWorth: null,
  activeAccounts: [],
  totalSpending: null,
  spendingCategories: [],
  isLoadingWorth: false,
  isLoadingSpending: false,
  spendingStartDate: firstDayOfMonthString(),
  spendingEndDate: todayString(),

  async fetchNetWorth() {
    set({ isLoadingWorth: true });
    try {
      const { data } = await api.get<NetWorthResponse>("/reports/net-worth");
      set({ netWorth: data.net_worth, activeAccounts: data.accounts ?? [] });
    } finally {
      set({ isLoadingWorth: false });
    }
  },

  async fetchSpending(startDate: string, endDate: string) {
    set({
      isLoadingSpending: true,
      spendingStartDate: startDate,
      spendingEndDate: endDate,
    });
    try {
      const { data } = await api.get<SpendingResponse>(
        "/reports/spending-by-category",
        {
          params: { start_date: startDate, end_date: endDate },
        },
      );
      set({
        totalSpending: data.total_spending,
        spendingCategories: data.categories ?? [],
      });
    } finally {
      set({ isLoadingSpending: false });
    }
  },
}));
