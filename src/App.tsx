import { useState } from "react";
import { MediaUpload, type MediaFile } from "./components/MediaUpload";
import { CreateInvoice } from "./pages/CreateInvoice";
import { InvoiceView } from "./pages/InvoiceView";
import type { Draft } from "./types/draft";

export default function App() {
  const [view, setView] = useState<"invoice" | "components" | "recipient">("invoice");
  const [logoFiles, setLogoFiles] = useState<MediaFile[]>([]);
  const [itemFiles, setItemFiles] = useState<MediaFile[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [openDraft, setOpenDraft] = useState<Draft | null>(null);

  function handleUpload(
    incoming: MediaFile[],
    setter: React.Dispatch<React.SetStateAction<MediaFile[]>>
  ) {
    setter((prev) => {
      const byId = new Map(prev.map((f) => [f.id, f]));
      for (const f of incoming) byId.set(f.id, f);
      return Array.from(byId.values());
    });
  }

  function handleRemove(
    id: string,
    setter: React.Dispatch<React.SetStateAction<MediaFile[]>>
  ) {
    setter((prev) => prev.filter((f) => f.id !== id));
  }

  function saveDraft(draft: Draft) {
    setDrafts((prev) => {
      // Replace existing draft with same id, otherwise prepend
      const without = prev.filter((d) => d.id !== draft.id);
      return [draft, ...without];
    });
  }

  function deleteDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  if (view === "invoice") {
    return (
      <>
        <DevSwitcher current={view} onSwitch={setView} />
        <CreateInvoice
          drafts={drafts}
          initialDraft={openDraft}
          onSaveDraft={saveDraft}
          onDeleteDraft={deleteDraft}
          onOpenDraft={(d) => setOpenDraft(d)}
          onClearOpenDraft={() => setOpenDraft(null)}
        />
      </>
    );
  }

  if (view === "recipient") {
    return (
      <>
        <DevSwitcher current={view} onSwitch={setView} />
        <InvoiceView />
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4F6",
        padding: "40px 24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <DevSwitcher current={view} onSwitch={setView} />
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
        MediaUpload — component preview
      </h1>
      <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 40 }}>
        Standalone component, not yet wired into the invoice flow.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 32,
        }}
      >
        <Card title="Logo upload (maxFiles=1)" subtitle="Mirrors the existing Customize panel behaviour">
          <MediaUpload
            maxFiles={1}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={logoFiles}
            label="Upload logo"
            onUpload={(f) => handleUpload(f, setLogoFiles)}
            onRemove={(id) => handleRemove(id, setLogoFiles)}
            onReorder={setLogoFiles}
          />
          <DebugPanel files={logoFiles} />
        </Card>

        <Card title="Line item images (maxFiles=4)" subtitle="Per-item attachment for Visual Line Items feature">
          <MediaUpload
            maxFiles={4}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={itemFiles}
            label="Add image"
            onUpload={(f) => handleUpload(f, setItemFiles)}
            onRemove={(id) => handleRemove(id, setItemFiles)}
            onReorder={setItemFiles}
          />
          <DebugPanel files={itemFiles} />
        </Card>

        <Card title="At limit (pre-filled)" subtitle="maxFiles=2, already full — add affordance hidden">
          <MediaUpload
            maxFiles={2}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={[
              { id: "demo_a", url: "https://placehold.co/120x80/4A6CF7/ffffff?text=A", name: "proposal-option-a.jpg", sizeKB: 183.9, caption: "Option A", status: "uploaded" },
              { id: "demo_b", url: "https://placehold.co/120x80/0F172A/ffffff?text=B", name: "proposal-option-b.jpg", sizeKB: 97.2, caption: "Option B", status: "uploaded" },
            ]}
            onRemove={() => {}}
            onReorder={() => {}}
          />
        </Card>

        <Card title="Uploading state" subtitle="One file mid-upload, one already uploaded">
          <MediaUpload
            maxFiles={4}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={[
              { id: "demo_c", url: "https://placehold.co/120x80/F59E0B/ffffff?text=✓", name: "fabric-swatch-beige.jpg", sizeKB: 240.0, caption: "", status: "uploaded" },
              { id: "demo_d", url: "", name: "fabric-swatch-teal.jpg", sizeKB: 0, caption: "", status: "uploading" },
            ]}
            onRemove={() => {}}
            onReorder={() => {}}
          />
        </Card>

        <Card title="Error state" subtitle="A file that failed to upload">
          <MediaUpload
            maxFiles={4}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            files={[
              { id: "demo_e", url: "", name: "room-mockup.jpg", sizeKB: 0, caption: "", status: "error" },
            ]}
            onRemove={() => {}}
            onReorder={() => {}}
          />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}>
      <h2 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#111827" }}>{title}</h2>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#9CA3AF" }}>{subtitle}</p>
      {children}
    </div>
  );
}

const DEV_VIEWS = [
  { key: "invoice", label: "Create Invoice" },
  { key: "recipient", label: "Recipient View" },
  { key: "components", label: "MediaUpload" },
] as const;

function DevSwitcher({ current, onSwitch }: { current: "invoice" | "components" | "recipient"; onSwitch: (v: "invoice" | "components" | "recipient") => void }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", gap: 4, background: "#1E3A8A", borderRadius: 8, padding: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
      {DEV_VIEWS.map(({ key, label }) => (
        <button key={key} type="button" onClick={() => onSwitch(key)}
          style={{ padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
            background: current === key ? "#fff" : "transparent",
            color: current === key ? "#1E3A8A" : "rgba(255,255,255,0.7)" }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function DebugPanel({ files }: { files: MediaFile[] }) {
  if (!files.length) return null;
  return (
    <details style={{ marginTop: 16 }}>
      <summary style={{ fontSize: 11, color: "#9CA3AF", cursor: "pointer", userSelect: "none" }}>
        onUpload / onReorder payload ({files.length} file{files.length !== 1 ? "s" : ""})
      </summary>
      <pre style={{ marginTop: 8, padding: 10, background: "#F8F9FA", borderRadius: 6, fontSize: 11, color: "#374151", overflow: "auto", maxHeight: 160 }}>
        {JSON.stringify(files.map(({ id, name, sizeKB, caption, status }) => ({ id, name, sizeKB, caption, status })), null, 2)}
      </pre>
    </details>
  );
}
