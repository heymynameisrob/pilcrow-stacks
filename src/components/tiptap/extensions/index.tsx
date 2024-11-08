import { InputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Code } from "@tiptap/extension-code";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Emoji } from "@tiptap-pro/extension-emoji";
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Image } from "@tiptap/extension-image";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { ListKeymap } from "@tiptap/extension-list-keymap";
import { Markdown } from "tiptap-markdown";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { TextStyle } from "@tiptap/extension-text-style";
import TiptapLink from "@tiptap/extension-link";
import TiptapUnderline from "@tiptap/extension-underline";
import { UniqueID } from "@tiptap-pro/extension-unique-id";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { lowlight } from "lowlight/lib/common";

// Custom Extensions
import { Color } from "@/components/tiptap/extensions/color";
import CustomKeyMap from "@/components/tiptap/extensions/custom-keys";
import Iframe from "@/components/tiptap/extensions/iframe";
import { Paragraph } from "@/components/tiptap/extensions/paragraph";
import { uploadEditorImage } from "@/components/tiptap/extensions/image-upload";
import emojiSuggestion from "@/components/tiptap/extensions/emoji-suggestion";
import SlashCommand from "@/components/tiptap/extensions/slash-command";
import Callout from "@/components/tiptap/extensions/callout";
import { Strapline } from "@/components/tiptap/extensions/strapline";
import { CustomHighlight } from "@/components/tiptap/extensions/custom-mark";
import Loading from "@/components/tiptap/extensions/loading";
import { CodeBlockComponent } from "@/components/tiptap/extensions/codeblock";
import { Figure } from "@/components/tiptap/extensions/figure";

export const defaultExtensions: Array<any> = [
  Document.extend({
    content: "heading block*",
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  Markdown.configure({
    linkify: true,
  }),
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  Bold,
  Italic,
  Strike,
  Paragraph,
  HardBreak,
  History,
  CustomKeyMap,
  CharacterCount,
  Image,
  SlashCommand,
  Loading,
  Figure.configure({
    HTMLAttributes: {
      class:
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    },
  }),
  Iframe.configure({
    HTMLAttributes: {
      class: "w-full aspect-video mb-[1.33em]",
    },
  }),
  Strapline.configure({
    HTMLAttributes: {
      class:
        "strapline text-secondary prose text-[1.25em] font-normal leading-[inherit] mt-0 mb-[1.33em]",
    },
  }),
  Callout.configure({
    emoji: "📣",
    HTMLAttributes: {
      class:
        "relative p-4 pl-12 rounded-md bg-ui-low text-primary before:content-[attr(data-emoji)] before:absolute before:top-4 before:left-4 before:text-base",
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "!pl-0 list-style-none",
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class:
        "flex flex-row items-center gap-2 checked:line-through !my-0 [&_p]:m-0",
    },
  }),
  Emoji.configure({
    HTMLAttributes: {
      class: "inline text-[1em]",
    },
    enableEmoticons: true, // E.g. <3 will be converted to ❤️
    suggestion: emojiSuggestion,
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc list-outside leading-3 -mt-2 text-primary",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3 -mt-2",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      placeholder: "",
      class: "leading-normal list-outside text-secondary",
    },
  }),
  ListKeymap,
  Code.configure({
    HTMLAttributes: {
      class:
        "rounded-md bg-gray-2 px-1.5 py-1 font-mono font-medium text-primary text-sm",
      spellcheck: "false",
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockComponent);
    },
  }).configure({
    HTMLAttributes: {
      class: "rounded-lg bg-gray-4 px-1.5 py-1 font-mono text-sm text-primary",
      spellcheck: "false",
    },
    lowlight,
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-4 border-primary",
    },
  }),
  Dropcursor.configure({
    color: "#DBEAFE",
    width: 4,
  }),
  UniqueID.configure({
    attributeName: "id",
    generateID: () => `tiptap-${Math.random().toString(36).slice(2, 9)}`, // 7 characters unique id
    types: [
      "heading",
      "paragraph",
      "codeBlock",
      "listItem",
      "blockquote",
      "callout",
    ],
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-primary",
    },
  }),
  TiptapLink.extend({
    inclusive: false,
  }).configure({
    linkOnPaste: true,
    HTMLAttributes: {
      class:
        "text-primary underline underline-offset-[3px] hover:text-opacity-70 transition-colors cursor-pointer",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "# Title";
      }

      return "Press / commands or start writing...";
    },
    includeChildren: true,
  }),
  CustomHighlight.configure({
    multicolor: true,
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor: any, files: Array<File>, pos: any) => {
      files.forEach((file: any) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          uploadEditorImage(file)
            .then((res: any) => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: res,
                  },
                })
                .run();
            })
            .catch((err: any) => {
              console.log(err);
              return false;
            });
        };
        return false;
      });
    },
    onPaste: (
      currentEditor: any,
      files: Array<File>,
      htmlContent: string | undefined,
    ) => {
      if (htmlContent) {
        // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
        // you could extract the pasted file from this url string and upload it to a server for example
        console.log(htmlContent); // eslint-disable-line no-console
        return false;
      }
      currentEditor.commands.insertContent("<loading-component />");

      files.forEach((file: any) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          uploadEditorImage(file)
            .then((res: any) => {
              currentEditor.chain().focus().setImage({ src: res }).run();
            })
            .catch((err: any) => {
              console.log(err);
              return false;
            });
        };
        return false;
      });
    },
  }),
];

export const RichTextExtensions = [
  Document,
  ...defaultExtensions.slice(1, defaultExtensions.length),
];
