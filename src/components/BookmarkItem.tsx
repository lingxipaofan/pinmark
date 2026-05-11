import React from "react";
import type { BookmarkNode, LinkStatus } from "../lib/types";

interface Props {
  bookmark: BookmarkNode;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, node: BookmarkNode) => void;
  linkStatus?: LinkStatus;
}

// Module-level shift-click tracking
let _lastClickedId: string | null = null;

export default function BookmarkItem({
  bookmark,
  isSelected,
  onToggle,
  onContextMenu,
  linkStatus,
}: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/bookmark-id", bookmark.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".bookmark-visit")) return;
    if ((e.target as HTMLElement).closest(".bookmark-checkbox")) {
      onToggle(bookmark.id);
      _lastClickedId = bookmark.id;
      return;
    }
    // Shift+click for range
    if (e.shiftKey && _lastClickedId) {
      window.dispatchEvent(new CustomEvent("bookmark-shift-select", {
        detail: { fromId: _lastClickedId, toId: bookmark.id },
      }));
      return;
    }
    // Default: toggle selection
    onToggle(bookmark.id);
    _lastClickedId = bookmark.id;
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmark.url) chrome.tabs.create({ url: bookmark.url });
  };

  const favicon = bookmark.url
    ? `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`
    : "";

  return (
    <div
      className={`bookmark-item ${isSelected ? "selected" : ""} ${linkStatus && linkStatus !== "unknown" ? `link-${linkStatus}` : ""}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, bookmark)}
    >
      <label className="bookmark-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(bookmark.id)}
        />
      </label>
      <img
        className="bookmark-favicon"
        src={favicon}
        alt=""
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {linkStatus === "checking" && <span className="bookmark-status status-checking">{""}</span>}
      {linkStatus === "valid" && <span className="bookmark-status status-valid" title="有效">✓</span>}
      {linkStatus === "broken" && <span className="bookmark-status status-broken" title="失效">✗</span>}
      <span className="bookmark-title">{bookmark.title || "无标题"}</span>
      <span className="bookmark-url">{bookmark.url}</span>
      {bookmark.url && (
        <button className="bookmark-visit" onClick={handleVisit} title={bookmark.url}>↗</button>
      )}
    </div>
  );
}
