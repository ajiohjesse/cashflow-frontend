import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import {
  getCategoryWithStatQuery,
  inflowCategoryQuery,
  outflowCategoryQuery,
} from "@/network/queries/category.queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FolderOpen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useVitePostHog } from "vite-plugin-posthog/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Spinner from "./ui/spinner";

interface Props {
  type: "income" | "expense";
}

const Categories = (props: Props) => {
  const { type } = props;
  const { data, error, refetch } = useQuery(getCategoryWithStatQuery(type));

  if (data) {
    const { categories } = data;

    if (categories.length === 0) {
      <div className="grid place-items-center space-y-4 px-4 py-20 text-muted-foreground">
        <FolderOpen className="size-12" />
        <p>No Categories found.</p>
      </div>;
    }

    return (
      <section className="py-4">
        <p className="mb-4 text-sm font-bold text-muted-foreground">
          You have {categories.length} {type} categories.
        </p>
        {categories.map((c, i) => (
          <CategoryCard
            index={i}
            key={c.id}
            type={type}
            id={c.id}
            name={c.name}
            totalTransactions={c.totalTransactions}
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center space-y-4 px-4 py-12 text-muted-foreground">
        <FolderOpen className="size-12" />
        <p>Error getting categories</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-12">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
};

export default Categories;

interface CategoryCardProps {
  index: number;
  id: string;
  name: string;
  totalTransactions: number;
  type: "income" | "expense";
}

const CategoryCard = (props: CategoryCardProps) => {
  const { index, id, name, totalTransactions, type } = props;

  return (
    <div className="j flex gap-4 border-b py-4 last:border-b-0">
      <div className="flex w-8 items-center justify-center rounded bg-primary text-primary-foreground">
        {index + 1}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="pt-2 text-sm text-muted-foreground">
          {totalTransactions}{" "}
          {totalTransactions === 1 ? "transaction" : "transactions"}.
        </p>
      </div>

      {totalTransactions === 0 ? <DeleteCategory id={id} type={type} /> : null}
    </div>
  );
};

const DeleteCategory = (props: { id: string; type: "income" | "expense" }) => {
  const { id, type } = props;
  const posthog = useVitePostHog();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: async () => {
      const url =
        type === "income"
          ? `/v1/categories/inflow/${id}`
          : `/v1/categories/outflow/${id}`;
      await api.delete(url);
    },
    onSuccess: () => {
      posthog?.capture("Delete category", { type });
      queryClient.invalidateQueries(getCategoryWithStatQuery(type));
      queryClient.invalidateQueries(
        type === "income" ? inflowCategoryQuery : outflowCategoryQuery,
      );
      setDialogOpen(false);
    },
  });

  const handleDialog = (open: boolean) => {
    if (isDialogOpen && isPending) return;
    setDialogOpen(open);
  };

  const handleDelete = () => {
    if (isPending) return;
    mutate();
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="self-end text-rose-700"
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            category. Note that you can only delete categories without any
            attached transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-500"
          >
            <Spinner loading={isPending} title="Deleting transaction">
              Delete
            </Spinner>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
