import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export function useUser(id: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/user", id],
    queryFn: async () => {
      const res = await ky.get("/api/user").json();
      return res;
    },
  });

  return {
    user: data,
    error,
    loading: isLoading,
  };
}
