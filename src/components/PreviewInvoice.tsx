import { useEffect, useState } from "react";
import { MediaUpload, type MediaFile } from "./MediaUpload";
import { InvoiceDocument } from "./InvoiceDocument";
import type { InvoiceTemplate } from "./InvoiceDocument";

export type { InvoiceData } from "./InvoiceDocument";

const BANNER_COLORS = [
  "#1D4ED8",
  "#0F172A",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#22C55E",
  "#15803D",
];

interface Props {
  data: import("./InvoiceDocument").InvoiceData;
  onClose: () => void;
}

export function PreviewInvoice({ data, onClose }: Props) {
  const [template, setTemplate] = useState<InvoiceTemplate>("modern");
  const [bannerColor, setBannerColor] = useState("#0F172A");
  const [hexInput, setHexInput] = useState("#0F172A");
  const [logoFiles, setLogoFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function applyHex(val: string) {
    const clean = val.startsWith("#") ? val : "#" + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) setBannerColor(clean);
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
      <div style={{
        width: "100%", maxWidth: 1100,
        height: "calc(100vh - 40px)", maxHeight: 860,
        background: "#fff", borderRadius: 12,
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}>
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: "1px solid #E5E7EB", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Preview Invoice</span>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 0, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left: Customize */}
          <div style={{ width: 340, flexShrink: 0, background: "#F9FAFB", borderRight: "1px solid #E5E7EB", overflowY: "auto", padding: "28px 24px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Customize</div>

            {/* Invoice type */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Invoice type</div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["Classic", "Modern"] as const).map((t) => {
                  const active = template === t.toLowerCase();
                  return (
                    <button key={t} type="button" onClick={() => setTemplate(t.toLowerCase() as InvoiceTemplate)}
                      style={{ padding: "6px 20px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", border: `1.5px solid ${active ? "#374151" : "#D1D5DB"}`, background: "#fff", color: active ? "#111827" : "#6B7280", fontWeight: active ? 600 : 400 }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Banner</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {BANNER_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => pickSwatch(c)} aria-label={c}
                    style={{ width: 36, height: 36, borderRadius: 8, background: c, border: "none", cursor: "pointer", boxShadow: bannerColor === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : "none" }} />
                ))}
              </div>
              <input type="text" value={hexInput} onChange={(e) => applyHex(e.target.value)}
                style={{ padding: "8px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#374151", width: 120, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Logo */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Logo</div>
              <MediaUpload
                maxFiles={1} maxSizeMB={5}
                acceptedTypes={["image/png", "image/jpeg"]}
                files={logoFiles} label="Upload logo"
                onUpload={handleLogoUpload}
                onRemove={(id) => setLogoFiles((prev) => prev.filter((f) => f.id !== id))}
                onReorder={setLogoFiles}
              />
            </div>
          </div>

          {/* Right: live invoice */}
          <div style={{ flex: 1, overflowY: "auto", background: "#F3F4F6", padding: "28px 32px" }}>
            <InvoiceDocument
              data={data}
              template={template}
              bannerColor={bannerColor}
              logoFiles={logoFiles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
