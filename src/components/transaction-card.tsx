import { cn, dateFormatter, isOlderThanOneDay } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import DeleteTransaction from "./delete-transaction";

export interface TransactionCardProps {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: "income" | "expense";
}

const TransactionCard = (props: TransactionCardProps) => {
  return (
    <div className="flex gap-4 border-b py-4 last:border-b-0">
      <p
        className={cn(
          "self-start rounded-full p-2 text-xs font-medium",
          props.type === "income"
            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
            : "border-rose-500 bg-rose-50 text-rose-600",
        )}
      >
        {props.type === "income" ? (
          <ArrowDownIcon size={16} />
        ) : (
          <ArrowUpIcon size={16} />
        )}
      </p>
      <div className="flex-1">
        <p className="font-semibold">{props.category}</p>
        <p className="pt-1 text-sm">{props.description}</p>
        <p className="pt-2 text-sm text-muted-foreground">
          {dateFormatter.format(new Date(props.date))}
        </p>
      </div>

      <div className="flex flex-col justify-between">
        <p
          className={cn(
            "self-start font-bold",
            props.type === "income" ? "text-emerald-600" : "text-rose-600",
          )}
        >
          &#8358;
          {props.amount.toLocaleString("en-US")}
        </p>
        {isOlderThanOneDay(new Date(props.date)) ? null : (
          <DeleteTransaction type={props.type} transactionId={props.id} />
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
