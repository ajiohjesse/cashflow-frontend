import { getTransactionQuery } from "@/network/queries/transactions.queries";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { Button } from "react-day-picker";
import TransactionCard from "./transaction-card";
import { PagePagination } from "./ui/page-pagination";
import { Skeleton } from "./ui/skeleton";

const Outflows = () => {
  const { page, limit, search, categories, startDate, endDate, sort } =
    useSearch({
      from: "/_protected/transactions",
    });
  const { data, error, refetch } = useQuery(
    getTransactionQuery("expense", {
      categories: categories?.trim() ? categories.split(",") : [],
      search,
      startDate,
      endDate,
      limit,
      page,
      sort,
    }),
  );

  if (data) {
    if (data.transactions.length === 0) {
      return (
        <div className="grid place-items-center space-y-4 px-4 py-20 text-muted-foreground">
          <FolderOpen className="size-12" />
          <p>No transactions found.</p>
        </div>
      );
    }

    return (
      <section className="py-8">
        <p className="text-sm font-semibold text-muted-foreground">
          Showing {data.transactions.length} of {data.pagination.totalCount}{" "}
          {data.pagination.totalCount === 1 ? "transaction" : "transactions"}.
        </p>

        <div className="pb-12 pt-4">
          {data?.transactions.map(
            ({ amount, id, category, description, createdAt }) => (
              <TransactionCard
                key={id}
                id={id}
                type="expense"
                amount={amount}
                category={category.name}
                description={description}
                date={createdAt}
              />
            ),
          )}
        </div>

        <PagePagination
          page={page}
          pageSize={limit}
          totalCount={data?.pagination.totalCount || 0}
          pageSizeSelectOptions={{
            pageSizeOptions: [5, 10, 15, 20],
          }}
        />
      </section>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center space-y-4 px-4 py-12 text-muted-foreground">
        <FolderOpen className="size-12" />
        <p>Error getting transactions</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-12">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
};

export default Outflows;
