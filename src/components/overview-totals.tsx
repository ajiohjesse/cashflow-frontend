import { cn } from "@/lib/utils";
import { useOverviewQuery } from "@/network/queries/overview.queries";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";

const TotalLoading = () => <span className="animate-ping">...</span>;

const OverviewTotals = () => {
  const { data, error } = useOverviewQuery();

  const totals = {
    totalIncome: error
      ? "-"
      : data?.totalInflowAmount.toLocaleString("en-US") || <TotalLoading />,
    totalExpenses: error
      ? "-"
      : data?.totalOutflowAmount.toLocaleString("en-US") || <TotalLoading />,
    netTotal: error
      ? "-"
      : data?.netTotal.toLocaleString("en-US") || <TotalLoading />,
  };

  return (
    <section className="flex flex-col gap-4 sm:flex-row">
      <div
        className="flex-1 rounded-lg border p-4 shadow-md"
        data-name="inflow-summary"
      >
        <ArrowDownIcon className="size-8 text-emerald-600" />
        <h2 className="mb-2 mt-4 text-sm font-medium uppercase text-muted-foreground">
          Total Income
        </h2>
        <p className="flex items-baseline gap-1">
          <span className="font-bold text-muted-foreground">&#8358;</span>
          <span className="text-2xl font-bold text-emerald-600">
            {totals.totalIncome}
          </span>
        </p>
      </div>

      <div
        className="flex-1 rounded-lg border p-4 shadow-md"
        data-name="outflow-summary"
      >
        <ArrowUpIcon className="size-8 text-rose-600" />
        <h2 className="mb-2 mt-4 text-sm font-medium uppercase text-muted-foreground">
          Total Expenses
        </h2>
        <p className="flex items-baseline gap-1">
          <span className="font-bold text-muted-foreground">&#8358;</span>
          <span className="text-2xl font-bold text-rose-600">
            {totals.totalExpenses}
          </span>
        </p>
      </div>

      <div className="flex-1 rounded-lg border p-4 shadow-md">
        <WalletIcon className="size-8 text-sky-600" />
        <h2 className="mb-2 mt-4 text-sm font-medium uppercase text-muted-foreground">
          Net Total
        </h2>
        <p className="flex items-baseline gap-1">
          <span className="font-bold text-muted-foreground">&#8358;</span>
          <span
            className={cn(
              "text-2xl font-bold",
              data && data.netTotal < 0 ? "text-rose-600" : "text-emerald-600",
            )}
          >
            {totals.netTotal}
          </span>
        </p>
      </div>
    </section>
  );
};

export default OverviewTotals;
