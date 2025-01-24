import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { getCategoryWithStatQuery } from "@/network/queries/category.queries";
import { getOverviewQuery } from "@/network/queries/overview.queries";
import { getTransactionQuery } from "@/network/queries/transactions.queries";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import Spinner from "./ui/spinner";

interface Props {
  transactionId: string;
  type: "income" | "expense";
}

export default function DeleteTransaction(props: Props) {
  const { transactionId, type } = props;
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-transaction"],
    mutationFn: async () => {
      const url =
        type === "income"
          ? `/v1/inflows/${transactionId}`
          : `/v1/outflows/${transactionId}`;
      await api.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getTransactionQuery(type));
      queryClient.invalidateQueries(getOverviewQuery());
      queryClient.invalidateQueries(getCategoryWithStatQuery(type));
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
            transaction. Note that you can only delete transactions that are
            less than 24 hours old.
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
}
