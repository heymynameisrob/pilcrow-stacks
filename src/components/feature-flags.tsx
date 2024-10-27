import { FlagIcon } from "@heroicons/react/20/solid";
import { createContext, useContext, useState, useEffect } from "react";

import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { IS_DEV } from "@/lib/flags";

// Define the flag type

type Flags = {
  id: string;
  enabled: boolean;
}[];

const FeatureFlagContext = createContext<{
  flags: Flags | [];
  setFlag: (id: string, enabled: boolean) => void;
  isEnabled: (id: string) => boolean;
} | null>(null);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider",
    );
  }
  return context;
};

export const FeatureFlagProvider = ({
  children,
  initialFlags = [],
}: {
  children: React.ReactNode;
  initialFlags: Flags | [];
}) => {
  const [flags, setFlags] = useState<Flags | []>(initialFlags);
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Load up flags from localStorage on mount
   */
  useEffect(() => {
    const flags = JSON.parse(localStorage.getItem("featureFlags") || "[]");
    setFlags((prev) => [...prev, ...flags]);
    setIsMounted(true);
  }, []);

  const setFlag = (id: string, enabled: boolean) => {
    setFlags((prev) => {
      // If flag doesn't exist, add it. Else toggle it's status
      const newFlags = prev.find((f) => f.id === id)
        ? prev.map((flag) => (flag.id === id ? { ...flag, enabled } : flag))
        : [...prev, { id, enabled }];

      localStorage.setItem("featureFlags", JSON.stringify(newFlags));
      return newFlags;
    });
  };

  const isEnabled = (id: string) => {
    return flags.find((f) => f.id === id)?.enabled ?? false;
  };

  const value = {
    flags,
    setFlag,
    isEnabled,
  };

  if (!isMounted) {
    return null;
  }

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const FeatureFlag = ({
  flag,
  children,
  fallback = null,
}: {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag) ? children : fallback;
};

export const FeatureFlagManager = () => {
  const { flags, setFlag } = useFeatureFlags();

  if (!IS_DEV) return null;

  return (
    <Popover>
      <PopoverTrigger className="fixed bottom-[72px] right-4 z-max w-10 h-10 bg-black shadow-floating hover:bg-black/80 flex items-center justify-center p-2 rounded-full data-[state=open]:bg-[#333]">
        <FlagIcon className="w-5 h-5 text-white" />
      </PopoverTrigger>
      <PopoverContent side="top" align="end" dark>
        <div className="grid gap-2">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center gap-2">
              <Checkbox
                id={flag.id}
                checked={flag.enabled}
                onCheckedChange={(checked: boolean) =>
                  setFlag(flag.id, checked)
                }
              />
              <Label htmlFor={flag.id}>{flag.id}</Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
