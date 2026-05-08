import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getClientConfig } from "@/lib/clients";
import { searchIssues } from "@/lib/jira";

const FIELDS = [
  "summary",
  "labels",
  "timetracking",
  "status",
  "priority",
  "parent",
  "issuetype",
];

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response(null, { status: 404 });
  }

  const { slug } = await ctx.params;
  const accessibleClients = session.user.accessibleClients ?? [];
  if (!accessibleClients.includes(slug)) {
    return new Response(null, { status: 404 });
  }

  const config = await getClientConfig(slug);
  if (!config || !accessibleClients.includes(config.slug)) {
    return new Response(null, { status: 404 });
  }

  const extra = config.jiraJqlExtra ? ` AND ${config.jiraJqlExtra}` : "";
  const jql = `project = ${config.jiraProjectKey} AND issuetype != Epic${extra} ORDER BY key ASC`;

  const fresh = req.nextUrl.searchParams.get("fresh") === "1";

  try {
    const issues = await searchIssues({
      jql,
      fields: FIELDS,
      maxResults: 100,
      fresh,
    });
    return Response.json({
      issues,
      client: { slug: config.slug, displayName: config.displayName },
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
