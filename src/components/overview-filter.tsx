import { cn } from "@/lib/utils";
import { getOverviewQuery } from "@/network/queries/overview.queries";
import { OverviewFilterInterval, useOverviewStore } from "@/stores/stores";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const OverviewFilter = () => {
  const {
    interval,
    setInterval,
    setDateRange,
    startDate,
    endDate,
    clearDateRange,
  } = useOverviewStore();

  const { data, error } = useQuery(
    getOverviewQuery({
      interval,
      startDate,
      endDate,
    }),
  );

  if (error) {
    return null;
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-8 py-8">
      <p className="w-max rounded-full border bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700">
        <CalendarIcon className="mr-2 inline size-3" />
        {data ? data.period : "Loading..."}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          type="single"
          variant="outline"
          defaultValue="day"
          value={interval}
          className={cn(startDate ? "opacity-30" : "opacity-100")}
          onValueChange={(value) => {
            clearDateRange();
            if (!value) return;
            setInterval(value as OverviewFilterInterval);
          }}
        >
          <ToggleGroupItem value="year" aria-label="Toggle bold">
            Y
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Toggle italic">
            M
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Toggle underline">
            W
          </ToggleGroupItem>
          <ToggleGroupItem value="day" aria-label="Toggle underline">
            D
          </ToggleGroupItem>
        </ToggleGroup>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={startDate ? "default" : "outline"}
              className={cn("w-[250px] justify-start text-left font-normal")}
            >
              <CalendarIcon />
              {(() => {
                if (!startDate) return <span>Pick a date</span>;

                if (!endDate || startDate === endDate)
                  return format(startDate, "d LLL y");

                return (
                  <>
                    {format(startDate, "d LLL y")} -{" "}
                    {format(endDate, "d LLL y")}
                  </>
                );
              })()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDate ? new Date(startDate) : undefined}
              selected={{
                from: startDate ? new Date(startDate) : undefined,
                to: endDate ? new Date(endDate) : undefined,
              }}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </section>
  );
};

export default OverviewFilter;
