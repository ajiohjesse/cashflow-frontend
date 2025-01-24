import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import { APIResponses } from "../api-types";

export const inflowCategoryQuery = queryOptions({
  queryKey: ["inflow-categories"],
  queryFn: async () => {
    return (
      await api.get<APIResponses["inflowCategories"]>("/v1/categories/inflow")
    ).data.data;
  },
  staleTime: Infinity,
});

export const outflowCategoryQuery = queryOptions({
  queryKey: ["outflow-categories"],
  queryFn: async () => {
    return (
      await api.get<APIResponses["outflowCategories"]>("/v1/categories/outflow")
    ).data.data;
  },
  staleTime: Infinity,
});

export const getCategoryWithStatQuery = (type: "income" | "expense") => {
  return queryOptions({
    queryKey: ["categories-with-stat", type],
    queryFn: async () => {
      const url =
        type === "income"
          ? "/v1/categories/inflow/stats"
          : "/v1/categories/outflow/stats";
      return (await api.get<APIResponses["categoryWithStat"]>(url)).data.data;
    },
    staleTime: Infinity,
  });
};
