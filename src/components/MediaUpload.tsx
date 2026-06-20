import React, {
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

export type UploadStatus = "uploading" | "uploaded" | "error";

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  sizeKB: number;
  caption: string;
  status: UploadStatus;
}

export interface MediaUploadProps {
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum size per file in MB */
  maxSizeMB?: number;
  /** Accepted MIME types, e.g. ["image/png", "image/jpeg"] */
  acceptedTypes?: string[];
  /** Current list of uploaded files (controlled) */
  files?: MediaFile[];
  /** Called when one or more valid files are selected */
  onUpload?: (files: MediaFile[]) => void;
  /** Called when a file is removed by its id */
  onRemove?: (id: string) => void;
  /** Called with the reordered full list after a drag reorder */
  onReorder?: (files: MediaFile[]) => void;
  /** Optional label shown in the empty state */
  label?: string;
}

const DEFAULT_ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_FILES = 4;

function formatKB(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`;
}

function makeId() {
  return `media_${Math.random().toString(36).slice(2, 9)}`;
}

export function MediaUpload({
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  files = [],
  onUpload,
  onRemove,
  onReorder,
  label = "Upload image",
}: MediaUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Drag-to-reorder state
  const dragSrcIndex = useRef<number | null>(null);

  const atLimit = files.length >= maxFiles;

  const acceptAttr = acceptedTypes.join(",");
  const acceptedExtensions = acceptedTypes
    .map((t) => t.split("/")[1].toUpperCase())
    .join(", ");

  function validateAndStage(rawFiles: FileList | File[]) {
    setValidationError(null);
    const remaining = maxFiles - files.length;
    const list = Array.from(rawFiles).slice(0, remaining);
    const valid: MediaFile[] = [];
    const errors: string[] = [];

    for (const file of list) {
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`"${file.name}" is not a supported type.`);
        continue;
      }
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        errors.push(`"${file.name}" exceeds ${maxSizeMB}MB.`);
        continue;
      }
      valid.push({
        id: makeId(),
        url: URL.createObjectURL(file),
        name: file.name,
        sizeKB: file.size / 1024,
        caption: "",
        status: "uploading",
      });
    }

    if (errors.length) setValidationError(errors.join(" "));

    if (valid.length) {
      // Simulate async upload: flip to "uploaded" after a short delay
      onUpload?.(valid);
      setTimeout(() => {
        onUpload?.(valid.map((f) => ({ ...f, status: "uploaded" })));
      }, 800);
    }
  }

  const handleFiles = useCallback(
    (rawFiles: FileList | File[]) => validateAndStage(rawFiles),
    [files, maxFiles, maxSizeMB, acceptedTypes]
  );

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (atLimit) return;
    handleFiles(e.dataTransfer.files);
  }

  // --- Drag-to-reorder handlers ---
  function onItemDragStart(index: number) {
    dragSrcIndex.current = index;
  }

  function onItemDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (
      dragSrcIndex.current === null ||
      dragSrcIndex.current === index
    )
      return;
    const reordered = [...files];
    const [moved] = reordered.splice(dragSrcIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragSrcIndex.current = index;
    onReorder?.(reordered);
  }

  function onItemDragEnd() {
    dragSrcIndex.current = null;
  }

  const hasFiles = files.length > 0;

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Drop zone / empty state */}
      {!atLimit && (
        <div
          role="button"
          tabIndex={0}
          aria-label={`${label} — ${acceptedExtensions}, max ${maxSizeMB}MB`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={onDrop}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "24px 16px",
            borderRadius: 10,
            background: isDraggingOver ? "#EEF3FF" : "#F8F9FA",
            border: `1.5px dashed ${isDraggingOver ? "#4A6CF7" : "#D1D5DB"}`,
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
            minHeight: 110,
            outline: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,108,247,0.25)")
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          {/* Cloud upload icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDraggingOver ? "#4A6CF7" : "#9CA3AF"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>

          <span
            style={{
              color: "#4A6CF7",
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            {hasFiles ? "Add another image" : label}
          </span>

          <span style={{ color: "#9CA3AF", fontSize: 12 }}>
            {acceptedExtensions} (max. {maxSizeMB}MB)
            {maxFiles > 1 && ` · up to ${maxFiles} images`}
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptAttr}
        multiple={maxFiles > 1}
        style={{ display: "none" }}
        onChange={onInputChange}
        // Allow camera capture on mobile
        capture={undefined}
      />

      {/* Validation error */}
      {validationError && (
        <p
          role="alert"
          style={{
            color: "#DC2626",
            fontSize: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {validationError}
        </p>
      )}

      {/* Attached files */}
      {hasFiles && (
        <ul
          style={{
            listStyle: "none",
            margin: "12px 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {files.map((file, index) => (
            <FileRow
              key={file.id}
              file={file}
              index={index}
              onRemove={() => onRemove?.(file.id)}
              onDragStart={() => onItemDragStart(index)}
              onDragOver={(e) => onItemDragOver(e, index)}
              onDragEnd={onItemDragEnd}
            />
          ))}
        </ul>
      )}

      {/* Per-invoice cap reached */}
      {atLimit && (
        <p
          style={{
            color: "#6B7280",
            fontSize: 12,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Maximum of {maxFiles} image{maxFiles !== 1 ? "s" : ""} reached.
        </p>
      )}
    </div>
  );
}

/* ---------- FileRow sub-component ---------- */

interface FileRowProps {
  file: MediaFile;
  index: number;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function FileRow({
  file,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: FileRowProps) {
  const isUploading = file.status === "uploading";
  const isError = file.status === "error";

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        background: "#F8F9FA",
        border: "1px solid #E5E7EB",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {/* Drag handle */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        fill="#9CA3AF"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <circle cx="7" cy="4" r="1.5" />
        <circle cx="13" cy="4" r="1.5" />
        <circle cx="7" cy="10" r="1.5" />
        <circle cx="13" cy="10" r="1.5" />
        <circle cx="7" cy="16" r="1.5" />
        <circle cx="13" cy="16" r="1.5" />
      </svg>

      {/* Thumbnail */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          background: "#E5E7EB",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isUploading ? (
          <Spinner />
        ) : (
          <img
            src={file.url}
            alt={file.caption || `Reference image`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      {/* File info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: isError ? "#DC2626" : "#9CA3AF",
          }}
        >
          {isError
            ? "Upload failed — tap to retry"
            : isUploading
            ? "Uploading…"
            : formatKB(file.sizeKB)}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          color: "#DC2626",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span
          style={{ fontSize: 12, marginLeft: 3, fontWeight: 500 }}
        >
          Remove file
        </span>
      </button>
    </li>
  );
}

function Spinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4A6CF7"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
