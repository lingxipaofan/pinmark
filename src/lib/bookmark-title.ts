const LEADING_COUNT_PATTERN = /^\s*(?:\(\d+\)|（\d+）|\[\d+\]|【\d+】)\s*/;
const DOMAIN_PATTERN = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/.*)?$/i;

export function simplifyBookmarkTitle(title: string): string {
  const cleaned = title.replace(LEADING_COUNT_PATTERN, "").trim();
  if (!cleaned) return title.trim();

  const parts = cleaned
    .split(/\s*(?:\||｜)\s*|\s+[-–—·•]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) return cleaned;

  const uniqueParts = parts.filter(
    (part, index) => parts.findIndex((candidate) => candidate.toLocaleLowerCase() === part.toLocaleLowerCase()) === index
  );
  if (uniqueParts.length === 1) return uniqueParts[0];

  const domain = [...uniqueParts].reverse().find((part) => DOMAIN_PATTERN.test(part));
  return domain || uniqueParts[0];
}
