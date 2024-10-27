import * as Tooltip from "@radix-ui/react-tooltip";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";

import { IS_DEV } from "@/lib/flags";
import {
  FeatureFlagManager,
  FeatureFlagProvider,
} from "@/components/feature-flags";

import type { AppProps } from "next/app";

import "@/globals.css";

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
        <FeatureFlagProvider
          initialFlags={[
            { id: "test", enabled: false },
            { id: "new-menu", enabled: true },
          ]}
        >
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
          <FeatureFlagManager />
        </FeatureFlagProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
