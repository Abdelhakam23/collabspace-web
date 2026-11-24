"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectShell } from "@/components/projects/project-shell";
import { TeamCards } from "@/components/projects/team-cards";
import { getProjectTeamsTaskProgress } from "@/lib/api/projects";
import type { ProjectTeamProgress } from "@/lib/types";

/** Teams tab of the project screen ("All Projects / Alpha / teams",
 * node 181-1982), wired to A4.4. */

export default function ProjectTeamsPage() {
  return (
    <Suspense>
      <ProjectTeamsContent />
    </Suspense>
  );
}

function ProjectTeamsContent() {
  const { id } = useParams<{ id: string }>();
  const [teams, setTeams] = useState<ProjectTeamProgress[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getProjectTeamsTaskProgress(id);
        if (!cancelled) setTeams(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setTeams([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <ProjectShell projectId={id}>
      {loaded ? <TeamCards teams={teams} /> : null}
    </ProjectShell>
  );
}
