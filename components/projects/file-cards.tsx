import { useState } from "react";
import { Download, FileIcon, FileText, Image as ImageIcon } from "lucide-react";
import { saveFileDownload } from "@/lib/api/files";
import type { FileAttachment } from "@/lib/types";

/**
 * File cards of the "All Projects / Alpha / Files" frame (node 181-2367),
 * wired to A7.1 (GET /files?project_id=). Geometry and type are read from
 * the native nodes: 90px white cards (radius 16, 1px #AEAEB2 border, 16px
 * padding, 14px gaps) with the red PDF artwork (~29x37, #F44336), the name
 * in Inter Medium 16px, the uploader in Inter Regular 13px and the size/time
 * meta in Inter Regular 12px, all #000000. The 18px black download icon is
 * wired to A7.5 (a read) and saves the blob. Recent Files cards are 404px
 * wide with 50px
 * gaps; the All Files grid uses 346px cards with 32px gaps.
 */

const SANS = "font-[family-name:var(--font-sans)]";

function fileIcon(file: FileAttachment) {
  const name = (file.original_name || file.name || "").toLowerCase();
  const mime = (file.mime_type || "").toLowerCase();
  // PDFs carry the native document artwork recovered from the design file
  // (public/assets/pdf-file.svg); other types keep a lucide stand-in since
  // the design only ever draws PDFs.
  if (mime.includes("pdf") || name.endsWith(".pdf")) return { pdf: true as const, color: "#F44336", Icon: FileText };
  if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) return { pdf: false as const, color: "#0DB0A8", Icon: ImageIcon };
  return { pdf: false as const, color: "#525256", Icon: FileIcon };
}

function fileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function timeAgo(value?: string | null) {
  if (!value) return "";
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return `${mins || 1}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function FileCard({ file }: { file: FileAttachment }) {
  const { color, Icon, pdf } = fileIcon(file);
  const [downloading, setDownloading] = useState(false);
  const meta = [fileSize(file.size), timeAgo(file.created_at)].filter(Boolean).join(" • ");
  // A7.5 is a read; the download affordance is wired and saves the blob.
  async function onDownload() {
    setDownloading(true);
    try {
      await saveFileDownload(file);
    } finally {
      setDownloading(false);
    }
  }
  return (
    <li className="flex h-[90px] items-center gap-[14px] rounded-2xl bg-white p-4 ring-1 ring-[#AEAEB2]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ color }}>
        {pdf ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/assets/pdf-file.svg" alt="" width={29} height={37} />
        ) : (
          <Icon size={30} strokeWidth={1.5} />
        )}
      </span>
      <span className="flex h-[58px] min-w-0 flex-1 flex-col justify-between">
        <span className={`${SANS} block truncate text-base font-medium leading-tight text-black`}>
          {file.original_name || file.name}
        </span>
        <span className={`${SANS} block truncate text-[13px] leading-tight text-black`}>
          {file.uploader?.name ? `By ${file.uploader.name}` : ""}
        </span>
        <span className={`${SANS} block truncate text-xs leading-tight text-black`}>{meta}</span>
      </span>
      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        aria-label={`Download ${file.original_name || file.name}`}
        className="shrink-0 text-black disabled:opacity-40"
      >
        <Download size={18} />
      </button>
    </li>
  );
}

export function FileCardGrid({ files, className }: { files: FileAttachment[]; className?: string }) {
  return (
    <ul className={`grid md:grid-cols-2 xl:grid-cols-3 ${className ?? "gap-8"}`}>
      {files.map((f) => (
        <FileCard key={f.id} file={f} />
      ))}
    </ul>
  );
}
