import { api } from "@/lib/axios";
import { useOverviewStore } from "@/stores/stores";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { APIResponses } from "../api-types";

interface OverviewQueryOptions {
  interval: string;
  startDate?: string;
  endDate?: string;
}

export const getOverviewQuery = (filters?: OverviewQueryOptions) => {
  const queryKey: unknown[] = ["overview"];
  if (filters) queryKey.push(filters);

  return queryOptions({
    queryKey,
    queryFn: async () => {
      const { interval = "day", startDate, endDate } = filters || {};
      const searchParams = new URLSearchParams();
      searchParams.append("interval", interval);

      if (startDate) {
        searchParams.append("startDate", startDate);
      }

      if (endDate) {
        searchParams.append("endDate", endDate);
      }

      return (
        await api.get<APIResponses["overview"]>(
          `/v1/overview?${searchParams.toString()}`,
        )
      ).data.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useOverviewQuery = () => {
  const { interval, startDate, endDate } = useOverviewStore();
  return useQuery(
    getOverviewQuery({
      interval,
      startDate,
      endDate,
    }),
  );
};

export const financialSummaryQuery = queryOptions({
  queryKey: ["financialSummary"],
  queryFn: async () => {
    return (await api.get<APIResponses["summary"]>("/v1/overview/summary")).data
      .data;
  },
  staleTime: Infinity,
});
