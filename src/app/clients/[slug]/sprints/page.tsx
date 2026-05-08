import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getClientConfig } from "@/lib/clients";
import { searchIssues } from "@/lib/jira";
import SprintDashboard from "./SprintDashboard";

const FIELDS = [
  "summary",
  "labels",
  "timetracking",
  "status",
  "priority",
  "parent",
  "issuetype",
];

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SprintsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.email) notFound();
  if (!session.user.accessibleClients?.includes(slug)) notFound();

  const config = await getClientConfig(slug);
  if (!config || !session.user.accessibleClients.includes(config.slug)) {
    notFound();
  }

  const extra = config.jiraJqlExtra ? ` AND ${config.jiraJqlExtra}` : "";
  const jql = `project = ${config.jiraProjectKey} AND issuetype != Epic${extra} ORDER BY key ASC`;

  const issues = await searchIssues({
    jql,
    fields: FIELDS,
    maxResults: 100,
  });

  return (
    <SprintDashboard
      slug={config.slug}
      displayName={config.displayName}
      initialIssues={issues}
      initialFetchedAt={new Date().toISOString()}
    />
  );
}
