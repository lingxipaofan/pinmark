import React from "react";
import { useI18n, formatRelativeTime } from "../lib/i18n";

interface Props {
  folderTitle: string;
  bookmarkCount: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
  onCheckLinks?: () => void;
  onRecheckBroken?: () => void;
  isCheckingLinks?: boolean;
  brokenCount?: number;
  lastCheckedAt?: number | null;
  emptyFolders: { id: string; title: string }[];
  duplicateBookmarks: { id: string; title: string; url: string }[];
}

export default function ToolBar({
  folderTitle,
  bookmarkCount,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onDeleteSelected,
  onCheckLinks,
  onRecheckBroken,
  isCheckingLinks,
  brokenCount,
  lastCheckedAt,
  emptyFolders,
  duplicateBookmarks,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <strong>{folderTitle}</strong>
        <span className="toolbar-count">{t("bookmark_count", { count: bookmarkCount })}</span>
      </div>
      <div className="toolbar-center">
        {bookmarkCount > 0 && (
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={allSelected && bookmarkCount > 0}
              onChange={onToggleSelectAll}
            />
            {t("select_all_checkbox")}
          </label>
        )}
        {selectedCount > 0 && (
          <button className="btn-delete" onClick={onDeleteSelected}>
            {t("delete_with_count", { count: selectedCount })}
          </button>
        )}
      </div>
      <div className="toolbar-right">
        {onCheckLinks && bookmarkCount > 0 && (
          <button
            className="btn-link-check"
            onClick={onCheckLinks}
            disabled={isCheckingLinks}
          >
            {isCheckingLinks ? "⏳" : "🔗"} {t("check_links")}
          </button>
        )}
        {brokenCount !== undefined && brokenCount > 0 && !isCheckingLinks && (
          <>
            <button className="btn-link-check" onClick={onRecheckBroken}>
              🔄 {t("recheck_broken")}
            </button>
            <span className="cleanup-hint broken-hint" title={t("broken_found", { count: brokenCount })}>
              ⚠️ {t("broken_found", { count: brokenCount })}
            </span>
          </>
        )}
        {lastCheckedAt && !isCheckingLinks && (
          <span className="cleanup-hint">{t("last_checked", { time: formatRelativeTime(lastCheckedAt, t) })}</span>
        )}
        {emptyFolders.length > 0 && (
          <span className="cleanup-hint" title={`${emptyFolders.length} ${t("empty_folders", { count: emptyFolders.length })}`}>
            {t("empty_folders", { count: emptyFolders.length })}
          </span>
        )}
        {duplicateBookmarks.length > 0 && (
          <span className="cleanup-hint" title={t("duplicates", { count: duplicateBookmarks.length })}>
            {t("duplicates", { count: duplicateBookmarks.length })}
          </span>
        )}
      </div>
    </div>
  );
}
