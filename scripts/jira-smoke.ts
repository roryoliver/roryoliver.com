/**
 * Run with: npx tsx --env-file=.env.local scripts/jira-smoke.ts
 *
 * Hits Jira with `project = TRA AND issuetype != Epic` and reports the
 * issue count plus a few sample fields. Use this to confirm the Jira
 * env vars are correct before wiring the dashboard.
 */
import { searchIssues } from "../src/lib/jira";

async function main() {
  const required = ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("Missing env vars:", missing.join(", "));
    console.error("Run: npx tsx --env-file=.env.local scripts/jira-smoke.ts");
    process.exit(1);
  }

  const project = process.argv[2] ?? "TRA";
  const jql = `project = ${project} AND issuetype != Epic ORDER BY key ASC`;
  console.log(`Querying: ${jql}`);

  const issues = await searchIssues({
    jql,
    fields: [
      "summary",
      "labels",
      "timetracking",
      "status",
      "priority",
      "issuetype",
    ],
    maxResults: 100,
    fresh: true,
  });

  console.log(`Got ${issues.length} issues.`);
  if (issues.length) {
    const sample = issues.slice(0, 3).map((it) => ({
      key: it.key,
      summary: it.fields.summary?.slice(0, 60),
      status: it.fields.status?.name,
      labels: it.fields.labels,
    }));
    console.log("Sample:", JSON.stringify(sample, null, 2));
  }

  const labelCounts = issues.reduce<Record<string, number>>((acc, it) => {
    for (const l of it.fields.labels ?? []) acc[l] = (acc[l] ?? 0) + 1;
    return acc;
  }, {});
  console.log("Top labels:", labelCounts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
