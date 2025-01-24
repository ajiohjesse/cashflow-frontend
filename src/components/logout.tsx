import { useAuthStore } from "@/auth";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

const Logout = () => {
  const authStore = useAuthStore();
  const { mutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return await api.post("/v1/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      authStore.clearUser();
    },
  });

  return (
    <Button
      variant="link"
      onClick={() => mutate()}
      className="px-2 text-rose-600 hover:text-rose-500"
    >
      <Spinner
        loading={isPending}
        title="Logging out"
        childrenClassName="flex items-center gap-2"
      >
        <LogOut />
        Logout
      </Spinner>
    </Button>
  );
};

export default Logout;
