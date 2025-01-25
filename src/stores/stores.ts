import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OverviewFilterInterval = "day" | "week" | "month" | "year";

export interface OverviewStoreType {
  interval: OverviewFilterInterval;
  startDate: string | undefined;
  endDate: string | undefined;

  setInterval: (interval: OverviewFilterInterval) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  clearDateRange: () => void;
}

export const useOverviewStore = create(
  persist<OverviewStoreType>(
    (set) => ({
      interval: "day",
      startDate: undefined,
      endDate: undefined,
      setInterval: (interval) => set({ interval }),
      setDateRange: (dateRange) =>
        set({
          startDate: dateRange?.from?.toISOString(),
          endDate:
            dateRange?.to?.toISOString() || dateRange?.from?.toISOString(),
        }),
      clearDateRange: () => set({ startDate: undefined, endDate: undefined }),
    }),
    {
      name: "overview-filter",
    },
  ),
);

interface NavStoreType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useNavStore = create(
  persist<NavStoreType>(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "nav-store",
    },
  ),
);
