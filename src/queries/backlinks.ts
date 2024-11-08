import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { api, REVALIDATE_DAY } from "@/lib/fetch";

import type { ApiReturnType, Backlink, Doc } from "@/lib/types";

export function useBacklinks() {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/backlinks", session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Array<Backlink>> = await api
        .get("/api/backlinks")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  const { mutate: newBacklink } = useMutation({
    mutationFn: async (backlink: Partial<Backlink>) => {
      const { data, error }: ApiReturnType<Backlink> = await api
        .post("/api/backlinks", {
          json: { ...backlink, user: session?.user.id },
        })
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onMutate: (backlink: Partial<Backlink>) => {
      queryClient.setQueryData(
        ["/api/backlinks", session?.user.id],
        (oldData: Array<Backlink>) => {
          return [...oldData, backlink];
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/backlinks", session?.user.id],
      });
    },
  });

  const { mutate: removeBacklink } = useMutation({
    mutationFn: async (backlink: Partial<Backlink>) => {
      const { data, error }: ApiReturnType<Backlink> = await api
        .delete("/api/backlinks", { json: backlink })
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onMutate: (backlink: Partial<Backlink>) => {
      queryClient.setQueryData(
        ["/api/backlinks", session?.user.id],
        (oldData: Array<Backlink>) => {
          return oldData.filter((b) => b !== backlink);
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/backlinks", session?.user.id],
      });
    },
  });

  return {
    backlinks: data || null,
    loading: isLoading,
    error,
    newBacklink,
    removeBacklink,
  };
}

export function useBacklinkedDocs(id: string) {
  const { data: session } = useSession();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: [`/api/backlinks/docs/${id}`, session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Array<Doc>> = await api
        .get(`/api/backlinks/docs/${id}`)
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  return {
    docs: data || [],
    loading: isLoading,
    error,
  };
}
