import { cn } from "@/lib/utils";
import { getCategoryWithStatQuery } from "@/network/queries/category.queries";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, FolderOpen } from "lucide-react";

interface Props {
  type: "income" | "expense";
}

const CategoryStats = (props: Props) => {
  const { type } = props;
  const { data, error } = useQuery(getCategoryWithStatQuery(type));

  if (error) {
    return null;
  }

  if (data) {
    const categories = data.categories;
    const highestIncomeCatecories = [...categories].sort(
      (a, b) => b.totalTransactions - a.totalTransactions,
    );

    const topCategories: { name: string; total: number }[] = [];

    for (const category of highestIncomeCatecories) {
      if (topCategories.length === 0) {
        if (category.totalTransactions === 0) continue;
        topCategories.push({
          name: category.name,
          total: category.totalTransactions,
        });
        continue;
      }

      if (category.totalTransactions === topCategories[0].total) {
        topCategories.push({
          name: category.name,
          total: category.totalTransactions,
        });
        continue;
      } else {
        break;
      }
    }

    const itemsToDisplay = topCategories.slice(0, 5);
    const hiddenItems = topCategories.slice(5);

    return (
      <article className={cn("grid w-full rounded-lg border p-4 shadow-md")}>
        <h2 className="text-sm font-bold text-muted-foreground">
          Most Frequent {type === "income" ? "Income" : "Expense"} Category
        </h2>
        <p
          className={cn(
            "my-2 border-y py-2 font-bold",
            type === "income" ? "text-emerald-700" : "text-rose-700",
          )}
        >
          {itemsToDisplay.length === 0 ? (
            <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <FolderOpen />
              No Transactions
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {type === "income" ? (
                <ArrowDown className="size-5" />
              ) : (
                <ArrowUp className="size-5" />
              )}
              {itemsToDisplay[0].total} transactions
            </span>
          )}
        </p>
        <ul className="list-inside list-disc space-y-2 py-2 text-sm font-medium">
          {itemsToDisplay.map((c, i) => (
            <li key={i}>{c.name}</li>
          ))}
        </ul>
        {hiddenItems.length > 0 ? (
          <span className="text-xs font-medium text-muted-foreground">
            + {hiddenItems.length} more{" "}
            {hiddenItems.length > 1 ? "categories" : "category"}
          </span>
        ) : null}
      </article>
    );
  }
};

export default CategoryStats;
