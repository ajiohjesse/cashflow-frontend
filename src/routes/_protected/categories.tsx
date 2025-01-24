import AddCategory from "@/components/add-category";
import Categories from "@/components/categories";
import CategoryStats from "@/components/category-stats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_protected/categories")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => ({
    type: ["income", "expense"].includes(search.type)
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
    <div className="p-4 md:px-6">
      <div className="mb-2 flex flex-col gap-4 xs:flex-row xs:items-baseline xs:justify-between">
        <h1 className="text-xl font-semibold text-muted-foreground">
          Categories
        </h1>

        <AddCategory
          type={type}
          trigger={
            <Button>
              <PlusIcon /> Add Category
            </Button>
          }
        />
      </div>

      <section className="flex flex-col gap-4 py-4 md:flex-row">
        <CategoryStats type="income" />
        <CategoryStats type="expense" />
      </section>

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
          <Categories type={type} />
        </TabsContent>
        <TabsContent value="expense">
          <Categories type={type} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
