import { useQuery } from "@tanstack/react-query";

import { api, REVALIDATE_DAY } from "@/lib/fetch";
import { ApiReturnType, Doc, DocsInView } from "@/lib/types";

export function usePublicDocs(publicId: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["/api/public/docs", publicId],
    queryFn: async () => {
      const { data, error }: ApiReturnType<DocsInView> = await api
        .get(`/api/public/docs?publicId=${publicId}`)
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: 1000,
  });

  return {
    homepage: data?.homepage,
    loading: isLoading,
    error,
  };
}

export function usePublicDoc(docId: string, publicId: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [`/api/public/docs/${docId}`, publicId],
    queryFn: async () => {
      const { data, error }: ApiReturnType<Doc> = await api
        .get(`/api/public/docs/${docId}?publicId=${publicId}`)
        .json();
      if (error) throw Error(error.message);
      return data;
    },
    staleTime: REVALIDATE_DAY,
  });

  return {
    doc: data,
    loading: isLoading,
    error,
  };
}
