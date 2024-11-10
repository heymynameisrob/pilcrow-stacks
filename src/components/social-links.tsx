import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { LinkIcon } from "@heroicons/react/16/solid";

import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/primitives/tooltip";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2 mt-[1.3rem] md:items-center md:flex-row">
      <Link delay={0.1} title="Website" link="https://heymynameisrob.com">
        <LinkIcon className="w-4 h-4" />
        <small className="md:hidden">Website</small>
      </Link>
      <Link delay={0.1} title="Github" link="https://github.com/heymynameisrob">
        <GitHubLogoIcon className="w-4 h-4" />
        <small className="md:hidden">Github</small>
      </Link>
      <Link
        title="Bluesky"
        delay={0.2}
        link="https://bsky.app/profile/heymynameisrob.com"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="w-4 h-4"
        >
          <path
            d="M407.8 294.7c-3.3-.4-6.7-.8-10-1.3 3.4.4 6.7.9 10 1.3zM288 227.1c-26.1-50.7-97.1-145.2-163.1-191.8C61.6-9.4 37.5-1.7 21.6 5.5 3.3 13.8 0 41.9 0 58.4S9.1 194 15 213.9c19.5 65.7 89.1 87.9 153.2 80.7 3.3-.5 6.6-.9 10-1.4-3.3.5-6.6 1-10 1.4-93.9 14-177.3 48.2-67.9 169.9C220.6 589.1 265.1 437.8 288 361.1c22.9 76.7 49.2 222.5 185.6 103.4 102.4-103.4 28.1-156-65.8-169.9-3.3-.4-6.7-.8-10-1.3 3.4.4 6.7.9 10 1.3 64.1 7.1 133.6-15.1 153.2-80.7C566.9 194 576 75 576 58.4s-3.3-44.7-21.6-52.9c-15.8-7.1-40-14.9-103.2 29.8C385.1 81.9 314.1 176.4 288 227.1z"
            fill="currentColor"
          />
        </svg>
        <small className="md:hidden">Bluesky</small>
      </Link>
      <Link
        delay={0.3}
        title="LinkedIn"
        link="https://github.com/heymynameisrob"
      >
        <LinkedInLogoIcon className="w-4 h-4" />
        <small className="md:hidden">LinkedIn</small>
      </Link>
    </div>
  );
}

function Link({
  link,
  children,
  title,
  delay,
  className,
}: {
  link: string;
  children: React.ReactNode;
  title: string;
  delay?: number;
  className?: string;
}) {
  return (
    <Tooltip content={title}>
      <div>
        <FadeIn delay={delay ?? 0}>
          <a
            href={link}
            target="_blank"
            rel="noopener nofollow"
            className={cn(
              "inline-flex justify-center items-center w-auto px-3 gap-1.5 h-8 text-secondary bg-black/10 rounded-full font-medium duration-200 ease-out hover:scale-110 hover:text-primary hover:bg-gray-2 md:px-px md:w-8",
              "dark:bg-white/10",
              className,
            )}
          >
            {children}
          </a>
        </FadeIn>
      </div>
    </Tooltip>
  );
}
