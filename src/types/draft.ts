import type { LineItem } from "../components/ItemsTable";

export interface Draft {
  id: string;
  savedAt: number; // Date.now()
  invoiceName: string;
  description: string;
  wallet: string | null;
  dueDate: "yes" | "no";
  items: LineItem[]; // includes item.images[] with full MediaFile data
}

export function makeDraftId() {
  return `draft_${Math.random().toString(36).slice(2, 9)}`;
}
