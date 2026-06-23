import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../lib/i18n";

interface Props {
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onCancel]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="confirm-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title">{t("confirm_delete_title")}</h2>
        <p id="confirm-message">{message}</p>
        <footer className="confirm-actions">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={isSubmitting}>
            {t("cancel")}
          </button>
          <button
            type="button"
            className="confirm-delete-button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {t("confirm_delete")}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
