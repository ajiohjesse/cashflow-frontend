import { useUser } from "@/auth";
import { Skeleton } from "./ui/skeleton";

const WelcomeMessage = () => {
  const { data, error } = useUser();

  if (data) {
    return (
      <div className="flex flex-col gap-2 py-4 fade-in-50 xs:flex-row xs:items-center">
        <p className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
          {data.fullName[0]}
        </p>
        <p className="text-lg font-semibold text-primary">
          Welcome {data.fullName} 👋
        </p>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="py-4 fade-in-50">
      <Skeleton className="h-9 w-1/3 min-w-[240px]" />
    </div>
  );
};

export default WelcomeMessage;
