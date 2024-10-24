import { Button } from "@/components/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, theme } = useTheme();

  return (
    <main className="h-screen w-screen grid place-items-center">
      <h1>Hello World!</h1>
      <Button
        variant="secondary"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Change theme
      </Button>
    </main>
  );
}
