import { useEffect, useRef, useState } from "react";
import { ItemsTable, emptyItem, type LineItem } from "../components/ItemsTable";
import { PreviewInvoice, type InvoiceData } from "../components/PreviewInvoice";
import type { Draft } from "../types/draft";
import { makeDraftId } from "../types/draft";
import type { MediaFile } from "../components/MediaUpload";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";

const WALLETS = [
  { name: "Interest Accruals", bal: "₦0.00" },
  { name: "Revenue Stream", bal: "₦0.00" },
  { name: "Test 3", bal: "₦0.00" },
  { name: "Transportation", bal: "₦11,561.44" },
];

interface Recipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const INITIAL_RECIPIENTS: Recipient[] = [
  { id: "r1", name: "Ifeanyi Nwune", email: "ifeanyinwune@gmail.com", phone: "+2347065705327", address: "21 Muyiwa Opaleye Street, Lekki Lagos" },
  { id: "r2", name: "Arinze Porchplus", email: "arinze@porchplus.com", phone: "+2348012345678", address: "5 Admiralty Way, Lekki Phase 1" },
];

interface CreateInvoiceProps {
  drafts?: Draft[];
  initialDraft?: Draft | null;
  onSaveDraft?: (draft: Draft) => void;
  onDeleteDraft?: (id: string) => void;
  onOpenDraft?: (draft: Draft) => void;
  onClearOpenDraft?: () => void;
}

export function CreateInvoice({
  drafts = [],
  initialDraft = null,
  onSaveDraft,
  onDeleteDraft,
  onOpenDraft,
  onClearOpenDraft,
}: CreateInvoiceProps) {
  // Track which draft this form corresponds to (so re-saving updates it)
  const draftIdRef = useRef<string>(initialDraft?.id ?? makeDraftId());

  const [items, setItems] = useState<LineItem[]>(initialDraft?.items ?? [emptyItem()]);
  const [dueDate, setDueDate] = useState<"yes" | "no">(initialDraft?.dueDate ?? "no");
  const [wallet, setWallet] = useState<string | null>(initialDraft?.wallet ?? null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [invoiceName, setInvoiceName] = useState(initialDraft?.invoiceName ?? "");
  const [invoiceDesc, setInvoiceDesc] = useState(initialDraft?.description ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [showAddRecipient, setShowAddRecipient] = useState(false);

  // When the parent loads a draft (user clicked "Open" in drafts panel),
  // reset the whole form to that draft's state.
  useEffect(() => {
    if (!initialDraft) return;
    draftIdRef.current = initialDraft.id;
    setItems(initialDraft.items);
    setDueDate(initialDraft.dueDate);
    setWallet(initialDraft.wallet);
    setInvoiceName(initialDraft.invoiceName);
    setInvoiceDesc(initialDraft.description);
    onClearOpenDraft?.();
  }, [initialDraft?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSaveDraft() {
    const draft: Draft = {
      id: draftIdRef.current,
      savedAt: Date.now(),
      invoiceName,
      description: invoiceDesc,
      wallet,
      dueDate,
      items,
    };
    onSaveDraft?.(draft);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  }

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  const previewData: InvoiceData = {
    invoiceName,
    description: invoiceDesc,
    recipient: "",
    items,
    subtotal,
    wallet,
    dueDate: "",
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Drafts button */}
            <button
              type="button"
              onClick={() => setShowDrafts(true)}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E5E7EB", borderRadius: 7, padding: "6px 14px", cursor: "pointer", color: "#374151", fontSize: 13, fontFamily: "inherit" }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" /></svg>
              Drafts
              {drafts.length > 0 && (
                <span style={{ background: BLUE, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>
                  {drafts.length}
                </span>
              )}
            </button>
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
                  <input type="text" placeholder="Enter Invoice Name" value={invoiceName} onChange={(e) => setInvoiceName(e.target.value)} style={plainInput} />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <input type="text" placeholder="Enter Invoice Description" value={invoiceDesc} onChange={(e) => setInvoiceDesc(e.target.value)} style={plainInput} />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <FieldLabel>Recipient</FieldLabel>
                <RecipientPicker
                  recipients={recipients}
                  selected={recipient}
                  open={recipientOpen}
                  onToggle={() => setRecipientOpen((o) => !o)}
                  onClose={() => setRecipientOpen(false)}
                  onSelect={(r) => { setRecipient(r); setRecipientOpen(false); }}
                  onAddNew={() => { setRecipientOpen(false); setShowAddRecipient(true); }}
                />
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
                  <WalletPicker wallet={wallet} onSelect={(name) => { setWallet(name); setWalletOpen(false); }} open={walletOpen} onToggle={() => setWalletOpen((o) => !o)} onClose={() => setWalletOpen(false)} />
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
            <button type="button" onClick={handleSaveDraft} style={{ padding: "11px 28px", background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Save to drafts
            </button>
            <button type="button" onClick={() => setShowPreview(true)} style={{ padding: "11px 28px", background: BLUE, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minWidth: 100 }}>
              Preview
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewInvoice data={previewData} onClose={() => setShowPreview(false)} />
      )}

      {/* Drafts slide-over panel */}
      {showDrafts && (
        <DraftsPanel
          drafts={drafts}
          onOpen={(d) => {
            onOpenDraft?.(d);
            setShowDrafts(false);
          }}
          onDelete={onDeleteDraft}
          onClose={() => setShowDrafts(false)}
        />
      )}

      {/* Add Recipient slide-over */}
      {showAddRecipient && (
        <AddRecipientPanel
          onClose={() => setShowAddRecipient(false)}
          onAdd={(r) => {
            setRecipients((prev) => [...prev, r]);
            setRecipient(r);
            setShowAddRecipient(false);
          }}
        />
      )}

      {/* "Saved" toast */}
      {savedToast && (
        <div role="status" style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "#111827", color: "#fff", fontSize: 13, padding: "10px 18px",
          borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 9000,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#4ADE80">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Draft saved — images included
        </div>
      )}
    </div>
  );
}

/* ── Wallet picker ── */

interface WalletPickerProps {
  wallet: string | null;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (name: string) => void;
}

function WalletPicker({ wallet, open, onToggle, onClose, onSelect }: WalletPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) return;
      onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  // Position the fixed popover below the trigger button
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
      zIndex: 9000,
    });
  }, [open]);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8,
          background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          color: wallet ? "#111827" : "#9CA3AF",
        }}
      >
        {wallet ?? "Select Wallet"}
        <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF" style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {WALLETS.map(({ name, bal }) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelect(name)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px",
                background: wallet === name ? BLUE_LIGHT : "transparent",
                border: "none", borderBottom: "1px solid #F3F4F6",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}
            >
              {/* Colored square icon background */}
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: "#FCE7E7",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="#F87171">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, textDecoration: "line-through" }}>{bal}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Recipient picker ── */

