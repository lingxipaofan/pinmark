// @vitest-environment jsdom

import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../src/components/Header";
import { I18nProvider } from "../src/lib/i18n";

function renderHeader(overrides = {}) {
  const props = {
    searchQuery: "",
    onSearchChange: vi.fn(),
    onSearchSubmit: vi.fn(),
    searchEngine: "browser" as const,
    onSearchEngineChange: vi.fn(),
    customSearchEngines: [],
    onCustomSearchEnginesChange: vi.fn(),
    darkMode: false,
    onDarkModeChange: vi.fn(),
    simplifyTitles: false,
    onSimplifyTitlesChange: vi.fn(),
    searchZoom: 1,
    onSearchZoomChange: vi.fn(),
    gridZoom: 1,
    onGridZoomChange: vi.fn(),
    version: "0.1.0",
    ...overrides,
  };

  render(
    <I18nProvider>
      <Header {...props} />
    </I18nProvider>,
  );
  return props;
}

describe("Header settings", () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("startmark-locale", "en");
  });

  it("renders navigation-only controls", () => {
    renderHeader();
    expect(screen.getByText("Search")).toBeTruthy();
    expect(screen.queryByText("List")).toBeNull();
    expect(screen.queryByText("Grid")).toBeNull();
    expect(screen.queryByTitle("Show folders")).toBeNull();
    expect(screen.queryByTitle("Hide folders")).toBeNull();
  });

  it("submits web searches from the search field", () => {
    const props = renderHeader({ searchQuery: "weather tomorrow" });

    fireEvent.submit(screen.getByRole("textbox", { name: "Search bookmarks or the web... (⌘F / Enter)" }));

    expect(props.onSearchSubmit).toHaveBeenCalledWith("weather tomorrow");
  });

  it("moves inline controls into a settings dialog and applies changes immediately", () => {
    const props = renderHeader();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Dark mode" }));
    expect(props.onDarkModeChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "Display" }));
    fireEvent.click(screen.getByRole("switch", { name: "Short titles" }));
    expect(props.onSimplifyTitlesChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Search engine" }), {
      target: { value: "bing" },
    });
    expect(props.onSearchEngineChange).toHaveBeenCalledWith("bing");

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(props.onCustomSearchEnginesChange).toHaveBeenCalledWith([
      expect.objectContaining({ title: "Custom", template: "" }),
    ]);

    cleanup();
    const customProps = renderHeader({
      customSearchEngines: [{ id: "custom:test", title: "Docs", template: "https://docs.test/?q=%s" }],
    });
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
      target: { value: "Docs Search" },
    });
    expect(customProps.onCustomSearchEnginesChange).toHaveBeenCalledWith([
      { id: "custom:test", title: "Docs Search", template: "https://docs.test/?q=%s" },
    ]);

    cleanup();
    const pickerProps = renderHeader({
      customSearchEngines: [{ id: "custom:test", title: "Docs", template: "https://docs.test/?q=%s" }],
    });
    fireEvent.click(screen.getByRole("button", { name: "Select search engine" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: /Docs/ }));
    expect(pickerProps.onSearchEngineChange).toHaveBeenCalledWith("custom:test");

    const searchZoomChange = vi.fn();
    const gridZoomChange = vi.fn();
    cleanup();
    renderHeader({
      searchZoom: 1,
      onSearchZoomChange: searchZoomChange,
      gridZoom: 1,
      onGridZoomChange: gridZoomChange,
    });
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Display" }));
    const searchZoomSlider = screen.getByRole("slider", { name: "Search area scale" });
    expect(searchZoomSlider.getAttribute("step")).toBe("any");
    fireEvent.change(searchZoomSlider, {
      target: { value: "1.15" },
    });
    expect(searchZoomChange).toHaveBeenCalledWith(1.15);
    fireEvent.change(screen.getByRole("slider", { name: "Folder area scale" }), {
      target: { value: "0.9" },
    });
    expect(gridZoomChange).toHaveBeenCalledWith(0.9);
    fireEvent.click(screen.getByRole("button", { name: "Reset scale" }));
    expect(searchZoomChange).toHaveBeenCalledWith(1);
    expect(gridZoomChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: "About" }));
    expect(screen.getByText("Version")).toBeTruthy();
    expect(screen.getByText("0.1.0")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
    const languageSelect = screen.getByRole("combobox", { name: "Language" });
    languageSelect.focus();
    fireEvent.change(languageSelect, {
      target: { value: "ja" },
    });
    expect(localStorage.getItem("startmark-locale")).toBe("ja");
    expect(document.activeElement).toBe(languageSelect);
  });

  it("closes from the close button, backdrop, and Escape", () => {
    vi.useFakeTimers();
    renderHeader();
    const open = () => {
      fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    };
    const finishCloseAnimation = () => {
      act(() => {
        vi.advanceTimersByTime(160);
      });
    };

    open();
    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));
    finishCloseAnimation();
    expect(screen.queryByRole("dialog")).toBeNull();

    open();
    fireEvent.click(screen.getByTestId("settings-backdrop"));
    finishCloseAnimation();
    expect(screen.queryByRole("dialog")).toBeNull();

    open();
    fireEvent.keyDown(document, { key: "Escape" });
    finishCloseAnimation();
    expect(screen.queryByRole("dialog")).toBeNull();
    vi.useRealTimers();
  });
});
