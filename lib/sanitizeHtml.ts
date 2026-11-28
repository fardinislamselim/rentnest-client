import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "code",
  "pre",
  "hr",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Sanitizes rich HTML strings safely across both server and client environments.
 */
export const sanitizeHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return "";
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
  });
};

/**
 * Strips HTML tags to produce clean plain text for cards and character counts.
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
