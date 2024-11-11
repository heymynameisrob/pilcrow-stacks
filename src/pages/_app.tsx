import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  isServer,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  AsyncStorage,
  experimental_createPersister as persister,
} from "@tanstack/query-persist-client-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createStore, del, get, set, UseStore } from "idb-keyval";

import {
  FeatureFlagManager,
  FeatureFlagProvider,
} from "@/components/feature-flags";
import { CommandMenu } from "@/components/command-menu";
import { IS_DEV } from "@/lib/flags";

import type { AppProps } from "next/app";

import "@/globals.css";

function newIdbStorage(idbStore: UseStore): AsyncStorage {
  return {
    getItem: async (key) => await get(key, idbStore),
    setItem: async (key, value) => await set(key, value, idbStore),
    removeItem: async (key) => await del(key, idbStore),
  };
}

function makeQueryClient(persisterOptions?: boolean) {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        queryClient.invalidateQueries({
          queryKey: mutation.options.mutationKey,
        });
      },
      onError: (error, _variables, _context, mutation) => {
        queryClient.invalidateQueries({
          queryKey: mutation.options.mutationKey,
        });
      },
    }),
    defaultOptions: {
      queries: {
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        // @ts-expect-error - This is a valid option
        persister:
          isServer || !persisterOptions
            ? undefined
            : persister({
                storage: newIdbStorage(
                  createStore(
                    "pilcrow",
                    IS_DEV ? "local" : process.env.NEXT_PUBLIC_BUILD_ID!,
                  ),
                ),
                prefix: "qc-",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                buster: process.env.NEXT_PUBLIC_BUILD_ID,
                serialize: (data) => JSON.stringify(data),
                deserialize: (data) => JSON.parse(data),
              }),
      },
    },
  });

  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(persisterOptions = true) {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient)
      browserQueryClient = makeQueryClient(persisterOptions);
    return browserQueryClient;
  }
}

export function QueryProvider({
  children,
  persistQueries = true,
}: {
  children: React.ReactNode;
  persistQueries?: boolean;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient(persistQueries);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <FeatureFlagProvider initialFlags={[]}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Tooltip.Provider delayDuration={100}>
              <Component {...pageProps} />
              <CommandMenu />
            </Tooltip.Provider>
          </ThemeProvider>
          <FeatureFlagManager />
        </FeatureFlagProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
