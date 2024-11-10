import { motion, type Transition } from "framer-motion";

export function FadeIn({
  children,
  transition,
  delay,
}: {
  children: React.ReactNode;
  transition?: Transition;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        ...transition,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
