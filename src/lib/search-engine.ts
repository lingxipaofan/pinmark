export const SEARCH_ENGINE_KEY = "startmark-search-engine";
export const CUSTOM_SEARCH_TEMPLATE_KEY = "startmark-custom-search-template";

export type SearchEngineId = "browser" | "google" | "bing" | "baidu" | "duckduckgo" | "custom";

export interface SearchEngineOption {
  id: SearchEngineId;
  label: string;
  template: string | null;
}

export const SEARCH_ENGINES: SearchEngineOption[] = [
  { id: "browser", label: "browser_default_search", template: null },
  { id: "google", label: "Google", template: "https://www.google.com/search?q=%s" },
  { id: "bing", label: "Bing", template: "https://www.bing.com/search?q=%s" },
  { id: "baidu", label: "百度", template: "https://www.baidu.com/s?wd=%s" },
  { id: "duckduckgo", label: "DuckDuckGo", template: "https://duckduckgo.com/?q=%s" },
  { id: "custom", label: "custom_search_engine", template: null },
];

export function isSearchEngineId(value: string | null): value is SearchEngineId {
  return SEARCH_ENGINES.some((engine) => engine.id === value);
}

export function readSearchEngine(): SearchEngineId {
  try {
    const stored = localStorage.getItem(SEARCH_ENGINE_KEY);
    return isSearchEngineId(stored) ? stored : "browser";
  } catch {
    return "browser";
  }
}

export function readCustomSearchTemplate(): string {
  try {
    return localStorage.getItem(CUSTOM_SEARCH_TEMPLATE_KEY) || "";
  } catch {
    return "";
  }
}

export function getSearchEngineOption(id: SearchEngineId): SearchEngineOption {
  return SEARCH_ENGINES.find((engine) => engine.id === id) || SEARCH_ENGINES[0];
}

export function buildSearchUrl(template: string, query: string): string {
  const encodedQuery = encodeURIComponent(query);
  const trimmedTemplate = template.trim();
  if (!trimmedTemplate) {
    return `https://www.google.com/search?q=${encodedQuery}`;
  }

  if (trimmedTemplate.includes("%s")) {
    return trimmedTemplate.replaceAll("%s", encodedQuery);
  }

  const separator = trimmedTemplate.includes("?") ? "&" : "?";
  return `${trimmedTemplate}${separator}q=${encodedQuery}`;
}
