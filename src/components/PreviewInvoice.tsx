import { useEffect, useRef, useState } from "react";
import type { LineItem } from "./ItemsTable";
import type { MediaFile } from "./MediaUpload";

const BLUE = "#1D4ED8";

export interface InvoiceData {
  invoiceName: string;
  description: string;
  recipient: string;
  items: LineItem[];
  subtotal: number;
  wallet: string | null;
  dueDate: string;
}

interface Props {
  data: InvoiceData;
  onClose: () => void;
}

type Template = "classic" | "modern";

export function PreviewInvoice({ data, onClose }: Props) {
  const [template, setTemplate] = useState<Template>("classic");
  const overlayRef = useRef<HTMLDivElement>(null);

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
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        zIndex: 2000, overflowY: "auto", padding: "40px 24px 64px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Template switcher + close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4, background: "#1E3A8A", borderRadius: 8, padding: 4 }}>
            {(["classic", "modern"] as Template[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                style={{
                  padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                  background: template === t ? "#fff" : "transparent",
                  color: template === t ? "#1E3A8A" : "rgba(255,255,255,0.75)",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Close
          </button>
        </div>

        {/* Invoice document */}
        {template === "classic"
          ? <ClassicTemplate data={data} />
          : <ModernTemplate data={data} />
        }
      </div>
    </div>
  );
}

/* ── Shared helpers ── */

function uploadedImages(images: MediaFile[]) {
  return images.filter((f) => f.status === "uploaded");
}

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });
}

function ItemImageStrip({ images }: { images: MediaFile[] }) {
  const ready = uploadedImages(images);
  if (!ready.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {ready.map((f) => (
        <img
          key={f.id}
          src={f.url}
          alt={f.caption || f.name}
          style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #E5E7EB", flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

/* ── Classic template ── */

function ClassicTemplate({ data }: { data: InvoiceData }) {
  const { invoiceName, items, subtotal } = data;

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: "hidden",
    }}>
      {/* Header band */}
      <div style={{ background: BLUE, padding: "28px 32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>INVOICE</div>
            {invoiceName && <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 }}>{invoiceName}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>From</div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginTop: 2 }}>Hermiston, Hegmann And Sauer</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 32px" }}>
        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
              <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", width: "50%" }}>Description</th>
              <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Unit Price</th>
              <th style={{ textAlign: "right", padding: "8px 0", color: "#6B7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const amount = item.quantity * item.unitPrice;
              const hasImages = uploadedImages(item.images).length > 0;
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: hasImages ? "14px 16px 14px 0" : "14px 16px 14px 0", verticalAlign: "top" }}>
                    <div style={{ color: "#111827", fontWeight: 500 }}>
                      {item.description || <span style={{ color: "#9CA3AF" }}>—</span>}
                    </div>
                    <ItemImageStrip images={item.images} />
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center", color: "#374151", verticalAlign: "top" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", color: "#374151", verticalAlign: "top" }}>{fmt(item.unitPrice)}</td>
                  <td style={{ padding: "14px 0 14px 12px", textAlign: "right", color: "#111827", fontWeight: 600, verticalAlign: "top" }}>{fmt(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <div style={{ minWidth: 220 }}>
            <TotalRow label="Subtotal" value={fmt(subtotal)} />
            <div style={{ borderTop: "2px solid #111827", marginTop: 8, paddingTop: 8 }}>
              <TotalRow label="Total" value={fmt(subtotal)} bold />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #F3F4F6", textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>
          Thank you for your business
        </div>
      </div>
    </div>
  );
}

/* ── Modern template ── */

function ModernTemplate({ data }: { data: InvoiceData }) {
  const { invoiceName, items, subtotal } = data;

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
              {invoiceName || "Invoice"}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 24 }}>
              <MetaField label="From" value="Hermiston, Hegmann And Sauer" />
            </div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="#fff">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Items</div>
        {items.map((item) => {
          const amount = item.quantity * item.unitPrice;
          const ready = uploadedImages(item.images);
          return (
            <div key={item.id} style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", border: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>
                    {item.description || <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Unnamed item</span>}
                  </div>
                  <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
                    {item.quantity} × {fmt(item.unitPrice)}
                  </div>
                  {/* Images below description */}
                  {ready.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {ready.map((f) => (
                        <img
                          key={f.id}
                          src={f.url}
                          alt={f.caption || f.name}
                          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB", flexShrink: 0 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", flexShrink: 0 }}>
                  {fmt(amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div style={{ padding: "16px 32px 32px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ minWidth: 240 }}>
            <TotalRow label="Subtotal" value={fmt(subtotal)} />
            <div style={{ borderTop: "2px solid #111827", marginTop: 8, paddingTop: 8 }}>
              <TotalRow label="Total" value={fmt(subtotal)} bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tiny shared sub-components ── */

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: bold ? 15 : 13 }}>
      <span style={{ color: bold ? "#111827" : "#6B7280", fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: "#111827", fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 13, color: "#374151", fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}
