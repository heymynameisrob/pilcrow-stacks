import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export function LoginForm() {
  const [state, setState] = useState<"default" | "submitting" | "success">(
    "default",
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const content = useMemo(() => {
    switch (state) {
      case "submitting":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "success":
        return "Login link sent!";
      default:
        return "Send me a login link";
    }
  }, [state]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setState("submitting");
    signIn("email", { redirect: false, ...values }).then(() => {
      setState("success");
    });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[360px] space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="h-11"
                  autoFocus
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          disabled={state !== "default"}
          className={cn(
            "w-full overflow-hidden",
            state === "success"
              ? "bg-green-700 dark:bg-green-700 disabled:opacity-100 text-white"
              : null,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              key={state}
              className="drop-shadow-sm"
            >
              {content}
            </motion.span>
          </AnimatePresence>
        </Button>
        <FormMessage
          className={cn(
            "!text-xs !text-secondary text-center opacity-0",
            state === "success" && "opacity-100",
          )}
        >
          Give it 2 minutes. If no link arrives, then try again
        </FormMessage>
      </form>
    </Form>
  );
}
