import { useEffect, useState } from "react";
import { InvoiceDocument } from "../components/InvoiceDocument";
import type { InvoiceData } from "../components/InvoiceDocument";
import type { MediaFile } from "../components/MediaUpload";
import { emptyItem } from "../components/ItemsTable";

const BLUE = "#1D4ED8";

/* ── Mock data representing a sent invoice ── */

function makeMockData(): InvoiceData & { bannerColor: string; logoFiles: MediaFile[] } {
  const item1 = { ...emptyItem(), description: "Brand identity design", quantity: 1, unitPrice: 850000 };
  const item2 = { ...emptyItem(), description: "Website redesign (5 pages)", quantity: 1, unitPrice: 1200000 };
  const item3 = { ...emptyItem(), description: "Social media graphics pack", quantity: 3, unitPrice: 75000 };

  return {
    invoiceName: "Creative Services — Q2 2026",
    description: "Design retainer for April–June 2026",
    recipient: "Ifeanyi Nwune",
    items: [item1, item2, item3],
    subtotal: item1.unitPrice + item2.unitPrice + item3.quantity * item3.unitPrice,
    wallet: null,
    dueDate: "Jul 2, 2026",
    bannerColor: "#0F172A",
    logoFiles: [],
  };
}

const MOCK = makeMockData();

/* ── Responsive hook ── */

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < breakpoint); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

/* ── Page ── */

export function InvoiceView() {
  const isMobile = useIsMobile();
  const [paid, setPaid] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F3F4F6",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      textAlign: "left",
    }}>

      {/* Top bar */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: isMobile ? "12px 16px" : "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#0B2239" />
            <path d="M20 8c-3.31 0-6 2.69-6 6 0 2.23 1.22 4.18 3 5.23V28h6V19.23c1.78-1.05 3-3 3-5.23 0-3.31-2.69-6-6-6z" fill="#fff" />
            <circle cx="17" cy="14" r="1.5" fill="#0B2239" />
          </svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0B2239", letterSpacing: "-0.01em", lineHeight: 1.2 }}>piggyvest</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em", lineHeight: 1.2 }}>BUSINESS</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>Secure invoice payment</div>
      </header>

      {/* Page content */}
      <main style={{
        maxWidth: isMobile ? "100%" : 720,
        margin: "0 auto",
        padding: isMobile ? 0 : "32px 24px 64px",
      }}>

        {/* Status chip — shown after mock "Pay" */}
        {paid && (
          <div style={{
            margin: isMobile ? "12px 16px" : "0 0 16px",
            padding: "10px 16px",
            background: "#ECFDF5", border: "1px solid #6EE7B7",
            borderRadius: 8, fontSize: 13, color: "#065F46", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#059669">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Payment confirmed — thank you!
          </div>
        )}

        {/* Invoice document */}
        <div style={{ borderRadius: isMobile ? 0 : 10, overflow: "hidden", boxShadow: isMobile ? "none" : "0 2px 16px rgba(0,0,0,0.08)" }}>
          <InvoiceDocument
            data={MOCK}
            template="modern"
            bannerColor={MOCK.bannerColor}
            logoFiles={MOCK.logoFiles}
            mobile={isMobile}
          />
        </div>

        {/* Pay CTA */}
        {!paid && (
          <div style={{
            margin: isMobile ? "0" : "0",
            padding: isMobile ? "16px" : "20px 0 0",
            background: isMobile ? "#fff" : "transparent",
            borderTop: isMobile ? "1px solid #E5E7EB" : "none",
          }}>
            <button
              type="button"
              onClick={() => setPaid(true)}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: BLUE,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
              }}
            >
              Pay ₦{MOCK.subtotal.toLocaleString("en-NG")}
            </button>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
              Secured by PiggyVest Business · SSL encrypted
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
