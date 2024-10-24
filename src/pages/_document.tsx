import { Html, Head, Main, NextScript } from "next/document";

import { Toaster } from "@/components/sonner";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className="font-sans text-primary min-h-screen antialiased">
        <Main />
        <NextScript />
        <Toaster />
      </body>
    </Html>
  );
}
