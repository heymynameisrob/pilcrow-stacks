import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { api, REVALIDATE_DAY } from "@/lib/fetch";

import type { ApiReturnType, User } from "@/lib/types";

export function useUser() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/user", session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<User> = await api
        .get("/api/user")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  const { mutate: updateUserProfile } = useMutation({
    mutationKey: ["/api/user", session?.user.id],
    mutationFn: async (formData: Partial<User>) => {
      const { data, error }: ApiReturnType<Partial<User>> = await api
        .post("/api/user", { json: formData })
        .json();
      if (error) throw Error(error.message);
      console.log("data", data);
      return data;
    },
  });

  return {
    user: data || null,
    error,
    loading: isLoading,
    updateUserProfile,
  };
}
