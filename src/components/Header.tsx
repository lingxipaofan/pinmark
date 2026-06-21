import React from "react";
import { useI18n, type Locale } from "../lib/i18n";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarkCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  darkMode: boolean;
  onDarkModeChange: (v: boolean) => void;
  simplifyTitles: boolean;
  onSimplifyTitlesChange: (value: boolean) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export default function Header({
  searchQuery,
  onSearchChange,
  bookmarkCount,
  viewMode,
  onViewModeChange,
  darkMode,
  onDarkModeChange,
  simplifyTitles,
  onSimplifyTitlesChange,
  searchRef,
}: Props) {
  const { t, locale, setLocale, locales } = useI18n();

  return (
    <header className="header">
      <h1 className="header-title">🔖 Pinmark</h1>
      <span className="header-count">{t("total_bookmarks", { count: bookmarkCount })}</span>
      <div className="header-search">
        <input
          ref={searchRef}
          type="text"
          placeholder={t("search_placeholder")}
          aria-label={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <label className="title-mode-toggle" title={t("simplify_titles_hint")}>
        <input
          type="checkbox"
          role="switch"
          checked={simplifyTitles}
          onChange={(e) => onSimplifyTitlesChange(e.target.checked)}
        />
        <span className="title-mode-track" aria-hidden="true">
          <span className="title-mode-thumb" />
        </span>
        <span>{t("simplify_titles")}</span>
      </label>
      <button
        className="dark-toggle"
        onClick={() => onDarkModeChange(!darkMode)}
        title={darkMode ? t("light_mode") : t("dark_mode")}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      <select
        className="lang-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        title={t("language")}
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => onViewModeChange("grid")}
          title={t("grid_view")}
        >
          🗂 {t("grid")}
        </button>
        <button
          className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => onViewModeChange("list")}
          title={t("list_view")}
        >
          📋 {t("list")}
        </button>
      </div>
    </header>
  );
}
