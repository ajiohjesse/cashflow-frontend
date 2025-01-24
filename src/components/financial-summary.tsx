import panda from "@/assets/panda.svg";
import { financialSummaryQuery } from "@/network/queries/overview.queries";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const FinancialSummary = () => {
  const { data, error, refetch } = useQuery(financialSummaryQuery);

  return (
    <div className="relative -mx-4 mt-16 bg-gradient-to-b from-accent via-transparent to-transparent p-6 md:-mx-8">
      <div className="absolute -top-8 right-4 md:-top-14">
        <div
          className="absolute right-20 w-[160px] animate-bounce rounded-lg rounded-br-none bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-md md:right-24"
          style={{ animationDuration: "2.5s" }}
        >
          Hi, I'm Flowy, your AI financial assistant.
        </div>
        <img src={panda} alt="panda" className="h-28 md:h-36" />
      </div>

      <h2 className="text-xl font-semibold text-primary">Financial Summary</h2>

      <p className="mb-4 text-sm font-semibold leading-6">
        Financial Summary for last month.
      </p>

      {data ? (
        <p className="text-pretty text-sm leading-7 md:text-base md:leading-7">
          {data.summary}
        </p>
      ) : error ? (
        <>
          <p className="mb-4 text-pretty text-sm leading-7 md:text-base md:leading-7">
            There was an error fetching the financial summary for last month.
          </p>
          <Button onClick={() => refetch()} type="button">
            Retry
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
