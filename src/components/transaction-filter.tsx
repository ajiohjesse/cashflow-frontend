import { cn, debounce } from "@/lib/utils";
import {
  inflowCategoryQuery,
  outflowCategoryQuery,
} from "@/network/queries/category.queries";
import { SortOption } from "@/routes/_protected/transactions";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, SearchIcon, SortAscIcon, XIcon } from "lucide-react";
import { useTransition } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { MultiSelect } from "./ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";

const TransactionFilter = () => {
  const navigate = useNavigate();
  const { type, categories, startDate, endDate, search } = useSearch({
    from: "/_protected/transactions",
  });

  const isFiltering =
    Boolean(categories) ||
    Boolean(search) ||
    Boolean(startDate) ||
    Boolean(endDate);

  const handleClearFilters = () => {
    navigate({
      to: `.`,
      search: (prev) => ({
        ...prev,
        dateSort: undefined,
        amountSort: undefined,
        categories: undefined,
        search: undefined,
        startDate: undefined,
        endDate: undefined,
        sort: undefined,
      }),
    });
  };

  return (
    <section className="flex flex-col items-center gap-2 py-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <Search />
        <DateFilter />
      </div>
      <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
        {type === "income" ? (
          <InflowCategoryFilter />
        ) : (
          <OutflowCategoryFilter />
        )}
        <SortingFilter />
        {isFiltering ? (
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="font-medium text-rose-700 animate-in slide-in-from-top-5"
          >
            <XIcon />
            <span>Clear Filters</span>
          </Button>
        ) : null}
      </div>
    </section>
  );
};

export default TransactionFilter;

const Search = () => {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const { search } = useSearch({
    from: "/_protected/transactions",
  });

  const handleDebouncedSearch = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        navigate({
          to: ".",
          search: (prev) => ({
            ...prev,
            search: e.target.value.trim() || undefined,
          }),
          replace: true,
        });
      });
    },
    500,
  );

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-2 top-2 size-5 text-muted-foreground" />
      <Input
        key={search}
        defaultValue={search}
        placeholder="Search transaction description"
        onChange={handleDebouncedSearch}
        className="pl-8 text-sm"
      />
    </div>
  );
};

const DateFilter = () => {
  const navigate = useNavigate();
  const { startDate, endDate } = useSearch({
    from: "/_protected/transactions",
  });

  const clearDateQuery = () => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, startDate: undefined, endDate: undefined }),
      replace: true,
    });
  };

  const handleDateSelect = (range?: DateRange) => {
    if (!range || range.from?.toISOString() === range.to?.toISOString()) {
      return clearDateQuery();
    }

    if (startDate && range.from === new Date(startDate)) {
      return clearDateQuery();
    }
    if (endDate && range.to === new Date(endDate)) {
      return clearDateQuery();
    }

    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        startDate: range.from?.toISOString(),
        endDate: range.to?.toISOString(),
      }),
      replace: true,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={startDate ? "default" : "outline"}
          className={cn(
            "w-full min-w-[250px] justify-start text-left font-normal sm:w-[250px]",
          )}
        >
          <CalendarIcon />
          {(() => {
            if (!startDate) return <span>Pick a date</span>;

            if (!endDate || startDate === endDate)
              return format(startDate, "d LLL y");

            return (
              <>
                {format(startDate, "d LLL y")} - {format(endDate, "d LLL y")}
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
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

const InflowCategoryFilter = () => {
  const navigate = useNavigate();
  const { categories } = useSearch({
    from: "/_protected/transactions",
  });
  const defaultCategories = categories?.trim() ? categories.split(",") : [];
  const { data } = useQuery(inflowCategoryQuery);

  const options = data
    ? data.inflowCategories.map((c) => ({
        label: c.name,
        value: c.name.toLowerCase(),
      }))
    : [];

  const handleCategoryChange = (values: string[]) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        categories: values.length > 0 ? values.join(",") : undefined,
      }),
      replace: true,
    });
  };

  return (
    <MultiSelect
      key={categories}
      options={options}
      defaultValue={defaultCategories}
      onValueChange={handleCategoryChange}
      placeholder="Select Categories"
      animation={2}
    />
  );
};
const OutflowCategoryFilter = () => {
  const navigate = useNavigate();
  const { categories } = useSearch({
    from: "/_protected/transactions",
  });
  const defaultCategories = categories?.trim() ? categories.split(",") : [];
  const { data } = useQuery(outflowCategoryQuery);

  const options = data
    ? data.outflowCategories.map((c) => ({
        label: c.name,
        value: c.name.toLowerCase(),
      }))
    : [];

  const handleCategoryChange = (values: string[]) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        categories: values.length > 0 ? values.join(",") : undefined,
      }),
      replace: true,
    });
  };

  return (
    <MultiSelect
      options={options}
      defaultValue={defaultCategories}
      onValueChange={handleCategoryChange}
      placeholder="Select Categories"
      animation={2}
    />
  );
};

const SortingFilter = () => {
  const [_, startTransition] = useTransition();
  const navigate = useNavigate();
  const { sort } = useSearch({
    from: "/_protected/transactions",
  });

  const handleSortChange = (value: string) => {
    startTransition(() => {
      navigate({
        to: `.`,
        search: (prev) => ({
          ...prev,
          page: 1,
          sort: value === "none" ? undefined : (value as SortOption),
        }),
      });
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={sort ? "default" : "outline"}
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[150px]",
          )}
        >
          <SortAscIcon />
          {sort ? sort : "Sort by"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <RadioGroup
          defaultValue={sort || "none"}
          onValueChange={(value) => handleSortChange(value)}
          className="text-sm"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="amount:none" />
            <label htmlFor="amount:none">None</label>
          </div>

          <Separator className="my-px" />

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="amount:asc" id="amount:asc" />
            <label htmlFor="amount:asc">Amount - Asc</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="amount:desc" id="amount:desc" />
            <label htmlFor="amount:desc">Amount - Desc</label>
          </div>

          <Separator className="my-px" />

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date:asc" id="date:asc" />
            <label htmlFor="date:asc">Date - Asc</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date:desc" id="date:desc" />
            <label htmlFor="date:desc">Date - Desc</label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};
