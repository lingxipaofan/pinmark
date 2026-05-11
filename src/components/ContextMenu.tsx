import React from "react";
import { useI18n } from "../lib/i18n";

interface Props {
  x: number;
  y: number;
  type: "folder" | "bookmark";
  onAction: (action: string) => void;
}

export default function ContextMenu({ x, y, type, onAction }: Props) {
  const { t } = useI18n();

  return (
    <div
      className="context-menu"
      style={{ left: x, top: y, position: "fixed" }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === "folder" && (
        <>
          <div className="context-menu-item" onClick={() => onAction("open-all")}>
            {t("open_all")}
          </div>
          <div className="context-menu-sep" />
          <div className="context-menu-item" onClick={() => onAction("rename-folder")}>
            {t("rename")}
          </div>
          <div className="context-menu-sep" />
          <div className="context-menu-item" onClick={() => onAction("create-sub-folder")}>
            {t("new_subfolder")}
          </div>
          <div className="context-menu-sep" />
          <div className="context-menu-item" onClick={() => onAction("delete-folder")}>
            {t("delete_folder")}
          </div>
        </>
      )}
      {type === "bookmark" && (
        <>
          <div className="context-menu-item" onClick={() => onAction("rename-bookmark")}>
            {t("rename")}
          </div>
          <div className="context-menu-item" onClick={() => onAction("edit-url")}>
            {t("edit_url")}
          </div>
          <div className="context-menu-sep" />
          <div className="context-menu-item" onClick={() => onAction("delete-bookmark")}>
            {t("delete_bookmark")}
          </div>
        </>
      )}
    </div>
  );
}
