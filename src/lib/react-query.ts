import { toast } from "@/hooks/use-toast";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      retry: (_failureCount, error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          return false;
        }
        return true;
      },
    },
    mutations: {
      onError: (error) => {
        if (isAxiosError(error)) {
          toast({
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });

          return;
        }

        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    },
  },
});
