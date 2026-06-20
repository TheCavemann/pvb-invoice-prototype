import { useState } from "react";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  onAddImageClick: (itemId: string) => void;
}

function makeId() {
  return `item_${Math.random().toString(36).slice(2, 9)}`;
}

function emptyItem(): LineItem {
  return { id: makeId(), description: "", quantity: 1, unitPrice: 0 };
}

export function ItemsTable({ items, onChange, onAddImageClick }: ItemsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
            <th style={thStyle("left")}>Description</th>
            <th style={thStyle("center")}>Quantity</th>
            <th style={thStyle("right")}>Unit Price (NGN)</th>
            <th style={thStyle("right")}>Amount (NGN)</th>
            {/* Zero-width header for the action column — keeps layout stable */}
            <th style={{ width: 36, padding: 0 }} />
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const amount = item.quantity * item.unitPrice;
            const isHovered = hoveredRow === item.id;

            return (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid #F3F4F6", position: "relative" }}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Description */}
                <td style={tdStyle("left")}>
                  <input
                    type="text"
                    value={item.description}
                    placeholder="Enter item description"
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    style={cellInputStyle}
                  />
                </td>

                {/* Quantity */}
                <td style={tdStyle("center")}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })
                    }
                    style={{ ...cellInputStyle, textAlign: "center", width: 60 }}
                  />
                </td>

                {/* Unit Price */}
                <td style={tdStyle("right")}>
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })
                    }
                    style={{ ...cellInputStyle, textAlign: "right", width: 100 }}
                  />
                </td>

                {/* Amount (read-only) */}
                <td style={{ ...tdStyle("right"), color: "#111827", fontWeight: 400 }}>
                  {amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </td>

                {/* Add-image button — appears on row hover, sits in the dedicated action column */}
                <td style={{ padding: "0 12px 0 4px", width: 36, verticalAlign: "middle" }}>
                  <button
                    type="button"
                    onClick={() => onAddImageClick(item.id)}
                    aria-label={`Add image to ${item.description || "this item"}`}
                    title="Add image to this item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: isHovered ? "1.5px dashed #4A6CF7" : "1.5px dashed transparent",
                      background: isHovered ? "#EEF3FF" : "transparent",
                      cursor: "pointer",
                      color: isHovered ? "#4A6CF7" : "transparent",
                      flexShrink: 0,
                      transition: "border-color 0.15s, color 0.15s, background 0.15s",
                      outline: "none",
                      padding: 0,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4A6CF7";
                      e.currentTarget.style.color = "#4A6CF7";
                      e.currentTarget.style.background = "#EEF3FF";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,108,247,0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.color = "transparent";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <AddImageIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add new item */}
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem()])}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#4A6CF7",
          fontSize: 13,
          fontWeight: 500,
          padding: "12px 24px",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1E3A8A")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#4A6CF7")}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add new Item
      </button>

    </div>
  );
}

/* ── Remove affordance lives in the row via a separate approach ── */
// (kept simple: trash icon is in the same action cell, shown on hover via ItemsTable state)

function AddImageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Image frame */}
      <rect x="1" y="3" width="14" height="11" rx="2" />
      {/* Mountain / landscape */}
      <path d="M1 10l3.5-3.5L8 10l2.5-2.5L15 10" />
      {/* Sun dot */}
      <circle cx="4.5" cy="6.5" r="1" />
      {/* Plus badge top-right */}
      <line x1="16" y1="1" x2="16" y2="5" />
      <line x1="14" y1="3" x2="18" y2="3" />
    </svg>
  );
}

/* ── Style helpers ── */

function thStyle(align: "left" | "center" | "right"): React.CSSProperties {
  return {
    padding: "10px 16px",
    textAlign: align,
    fontWeight: 500,
    color: "#6B7280",
    fontSize: 13,
    whiteSpace: "nowrap",
    background: "transparent",
  };
}

function tdStyle(align: "left" | "center" | "right"): React.CSSProperties {
  return {
    padding: "12px 16px",
    textAlign: align,
    verticalAlign: "middle",
    color: "#374151",
  };
}

const cellInputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  padding: 0,
  fontFamily: "inherit",
  width: "100%",
};
