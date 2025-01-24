import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import {
  getCategoryWithStatQuery,
  inflowCategoryQuery,
  outflowCategoryQuery,
} from "@/network/queries/category.queries";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Spinner from "./ui/spinner";

interface AddCategoryProps {
  type: "income" | "expense";
  trigger?: React.ReactNode;
}

const AddCategory = (props: AddCategoryProps) => {
  const { type, trigger } = props;

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const categoryNameMap = {
    income: "New Income Category",
    expense: "New Expense Category",
  };
  const categoryPlaceholderMap = {
    income: "E.g Salary",
    expense: "E.g Transportation",
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-category"],
    mutationFn: async (type: "income" | "expense") => {
      if (type === "income") {
        return (
          await api.post("/v1/categories/inflow", {
            name: categoryName,
          })
        ).data.data;
      }

      return (
        await api.post("/v1/categories/outflow", {
          name: categoryName,
        })
      ).data.data;
    },
    onSuccess: () => {
      toast({
        title: "Category added successfully",
      });
      setCategoryName("");
      setOpen(false);

      queryClient.invalidateQueries(
        type === "income" ? inflowCategoryQuery : outflowCategoryQuery,
      );
      queryClient.invalidateQueries(getCategoryWithStatQuery(type));
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({
        title: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }
    mutate(type);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="link" className="gap-1 text-xs">
            <PlusIcon className="size-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoryNameMap[type]}</DialogTitle>
          <DialogDescription>
            {type === "income"
              ? "Create a category to group your income streams."
              : "Create a category to group your expenses."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="income-amount">Category Name</Label>
            <Input
              id={type + "category-name"}
              type="text"
              placeholder={categoryPlaceholderMap[type]}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <Button type="submit" onClick={handleSubmit}>
            {
              <Spinner title="Creating catrgory" loading={isPending}>
                Create Category
              </Spinner>
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
