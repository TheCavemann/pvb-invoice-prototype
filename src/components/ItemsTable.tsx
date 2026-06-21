import { useState } from "react";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";

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
            <th style={th("left", true)}>Description</th>
            <th style={th("center")}>Quantity</th>
            <th style={th("right")}>Unit Price (NGN)</th>
            <th style={th("right")}>Amount (NGN)</th>
            {/* Action column — zero visual weight in header */}
            <th style={{ width: 44, padding: 0, border: "none" }} />
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const amount = item.quantity * item.unitPrice;
            const isHovered = hoveredRow === item.id;

            return (
              <tr
                key={item.id}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ borderBottom: "1px solid #F3F4F6" }}
              >
                {/* Description */}
                <td style={td("left", true)}>
                  <input
                    type="text"
                    value={item.description}
                    placeholder="Product or Service"
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    style={cellInput}
                  />
                </td>

                {/* Quantity */}
                <td style={td("center")}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                    style={{ ...cellInput, textAlign: "center", width: 56 }}
                  />
                </td>

                {/* Unit Price — shows ₦ prefix inline */}
                <td style={td("right")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                    <span style={{ color: "#6B7280" }}>₦</span>
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
                      style={{ ...cellInput, textAlign: "right", width: 80 }}
                    />
                  </div>
                </td>

                {/* Amount */}
                <td style={{ ...td("right"), color: "#111827" }}>
                  {amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </td>

                {/* Add-image button — revealed on row hover */}
                <td style={{ width: 44, padding: "0 10px 0 4px", verticalAlign: "middle" }}>
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
                      border: `1.5px dashed ${isHovered ? BLUE : "transparent"}`,
                      background: isHovered ? BLUE_LIGHT : "transparent",
                      cursor: "pointer",
                      color: isHovered ? BLUE : "transparent",
                      transition: "border-color 0.12s, color 0.12s, background 0.12s",
                      outline: "none",
                      padding: 0,
                      flexShrink: 0,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = BLUE;
                      e.currentTarget.style.color = BLUE;
                      e.currentTarget.style.background = BLUE_LIGHT;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${BLUE}33`;
                    }}
                    onBlur={(e) => {
                      if (hoveredRow !== item.id) {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.color = "transparent";
                        e.currentTarget.style.background = "transparent";
                      }
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
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: BLUE, fontSize: 13, fontWeight: 500, padding: "12px 24px", fontFamily: "inherit" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1e40af")}
        onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add new Item
      </button>
    </div>
  );
}

function AddImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="14" height="11" rx="2" />
      <path d="M1 10l3.5-3.5L8 10l2.5-2.5L15 10" />
      <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <line x1="16.5" y1="1" x2="16.5" y2="5" />
      <line x1="14.5" y1="3" x2="18.5" y2="3" />
    </svg>
  );
}

/* ── Style helpers ── */

function th(align: "left" | "center" | "right", hasBorderRight?: boolean): React.CSSProperties {
  return {
    padding: "10px 16px",
    textAlign: align,
    fontWeight: 500,
    color: "#6B7280",
    fontSize: 13,
    whiteSpace: "nowrap",
    borderRight: hasBorderRight ? "1px solid #F3F4F6" : undefined,
  };
}

function td(align: "left" | "center" | "right", hasBorderRight?: boolean): React.CSSProperties {
  return {
    padding: "14px 16px",
    textAlign: align,
    verticalAlign: "middle",
    color: "#374151",
    borderRight: hasBorderRight ? "1px solid #F3F4F6" : undefined,
  };
}

const cellInput: React.CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  padding: 0,
  fontFamily: "inherit",
  width: "100%",
};
