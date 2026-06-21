import type { MediaFile } from "./MediaUpload";
import type { LineItem } from "./ItemsTable";

const BLUE = "#1D4ED8";

export type InvoiceTemplate = "classic" | "modern";

export interface InvoiceData {
  invoiceName: string;
  description: string;
  recipient: string;
  items: LineItem[];
  subtotal: number;
  wallet: string | null;
  dueDate: string;
}

export interface InvoiceDocumentProps {
  data: InvoiceData;
  template: InvoiceTemplate;
  bannerColor: string;
  logoFiles: MediaFile[];
  /** Pass true to collapse bill-from/bill-to into a single column on narrow viewports */
  mobile?: boolean;
}

/* ── Helpers ── */

export function uploadedImages(images: MediaFile[]) {
  return images.filter((f) => f.status === "uploaded");
}

export function fmtNGN(n: number) {
  return n.toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

export function ItemImages({ images, size = 60 }: { images: MediaFile[]; size?: number }) {
  const ready = uploadedImages(images);
  if (!ready.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {ready.map((f) => (
        <img
          key={f.id}
          src={f.url}
          alt={f.caption || f.name}
          style={{
            width: size, height: size,
            objectFit: "cover", borderRadius: 6,
            border: "1px solid #E5E7EB", flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function Th({
  children, align, first, last,
}: {
  children: React.ReactNode;
  align: "left" | "center" | "right";
  first?: boolean;
  last?: boolean;
}) {
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

/* ── Shared invoice sections ── */

function InvoiceHeader({
  bannerColor, logoFiles, mobile,
}: { bannerColor: string; logoFiles: MediaFile[]; mobile?: boolean }) {
  const logo = logoFiles.find((f) => f.status === "uploaded");
  return (
    <div style={{ background: bannerColor, padding: mobile ? "20px 16px" : "24px 28px" }}>
      <div style={{
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: mobile ? 16 : 32,
      }}>
        <div>
          {logo && (
            <img src={logo.url} alt="Logo" style={{ height: 36, marginBottom: 12, objectFit: "contain", display: "block" }} />
          )}
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            Hermiston, Hegmann And Sauer
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            22666 Kshlerin Park<br />
            2347065705327<br />
            arinze@yopmail.com
          </div>
        </div>
        <div style={{ textAlign: mobile ? "left" : "right" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
            Bill To: <span style={{ color: "#fff", fontWeight: 600 }}>Ifeanyi Nwune</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            21 Muyiwa Opaleye Street, Lekki Lagos<br />
            +2347065705327<br />
            ifeanyinwune@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceMeta({
  invoiceName, description, dueDate, pad,
}: { invoiceName: string; description: string; dueDate: string; pad: string }) {
  return (
    <div style={{ padding: pad, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{invoiceName || "Invoice"}</div>
        {description && <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{description}</div>}
      </div>
      {dueDate && (
        <div style={{ fontSize: 13, color: "#6B7280", flexShrink: 0 }}>
          Due Date <span style={{ color: "#111827", fontWeight: 500 }}>{dueDate}</span>
        </div>
      )}
    </div>
  );
}

function ItemsTable({
  items, bordered, pad,
}: { items: LineItem[]; bordered?: boolean; pad: string }) {
  return (
    <div style={{ padding: pad }}>
      <table style={{
        width: "100%", borderCollapse: "collapse", fontSize: 13,
        ...(bordered ? { border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" } : {}),
      }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            <Th align="left" first>Item</Th>
            <Th align="center">Quantity</Th>
            <Th align="right">Unit Price (₦)</Th>
            <Th align="right" last>Amount (₦)</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const amount = item.quantity * item.unitPrice;
            const isLast = i === items.length - 1;
            return (
              <tr key={item.id} style={{ borderBottom: isLast && bordered ? "none" : "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 12px 14px 16px", verticalAlign: "top", color: "#111827" }}>
                  <div>{item.description || <span style={{ color: "#9CA3AF" }}>—</span>}</div>
                  <ItemImages images={item.images} />
                </td>
                <td style={{ padding: "14px 12px", textAlign: "center", verticalAlign: "top", color: "#374151" }}>{item.quantity}</td>
                <td style={{ padding: "14px 12px", textAlign: "right", verticalAlign: "top", color: "#374151" }}>{fmtNGN(item.unitPrice)}</td>
                <td style={{ padding: "14px 16px 14px 12px", textAlign: "right", verticalAlign: "top", color: "#111827", fontWeight: 500 }}>{fmtNGN(amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ItemsMobile({ items }: { items: LineItem[] }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Items</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => {
          const amount = item.quantity * item.unitPrice;
          return (
            <div key={item.id} style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px", border: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>
                    {item.description || <span style={{ color: "#9CA3AF", fontWeight: 400 }}>—</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    {item.quantity} × ₦{fmtNGN(item.unitPrice)}
                  </div>
                  <ItemImages images={item.images} size={72} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", flexShrink: 0 }}>
                  ₦{fmtNGN(amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Totals({ subtotal, pad }: { subtotal: number; pad: string }) {
  return (
    <div style={{ padding: pad, display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", borderTop: "1px solid #F3F4F6" }}>
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Notes:</div>
      </div>
      <div style={{ minWidth: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
          <span style={{ color: "#6B7280" }}>Subtotal</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>₦ {fmtNGN(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 4px", fontSize: 14, borderTop: "1px solid #E5E7EB", marginTop: 6 }}>
          <span style={{ fontWeight: 700, color: "#111827" }}>TOTAL</span>
          <span style={{ fontWeight: 700, color: "#111827" }}>₦ {fmtNGN(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

function PaymentSection({ pad, mobile }: { pad: string; mobile?: boolean }) {
  return (
    <div style={{
      padding: pad, borderTop: "1px solid #F3F4F6",
      display: "flex",
      flexDirection: mobile ? "column" : "row",
      justifyContent: "space-between",
      gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Payment Method</div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, maxWidth: 260 }}>
          Complete payment by making transfer to the account details provided
        </div>
      </div>
      <div style={{ textAlign: mobile ? "left" : "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Account Details</div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.8 }}>
          3324164287<br />
          FAAS (SANDBOX)<br />
          Hermiston Hegmann And Sauer-7408
        </div>
      </div>
    </div>
  );
}

function DocFooter({ pad }: { pad: string }) {
  return (
    <div style={{
      padding: pad, borderTop: "1px solid #F3F4F6",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 8,
    }}>
      <div style={{ fontSize: 12, color: "#6B7280" }}>Piggyvest Business — Maximize Your Business Money.</div>
      <div style={{ fontSize: 12 }}>
        Email us at <span style={{ color: BLUE }}>support@piggyvest.business</span>
      </div>
    </div>
  );
}

/* ── Main exported component ── */

export function InvoiceDocument({ data, template, bannerColor, logoFiles, mobile }: InvoiceDocumentProps) {
  const { invoiceName, description, items, subtotal, dueDate } = data;
  const pad = mobile ? "16px 16px" : "20px 28px";
  const metaPad = mobile ? "16px 16px 0" : "18px 28px 0";
  const itemsPad = mobile ? "16px 0 0" : "16px 28px 0";

  return (
    <div style={{
      background: "#fff",
      borderRadius: mobile ? 0 : 10,
      overflow: "hidden",
      boxShadow: mobile ? "none" : "0 2px 12px rgba(0,0,0,0.08)",
    }}>
      <InvoiceHeader bannerColor={bannerColor} logoFiles={logoFiles} mobile={mobile} />

      <InvoiceMeta
        invoiceName={invoiceName}
        description={description}
        dueDate={dueDate}
        pad={metaPad}
      />

      {mobile ? (
        <div style={{ padding: "16px 0 0" }}>
          <ItemsMobile items={items} />
        </div>
      ) : (
        <ItemsTable items={items} bordered={template === "classic"} pad={itemsPad} />
      )}

      <Totals subtotal={subtotal} pad={pad} />
      <PaymentSection pad={pad} mobile={mobile} />
      <DocFooter pad={pad} />
    </div>
  );
}
