import { signOut } from "next-auth/react";

import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/user-menu";

export function FullPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-screen h-screen grid place-items-center bg-background">
      {children}
    </main>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-rows-[minmax(auto,_48px),_1fr] h-dvh bg-background">
      <nav
        role="navigation"
        className="flex items-center justify-between h-12 px-4 bg-background border-b"
      >
        <p>
          <strong>Next Starter</strong>
        </p>
        <div className="flex items-center justify-end gap-2">
          <UserMenu position="top" />
        </div>
      </nav>
      <div className="w-full h-full overflow-y-scroll">{children}</div>
    </main>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-cols-[minmax(auto,240px),_1fr] h-dvh bg-background">
      <nav
        role="navigation"
        className="flex flex-col gap-4 p-4 border-r bg-gray-1"
      >
        <p>
          <strong>Next Starter</strong>
        </p>
        <div className="mt-auto flex items-center justify-between gap-4">
          <UserMenu position="bottom" />
        </div>
      </nav>
      <div className="w-full h-full overflow-y-scroll">{children}</div>
    </main>
  );
}

export const Container = ({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "lg" | "md";
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-12",
        size === "sm" && "w-full sm:max-w-2xl",
        size === "md" && "w-full md:max-w-4xl",
        size === "lg" && "w-full lg:max-w-[1280px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
