import { useState } from "react";
import { ItemsTable, type LineItem } from "../components/ItemsTable";

function makeItemId() {
  return `item_${Math.random().toString(36).slice(2, 9)}`;
}

export function CreateInvoice() {
  const [items, setItems] = useState<LineItem[]>([
    { id: makeItemId(), description: "Living Room Rug", quantity: 1, unitPrice: 150000 },
    { id: makeItemId(), description: "Wall Art – Custom Canvas", quantity: 2, unitPrice: 45000 },
    { id: makeItemId(), description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [lastClicked, setLastClicked] = useState<string | null>(null);

  function handleAddImageClick(itemId: string) {
    setLastClicked(itemId);
  }

  const clickedItem = items.find((it) => it.id === lastClicked);

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Top nav */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", display: "flex", alignItems: "center", height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>PVB Business</span>
        <span style={{ margin: "0 12px", color: "#D1D5DB" }}>›</span>
        <span style={{ fontSize: 14, color: "#6B7280" }}>Invoicing</span>
        <span style={{ margin: "0 12px", color: "#D1D5DB" }}>›</span>
        <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>Create Invoice</span>
      </header>

      <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Create Invoice</h1>

        {/* Invoice details */}
        <Section title="Invoice Details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Invoice title">
              <input type="text" defaultValue="Interior Decor Proposal" style={fieldInputStyle} />
            </Field>
            <Field label="Invoice number">
              <input type="text" defaultValue="INV-0042" style={fieldInputStyle} />
            </Field>
            <Field label="Due date">
              <input type="date" defaultValue="2026-07-15" style={fieldInputStyle} />
            </Field>
            <Field label="Bill to">
              <input type="text" defaultValue="Arinze Chibueze" style={fieldInputStyle} />
            </Field>
          </div>
        </Section>

        {/* Items */}
        <Section title="Items">
          <ItemsTable
            items={items}
            onChange={setItems}
            onAddImageClick={handleAddImageClick}
          />
        </Section>

        {/* Notes */}
        <Section title="Notes (optional)">
          <textarea
            rows={3}
            placeholder="Add a note to your client…"
            style={{ ...fieldInputStyle, width: "100%", resize: "vertical", boxSizing: "border-box" }}
          />
        </Section>

        {/* Toast showing which item was clicked — placeholder for the real modal */}
        {lastClicked && (
          <div
            role="status"
            style={{
              position: "fixed",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#111827",
              color: "#fff",
              fontSize: 13,
              padding: "10px 18px",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            "Add image" clicked on:{" "}
            <strong>{clickedItem?.description || "(empty item)"}</strong>
            {" "}— uploader coming next
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 48 }}>
          <button type="button" style={secondaryBtnStyle}>Save to drafts</button>
          <button type="button" style={primaryBtnStyle}>Preview Invoice →</button>
        </div>
      </div>
    </div>
  );
}

/* ── small layout helpers ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#111827" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const fieldInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  fontSize: 14,
  color: "#111827",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  background: "#1E3A8A",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  background: "#fff",
  color: "#374151",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};
