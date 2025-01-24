import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import {
  inflowCategoryQuery,
  outflowCategoryQuery,
} from "@/network/queries/category.queries";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Transaction = "income" | "expense";

interface CategorySelectProps {
  value?: {
    id: string;
    name: string;
  };
  setValue: (value?: { id: string; name: string }) => void;
  type: Transaction;
}

const useCategoryQuery = (type: Transaction) => {
  if (type === "income") {
    const { data, error, refetch } = useQuery(inflowCategoryQuery);
    return { categories: data?.inflowCategories, error, refetch };
  }
  const { data, error, refetch } = useQuery(outflowCategoryQuery);
  return { categories: data?.outflowCategories, error, refetch };
};

export const CategorySelect = (props: CategorySelectProps) => {
  const {
    value: selectedCategory,
    setValue: setSelectedCategory,
    type,
  } = props;
  const [open, setOpen] = useState(false);
  const { categories, error, refetch } = useCategoryQuery(type);

  if (error) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Select category...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>
                <p className="mb-2">Failed to load categories.</p>
                <Button size="sm" variant="link" onClick={() => refetch()}>
                  Retry
                </Button>
              </CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  if (categories) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory.id)?.name
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      setSelectedCategory(
                        selectedCategory?.name === category.name
                          ? undefined
                          : { id: category.id, name: category.name },
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory?.id === category.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          Select category...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>
              <p className="mb-2">Loading categories...</p>
            </CommandEmpty>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
