/**
 * Inline `#tag` parsing for task titles.
 *
 * Rules:
 *   - A hashtag is `#` preceded by start-of-string or whitespace (so
 *     `C#` and `room#3` don't trigger it)
 *   - Allowed chars: letters, digits, `-`, `_`
 *   - Max 32 chars per tag (storage sanity)
 *   - Stored lowercased + de-duplicated
 *   - Stripped from the saved title; the leading whitespace before each
 *     hashtag is preserved so adjacent words don't collide
 */

const HASHTAG_RE = /(\s|^)#([a-zA-Z0-9_-]{1,32})\b/g;

export interface ParsedTitle {
  title: string;
  tags: string[];
}

export function parseHashtags(input: string): ParsedTitle {
  const tags = new Set<string>();
  const stripped = input.replace(HASHTAG_RE, (_full, prefix: string, name: string) => {
    tags.add(name.toLowerCase());
    return prefix;
  });
  return {
    title: stripped.replace(/\s+/g, " ").trim(),
    tags: Array.from(tags),
  };
}

/** Build an updated tags array from input title plus existing extra tags. */
export function mergeTags(parsed: string[], existing: readonly string[] = []): string[] {
  const set = new Set<string>(parsed);
  for (const t of existing) set.add(t.toLowerCase());
  return Array.from(set);
}
