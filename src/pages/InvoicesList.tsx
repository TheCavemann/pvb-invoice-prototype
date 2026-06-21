import { useState } from "react";
import type { SentInvoice } from "../types/sentInvoice";

const BLUE = "#1D4ED8";

interface Props {
  invoices: SentInvoice[];
  onView?: (invoice: SentInvoice) => void;
  onCreateNew?: () => void;
}

export function InvoicesList({ invoices, onView, onCreateNew }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"invoices" | "drafts" | "recipients">("invoices");

  const unpaid = invoices.filter((inv) => inv.status === "unpaid");
  const paid = invoices.filter((inv) => inv.status === "paid");
  const overdue: SentInvoice[] = []; // no overdue state yet

  const filtered = invoices.filter((inv) =>
    !search || inv.invoiceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F9FAFB",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 14, color: "#111827", textAlign: "left",
    }}>
      {/* Top bar */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Invoices</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#374151", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>AC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>Arinze Chibueze</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.3 }}>Business Owner</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
        </div>
      </header>

      <div style={{ padding: "28px 32px 64px" }}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          <SummaryCard
            label="Overdue Invoices"
            amount={overdue.reduce((s, inv) => s + inv.subtotal, 0)}
            count={overdue.length}
            countColor="#EF4444"
            icon={<OverdueIcon />}
            iconBg="#F3F4F6"
          />
          <SummaryCard
            label="Unpaid Invoices"
            amount={unpaid.reduce((s, inv) => s + inv.subtotal, 0)}
            count={unpaid.length}
            countColor="#D97706"
            icon={<UnpaidIcon />}
            iconBg="#F3F4F6"
          />
          <SummaryCard
            label="Paid Invoices"
            amount={paid.reduce((s, inv) => s + inv.subtotal, 0)}
            count={paid.length}
            countColor="#059669"
            icon={<PaidIcon />}
            iconBg="#F3F4F6"
          />
        </div>

        {/* Tabs + Create button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E7EB" }}>
            {(["invoices", "drafts", "recipients"] as const).map((tab) => {
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontFamily: "inherit",
                    color: active ? BLUE : "#6B7280",
                    fontWeight: active ? 600 : 400,
                    borderBottom: active ? `2px solid ${BLUE}` : "2px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onCreateNew}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px",
              background: BLUE, color: "#fff",
              border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create new invoice
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 14px", border: "1px solid #E5E7EB", borderRadius: 8,
            background: "#fff", width: 340,
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF" style={{ flexShrink: 0 }}>
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search by invoice name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none", outline: "none", flex: 1,
                fontSize: 13, fontFamily: "inherit", color: "#111827",
                background: "transparent",
              }}
            />
          </div>

          <button
            type="button"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px", background: "#fff",
              border: "1px solid #E5E7EB", borderRadius: 8,
              fontSize: 13, fontFamily: "inherit", color: "#374151",
              cursor: "pointer",
            }}
          >
            Filter
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-8.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 110px 110px 1fr 120px 100px 40px",
            padding: "12px 20px",
            borderBottom: "1px solid #E5E7EB",
            fontSize: 12, fontWeight: 600, color: "#374151",
          }}>
            <span>Invoice Number</span>
            <span>Invoice Name</span>
            <span>Issued On</span>
            <span>Due Date</span>
            <span>Recipient</span>
            <span>Amount</span>
            <span>Status</span>
            <span />
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "#9CA3AF" }}>
              {invoices.length === 0
                ? "No invoices yet. Create and send one to see it here."
                : "No invoices match your search."}
            </div>
          ) : (
            filtered.map((inv) => {
              const issued = new Date(inv.sentAt).toLocaleDateString("en-NG", {
                day: "2-digit", month: "2-digit", year: "numeric",
              }).replace(/\//g, " - ");

              const invoiceNum = `INV${inv.id.replace("inv_", "").toUpperCase().padEnd(8, "0").slice(0, 8)}`;

              return (
                <div
                  key={inv.id}
                  onClick={() => onView?.(inv)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 110px 110px 1fr 120px 100px 40px",
                    padding: "14px 20px",
                    borderBottom: "1px solid #F3F4F6",
                    alignItems: "center",
                    cursor: onView ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; }}
                >
                  <span style={{ fontSize: 13, color: "#374151" }}>{invoiceNum}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                    {inv.invoiceName || "Untitled Invoice"}
                  </span>
                  <span style={{ fontSize: 13, color: "#374151" }}>{issued}</span>
                  <span style={{ fontSize: 13, color: "#374151" }}>N/A</span>
                  <span style={{ fontSize: 13, color: "#374151" }}>{inv.recipient || "—"}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                    ₦{inv.subtotal.toLocaleString("en-NG")}
                  </span>
                  <span>
                    <StatusBadge status={inv.status} />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "unpaid" | "paid" }) {
  const isPaid = status === "paid";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      background: isPaid ? "#ECFDF5" : "#FFFBEB",
      color: isPaid ? "#065F46" : "#92400E",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: isPaid ? "#059669" : "#D97706",
        flexShrink: 0,
      }} />
      {isPaid ? "Paid" : "Unpaid"}
    </span>
  );
}

interface SummaryCardProps {
  label: string;
  amount: number;
  count: number;
  countColor: string;
  icon: React.ReactNode;
  iconBg: string;
}

function SummaryCard({ label, amount, count, countColor, icon, iconBg }: SummaryCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB",
      padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
          ₦{amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: 12, color: countColor, fontWeight: 500 }}>
          {count} Invoice{count !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

function OverdueIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" fill="none" />
      <path d="M12 8v4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.5" fill="#6B7280" stroke="#6B7280" strokeWidth="1" />
    </svg>
  );
}

function UnpaidIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#6B7280" strokeWidth="1.5" fill="none" />
      <path d="M3 9h18" stroke="#6B7280" strokeWidth="1.5" />
      <path d="M7 14h4M7 17h6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PaidIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" fill="none" />
      <path d="M8 12l3 3 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
