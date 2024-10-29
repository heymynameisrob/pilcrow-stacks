import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { api, REVALIDATE_DAY } from "@/lib/fetch";

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
      console.log("API Response", data);
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
              title: "New document",
              emoji: "📝",
            },
          ];
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/docs", session?.user.id],
      });
    },
  });

  const openDoc = (doc: Partial<Doc>) => {
    queryClient.setQueryData(
      ["/api/docs", session?.user.id],
      (oldData: Array<Partial<Doc>>) => {
        const filteredData = oldData.filter((d) => doc.id !== d.id);
        return [...filteredData, doc];
      },
    );
  };

  return {
    docs: data || null,
    loading: isLoading,
    error,
    newDoc,
    openDoc,
  };
}
