"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { FileCardGrid } from "@/components/projects/file-cards";
import { ProjectShell } from "@/components/projects/project-shell";
import { listFiles } from "@/lib/api/files";
import type { FileAttachment } from "@/lib/types";

/** Files tab of the project screen ("All Projects / Alpha / Files",
 * node 181-2367), wired to A7.1. "Recent Files" is the three newest
 * uploads; upload is a write flow and stays inert. */

const SANS = "font-[family-name:var(--font-sans)]";

export default function ProjectFilesPage() {
  return (
    <Suspense>
      <ProjectFilesContent />
    </Suspense>
  );
}

function ProjectFilesContent() {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listFiles({ project_id: id, per_page: 50 });
        const items = (res.data as { data?: FileAttachment[] } | FileAttachment[]) ?? [];
        if (!cancelled) setFiles(Array.isArray(items) ? items : (items.data ?? []));
      } catch {
        if (!cancelled) setFiles([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const recent = [...files]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <ProjectShell projectId={id}>
      {loaded ? (
        <div className="mt-8 flex flex-col gap-8">
          {recent.length ? (
            <section>
              <h2 className={`${SANS} mb-4 text-[18px] font-semibold text-[#191919]`}>Recent Files</h2>
              <FileCardGrid files={recent} />
            </section>
          ) : null}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`${SANS} text-[18px] font-semibold text-[#191919]`}>All Files</h2>
              {/* Upload is a write flow outside the current read-only scope;
                  the drawn button stays inert (docs/design-api-gaps.md). */}
              <button
                type="button"
                aria-disabled="true"
                title="File upload is not wired yet"
                className={`${SANS} flex items-center gap-2 rounded-[10px] bg-[#005AFB] px-4 py-2 text-sm font-medium text-white`}
              >
                Upload File <Plus size={16} />
              </button>
            </div>
            {files.length ? <FileCardGrid files={files} /> : <p className={`${SANS} text-sm text-[#718096]`}>No files yet.</p>}
          </section>
        </div>
      ) : null}
    </ProjectShell>
  );
}
