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

function formatNaira(n: number) {
  return n.toLocaleString("en-NG");
}

export function ItemsTable({ items, onChange, onAddImageClick }: ItemsTableProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    onChange(items.filter((it) => it.id !== id));
  }

  function addItem() {
    onChange([...items, emptyItem()]);
  }

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["Item", "Quantity", "Unit Price (₦)", "Amount (₦)", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: h === "Amount (₦)" ? "right" : "left",
                    fontWeight: 500,
                    color: "#6B7280",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const amount = item.quantity * item.unitPrice;
              const isFocused = focusedId === item.id;

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #F3F4F6",
                    background: isFocused ? "#FAFAFA" : "transparent",
                    transition: "background 0.1s",
                  }}
                  onFocus={() => setFocusedId(item.id)}
                  onBlur={() => setFocusedId(null)}
                >
                  {/* Description */}
                  <td style={{ padding: "8px 12px", minWidth: 200 }}>
                    <input
                      type="text"
                      value={item.description}
                      placeholder="Item description"
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      style={inputStyle}
                    />
                  </td>

                  {/* Quantity */}
                  <td style={{ padding: "8px 12px", width: 90 }}>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })
                      }
                      style={{ ...inputStyle, textAlign: "center" }}
                    />
                  </td>

                  {/* Unit price */}
                  <td style={{ padding: "8px 12px", width: 130 }}>
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })
                      }
                      style={{ ...inputStyle, textAlign: "right" }}
                    />
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "8px 12px", width: 110, textAlign: "right", color: "#111827", fontWeight: 500 }}>
                    {formatNaira(amount)}
                  </td>

                  {/* Actions: add image + remove */}
                  <td style={{ padding: "8px 8px 8px 4px", width: 72, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {/* Add image button */}
                      <button
                        type="button"
                        onClick={() => onAddImageClick(item.id)}
                        aria-label={`Add image to ${item.description || "this item"}`}
                        title="Add image"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderRadius: 6,
                          border: "1.5px dashed #D1D5DB",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#9CA3AF",
                          flexShrink: 0,
                          transition: "border-color 0.15s, color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#4A6CF7";
                          e.currentTarget.style.color = "#4A6CF7";
                          e.currentTarget.style.background = "#EEF3FF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#D1D5DB";
                          e.currentTarget.style.color = "#9CA3AF";
                          e.currentTarget.style.background = "transparent";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,108,247,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <AddImageIcon />
                      </button>

                      {/* Remove row */}
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          title="Remove item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#D1D5DB",
                            flexShrink: 0,
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add item row */}
      <button
        type="button"
        onClick={addItem}
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#4A6CF7",
          fontSize: 13,
          fontWeight: 500,
          padding: "6px 12px",
          borderRadius: 6,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF3FF")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add item
      </button>

      {/* Subtotal */}
      <div style={{ borderTop: "1px solid #E5E7EB", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <table style={{ fontSize: 14 }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 16px 4px 0", color: "#6B7280" }}>Subtotal</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#111827" }}>₦{formatNaira(subtotal)}</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 16px 0 0", color: "#111827", fontWeight: 700, fontSize: 15 }}>TOTAL</td>
              <td style={{ padding: "6px 0 0", textAlign: "right", color: "#111827", fontWeight: 700, fontSize: 15 }}>₦{formatNaira(subtotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  padding: "4px 0",
  fontFamily: "inherit",
};

function AddImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <circle cx="7.5" cy="8.5" r="1.5" />
      <path d="M2 14l4-4 3 3 2-2 5 5" />
      <line x1="15" y1="2" x2="15" y2="6" />
      <line x1="13" y1="4" x2="17" y2="4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}
