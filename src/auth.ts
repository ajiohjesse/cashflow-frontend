import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { create } from "zustand";
import { queryClient } from "./lib/react-query";
import { userQuery } from "./network/queries/user.queries";

const userDetailsSchema = z.object({
  accessToken: z.string(),
});

type UserDetails = z.infer<typeof userDetailsSchema>;

interface AuthStore {
  user: UserDetails | null;
  setUser: (userDetails: UserDetails) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getSavedUser(),
  setUser: (userDetails) => {
    set({ user: userDetails });
    saveUser(userDetails);
  },
  clearUser: () => {
    set({ user: null });
    clearUser();
    queryClient.removeQueries(userQuery);
  },
}));

function getSavedUser() {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    const result = userDetailsSchema.safeParse(JSON.parse(user));
    return result.success ? result.data : null;
  } catch {
    clearUser();
    return null;
  }
}

function saveUser(userDetails: UserDetails) {
  localStorage.setItem("user", JSON.stringify(userDetails));
}
function clearUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("overview-filter");
}

export const useUser = () => useQuery(userQuery);
