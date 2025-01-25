import CreateTansaction from "@/components/create-transaction";
import Inflows from "@/components/inflows";
import Outflows from "@/components/outflows";
import TransactionFilter from "@/components/transaction-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isIsoDate } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const SORT_OPTIONS = [
  "amount:asc",
  "amount:desc",
  "date:asc",
  "date:desc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

interface TransactionsSearch {
  search?: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
  limit: number;
  page: number;
  sort?: SortOption;
  type: "expense" | "income";
}

export const Route = createFileRoute("/_protected/transactions")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>): TransactionsSearch => ({
    categories: search.categories,
    search: search.search,
    startDate: isIsoDate(search.startDate) ? search.startDate : undefined,
    endDate: isIsoDate(search.endDate) ? search.endDate : undefined,
    limit: search.limit ? Number(search.limit) : 20,
    page: search.page ? Number(search.page) : 1,
    sort: SORT_OPTIONS.includes(search.sort as SortOption)
      ? (search.sort as SortOption)
      : undefined,
    type: ["expense", "income"].includes(search.type)
      ? (search.type as "income" | "expense")
      : "income",
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { type } = Route.useSearch();

  const handleTabChange = (value: string) => {
    navigate({
      to: `.`,
      search: {
        type: value as "income" | "expense",
      },
    });
  };

  return (
    <div className="min-h-screen p-4 md:px-6">
      <div className="mb-2 flex flex-col gap-4 xs:flex-row xs:items-baseline xs:justify-between">
        <h1 className="text-xl font-semibold text-muted-foreground">
          All Transactions
        </h1>

        <CreateTansaction />
      </div>

      <TransactionFilter />

      <Tabs defaultValue={type} onValueChange={handleTabChange}>
        <TabsList className="sticky top-[72px] mx-auto flex h-12 w-full max-w-sm shadow-md">
          <TabsTrigger
            value="income"
            className="h-full w-full data-[state=active]:bg-emerald-700 data-[state=active]:text-emerald-50"
          >
            <ArrowDownIcon className="mr-2 size-5" />
            Income
          </TabsTrigger>
          <TabsTrigger
            className="h-full w-full data-[state=active]:bg-rose-700 data-[state=active]:text-rose-50"
            value="expense"
          >
            <ArrowUpIcon className="mr-2 size-5" />
            Expense
          </TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Inflows />
        </TabsContent>
        <TabsContent value="expense">
          <Outflows />
        </TabsContent>
      </Tabs>
    </div>
  );
}
