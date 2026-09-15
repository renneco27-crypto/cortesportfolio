export function sanitize(str: string, maxLength = 2000): string {
  return str
    .replace(/\0/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "")
    .trim()
    .slice(0, maxLength);
}
