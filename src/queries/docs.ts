import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

import { api, REVALIDATE_DAY } from "@/lib/fetch";
import { useOpenDocsStore } from "@/stores/docs";

import type { ApiReturnType, Doc } from "@/lib/types";

export function useDoc(docId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [`/api/docs/${docId}`, session?.user.id, docId],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Doc> = await api
        .get(`/api/docs/${docId}`)
        .json();
      console.log(error);
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  const { mutate: saveDoc } = useMutation({
    mutationKey: [`/api/docs/${docId}`],
    mutationFn: async (doc: Partial<Doc>) => {
      const { data, error }: ApiReturnType<Partial<Doc>> = await api
        .post(`/api/docs/${docId}`, { json: doc })
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/docs/${docId}`, session?.user.id],
      });
    },
  });

  return {
    doc: data || null,
    error,
    loading: isLoading,
    saveDoc,
  };
}

export function useDocs() {
  const { data: session } = useSession();
  const { openDoc } = useOpenDocsStore();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/docs", session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Array<Doc>> = await api
        .get("/api/docs")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  const { mutate: newDoc } = useMutation({
    mutationFn: async () => {
      const { data, error }: ApiReturnType<Doc> = await api
        .post("/api/docs/new")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["/api/docs", session?.user.id],
        (oldData: Array<Doc>) => {
          return [
            ...oldData,
            {
              id: Math.random(),
              title: format(new Date(), "mm DD YY"),
              emoji: "📝",
            },
          ];
        },
      );
    },
    onSuccess: (data: Doc | null) => {
      if (!data) return null;
      openDoc(data.id);
      queryClient.invalidateQueries({
        queryKey: ["/api/docs", session?.user.id],
      });
    },
  });

  return {
    docs: data || null,
    loading: isLoading,
    error,
    newDoc,
  };
}
