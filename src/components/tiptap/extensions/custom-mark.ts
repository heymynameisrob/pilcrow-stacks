import { Highlight } from "@tiptap/extension-highlight";

export const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      // Add data attribute called type
      type: {
        default: "highlight",
        parseHTML: (element) => ({
          type: element.getAttribute("data-type"),
        }),
        renderHTML: (attributes) => {
          return {
            "data-type": attributes.type,
          };
        },
      },
    };
  },
});
