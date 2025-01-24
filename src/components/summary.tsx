import { financialSummaryQuery } from "@/network/queries/overview.queries";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Improved Flowy component
const Flowy: React.FC<{ isThinking: boolean }> = ({ isThinking }) => (
  <div className="relative h-24 w-24">
    <div
      className={`absolute inset-0 rounded-full bg-blue-300 ${isThinking ? "animate-pulse" : ""}`}
    ></div>
    <div className="absolute inset-2 rounded-full bg-white"></div>
    <div className="absolute left-5 top-7 h-3 w-3 rounded-full bg-black"></div>
    <div className="absolute right-5 top-7 h-3 w-3 rounded-full bg-black"></div>
    <div
      className={`absolute bottom-6 left-1/2 h-4 w-8 -translate-x-1/2 transform rounded-full bg-black ${isThinking ? "animate-bounce" : ""}`}
    ></div>
    <div className="absolute left-1/2 top-1 h-6 w-10 -translate-x-1/2 transform rounded-full bg-blue-500"></div>
    <div className="absolute left-1/2 top-0 h-4 w-8 -translate-x-1/2 transform rounded-full bg-blue-300"></div>
  </div>
);

// Main FinancialSummary component
const FinancialSummary: React.FC = () => {
  const { data, isPending } = useQuery(financialSummaryQuery);

  return (
    <section className="rounded-lg bg-gradient-to-br from-purple-100/50 to-blue-100/50 p-6 shadow-md">
      <h2 className="mb-2 text-center text-2xl font-bold text-primary">
        Financial Summary
      </h2>
      <p className="mb-6 text-center text-sm">
        Here's a summary of your finances for last month.
      </p>
      {/* <div className="flex items-center justify-center mb-6">
        <Flowy isThinking={isPending} />
      </div> */}
      {isPending ? (
        <p className="animate-pulse text-center text-gray-600">
          Flowy is analyzing your finances...
        </p>
      ) : data ? (
        <div className="space-y-4">
          <div className="rounded-md bg-white p-6 shadow">
            <p className="leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Oops! Flowy couldn't fetch your data.
        </p>
      )}
    </section>
  );
};

export default FinancialSummary;
