import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import { APIResponses } from "../api-types";

interface TransactionQueryFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  limit?: number;
  page?: number;
  sort?: string;
}

export const getTransactionQuery = (
  type: "income" | "expense",
  filters?: TransactionQueryFilters,
) => {
  const queryKey: unknown[] = ["transactions", type];
  if (filters) queryKey.push(filters);

  return queryOptions({
    queryKey,
    queryFn: async () => {
      const { search, categories, startDate, endDate } = filters || {};
      const searchParams = new URLSearchParams();
      searchParams.append("type", type === "expense" ? "outflow" : "inflow");
      if (search) searchParams.append("search", search);
      if (startDate) searchParams.append("startDate", startDate);
      if (endDate) searchParams.append("endDate", endDate);
      if (categories) searchParams.append("categories", categories.join(","));
      if (filters?.limit) searchParams.append("limit", String(filters.limit));
      if (filters?.page) searchParams.append("page", String(filters.page));
      if (filters?.sort) searchParams.append("sort", filters.sort);

      return (
        await api.get<APIResponses["transactions"]>(
          `/v1/transactions?${searchParams.toString()}`,
        )
      ).data.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};
