import * as React from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { api, REVALIDATE_DAY } from "@/lib/fetch";
import { LIMIT } from "@/lib/utils";

import type { ApiReturnType, Doc, DocsInView } from "@/lib/types";

export function useDoc(docId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { closeDoc } = useDocsInView();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: [`/api/docs/${docId}`, session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Doc> = await api
        .get(`/api/docs/${docId}`)
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  const { mutate: saveDoc } = useMutation({
    mutationKey: [`/api/docs/${docId}`, session?.user.id],
    mutationFn: async (doc: Partial<Doc>) => {
      const { data, error }: ApiReturnType<Partial<Doc>> = await api
        .post(`/api/docs/${docId}`, { json: doc })
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/docs`, session?.user.id],
      });
    },
  });

  const { mutate: deleteDoc } = useMutation({
    mutationKey: [`/api/docs/${docId}`, session?.user.id],
    mutationFn: async () => {
      const { data, error }: ApiReturnType<void> = await api
        .delete(`/api/docs/${docId}`)
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onMutate: async () => {
      queryClient.setQueryData(
        ["/api/docs", session?.user.id],
        (old: Array<Doc>) => {
          return old.filter((doc) => doc.id !== docId);
        },
      );
      queryClient.setQueryData(
        ["/api/docs/in-view", session?.user.id],
        (old: DocsInView) => {
          return {
            ...old,
            docIds:
              old.docIds.length > 0
                ? old.docIds.filter((id) => id !== docId)
                : [],
          };
        },
      );
    },
    onSuccess: () => {
      closeDoc(docId);
      queryClient.invalidateQueries({
        queryKey: ["/api/docs", session?.user.id],
      });
      toast.success("Document deleted");
    },
  });

  return {
    doc: data || null,
    error,
    loading: isLoading,
    saveDoc,
    deleteDoc,
  };
}

export function useDocsInView() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/docs/in-view", session?.user.id],
    queryFn: async () => {
      const { data, error }: ApiReturnType<DocsInView> = await api
        .get("/api/docs/in-view")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
    placeholderData: keepPreviousData,
  });

  const { mutate: closeDoc } = useMutation({
    mutationKey: ["/api/docs/in-view", session?.user.id],
    mutationFn: async (docId: string) => {
      const docIds = data?.docIds.filter((id) => id !== docId) || [];

      const { data: responseData, error }: ApiReturnType<DocsInView> = await api
        .put("/api/docs/in-view", {
          json: {
            ...data,
            docIds,
            cursor: docIds.length > 3 ? docIds.length - LIMIT : 0,
          },
        })
        .json();

      if (error) throw Error(error.message);
      return responseData;
    },
    onMutate: async (docId) => {
      // Optimistically update to the new value
      queryClient.setQueryData(
        ["/api/docs/in-view", session?.user.id],
        (old: DocsInView | undefined) => {
          return {
            ...old,
            docIds: old?.docIds ? old.docIds.filter((id) => id !== docId) : [],
          };
        },
      );
    },
  });

  const { mutate: closeAllDocs } = useMutation({
    mutationKey: ["/api/docs/in-view", session?.user.id],
    mutationFn: async () => {
      const { data: responseData, error }: ApiReturnType<DocsInView> = await api
        .put("/api/docs/in-view", { json: { ...data, docIds: [], cursor: 0 } })
        .json();

      if (error) throw Error(error.message);
      return responseData;
    },
    onMutate: async () => {
      // Optimistically update to empty array
      queryClient.setQueryData(["/api/docs/in-view", session?.user.id], {
        docIds: [],
        cursor: 0,
      });
    },
  });

  const { mutate: openDoc } = useMutation({
    mutationKey: ["/api/docs/in-view", session?.user.id],
    mutationFn: async ({
      rootId,
      targetId,
    }: {
      rootId?: string;
      targetId: string;
    }) => {
      const docIds = data?.docIds ?? [];
      const rootIndex = rootId ? docIds.indexOf(rootId) : 0;
      const newDocIds = rootId
        ? [...docIds.slice(0, rootIndex + 1), targetId]
        : [...docIds, targetId];

      const { data: responseData, error }: ApiReturnType<DocsInView> = await api
        .put("/api/docs/in-view", {
          json: {
            ...data,
            docIds: newDocIds,
            cursor: docIds.length > 3 ? docIds.length - LIMIT : 0,
          },
        })
        .json();

      if (error) throw Error(error.message);
      return responseData;
    },
    onMutate: async ({ rootId, targetId }) => {
      const docIds =
        queryClient.getQueryData<DocsInView>([
          "/api/docs/in-view",
          session?.user.id,
        ])?.docIds ?? [];
      const rootIndex = rootId ? docIds.indexOf(rootId) : 0;
      const newDocIds = rootId
        ? [...docIds.slice(0, rootIndex + 1), targetId]
        : [...docIds, targetId];

      queryClient.setQueryData(
        ["/api/docs/in-view", session?.user.id],
        (old: DocsInView | undefined) => {
          return {
            ...old,
            docIds: newDocIds,
            cursor: newDocIds.length > 3 ? newDocIds.length - LIMIT : 0,
          };
        },
      );
    },
  });

  const { mutate: setCursor } = useMutation({
    mutationKey: ["/api/docs/in-view", session?.user.id],
    mutationFn: async (cursor: number) => {
      const { data: responseData, error }: ApiReturnType<DocsInView> = await api
        .put("/api/docs/in-view", { json: { ...data, cursor } })
        .json();

      if (error) throw Error(error.message);
      return responseData;
    },
    onMutate: async (cursor) => {
      queryClient.setQueryData(
        ["/api/docs/in-view", session?.user.id],
        (old: DocsInView | undefined) => ({
          ...old,
          cursor,
        }),
      );
    },
  });

  const { mutate: setHomepage } = useMutation({
    mutationKey: ["/api/docs/in-view", session?.user.id],
    mutationFn: async (homepage?: string) => {
      const { data: responseData, error }: ApiReturnType<DocsInView> = await api
        .put("/api/docs/in-view", {
          json: { ...data, homepage: homepage ?? null },
        })
        .json();

      if (error) throw Error(error.message);
      return responseData;
    },
    onMutate: async (homepage?: string) => {
      queryClient.setQueryData(
        ["/api/docs/in-view", session?.user.id],
        (old: DocsInView | undefined) => ({
          ...old,
          homepage,
        }),
      );
    },
  });

  return {
    docs: data?.docIds || [],
    cursor: Number(data?.cursor) || 0,
    homepage: data?.homepage,
    loading: isLoading,
    error,
    closeDoc,
    openDoc,
    closeAllDocs,
    setCursor,
    setHomepage,
  };
}

export function useDocs() {
  const { data: session } = useSession();
  const { openDoc } = useDocsInView();

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
    mutationKey: ["/api/docs", session?.user.id],
    mutationFn: async () => {
      const { data, error }: ApiReturnType<Doc> = await api
        .post("/api/docs/new")
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    onSuccess: (data: Doc | null) => {
      if (!data) return null;
      openDoc({ targetId: data.id });
    },
  });

  return {
    docs: data || null,
    loading: isLoading,
    error,
    newDoc,
  };
}
