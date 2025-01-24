import CategoryStats from "@/components/category-stats";
import CreateTansaction from "@/components/create-transaction";
import LatestTransactions from "@/components/latest-transactions";
import OverviewFilter from "@/components/overview-filter";
import OverviewTotals from "@/components/overview-totals";
import FinancialSummary from "@/components/summary";
import { Separator } from "@/components/ui/separator";
import WelcomeMessage from "@/components/welcome-message";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/overview")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid xl:grid-cols-[1fr_300px]">
      <div data-name="main-overview-section" className="px-4 pb-4 md:px-6">
        <WelcomeMessage />
        <section className="flex items-baseline justify-between gap-8 border-b py-4">
          <h1 className="text-xl font-semibold text-muted-foreground">
            Overview
          </h1>
          <CreateTansaction />
        </section>

        <OverviewFilter />
        <OverviewTotals />
        <LatestTransactions />
        <Separator className="mb-8" />
        <FinancialSummary />
      </div>
      <div
        data-name="aside-overview-summary"
        className="overflow-y-auto bg-background px-4 py-4 md:px-6 xl:sticky xl:top-16 xl:z-50 xl:h-[calc(100dvh-64px)] xl:border-l xl:px-6"
      >
        <section className="flex flex-col gap-4 py-4 md:flex-row xl:flex-col">
          <CategoryStats type="income" />
          <CategoryStats type="expense" />
        </section>
      </div>
    </div>
  );
}
