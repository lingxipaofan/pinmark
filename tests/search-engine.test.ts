import { describe, expect, it } from "vitest";
import { buildSearchUrl, getSearchEngineOption, isSearchEngineId } from "../src/lib/search-engine";

describe("search engine helpers", () => {
  it("builds URLs from templates with a placeholder", () => {
    expect(buildSearchUrl("https://example.com/search?q=%s", "hello world")).toBe(
      "https://example.com/search?q=hello%20world",
    );
  });

  it("appends q when a custom template has no placeholder", () => {
    expect(buildSearchUrl("https://example.com/search", "hello world")).toBe(
      "https://example.com/search?q=hello%20world",
    );
    expect(buildSearchUrl("https://example.com/search?source=startmark", "hello world")).toBe(
      "https://example.com/search?source=startmark&q=hello%20world",
    );
  });

  it("falls back to the browser option for unknown engine ids", () => {
    expect(isSearchEngineId("bing")).toBe(true);
    expect(isSearchEngineId("unknown")).toBe(false);
    expect(getSearchEngineOption("browser").id).toBe("browser");
  });
});
