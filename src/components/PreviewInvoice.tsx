import { useEffect, useRef, useState } from "react";
import { MediaUpload, type MediaFile } from "./MediaUpload";
import type { LineItem } from "./ItemsTable";

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

const BANNER_COLORS = [
  "#1D4ED8", // brand blue
  "#0F172A", // dark navy
  "#EAB308", // yellow
  "#F97316", // orange
  "#EF4444", // red
  "#22C55E", // green
  "#15803D", // dark green
];

export function PreviewInvoice({ data, onClose }: Props) {
  const [template, setTemplate] = useState<Template>("modern");
  const [bannerColor, setBannerColor] = useState("#0F172A");
  const [hexInput, setHexInput] = useState("#0F172A");
  const [logoFiles, setLogoFiles] = useState<MediaFile[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function applyHex(val: string) {
    const clean = val.startsWith("#") ? val : "#" + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      setBannerColor(clean);
    }
    setHexInput(val);
  }

  function pickSwatch(color: string) {
    setBannerColor(color);
    setHexInput(color);
  }

  function handleLogoUpload(incoming: MediaFile[]) {
    setLogoFiles((prev) => {
      const byId = new Map(prev.map((f) => [f.id, f]));
      for (const f of incoming) byId.set(f.id, f);
      return Array.from(byId.values());
    });
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000, padding: "20px 24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        textAlign: "left",
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: "100%", maxWidth: 1100,
          height: "calc(100vh - 40px)", maxHeight: 860,
          background: "#fff",
          borderRadius: 12,
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* ── Modal header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 28px", borderBottom: "1px solid #E5E7EB", flexShrink: 0,
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Preview Invoice</span>
          <button
            type="button" onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 4, display: "flex", borderRadius: 6 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Body: Customize | Invoice ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left: Customize panel */}
          <div style={{
            width: 340, flexShrink: 0,
            background: "#F9FAFB", borderRight: "1px solid #E5E7EB",
            overflowY: "auto", padding: "28px 24px",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Customize</div>

            {/* Invoice type */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Invoice type</div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["Classic", "Modern"] as const).map((t) => {
                  const active = template === t.toLowerCase();
                  return (
                    <button
                      key={t} type="button"
                      onClick={() => setTemplate(t.toLowerCase() as Template)}
                      style={{
                        padding: "6px 20px", borderRadius: 20, cursor: "pointer",
                        fontSize: 13, fontFamily: "inherit",
                        border: `1.5px solid ${active ? "#374151" : "#D1D5DB"}`,
                        background: "#fff",
                        color: active ? "#111827" : "#6B7280",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner color */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Banner</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {BANNER_COLORS.map((c) => (
                  <button
                    key={c} type="button"
                    onClick={() => pickSwatch(c)}
                    aria-label={c}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: c, border: "none", cursor: "pointer",
                      outline: bannerColor === c ? `3px solid ${c}` : "none",
                      outlineOffset: 2,
                      boxShadow: bannerColor === c ? "0 0 0 2px #fff, 0 0 0 4px " + c : "none",
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => applyHex(e.target.value)}
                style={{
                  padding: "8px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8,
                  fontSize: 13, fontFamily: "inherit", color: "#374151", width: 120,
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Logo */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Logo</div>
              <MediaUpload
                maxFiles={1}
                maxSizeMB={5}
                acceptedTypes={["image/png", "image/jpeg"]}
                files={logoFiles}
                label="Upload logo"
                onUpload={handleLogoUpload}
                onRemove={(id) => setLogoFiles((prev) => prev.filter((f) => f.id !== id))}
                onReorder={setLogoFiles}
              />
            </div>
          </div>

          {/* Right: Invoice preview */}
          <div style={{ flex: 1, overflowY: "auto", background: "#F3F4F6", padding: "28px 32px" }}>
            {template === "modern"
              ? <ModernInvoice data={data} bannerColor={bannerColor} logoFiles={logoFiles} />
              : <ClassicInvoice data={data} bannerColor={bannerColor} logoFiles={logoFiles} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared helpers ── */

function uploadedImages(images: MediaFile[]) {
  return images.filter((f) => f.status === "uploaded");
}

function fmt(n: number) {
  return n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

function ItemImages({ images }: { images: MediaFile[] }) {
  const ready = uploadedImages(images);
  if (!ready.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {ready.map((f) => (
        <img
          key={f.id} src={f.url} alt={f.caption || f.name}
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #E5E7EB", flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

interface TemplateProps {
  data: InvoiceData;
  bannerColor: string;
  logoFiles: MediaFile[];
}

/* ── Modern invoice ── */

function ModernInvoice({ data, bannerColor, logoFiles }: TemplateProps) {
  const { invoiceName, description, items, subtotal, dueDate } = data;
  const logo = logoFiles.find((f) => f.status === "uploaded");

  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

      {/* Dark header band */}
      <div style={{ background: bannerColor, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>

          {/* Left: from */}
          <div>
            {logo && (
              <img src={logo.url} alt="Logo" style={{ height: 36, marginBottom: 12, objectFit: "contain" }} />
            )}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Hermiston, Hegmann And Sauer</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              22666 Kshlerin Park<br />
              2347065705327<br />
              arinze@yopmail.com
            </div>
          </div>

          {/* Right: bill to */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Bill To: <span style={{ color: "#fff", fontWeight: 600 }}>Ifeanyi Nwune</span></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              21 Muyiwa Opaleye Street, Lekki Lagos<br />
              +2347065705327<br />
              ifeanyinwune@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Invoice meta row */}
      <div style={{ padding: "18px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{invoiceName || "Invoice"}</div>
          {description && <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{description}</div>}
        </div>
        {dueDate && (
          <div style={{ fontSize: 13, color: "#6B7280" }}>Due Date <span style={{ color: "#111827", fontWeight: 500 }}>{dueDate}</span></div>
        )}
      </div>

      {/* Items table */}
      <div style={{ padding: "18px 28px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              <Th align="left" first>Item</Th>
              <Th align="center">Quantity</Th>
              <Th align="right">Unity Price (₦)</Th>
              <Th align="right" last>Amount (₦)</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const amount = item.quantity * item.unitPrice;
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 12px 14px 0", verticalAlign: "top", color: "#111827" }}>
                    <div>{item.description || <span style={{ color: "#9CA3AF" }}>—</span>}</div>
                    <ItemImages images={item.images} />
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center", verticalAlign: "top", color: "#374151" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", verticalAlign: "top", color: "#374151" }}>{fmt(item.unitPrice)}</td>
                  <td style={{ padding: "14px 0 14px 12px", textAlign: "right", verticalAlign: "top", color: "#111827", fontWeight: 500 }}>{fmt(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notes + Totals */}
      <div style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", gap: 24, borderTop: "1px solid #F3F4F6" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Notes:</div>
          {description && <div style={{ fontSize: 12, color: "#6B7280" }}>{description}</div>}
        </div>
        <div style={{ minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
            <span style={{ color: "#6B7280" }}>Subtotal</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>₦ {fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 4px", fontSize: 14, borderTop: "1px solid #E5E7EB", marginTop: 6 }}>
            <span style={{ fontWeight: 700, color: "#111827" }}>TOTAL</span>
            <span style={{ fontWeight: 700, color: "#111827" }}>₦ {fmt(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ padding: "20px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Payment Method</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, maxWidth: 260 }}>
            Complete payment by making transfer to the account details provided
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Account Details</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.8 }}>
            3324164287<br />
            FAAS (SANDBOX)<br />
            Hermiston Hegmann And Sauer-7408
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#6B7280" }}>Piggyvest Business — Maximize Your Business Money.</div>
        <div style={{ fontSize: 12 }}>
          Email us at{" "}
          <span style={{ color: BLUE }}>support@piggyvest.business</span>
        </div>
      </div>
    </div>
  );
}

/* ── Classic invoice ── */

function ClassicInvoice({ data, bannerColor, logoFiles }: TemplateProps) {
  const { invoiceName, description, items, subtotal, dueDate } = data;
  const logo = logoFiles.find((f) => f.status === "uploaded");

  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

      {/* Dark header band */}
      <div style={{ background: bannerColor, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
          <div>
            {logo && (
              <img src={logo.url} alt="Logo" style={{ height: 36, marginBottom: 12, objectFit: "contain" }} />
            )}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Hermiston, Hegmann And Sauer</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              22666 Kshlerin Park<br />
              2347065705327<br />
              arinze@yopmail.com
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Bill To: <span style={{ color: "#fff", fontWeight: 600 }}>Ifeanyi Nwune</span></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              21 Muyiwa Opaleye Street, Lekki Lagos<br />
              +2347065705327<br />
              ifeanyinwune@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Invoice meta */}
      <div style={{ padding: "18px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{invoiceName || "Invoice"}</div>
          {description && <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{description}</div>}
        </div>
        {dueDate && (
          <div style={{ fontSize: 13, color: "#6B7280" }}>Due Date <span style={{ color: "#111827", fontWeight: 500 }}>{dueDate}</span></div>
        )}
      </div>

      {/* Items table — classic has a visible border on the table */}
      <div style={{ padding: "18px 28px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <Th align="left" first>Item</Th>
              <Th align="center">Quantity</Th>
              <Th align="right">Unity Price (₦)</Th>
              <Th align="right" last>Amount (₦)</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const amount = item.quantity * item.unitPrice;
              const last = i === items.length - 1;
              return (
                <tr key={item.id} style={{ borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 12px 14px 16px", verticalAlign: "top", color: "#111827" }}>
                    <div>{item.description || <span style={{ color: "#9CA3AF" }}>—</span>}</div>
                    <ItemImages images={item.images} />
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center", verticalAlign: "top", color: "#374151" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", verticalAlign: "top", color: "#374151" }}>{fmt(item.unitPrice)}</td>
                  <td style={{ padding: "14px 16px 14px 12px", textAlign: "right", verticalAlign: "top", color: "#111827", fontWeight: 500 }}>{fmt(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notes + Totals */}
      <div style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", gap: 24, borderTop: "1px solid #F3F4F6" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Notes:</div>
          {description && <div style={{ fontSize: 12, color: "#6B7280" }}>{description}</div>}
        </div>
        <div style={{ minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
            <span style={{ color: "#6B7280" }}>Subtotal</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>₦ {fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 4px", fontSize: 14, borderTop: "1px solid #E5E7EB", marginTop: 6 }}>
            <span style={{ fontWeight: 700, color: "#111827" }}>TOTAL</span>
            <span style={{ fontWeight: 700, color: "#111827" }}>₦ {fmt(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ padding: "20px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Payment Method</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, maxWidth: 260 }}>
            Complete payment by making transfer to the account details provided
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Account Details</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.8 }}>
            3324164287<br />
            FAAS (SANDBOX)<br />
            Hermiston Hegmann And Sauer-7408
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#6B7280" }}>Piggyvest Business — Maximize Your Business Money.</div>
        <div style={{ fontSize: 12 }}>
          Email us at{" "}
          <span style={{ color: BLUE }}>support@piggyvest.business</span>
        </div>
      </div>
    </div>
  );
}

/* ── Table header cell ── */

function Th({ children, align, first, last }: { children: React.ReactNode; align: "left" | "center" | "right"; first?: boolean; last?: boolean }) {
  return (
    <th style={{
      padding: "10px 12px",
      paddingLeft: first ? 16 : 12,
      paddingRight: last ? 16 : 12,
      textAlign: align,
      fontSize: 12,
      fontWeight: 600,
      color: "#6B7280",
      background: "#F9FAFB",
      borderBottom: "1px solid #E5E7EB",
      whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}
