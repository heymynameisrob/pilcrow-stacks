"use client";

import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node } from "@tiptap/core";
import { Loader } from "lucide-react";

import { AspectRatio } from "@/components/aspect-ratio";

const Component = () => {
  return (
    <NodeViewWrapper>
      <AspectRatio ratio={1}>
        <div className="absolute inset-0 flex items-center justify-center bg-ui">
          <Loader className="animate animate-spin" size={24} />
        </div>
      </AspectRatio>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "loadingComponent",

  group: "block",

  atom: true,

  parseHTML() {
    return [
      {
        tag: "loading-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["loading-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
