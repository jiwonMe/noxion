/**
 * Generate a stable, URL-safe ID from heading text.
 * 
 * Rules:
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove special characters (keep alphanumeric, Korean chars, hyphens)
 * - Keep Korean characters as-is (don't romanize)
 * - Handle duplicates: if slug exists in existingIds, return slug-1, slug-2, etc.
 * 
 * @param text - The heading text to convert
 * @param existingIds - Set of already-used IDs to avoid duplicates
 * @returns A stable, unique heading ID
 */
export function generateHeadingId(text: string, existingIds?: Set<string>): string {
  if (!text) return "";

  // Convert to lowercase
  let slug = text.toLowerCase();

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, "-");

  // Remove special characters, keep alphanumeric, Korean chars, and hyphens
  // Unicode ranges for Korean: \uAC00-\uD7AF (Hangul Syllables)
  slug = slug.replace(/[^\w\-\uAC00-\uD7AF]/g, "");

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  // Collapse multiple consecutive hyphens
  slug = slug.replace(/-+/g, "-");

  // Handle duplicates
  if (existingIds && existingIds.has(slug)) {
    let counter = 1;
    let candidate = `${slug}-${counter}`;
    while (existingIds.has(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  return slug;
}
