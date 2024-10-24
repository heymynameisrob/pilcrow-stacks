import { lazy, Suspense, useEffect, useState } from "react";

type IslandProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  lazy?: boolean;
  delay?: number; // Optional delay before showing
  onMount?: () => void; // Callback when mounted
};

// For lazy loaded components we need a wrapper since lazy() needs a component
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children} </>
);
const LazyComponent = lazy(() => Promise.resolve({ default: LazyWrapper }));

/**
 * Client Island - Client-side only rendering
 * Useful for partial rendering of heavy or non critical components
 * Makes things cleaner than writing random useEffect hacks everywhere
 */

export function Island({
  children,
  lazy = false,
  delay = 0,
  onMount,
  fallback,
}: IslandProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(!delay);

  useEffect(() => {
    setMounted(true);
    onMount?.();

    if (delay) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay, onMount]);

  // Show nothing or skeleton while not mounted
  if (!mounted) return fallback || null;

  // Don't render yet if there's a delay
  if (!shouldRender) return fallback || null;

  if (lazy) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent>{children}</LazyComponent>
      </Suspense>
    );
  }

  return <>{children}</>;
}
