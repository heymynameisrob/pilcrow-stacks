import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className="font-sans text-primary min-h-screen antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
