import { useOverviewQuery } from "@/network/queries/overview.queries";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import TransactionCard from "./transaction-card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const LatestTransactions = () => {
  const { data, error, refetch } = useOverviewQuery();

  const getDisplay = () => {
    if (error) {
      return (
        <div className="grid place-items-center space-y-4 px-4 py-12 text-muted-foreground">
          <p>Failed to load transactions.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      );
    }

    if (data) {
      const lastTransactions = [
        ...data.latestInflows.map((d) => ({
          ...d,
          type: "income",
        })),
        ...data.latestOutflows.map((d) => ({ ...d, type: "expense" })),
      ];

      if (lastTransactions.length === 0) {
        return (
          <div className="grid place-items-center space-y-4 px-4 py-12 text-muted-foreground">
            <FolderOpen className="size-12" />
            <p>No transactions found.</p>
          </div>
        );
      }

      return lastTransactions
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((transaction, index) => (
          <TransactionCard
            key={index}
            id={transaction.id}
            amount={transaction.amount}
            category={transaction.category.name}
            description={transaction.description}
            date={transaction.createdAt}
            type={transaction.type as "income" | "expense"}
          />
        ));
    }

    return (
      <div className="space-y-2 py-12">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  };

  return (
    <section className="pt-12">
      <div className="mb-4 flex flex-col justify-between gap-x-8 gap-y-2 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Latest Transactions
        </h2>
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-primary underline"
        >
          All transactions <ArrowUpRight size={16} />
        </Link>
      </div>
      {getDisplay()}
    </section>
  );
};

export default LatestTransactions;
