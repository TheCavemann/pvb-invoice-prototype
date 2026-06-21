import { useState } from "react";
import { ItemsTable, emptyItem, type LineItem } from "../components/ItemsTable";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";

const WALLETS = [
  { name: "Interest Accruals", bal: "₦0.00" },
  { name: "Revenue Stream", bal: "₦0.00" },
  { name: "Test 3", bal: "₦0.00" },
  { name: "Transportation", bal: "₦11,561.44" },
];

export function CreateInvoice() {
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [dueDate, setDueDate] = useState<"yes" | "no">("no");
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: 14, color: "#111827", textAlign: "left" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 260, flexShrink: 0, background: "#fff", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>

        {/* Org switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#374151", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, letterSpacing: "0.02em" }}>HH</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Hermiston, Hegman...</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Head Office</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#9CA3AF" style={{ flexShrink: 0 }}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <NavItem icon={<GridIcon />} label="Overview" />
          <NavItem icon={<HomeIcon />} label="Home" />

          <NavSection label="ACCOUNTS" />
          <NavItem icon={<CardIcon />} label="Expense Accounts" />
          <NavItem icon={<SaveIcon />} label="Savings Accounts" />
          <NavItem icon={<OverdraftIcon />} label="Overdraft Account" />

          <NavSection label="SAVINGS & INVESTMENTS" />
          <NavItem icon={<LockIcon />} label="Safelock" />
          <NavItem icon={<ChartIcon />} label="Investify" />

          <NavSection label="BUSINESS TOOLS" />
          <NavItem icon={<SwapIcon />} label="Transactions" />
          <NavItem icon={<ApproveIcon />} label="Payment Approvals" badge={2} />
          <NavItem icon={<CalIcon />} label="Schedule Payments" badge={1} />
          <NavItem icon={<UserIcon />} label="Beneficiaries" />
          <NavItem icon={<BulkIcon />} label="Bulk Transfer" />
          <NavItem icon={<InvoiceIcon />} label="Invoices" active />
        </div>

        {/* PiggyVest brand */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#0B2239" />
            <path d="M20 8c-3.31 0-6 2.69-6 6 0 2.23 1.22 4.18 3 5.23V28h6V19.23c1.78-1.05 3-3 3-5.23 0-3.31-2.69-6-6-6z" fill="#fff" />
            <circle cx="17" cy="14" r="1.5" fill="#0B2239" />
          </svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0B2239", letterSpacing: "-0.01em", lineHeight: 1.2 }}>piggyvest</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em", lineHeight: 1.2 }}>BUSINESS</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#F9FAFB" }}>

        {/* Top bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 6, borderRadius: 6, display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </button>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Create Invoice</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px 64px" }}>

          {/* Business info — no card, just text */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>Hermiston, Hegmann And Sauer</div>
            <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.8 }}>
              22666 Kshlerin Park<br />
              2347065705327<br />
              arinze@yopmail.com
            </div>
            <button type="button" style={{ marginTop: 6, background: "none", border: "none", cursor: "pointer", color: BLUE, fontSize: 13, padding: 0, fontFamily: "inherit", fontWeight: 500 }}>
              Edit Contact details
            </button>
          </div>

          {/* ── Invoice Details ── */}
          <SectionBlock>
            <SectionHeader>Invoice Details</SectionHeader>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div>
                  <FieldLabel>Invoice Name</FieldLabel>
                  <input type="text" placeholder="Enter Invoice Name" style={plainInput} />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <input type="text" placeholder="Enter Invoice Description" style={plainInput} />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <FieldLabel>Recipient</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}>
                  <span style={{ color: "#9CA3AF" }}>Select Recipient</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* ── Items ── */}
          <SectionBlock>
            <SectionHeader>Items</SectionHeader>
            <ItemsTable
              items={items}
              onChange={setItems}
            />
            <div style={{ padding: "0 0 4px" }} />
          </SectionBlock>

          {/* ── Payment Details ── */}
          <SectionBlock>
            <SectionHeader>Payment Details</SectionHeader>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

                {/* Wallet picker */}
                <div>
                  <FieldLabel>Wallet to receive payment</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setWalletOpen((o) => !o)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit", color: wallet ? "#111827" : "#9CA3AF" }}
                    >
                      {wallet ?? "Select Wallet"}
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    {walletOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 200, overflow: "hidden" }}>
                        {WALLETS.map(({ name, bal }) => (
                          <button key={name} type="button" onClick={() => { setWallet(name); setWalletOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: wallet === name ? BLUE_LIGHT : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                            <div style={{ width: 34, height: 34, borderRadius: 6, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="16" height="16" viewBox="0 0 20 20" fill="#F87171"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{name}</div>
                              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{bal}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Due date toggle */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Do you want to set a due date for this invoice?</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginBottom: 14 }}>Note: You can choose when you want the invoice to expire, after which the invoice becomes overdue and a notification is sent to the recipient.</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["Yes", "No"] as const).map((opt) => {
                      const active = dueDate === opt.toLowerCase();
                      return (
                        <button key={opt} type="button" onClick={() => setDueDate(opt.toLowerCase() as "yes" | "no")}
                          style={{ padding: "6px 22px", borderRadius: 20, border: `1.5px solid ${active ? "#374151" : "#D1D5DB"}`, background: "#fff", color: active ? "#111827" : "#6B7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Due date + Notes (shown when Yes) */}
              {dueDate === "yes" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 24, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
                  <div>
                    <FieldLabel>Due date</FieldLabel>
                    <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, gap: 8 }}>
                      <input type="text" placeholder="DD-MM-YYYY" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", color: "#9CA3AF", background: "transparent" }} />
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Notes</FieldLabel>
                    <textarea rows={3} style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: "#111827", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", margin: "8px 0 24px" }}>
            <div style={{ minWidth: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
                <span style={{ color: "#6B7280" }}>Subtotal</span>
                <span style={{ color: "#111827" }}>₦{subtotal > 0 ? subtotal.toLocaleString("en-NG") : ""}</span>
              </div>
              {["Add Surcharge", "Add Discount", "Add VAT"].map((a) => (
                <button key={a} type="button" style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: BLUE, fontSize: 13, padding: "3px 0", fontFamily: "inherit", fontWeight: 500 }}>
                  + {a}
                </button>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "1px solid #E5E7EB" }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>₦{subtotal > 0 ? subtotal.toLocaleString("en-NG") : ""}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" style={{ padding: "11px 28px", background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Save to drafts
            </button>
            <button type="button" style={{ padding: "11px 28px", background: BLUE, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minWidth: 100 }}>
              Preview
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Layout helpers ── */

function SectionBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 20, overflow: "hidden" }}>
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#F3F4F6", padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6, fontWeight: 400 }}>{children}</div>;
}

function NavSection({ label }: { label: string }) {
  return (
    <div style={{ padding: "12px 20px 4px", fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: "0.07em" }}>
      {label}
    </div>
  );
}

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", background: active ? BLUE_LIGHT : "transparent", color: active ? BLUE : "#374151", fontSize: 13, position: "relative" }}>
      <span style={{ color: active ? BLUE : "#6B7280", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && (
        <span style={{ background: "#F97316", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── Icons ── */
const ico = (d: string | string[], opts?: { fill?: string }) => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill={opts?.fill ?? "currentColor"}>
    {(Array.isArray(d) ? d : [d]).map((path, i) => <path key={i} fillRule="evenodd" d={path} clipRule="evenodd" />)}
  </svg>
);

const GridIcon = () => ico("M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z");
const HomeIcon = () => ico("M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z");
const CardIcon = () => ico(["M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z", "M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"]);
const SaveIcon = () => ico("M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z");
const OverdraftIcon = () => ico("M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z");
const LockIcon = () => ico("M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
const ChartIcon = () => ico("M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z");
const SwapIcon = () => ico("M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z");
const ApproveIcon = () => ico(["M9 2a1 1 0 000 2h2a1 1 0 100-2H9z", "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"]);
const CalIcon = () => ico(["M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z", "M6 7a1 1 0 000 2h8a1 1 0 100-2H6z"]);
const UserIcon = () => ico("M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z");
const BulkIcon = () => ico("M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z");
const InvoiceIcon = () => ico(["M9 2a1 1 0 000 2h2a1 1 0 100-2H9z", "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"]);

const plainInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #E5E7EB",
  outline: "none",
  fontSize: 14,
  color: "#111827",
  fontFamily: "inherit",
  padding: "8px 0",
  background: "transparent",
  boxSizing: "border-box",
};
