import { Paragraph as BaseParagraph } from "@tiptap/extension-paragraph";

export const Paragraph = BaseParagraph.extend({
  addAttributes() {
    return {
      "data-suggestion": {
        default: null,
        parseHTML: (element) => {
          return element.hasAttribute("data-suggestion")
            ? element.getAttribute("data-suggestion")
            : null;
        },
        renderHTML: (attributes) => {
          return {
            "data-suggestion": attributes["data-suggestion"],
          };
        },
      },
    };
  },
});
