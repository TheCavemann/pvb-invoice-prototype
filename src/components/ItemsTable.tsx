import { useEffect, useRef, useState } from "react";
import { MediaUpload, type MediaFile } from "./MediaUpload";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";
const MAX_IMAGES_PER_ITEM = 4;

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  images: MediaFile[];
}

interface ItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

function makeId() {
  return `item_${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyItem(): LineItem {
  return { id: makeId(), description: "", quantity: 1, unitPrice: 0, images: [] };
}

export function ItemsTable({ items, onChange }: ItemsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const openItem = items.find((it) => it.id === openItemId) ?? null;

  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function handleUpload(itemId: string, incoming: MediaFile[]) {
    onChange(
      items.map((it) => {
        if (it.id !== itemId) return it;
        const byId = new Map(it.images.map((f) => [f.id, f]));
        for (const f of incoming) byId.set(f.id, f);
        return { ...it, images: Array.from(byId.values()) };
      })
    );
  }

  function handleRemove(itemId: string, fileId: string) {
    onChange(
      items.map((it) =>
        it.id !== itemId
          ? it
          : { ...it, images: it.images.filter((f) => f.id !== fileId) }
      )
    );
  }

  function handleReorder(itemId: string, reordered: MediaFile[]) {
    onChange(items.map((it) => (it.id !== itemId ? it : { ...it, images: reordered })));
  }

  return (
    <>
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              <th style={th("left", true)}>Description</th>
              <th style={th("center")}>Quantity</th>
              <th style={th("right")}>Unit Price (NGN)</th>
              <th style={th("right")}>Amount (NGN)</th>
              <th style={{ width: 56, padding: 0, border: "none" }} />
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const amount = item.quantity * item.unitPrice;
              const isHovered = hoveredRow === item.id;
              const hasImages = item.images.length > 0;
              const firstUploaded = item.images.find((f) => f.status === "uploaded");
              const count = item.images.length;

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
                      onChange={(e) =>
                        updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })
                      }
                      style={{ ...cellInput, textAlign: "center", width: 56 }}
                    />
                  </td>

                  {/* Unit Price */}
                  <td style={td("right")}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                      <span style={{ color: "#6B7280" }}>₦</span>
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })
                        }
                        style={{ ...cellInput, textAlign: "right", width: 80 }}
                      />
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ ...td("right"), color: "#111827" }}>
                    {amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </td>

                  {/* Image action cell */}
                  <td style={{ width: 56, padding: "0 10px 0 4px", verticalAlign: "middle" }}>
                    {hasImages ? (
                      /* ── Thumbnail + badge ── */
                      <button
                        type="button"
                        onClick={() => setOpenItemId(item.id)}
                        aria-label={`${count} image${count !== 1 ? "s" : ""} attached to ${item.description || "this item"} — click to manage`}
                        title="Manage images"
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          overflow: "hidden",
                          border: `2px solid ${BLUE}`,
                          background: "#E5E7EB",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          {firstUploaded ? (
                            <img
                              src={firstUploaded.url}
                              alt={firstUploaded.caption || "Attached image"}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            /* Still uploading — spinner */
                            <MiniSpinner />
                          )}
                        </div>
                        {/* Count badge */}
                        {count > 1 && (
                          <span style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            background: BLUE,
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                            fontFamily: "inherit",
                          }}>
                            {count}
                          </span>
                        )}
                      </button>
                    ) : (
                      /* ── Add-image button (revealed on hover) ── */
                      <button
                        type="button"
                        onClick={() => setOpenItemId(item.id)}
                        aria-label={`Add image to ${item.description || "this item"}`}
                        title="Add image to this item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: `1.5px dashed ${isHovered ? BLUE : "#D1D5DB"}`,
                          background: isHovered ? BLUE_LIGHT : "transparent",
                          cursor: "pointer",
                          color: isHovered ? BLUE : "#C5C9D0",
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
                            e.currentTarget.style.borderColor = "#D1D5DB";
                            e.currentTarget.style.color = "#C5C9D0";
                            e.currentTarget.style.background = "transparent";
                          }
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <AddImageIcon />
                      </button>
                    )}
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

      {/* Image management modal */}
      {openItem && (
        <ImageModal
          item={openItem}
          onClose={() => setOpenItemId(null)}
          onUpload={(files) => handleUpload(openItem.id, files)}
          onRemove={(fileId) => handleRemove(openItem.id, fileId)}
          onReorder={(reordered) => handleReorder(openItem.id, reordered)}
        />
      )}
    </>
  );
}

/* ── Image modal ── */

interface ImageModalProps {
  item: LineItem;
  onClose: () => void;
  onUpload: (files: MediaFile[]) => void;
  onRemove: (fileId: string) => void;
  onReorder: (files: MediaFile[]) => void;
}

function ImageModal({ item, onClose, onUpload, onRemove, onReorder }: ImageModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Images for ${item.description || "item"}`}
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>
              {item.description ? `"${item.description}"` : "Item"} — Images
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Up to {MAX_IMAGES_PER_ITEM} images · PNG, JPG, JPEG · max 5 MB each
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* MediaUpload */}
        <div style={{ padding: "20px" }}>
          <MediaUpload
            maxFiles={MAX_IMAGES_PER_ITEM}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={item.images}
            label="Add image"
            onUpload={onUpload}
            onRemove={onRemove}
            onReorder={onReorder}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 18px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "9px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Small icons ── */

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

function MiniSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
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
