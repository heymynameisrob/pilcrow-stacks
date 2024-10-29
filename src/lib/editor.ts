import { Editor } from "@tiptap/core";

import { cn } from "@/lib/utils";

export function getAllText(editor: Editor) {
  return editor.state.doc.textBetween(0, editor.state.doc.content.size, "\n");
}

export function getPreviousText(
  editor: Editor,
  options: { chars: number; offset?: number },
) {
  const offset = options.offset || 0;
  return editor.state.doc.textBetween(
    Math.max(0, editor.state.selection.from - options.chars),
    editor.state.selection.from - offset,
    "\n",
  );
}

export function getSelectedText(editor: Editor) {
  return editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
  );
}

export function isSelectionEmpty(editor: Editor) {
  const { view } = editor;
  const { selection } = view.state;
  return selection.empty;
}

export function isNodeEmpty(node: any) {
  return node && node.isText && node.text === "";
}

export function getFontSize(size: string) {
  switch (size) {
    case "regular":
      return "prose-base";
    case "large":
      return "prose-lg";
    case "small":
      return "prose-sm";
    default:
      return "prose-base";
  }
}

export function getTitleFromJson(json: any) {
  if (!json || !json.content[0] || !json.content[0].content) return "Untitled";
  return json.content[0].content[0].text || "Untitled";
}

export function getEmbedUrl(url: string | null) {
  if (!url) return null;

  if (url.includes("youtube.com")) {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("figma.com")) {
    const fileId = url.split("file/")[1];
    return `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileId}`;
  }

  if (url.includes("loom.com")) {
    const videoId = url.split("share/")[1];
    return `https://www.loom.com/embed/${videoId}`;
  }

  return url;
}

export function stripFirstTag(content: string) {
  // Remove first h1 tag from string
  const match = /<h1[^>]*>(.*?)<\/h1>/.exec(content);
  if (match && match[0]) {
    return content.replace(match[0], "");
  } else {
    return content;
  }
}

export function extractTextFromJSON(json: any) {
  let textString = "";

  function extractText(contentArray: any) {
    for (const content of contentArray) {
      if (content.type === "text") {
        textString += content.text;
      } else if (content.content) {
        extractText(content.content);
      }
    }
  }

  if (json && json.content) {
    extractText(json.content);
  }

  return textString;
}

export function trimHtml(html: string, cutoff: number) {
  // remove cutoff amount of nodes from end of html
  const doc = new DOMParser().parseFromString(html, "text/html");
  const nodes = Array.from(doc.body.childNodes);
  const trimmedNodes = nodes.slice(0, -cutoff);
  const container = document.createElement("div");
  trimmedNodes.forEach((node) => container.appendChild(node));
  return new XMLSerializer().serializeToString(container);
}

export const editorProseClasses = cn(
  "prose prose-sm",
  "focus:outline-none",
  "prose-code:before:hidden prose-code:after:hidden",
  "prose-h1:text-base prose-h2:text-base prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base",
  "prose-h1:font-semibold prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-semibold prose-h5:font-semibold prose-h6:font-semibold",
  "focus:outline-none",
  "prose-code:before:hidden prose-code:after:hidden",
  "prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-semibold prose-h5:font-regular prose-h6:font-regular",
  "prose-h2:mb-[0.666em] prose-h3:mb-[0.666em]",
);
