import { Button } from "@/components/button";
import { LoginForm } from "@/components/login/login-form";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme, theme } = useTheme();

  return (
    <main className="h-screen w-screen grid place-items-center">
      <div className="flex flex-col">
        <h1>Login</h1>
        <LoginForm />
      </div>
      <Button
        variant="secondary"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Change theme
      </Button>
    </main>
  );
}
