import { EditorProps } from "@tiptap/pm/view";

import { cn } from "@/lib/utils";

export const defaultEditorProps: EditorProps = {
  attributes: {
    class: cn(
      "focus:outline-none",
      "prose-code:before:hidden prose-code:after:hidden",
      "prose-p:tracking-none prose-p:leading-7",
      "prose-h1:font-semiold prose-h1:text-3xl",
      "prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:text-base",
      "prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-semibold prose-h5:font-regular prose-h6:font-regular prose-p:font-regular",
      "prose-h2:mb-[0.666em] prose-h3:mb-[0.666em] prose-p:mb-[0.666em]",
    ),
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // prevent default event listeners from firing when slash command is active
      if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        const slashCommand = document.querySelector("#slash-command");
        if (slashCommand) {
          return true;
        }
      }
    },
  },
};
