import { describe, expect, it } from "vitest";
import { simplifyBookmarkTitle } from "../src/lib/bookmark-title";

describe("simplifyBookmarkTitle", () => {
  it.each([
    ["金山文档 | WPS云文档", "金山文档"],
    ["Cocos中文社区 - Cocos中文社区", "Cocos中文社区"],
    ["(177) Pinterest", "Pinterest"],
    ["Top games for Web - itch.io", "itch.io"],
    ["[12] GitHub", "GitHub"],
    ["Article title | Example Site", "Article title"],
  ])("simplifies %s", (title, expected) => {
    expect(simplifyBookmarkTitle(title)).toBe(expected);
  });

  it("does not alter a plain title", () => {
    expect(simplifyBookmarkTitle("OpenAI Documentation")).toBe("OpenAI Documentation");
  });
});
