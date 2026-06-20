import { useState } from "react";
import { ItemsTable, type LineItem } from "../components/ItemsTable";

function makeId() {
  return `item_${Math.random().toString(36).slice(2, 9)}`;
}

export function CreateInvoice() {
  const [items, setItems] = useState<LineItem[]>([
    { id: makeId(), description: "Test", quantity: 1, unitPrice: 10000 },
  ]);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<"yes" | "no">("no");
  const [wallet, setWallet] = useState("Wallet Operating Fees");
  const [walletOpen, setWalletOpen] = useState(false);

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const clickedItem = items.find((it) => it.id === lastClicked);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F3F4F6", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: 14 }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 208, flexShrink: 0, background: "#fff", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", padding: "16px 0" }}>
        {/* Org switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 16px", borderBottom: "1px solid #F3F4F6", marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1E3A8A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>PL</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Porchplus Limited</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Head Office</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>

        <NavItem icon={<GridIcon />} label="Overview" />
        <NavItem icon={<HomeIcon />} label="Home" />

        <NavSection label="ACCOUNTS" />
        <NavItem icon={<CardIcon />} label="Expense Accounts" />
        <NavItem icon={<SaveIcon />} label="Savings Accounts" />
        <NavItem icon={<ApiIcon />} label="API Accounts" />

        <NavSection label="SAVINGS & INVESTMENTS" />
        <NavItem icon={<LockIcon />} label="Safelock" />
        <NavItem icon={<ChartIcon />} label="Investify" />

        <NavSection label="BUSINESS TOOLS" />
        <NavItem icon={<SwapIcon />} label="Transactions" />
        <NavItem icon={<ApproveIcon />} label="Payment Approvals" />
        <NavItem icon={<CalIcon />} label="Schedule Payments" />
        <NavItem icon={<UserIcon />} label="Beneficiaries" />
        <NavItem icon={<BulkIcon />} label="Bulk Transfer" />
        <NavItem icon={<InvoiceIcon />} label="Invoices" active />

        <div style={{ flex: 1 }} />
        {/* PiggyVest logo */}
        <div style={{ padding: "16px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#0B2239", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C9.24 2 7 4.24 7 7c0 1.86 1.01 3.48 2.5 4.36V18h5v-6.64C15.99 10.48 17 8.86 17 7c0-2.76-2.24-5-5-5z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>piggyvest</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.2 }}>BUSINESS</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </button>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Create Invoice</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1E3A8A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>OO</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Olabode Ogunfuye</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Business Owner</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </div>
        </header>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>

          {/* Business card */}
          <div style={{ background: "#fff", borderRadius: 8, padding: "20px 24px", marginBottom: 16, boxShadow: cardShadow }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>Porchplus Limited</div>
            <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>
              A25, ADMIRALTY HOMES ESTATE, IGBO-EFON, LEKKI, LAGOS.<br />
              2348100694808<br />
              porchplusltd@gmail.com
            </div>
            <button type="button" style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", color: "#4A6CF7", fontSize: 13, padding: 0, fontFamily: "inherit" }}>
              Edit Contact details
            </button>
          </div>

          {/* Invoice Details */}
          <SectionHeader>Invoice Details</SectionHeader>
          <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", padding: "20px 24px", marginBottom: 16, boxShadow: cardShadow }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ borderRight: "1px solid #F3F4F6", paddingRight: 24 }}>
                <FieldLabel>Invoice Name</FieldLabel>
                <input type="text" defaultValue="Test" style={inlineInputStyle} />
              </div>
              <div style={{ paddingLeft: 24, position: "relative" }}>
                <FieldLabel>Description</FieldLabel>
                <input type="text" defaultValue="Test" style={inlineInputStyle} />
                <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 4 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ fontSize: 18 }}>💬</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <SectionHeader>Recipient</SectionHeader>
          <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", padding: "12px 24px", marginBottom: 16, boxShadow: cardShadow }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#111827" }}>Arinze Chibueze</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
          </div>

          {/* Items */}
          <SectionHeader>Items</SectionHeader>
          <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", padding: "0 0 16px", marginBottom: 16, boxShadow: cardShadow }}>
            <ItemsTable
              items={items}
              onChange={setItems}
              onAddImageClick={(id) => setLastClicked(id)}
            />
          </div>

          {/* Payment Details */}
          <SectionHeader>Payment Details</SectionHeader>
          <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", padding: "20px 24px", marginBottom: 16, boxShadow: cardShadow }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {/* Wallet picker */}
              <div>
                <FieldLabel>Wallet to receive payment</FieldLabel>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setWalletOpen((o) => !o)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit", color: "#111827" }}
                  >
                    {wallet}
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  {walletOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100 }}>
                      {["Subscriptions\n₦400.50", "Salary Payments\n₦194.00", "Wallet Operating Fees\n₦0.00", "Expense Account (Main)\n₦0.00"].map((opt) => {
                        const [name, bal] = opt.split("\n");
                        const active = name === wallet;
                        return (
                          <button key={name} type="button" onClick={() => { setWallet(name); setWalletOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: active ? "#EEF3FF" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 6, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="#DC2626"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{name}</div>
                              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{bal}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Due date toggle */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Do you want to set a due date for this invoice?</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>Note: You can choose when you want the invoice to expire, after which the invoice becomes overdue and a notification is sent to the recipient.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["Yes", "No"] as const).map((opt) => (
                    <button key={opt} type="button" onClick={() => setDueDate(opt.toLowerCase() as "yes" | "no")}
                      style={{ padding: "6px 20px", borderRadius: 20, border: "1px solid #E5E7EB", background: dueDate === opt.toLowerCase() ? "#111827" : "#fff", color: dueDate === opt.toLowerCase() ? "#fff" : "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {dueDate === "yes" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
                <div>
                  <FieldLabel>Due date</FieldLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <input type="date" defaultValue="2026-06-26" style={{ border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", flex: 1, color: "#111827" }} />
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <FieldLabel>Notes</FieldLabel>
                  <input type="text" defaultValue="Test" style={{ ...inlineInputStyle, border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px" }} />
                  <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 4 }}>
                    <span style={{ fontSize: 18 }}>📍</span>
                    <span style={{ fontSize: 18 }}>💬</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <div style={{ minWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#6B7280" }}>Subtotal</span>
                <span style={{ color: "#111827", fontWeight: 500 }}>₦{subtotal.toLocaleString("en-NG")}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                {["Add Surcharge", "Add Discount", "Add VAT"].map((a) => (
                  <button key={a} type="button" style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "#4A6CF7", fontSize: 13, padding: "2px 0", fontFamily: "inherit" }}>
                    + {a}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #E5E7EB" }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>₦{subtotal.toLocaleString("en-NG")}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" style={secondaryBtn}>Save to drafts</button>
            <button type="button" style={primaryBtn}>Preview</button>
          </div>
        </div>
      </div>

      {/* Dev toast */}
      {lastClicked && (
        <div role="status" style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#111827", color: "#fff", fontSize: 13, padding: "10px 18px", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 9999 }}>
          "Add image" clicked: <strong>{clickedItem?.description || "(empty item)"}</strong> — uploader coming next
        </div>
      )}
    </div>
  );
}

/* ── Tiny helpers ── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#F0F2F5", borderRadius: "8px 8px 0 0", padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "#374151" }}>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>{children}</div>;
}

function NavSection({ label }: { label: string }) {
  return <div style={{ padding: "10px 16px 4px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em" }}>{label}</div>;
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", cursor: "pointer", background: active ? "#EEF3FF" : "transparent", color: active ? "#4A6CF7" : "#374151", borderLeft: active ? "2px solid #4A6CF7" : "2px solid transparent", fontSize: 13 }}>
      <span style={{ opacity: active ? 1 : 0.5 }}>{icon}</span>
      {label}
    </div>
  );
}

/* Icons */
const ic = (d: string) => <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d={d} clipRule="evenodd" /></svg>;
const GridIcon = () => ic("M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z");
const HomeIcon = () => ic("M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z");
const CardIcon = () => ic("M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z");
const SaveIcon = () => ic("M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z");
const ApiIcon = () => <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2z" clipRule="evenodd" /></svg>;
const LockIcon = () => ic("M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
const ChartIcon = () => ic("M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z");
const SwapIcon = () => ic("M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z");
const ApproveIcon = () => ic("M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z");
const CalIcon = () => ic("M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z");
const UserIcon = () => ic("M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z");
const BulkIcon = () => ic("M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z");
const InvoiceIcon = () => ic("M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z");

const cardShadow = "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)";

const inlineInputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: 14,
  color: "#111827",
  fontFamily: "inherit",
  padding: "6px 0",
  background: "transparent",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  padding: "11px 32px",
  background: "#1E3A8A",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  minWidth: 100,
};

const secondaryBtn: React.CSSProperties = {
  padding: "11px 32px",
  background: "#fff",
  color: "#374151",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};
