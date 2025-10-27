"use client"

interface ViewToggleProps {
  viewType: "list" | "grid"
  onViewChange: (view: "list" | "grid") => void
}

export default function ViewToggle({ viewType, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        type="button"
        className={`view-toggle__button ${viewType === "list" ? "view-toggle__button--active" : ""}`}
        onClick={() => onViewChange("list")}
        aria-label="List view"
        title="List view"
      >
        ☰
      </button>
      <button
        type="button"
        className={`view-toggle__button ${viewType === "grid" ? "view-toggle__button--active" : ""}`}
        onClick={() => onViewChange("grid")}
        aria-label="Grid view"
        title="Grid view"
      >
        ⊞
      </button>
    </div>
  )
}
