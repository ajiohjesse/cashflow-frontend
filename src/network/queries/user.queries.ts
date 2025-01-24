import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import { APIResponses } from "../api-types";

export const userQuery = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    return (await api.get<APIResponses["user"]>("/v1/profile")).data.data;
  },
  staleTime: Infinity,
});
