import type { SentInvoice } from "../types/sentInvoice";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";

interface Props {
  invoices: SentInvoice[];
  onView?: (invoice: SentInvoice) => void;
}

export function InvoicesList({ invoices, onView }: Props) {
  const unpaid = invoices.filter((inv) => inv.status === "unpaid");
  const unpaidTotal = unpaid.reduce((s, inv) => s + inv.subtotal, 0);

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F9FAFB",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 14, color: "#111827", textAlign: "left",
    }}>
      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "0 32px", height: 56,
          display: "flex", alignItems: "center",
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Invoices</h1>
        </header>

        <div style={{ flex: 1, padding: "28px 32px 64px", overflowY: "auto" }}>
          {/* Summary card */}
          <div style={{
            background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB",
            padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: BLUE_LIGHT,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill={BLUE}>
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>Unpaid Invoices</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                ₦{unpaidTotal.toLocaleString("en-NG")}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                {unpaid.length} invoice{unpaid.length !== 1 ? "s" : ""} outstanding
              </div>
            </div>
          </div>

          {/* Invoices table */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 100px 80px",
              padding: "10px 20px",
              background: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
              fontSize: 11, fontWeight: 600, color: "#6B7280",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              <span>Invoice</span>
              <span>Recipient</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Issued On</span>
            </div>

            {invoices.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "#9CA3AF" }}>
                No invoices yet. Send one from Create Invoice.
              </div>
            ) : (
              invoices.map((inv) => {
                const issued = new Date(inv.sentAt).toLocaleDateString("en-NG", {
                  month: "short", day: "numeric", year: "numeric",
                });
                return (
                  <div
                    key={inv.id}
                    onClick={() => onView?.(inv)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1fr 100px 80px",
                      padding: "14px 20px",
                      borderBottom: "1px solid #F3F4F6",
                      alignItems: "center",
                      cursor: onView ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>
                        {inv.invoiceName || "Untitled Invoice"}
                      </div>
                      {inv.description && (
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{inv.description}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#374151" }}>{inv.recipient || "—"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                      ₦{inv.subtotal.toLocaleString("en-NG")}
                    </div>
                    <div>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        background: inv.status === "paid" ? "#ECFDF5" : "#FEF3C7",
                        color: inv.status === "paid" ? "#065F46" : "#92400E",
                      }}>
                        {inv.status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{issued}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
