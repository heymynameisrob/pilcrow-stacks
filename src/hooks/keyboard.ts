import { useEffect, useMemo } from "react";

import { useOS } from "./os";

type UseKeyboardShortcutArgs = {
  keys: string[];
  onKeyPressed: () => void;
  preventDefault?: boolean;
  enabled?: boolean;
};

export function useKeyboardShortcut({
  keys,
  onKeyPressed,
  preventDefault = true,
  enabled = true,
}: UseKeyboardShortcutArgs) {
  const os = useOS();

  const normalizedKeys = useMemo(
    () =>
      keys.map((key) =>
        key.toLowerCase() === "mod"
          ? os === "mac"
            ? "meta"
            : "control"
          : key.toLowerCase(),
      ),
    [keys, os],
  );

  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (enabled === false) return false;
      const pressedKeys: string[] = [];
      if (e.metaKey) pressedKeys.push("meta");
      if (e.ctrlKey) pressedKeys.push("control");
      if (e.altKey) pressedKeys.push("alt");
      if (e.shiftKey) pressedKeys.push("shift");
      pressedKeys.push(e.key.toLowerCase());

      const isMatch =
        normalizedKeys.every((key) => pressedKeys.includes(key)) &&
        normalizedKeys.length === pressedKeys.length;

      if (!isMatch) return false;

      if (preventDefault) {
        e.preventDefault();
        onKeyPressed();
      } else {
        onKeyPressed();
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [preventDefault, normalizedKeys, onKeyPressed, enabled]);
}
