import React from "react";
import { useI18n } from "../lib/i18n";

interface Props {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}

export default function Toast({ message, onUndo, onClose }: Props) {
  const { t } = useI18n();

  return (
    <div className="toast" onClick={(e) => e.stopPropagation()}>
      <span className="toast-message">{message}</span>
      {onUndo && (
        <button className="toast-undo" onClick={onUndo}>
          {t("undo")}
        </button>
      )}
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
