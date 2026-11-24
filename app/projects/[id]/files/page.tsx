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
        <div className="mt-8 flex flex-col gap-12">
          {recent.length ? (
            <section className="flex flex-col gap-[31px]">
              <h2 className={`${SANS} -mt-2 text-[25px] font-medium leading-[18px] text-black`}>Recent Files</h2>
              <FileCardGrid files={recent} className="gap-[50px]" />
            </section>
          ) : null}
          <section className="flex flex-col gap-[31px]">
            <div className="flex h-10 items-center justify-between">
              <h2 className={`${SANS} -mt-2 text-[25px] font-medium leading-[18px] text-black`}>All Files</h2>
              {/* Upload is a write flow outside the current read-only scope;
                  the drawn button stays inert (docs/design-api-gaps.md). */}
              <button
                type="button"
                aria-disabled="true"
                title="File upload is not wired yet"
                className={`${SANS} flex h-10 items-center gap-2 rounded-full bg-[#005AFB] py-3 pl-5 pr-3 text-sm font-medium text-white`}
              >
                Upload File <Plus size={16} />
              </button>
            </div>
            {files.length ? <FileCardGrid files={files} className="gap-x-8 gap-y-4" /> : <p className={`${SANS} text-sm text-[#718096]`}>No files yet.</p>}
          </section>
        </div>
      ) : null}
    </ProjectShell>
  );
}
