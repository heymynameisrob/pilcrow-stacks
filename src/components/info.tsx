import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { SocialLinks } from "@/components/social-links";
import { Key } from "@/primitives/key";

export function Info() {
  return (
    <Popover>
      <PopoverTrigger className="fixed bottom-4 left-4 z-50 w-10 h-10 bg-gray-1 flex items-center justify-center text-primary shadow-xl rounded-full border hover:bg-gray-3 data-[state=open]:bg-gray-3 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <QuestionMarkCircleIcon className="w-4 h-4 opacity-70" />
      </PopoverTrigger>
      <PopoverContent
        className="p-4 pt-6 prose prose-sm prose-p:text-secondary prose-p:text-balance max-w-prose outline-none "
        side="left"
        align="end"
      >
        <h2>Welcome to Pilcrow</h2>
        <p>It&apos;s a simple notebook app with a twist.</p>
        <p>
          Each document is like a single page. They stack next to each other and
          you can only view 3 at a time.
        </p>
        <p>This lets you write at the speed of inspiration.</p>
        <p>
          You can use Markdown and Notion-y commands, as well as reference other
          documents with <Key>@</Key>
        </p>
        <p>
          This is an free open(ish)-source project. Check out the{" "}
          <a
            href="https://github.com/heymynameisrob/pilcrow-stacks"
            target="_blank"
            rel="noopener nofollow"
            className="font-medium underline"
          >
            code here
          </a>
        </p>
        <p>Enjoy!</p>
        <p>
          <strong>Rob x</strong>
        </p>

        <SocialLinks />
      </PopoverContent>
    </Popover>
  );
}
