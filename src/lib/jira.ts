const BASE = process.env.JIRA_BASE_URL;
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_API_TOKEN;

export type JiraIssue = {
  key: string;
  fields: {
    summary: string;
    labels: string[];
    timetracking?: {
      originalEstimateSeconds?: number;
      remainingEstimateSeconds?: number;
      timeSpentSeconds?: number;
    };
    status?: { name: string };
    priority?: { name: string };
    parent?: { key: string };
    issuetype?: { name: string };
  };
};

export type SearchOptions = {
  jql: string;
  fields: string[];
  maxResults?: number;
  fresh?: boolean;
};

function authHeader(): string {
  if (!EMAIL || !TOKEN) {
    throw new Error(
      "Jira credentials missing: set JIRA_EMAIL and JIRA_API_TOKEN env vars",
    );
  }
  return "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");
}

export async function searchIssues({
  jql,
  fields,
  maxResults = 100,
  fresh = false,
}: SearchOptions): Promise<JiraIssue[]> {
  if (!BASE) throw new Error("JIRA_BASE_URL env var is not set");

  const url = `${BASE}/rest/api/3/search/jql`;
  const issues: JiraIssue[] = [];
  let nextPageToken: string | undefined;

  do {
    const body: Record<string, unknown> = { jql, fields, maxResults };
    if (nextPageToken) body.nextPageToken = nextPageToken;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(),
      },
      body: JSON.stringify(body),
      ...(fresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Jira ${res.status}: ${text.slice(0, 500)}`);
    }

    const data = (await res.json()) as {
      issues?: JiraIssue[];
      isLast?: boolean;
      nextPageToken?: string;
    };
    if (Array.isArray(data.issues)) issues.push(...data.issues);
    nextPageToken = data.isLast === false ? data.nextPageToken : undefined;
  } while (nextPageToken);

  return issues;
}