interface RecipientPickerProps {
  recipients: Recipient[];
  selected: Recipient | null;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (r: Recipient) => void;
  onAddNew: () => void;
}

function RecipientPicker({ recipients, selected, open, onToggle, onClose, onSelect, onAddNew }: RecipientPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) return;
      onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setMenuStyle({ position: "fixed", top: r.bottom + 4, left: r.left, width: r.width, zIndex: 9000 });
  }, [open]);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8,
          background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          color: selected ? "#111827" : "#9CA3AF",
        }}
      >
        {selected?.name ?? "Select Recipient"}
        <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF"
          style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.15s", flexShrink: 0 }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {recipients.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                padding: "14px 16px",
                background: selected?.id === r.id ? BLUE_LIGHT : "transparent",
                border: "none",
                borderBottom: i < recipients.length - 1 ? "1px solid #F3F4F6" : "none",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                fontSize: 14, color: "#111827",
              }}
            >
              {r.name}
            </button>
          ))}

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F3F4F6" }} />

          {/* Add Recipient link */}
          <button
            type="button"
            onClick={onAddNew}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "14px 16px",
              background: "transparent", border: "none",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              fontSize: 14, fontWeight: 500, color: BLUE,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Recipient
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Add Recipient slide-over ── */

interface AddRecipientPanelProps {
  onClose: () => void;
  onAdd: (r: Recipient) => void;
}

