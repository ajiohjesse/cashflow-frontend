import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { getCategoryWithStatQuery } from "@/network/queries/category.queries";
import { getOverviewQuery } from "@/network/queries/overview.queries";
import { getTransactionQuery } from "@/network/queries/transactions.queries";
import { useMutation } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import AddCategory from "./add-category";
import { CategorySelect } from "./category-select";
import { Input } from "./ui/input";
import Spinner from "./ui/spinner";
import { Textarea } from "./ui/textarea";

const CreateTansaction = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-5" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="income" className="">
          <TabsList className="w-full">
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
            <TransactionForm type="income" />
          </TabsContent>
          <TabsContent value="expense">
            <TransactionForm type="expense" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTansaction;

interface TransactionFormProps {
  type: "income" | "expense";
}

const TransactionForm = (props: TransactionFormProps) => {
  const { type } = props;
  const posthog = usePostHog();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<
    { id: string; name: string } | undefined
  >();
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: async () => {
      if (type === "income") {
        return (
          await api.post("/v1/inflows", {
            amount: Number(amount),
            categoryId: category?.id,
            description: description.trim(),
          })
        ).data.data;
      }

      return (
        await api.post("/v1/outflows", {
          amount: Number(amount),
          categoryId: category?.id,
          description: description.trim(),
        })
      ).data.data;
    },
    onSuccess: () => {
      toast({
        title: "Transaction added successfully",
      });
      posthog.capture("New transaction", { type });
      queryClient.invalidateQueries(getOverviewQuery());
      queryClient.invalidateQueries(getTransactionQuery(type));
      queryClient.invalidateQueries(getCategoryWithStatQuery(type));
      setCategory(undefined);
      setAmount("");
      setDescription("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    if (!amount) {
      toast({
        title: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    mutate();
  };

  return (
    <form className="grid gap-y-6 pt-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="income-category">Category</Label>
          <AddCategory type={type} />
        </div>
        <CategorySelect value={category} setValue={setCategory} type={type} />
      </div>
      <div className="grid justify-items-start gap-2">
        <Label htmlFor={`${type}-amount`}>Amount</Label>
        <Input
          id={`${type}-amount`}
          type="text"
          inputMode="numeric"
          required
          placeholder="Enter amount"
          value={amount ? `₦ ${Number(amount).toLocaleString("en-US")}` : "₦ "}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>
      <div className="grid justify-items-start gap-2">
        <Label htmlFor="income-description">Description (optional)</Label>
        <Textarea
          className="resize-none"
          id={`${type}-description`}
          placeholder="E.g Salary for the month this month."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className={cn(
          type === "income"
            ? "bg-emerald-700 text-emerald-50 hover:bg-emerald-600"
            : "bg-rose-700 text-rose-50 hover:bg-rose-600",
        )}
      >
        <Spinner title="Create transaction" loading={isPending}>
          Add {type === "income" ? "Income" : "Expense"}
        </Spinner>
      </Button>
    </form>
  );
};
