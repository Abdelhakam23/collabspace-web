import { Download, FileIcon, FileText, Image as ImageIcon } from "lucide-react";
import { initials } from "@/lib/format";
import type { FileAttachment } from "@/lib/types";

/**
 * File cards of the "All Projects / Alpha / Files" frame (node 181-2367),
 * wired to A7.1 (GET /files?project_id=). The download affordance stays
 * inert, matching the dashboard decision (docs/design-api-gaps.md).
 */

const SANS = "font-[family-name:var(--font-sans)]";

function fileTone(file: FileAttachment) {
  const name = (file.original_name || file.name || "").toLowerCase();
  const mime = (file.mime_type || "").toLowerCase();
  if (mime.includes("pdf") || name.endsWith(".pdf")) return { color: "#DB302A", bg: "#FEE4E2", Icon: FileText };
  if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) return { color: "#0DB0A8", bg: "#E6F8F7", Icon: ImageIcon };
  return { color: "#525256", bg: "#F3F4F6", Icon: FileIcon };
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
  const { color, bg, Icon } = fileTone(file);
  const meta = [fileSize(file.size), timeAgo(file.created_at)].filter(Boolean).join(" • ");
  return (
    <li className="flex items-center gap-3 rounded-[12px] bg-white p-4 ring-1 ring-[#F3F4F6]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ color, backgroundColor: bg }}>
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`${SANS} block truncate text-sm font-medium text-[#191919]`}>{file.original_name || file.name}</span>
        <span className={`${SANS} block truncate text-xs text-[#718096]`}>
          {file.uploader?.name ? `By ${file.uploader.name}` : ""}
        </span>
        <span className={`${SANS} block truncate text-xs text-[#718096]`}>{meta}</span>
      </span>
      <span aria-disabled="true" aria-label="Download (not wired yet)" className="shrink-0 text-[#525256]">
        <Download size={18} />
      </span>
    </li>
  );
}

export function FileCardGrid({ files }: { files: FileAttachment[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {files.map((f) => (
        <FileCard key={f.id} file={f} />
      ))}
    </ul>
  );
}
