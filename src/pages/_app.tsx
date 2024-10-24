import React from "react";
import { IS_DEV } from "@/flags";
import { ThemeProvider } from "next-themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { AppProps } from "next/app";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          // Invalidate query automatically on cache and error
          onSuccess: (_data, _variables, _context, mutation) => {
            IS_DEV &&
              console.error(
                "Success",
                mutation.options.mutationKey,
                Math.floor(performance.now()),
              );
            queryClient.invalidateQueries({
              queryKey: mutation.options.mutationKey,
            });
          },
          onError: (error, _variables, _context, mutation) => {
            IS_DEV &&
              console.error(
                "Error",
                mutation.options.mutationKey,
                error.message,
              );
            queryClient.invalidateQueries({
              queryKey: mutation.options.mutationKey,
            });
          },
        }),
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Tooltip.Provider delayDuration={200}>
            <Component {...pageProps} />
          </Tooltip.Provider>
        </ThemeProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
