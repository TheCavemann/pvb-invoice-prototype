import type { LineItem } from "../components/ItemsTable";
import type { MediaFile } from "../components/MediaUpload";

export interface SentInvoice {
  id: string;
  sentAt: number; // Date.now()
  status: "unpaid" | "paid";
  invoiceName: string;
  description: string;
  recipient: string;
  items: LineItem[];
  subtotal: number;
  wallet: string | null;
  dueDate: string;
  bannerColor: string;
  logoFiles: MediaFile[];
}

export function makeSentInvoiceId() {
  return `inv_${Math.random().toString(36).slice(2, 9)}`;
}
