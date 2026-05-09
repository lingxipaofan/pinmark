import React from "react";
import { useI18n } from "../lib/i18n";

interface Props {
  folderTitle: string;
  bookmarkCount: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
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
