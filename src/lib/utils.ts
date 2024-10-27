import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

// Copied from Shadcn - https://ui.shadcn.com
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromFirstAndLastName(
  firstName: string | null,
  lastName: string | null,
) {
  if (!firstName || !lastName) return "";
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

export function getInitialsFromFullName(name: string | null) {
  if (!name) return "";
  const names = name.split(" ");
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
}

export function getAvatarColour(name: string) {
  const initial = name.slice(0, 1).toLowerCase();

  if (/[a-d]/i.test(initial)) return "bg-red-200 text-red-900";
  if (/[e-h]/i.test(initial)) return "bg-green-200 text-green-900";
  if (/[i-l]/i.test(initial)) return "bg-yellow-200 text-yellow-900";
  if (/[m-q]/i.test(initial)) return "bg-blue-200 text-blue-900";
  if (/[r-t]/i.test(initial)) return "bg-indigo-200 text-indigo-900";
  if (/[u-w]/i.test(initial)) return "bg-purple-200 text-purple-900";
  if (/[x-z]/i.test(initial)) return "bg-pink-200 text-pink-900";

  return "bg-gray-3 text-primary";
}

export function pluarise(string: string, data: []) {
  return data.length > 1 ? `${string}s` : string;
}

export function truncateString(string: string, length: number) {
  if (string.length <= length) return string;
  return string.slice(0, length) + "...";
}

export function createSlug(string: string | null) {
  if (!string) return "";
  const slug = string.toLowerCase().replace(/ /g, "-");
  // strip out special characters, ampersands etc
  return slug.replace(/[^\w-]+/g, "");
}

export function fromNow(date: Date, verbose?: boolean) {
  const distance = formatDistanceToNow(date, { addSuffix: false });

  if (verbose) return `${distance} ago`;

  // Remove qualifiers like "about", "almost", "over", "less than"
  const cleanDistance = distance.replace(/^(about|almost|over|less than) /, "");

  // Split the cleaned distance string into value and unit
  const [value, unit] = cleanDistance.split(" ");

  // Define custom abbreviations
  const unitAbbreviations: { [key: string]: string } = {
    second: "s",
    minute: "min",
    hour: "h",
    day: "d",
    week: "w",
    month: "mo",
    year: "y",
  };

  const singularUnit = unit.endsWith("s") ? unit.slice(0, -1) : unit;

  // Get the appropriate abbreviation, defaulting to the first character if not found
  const abbreviatedUnit =
    unitAbbreviations[
      singularUnit.toLowerCase() as keyof typeof unitAbbreviations
    ] ?? singularUnit.charAt(0).toLowerCase();

  return `${value}${abbreviatedUnit} ago`;
}
