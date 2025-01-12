'use client';

import { create } from 'zustand';

export type TableEntry = {
  price: number;
  allocationPercentage: number;
  lots: number;
  shares: number;
  totalCost: number;
  averagePurchasePrice: number;
};

export type Summary = {
  totalCapitalUtilized: number;
  remainingCash: number;
  weightedAveragePrice: number;
  totalShares: number;
};

export type AllocationStore = {
  tableData: TableEntry[];
  summary: Summary | null;
  setTableData: (data: TableEntry[]) => void;
  setSummary: (summary: Summary | null) => void;
};

export const useAllocationStore = create<AllocationStore>((set) => ({
  tableData: [],
  summary: null,

  setTableData: (data) => set({ tableData: data }),
  setSummary: (summary) => set({ summary }),
}));
