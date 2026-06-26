import React from "react";
import { Search, Settings } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { getSearchEngineOption, type SearchEngineId } from "../lib/search-engine";
import SettingsModal from "./SettingsModal";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  searchEngine: SearchEngineId;
  onSearchEngineChange: (value: SearchEngineId) => void;
  customSearchTemplate: string;
  onCustomSearchTemplateChange: (value: string) => void;
  darkMode: boolean;
  onDarkModeChange: (v: boolean) => void;
  simplifyTitles: boolean;
  onSimplifyTitlesChange: (value: boolean) => void;
  showRootFolders: boolean;
  onShowRootFoldersChange: (value: boolean) => void;
  zoom?: number;
  onZoomChange?: (value: number) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  searchEngine,
  onSearchEngineChange,
  customSearchTemplate,
  onCustomSearchTemplateChange,
  darkMode,
  onDarkModeChange,
  simplifyTitles,
  onSimplifyTitlesChange,
  showRootFolders,
  onShowRootFoldersChange,
  zoom = 1,
  onZoomChange = () => undefined,
  searchRef,
}: Props) {
  const { t } = useI18n();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const searchEngineOption = getSearchEngineOption(searchEngine);
  const searchEngineLabel = searchEngineOption.label.includes("_")
    ? t(searchEngineOption.label)
    : searchEngineOption.label;

  React.useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener("startmark-open-settings", openSettings);
    return () => window.removeEventListener("startmark-open-settings", openSettings);
  }, []);

  return (
    <header className="header">
      <div className="header-brand" aria-hidden="true">{searchEngineLabel}</div>
      <form
        className="header-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit(searchQuery);
        }}
      >
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          ref={searchRef}
          type="text"
          placeholder={t("search_placeholder")}
          aria-label={t("search_placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button
          type="button"
          className="settings-button"
          onClick={() => setSettingsOpen(true)}
          aria-label={t("settings")}
          title={t("settings")}
        >
          <Settings size={18} aria-hidden="true" />
        </button>
      </form>
      {settingsOpen && (
        <SettingsModal
          darkMode={darkMode}
          onDarkModeChange={onDarkModeChange}
          simplifyTitles={simplifyTitles}
          onSimplifyTitlesChange={onSimplifyTitlesChange}
          searchEngine={searchEngine}
          onSearchEngineChange={onSearchEngineChange}
          customSearchTemplate={customSearchTemplate}
          onCustomSearchTemplateChange={onCustomSearchTemplateChange}
          showRootFolders={showRootFolders}
          onShowRootFoldersChange={onShowRootFoldersChange}
          zoom={zoom}
          onZoomChange={onZoomChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </header>
  );
}