function AddRecipientPanel({ onClose, onAdd }: AddRecipientPanelProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saveRecipient, setSaveRecipient] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit() {
    if (!fullName.trim()) return;
    const newRecipient: Recipient = {
      id: `r_${Math.random().toString(36).slice(2, 9)}`,
      name: fullName.trim(),
      email: email.trim(),
      phone: phone ? `+234${phone.replace(/^0/, "")}` : "",
      address: address.trim(),
    };
    onAdd(newRecipient);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 4000 }}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Recipient"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 420,
          background: "#fff", boxShadow: "-8px 0 32px rgba(0,0,0,0.16)",
          zIndex: 4001, display: "flex", flexDirection: "column",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Add Recipient</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "#F3F4F6", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
          <div style={{ marginBottom: 24 }}>
            <PanelLabel>Full name</PanelLabel>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={panelInput}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <PanelLabel>Email Address</PanelLabel>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={panelInput}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <PanelLabel>Phone Number</PanelLabel>
            <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
              {/* Country code prefix */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRight: "1px solid #E5E7EB", flexShrink: 0, background: "#F9FAFB" }}>
                {/* Nigerian flag emoji */}
                <span style={{ fontSize: 18, lineHeight: 1 }}>🇳🇬</span>
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>+234</span>
              </div>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", padding: "10px 14px", fontSize: 14, fontFamily: "inherit", color: "#111827", background: "transparent" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <PanelLabel>Recipient Address</PanelLabel>
            <textarea
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              style={{ ...panelInput, resize: "vertical", minHeight: 80, paddingTop: 10 }}
            />
          </div>

          {/* Save this Recipient toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              role="switch"
              aria-checked={saveRecipient}
              onClick={() => setSaveRecipient((v) => !v)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0,
                background: saveRecipient ? BLUE : "#D1D5DB",
                position: "relative", transition: "background 0.2s",
                padding: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: saveRecipient ? 22 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
            <span style={{ fontSize: 14, color: "#374151" }}>Save this Recipient</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!fullName.trim()}
            style={{
              width: "100%", padding: "14px", background: fullName.trim() ? BLUE : "#93C5FD",
              color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: fullName.trim() ? "pointer" : "not-allowed", fontFamily: "inherit",
              transition: "background 0.15s",
            }}
          >
            Add Recipient
          </button>
        </div>
      </div>
    </>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 8 }}>{children}</div>;
}

const panelInput: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  outline: "none",
  fontSize: 14,
  color: "#111827",
  fontFamily: "inherit",
  padding: "10px 14px",
  background: "#fff",
  boxSizing: "border-box",
};

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

/* ── Drafts slide-over panel ── */

interface DraftsPanelProps {
  drafts: Draft[];
  onOpen: (draft: Draft) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

function DraftsPanel({ drafts, onOpen, onDelete, onClose }: DraftsPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 3000 }}
      />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400,
        background: "#fff", boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
        zIndex: 3001, display: "flex", flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #E5E7EB", flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            Drafts {drafts.length > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: "#9CA3AF" }}>({drafts.length})</span>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 4, borderRadius: 6, display: "flex" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {drafts.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              No drafts yet. Hit "Save to drafts" on an invoice to save your progress.
            </div>
          ) : (
            drafts.map((draft) => <DraftCard key={draft.id} draft={draft} onOpen={onOpen} onDelete={onDelete} />)
          )}
        </div>
      </div>
    </>
  );
}

function DraftCard({ draft, onOpen, onDelete }: { draft: Draft; onOpen: (d: Draft) => void; onDelete?: (id: string) => void }) {
  const totalImages = draft.items.reduce((s, it) => s + it.images.filter((f) => f.status === "uploaded").length, 0);
  // Collect up to 4 preview thumbnails across all items
  const thumbs: MediaFile[] = [];
  for (const item of draft.items) {
    for (const img of item.images) {
      if (img.status === "uploaded" && thumbs.length < 4) thumbs.push(img);
    }
  }
  const saved = new Date(draft.savedAt);
  const timeStr = saved.toLocaleString("en-NG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
      {/* Title row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {draft.invoiceName || <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Untitled invoice</span>}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            {draft.items.length} item{draft.items.length !== 1 ? "s" : ""}
            {totalImages > 0 && ` · ${totalImages} image${totalImages !== 1 ? "s" : ""}`}
            {" · "}{timeStr}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete?.(draft.id)}
          aria-label="Delete draft"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: 2, flexShrink: 0, display: "flex" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Image thumbnails — proof the images are there */}
      {thumbs.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {thumbs.map((f) => (
            <img key={f.id} src={f.url} alt={f.caption || f.name}
              style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid #E5E7EB", flexShrink: 0 }} />
          ))}
          {totalImages > 4 && (
            <div style={{ width: 44, height: 44, borderRadius: 6, background: "#F3F4F6", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
              +{totalImages - 4}
            </div>
          )}
        </div>
      )}

      {/* Open button */}
      <button
        type="button"
        onClick={() => onOpen(draft)}
        style={{ width: "100%", padding: "8px 0", background: BLUE_LIGHT, color: BLUE, border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
      >
        Open draft
      </button>
    </div>
  );
}
