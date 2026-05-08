"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JiraIssue } from "@/lib/jira";
import styles from "./SprintDashboard.module.css";

type Unit = "d" | "h";
type SprintKey = "sprint-1" | "sprint-2" | "sprint-3" | "sprint-4" | "backlog";
type Buckets = Record<SprintKey, JiraIssue[]>;

const SPRINT_LABELS: Exclude<SprintKey, "backlog">[] = [
  "sprint-1",
  "sprint-2",
  "sprint-3",
  "sprint-4",
];
const ORDER: SprintKey[] = [...SPRINT_LABELS, "backlog"];
const SPRINT_LABEL: Record<SprintKey, string> = {
  "sprint-1": "Sprint 1",
  "sprint-2": "Sprint 2",
  "sprint-3": "Sprint 3",
  "sprint-4": "Sprint 4",
  backlog: "No label",
};
const SPRINT_PILL_CLASS: Record<SprintKey, string> = {
  "sprint-1": styles.pillS1,
  "sprint-2": styles.pillS2,
  "sprint-3": styles.pillS3,
  "sprint-4": styles.pillS4,
  backlog: styles.pillBl,
};

const STORAGE_KEY = "ro-sprint-dashboard-unit";
const JIRA_BROWSE_BASE = "https://roryoliver.atlassian.net/browse/";

function fmtTime(seconds: number, unit: Unit): string {
  if (unit === "h") {
    const h = seconds / 3600;
    return h < 0.05 ? "0h" : `${h.toFixed(1)}h`;
  }
  const d = seconds / 28800;
  if (d === 0) return "0d";
  if (d < 0.5) return `${(seconds / 3600).toFixed(1)}h`;
  return `${d.toFixed(1)}d`;
}

function bucketize(issues: JiraIssue[]): Buckets {
  const buckets: Buckets = {
    "sprint-1": [],
    "sprint-2": [],
    "sprint-3": [],
    "sprint-4": [],
    backlog: [],
  };
  for (const it of issues) {
    const labels = it.fields.labels ?? [];
    let placed = false;
    for (const sl of SPRINT_LABELS) {
      if (labels.includes(sl)) {
        buckets[sl].push(it);
        placed = true;
      }
    }
    if (!placed) buckets.backlog.push(it);
  }
  return buckets;
}

function sumTT(issues: JiraIssue[]) {
  let orig = 0;
  let rem = 0;
  let spent = 0;
  for (const it of issues) {
    const tt = it.fields.timetracking ?? {};
    orig += tt.originalEstimateSeconds ?? 0;
    rem += tt.remainingEstimateSeconds ?? 0;
    spent += tt.timeSpentSeconds ?? 0;
  }
  return { orig, rem, spent };
}

function statusGroups(issues: JiraIssue[]): Record<string, number> {
  const g: Record<string, number> = {};
  for (const it of issues) {
    const n = it.fields.status?.name ?? "Unknown";
    g[n] = (g[n] ?? 0) + 1;
  }
  return g;
}

function isDone(issue: JiraIssue): boolean {
  return (issue.fields.status?.name ?? "") === "Done";
}

function sprintKeyFor(issue: JiraIssue): SprintKey {
  const labels = issue.fields.labels ?? [];
  return SPRINT_LABELS.find((s) => labels.includes(s)) ?? "backlog";
}

type Props = {
  slug: string;
  displayName: string;
  initialIssues: JiraIssue[];
  initialFetchedAt: string;
};

export default function SprintDashboard({
  slug,
  displayName,
  initialIssues,
  initialFetchedAt,
}: Props) {
  const [unit, setUnit] = useState<Unit>("d");
  const [issues, setIssues] = useState<JiraIssue[]>(initialIssues);
  const [fetchedAt, setFetchedAt] = useState<string>(initialFetchedAt);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "h" || stored === "d") setUnit(stored);
  }, []);

  const setUnitPersisted = useCallback((u: Unit) => {
    setUnit(u);
    try {
      window.localStorage.setItem(STORAGE_KEY, u);
    } catch {
      /* ignore quota */
    }
  }, []);

  const reload = useCallback(async () => {
    setReloading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/jira/sprints/${encodeURIComponent(slug)}?fresh=1`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          body?.error ?? `Reload failed (HTTP ${res.status})`,
        );
      }
      const data = (await res.json()) as {
        issues: JiraIssue[];
        fetchedAt: string;
      };
      setIssues(data.issues);
      setFetchedAt(data.fetchedAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reload failed");
    } finally {
      setReloading(false);
    }
  }, [slug]);

  const active = useMemo(() => issues.filter((it) => !isDone(it)), [issues]);
  const buckets = useMemo(() => bucketize(active), [active]);
  const totalTT = useMemo(() => sumTT(active), [active]);

  const top15 = useMemo(
    () =>
      active
        .slice()
        .sort(
          (a, b) =>
            (b.fields.timetracking?.originalEstimateSeconds ?? 0) -
            (a.fields.timetracking?.originalEstimateSeconds ?? 0),
        )
        .slice(0, 15),
    [active],
  );

  const inconsistencies = useMemo(
    () =>
      active.filter((it) => {
        const tt = it.fields.timetracking ?? {};
        const orig = tt.originalEstimateSeconds ?? 0;
        const rem = tt.remainingEstimateSeconds ?? 0;
        return orig > 0 && rem > 0 && orig !== rem;
      }),
    [active],
  );

  const updatedLabel = useMemo(() => {
    const d = new Date(fetchedAt);
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Updated ${time} • ${active.length} tickets (epics + done excluded from totals)`;
  }, [fetchedAt, active.length]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1>{displayName} sprint planning</h1>
          <div className={styles.muted}>{updatedLabel}</div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.reloadButton}
            onClick={reload}
            disabled={reloading}
          >
            {reloading ? "Reloading…" : "Reload"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {ORDER.map((k) => {
          const list = buckets[k];
          const tt = sumTT(list);
          const sg = statusGroups(list);
          const outlook = tt.spent + tt.rem;
          const pctSpent = outlook
            ? Math.min(100, Math.round((tt.spent / outlook) * 100))
            : 0;
          const sortedStatuses = Object.entries(sg).sort(
            (a, b) => b[1] - a[1],
          );
          return (
            <div key={k} className={styles.card}>
              <div className={styles.statLabel}>
                <span
                  className={`${styles.pill} ${SPRINT_PILL_CLASS[k]}`}
                >
                  {SPRINT_LABEL[k]}
                </span>
              </div>
              <div className={styles.statValue}>
                {list.length}
                <span className={styles.statValueUnit}>tickets</span>
              </div>
              <div className={styles.statSub}>
                {fmtTime(tt.orig, unit)} estimated
              </div>
              <div className={styles.progress} title={`${pctSpent}% logged`}>
                <div style={{ width: `${pctSpent}%` }} />
              </div>
              <div className={styles.breakdown}>
                <div>
                  <span>Logged</span>
                  <span className="num">{fmtTime(tt.spent, unit)}</span>
                </div>
                <div>
                  <span>Remaining</span>
                  <span className="num">{fmtTime(tt.rem, unit)}</span>
                </div>
                {sortedStatuses.map(([s, c]) => (
                  <div key={s}>
                    <span>{s}</span>
                    <span className="num">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className={`${styles.card} ${styles.cardTotal}`}>
          <div className={styles.statLabel}>All non-done</div>
          <div className={styles.statValue}>
            {active.length}
            <span className={styles.statValueUnit}>tickets</span>
          </div>
          <div className={styles.statSub}>
            {fmtTime(totalTT.orig, unit)} estimated
          </div>
          <div className={styles.breakdown}>
            <div>
              <span>Logged</span>
              <span className="num">{fmtTime(totalTT.spent, unit)}</span>
            </div>
            <div>
              <span>Remaining</span>
              <span className="num">{fmtTime(totalTT.rem, unit)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <div className={styles.chartHeader}>
          <div className={styles.statLabel} style={{ marginBottom: 0 }}>
            Estimate vs logged time per sprint
          </div>
          <div className={styles.toggle}>
            <button
              type="button"
              className={unit === "d" ? "active" : undefined}
              onClick={() => setUnitPersisted("d")}
            >
              Days
            </button>
            <button
              type="button"
              className={unit === "h" ? "active" : undefined}
              onClick={() => setUnitPersisted("h")}
            >
              Hours
            </button>
          </div>
        </div>
        <div className={styles.chartCanvasWrap}>
          <SprintBarChart buckets={buckets} unit={unit} />
        </div>
        <div className={`${styles.muted} ${styles.chartCaption}`}>
          Stacked bar = current outlook (logged + remaining). Dashed marker =
          original estimate. If outlook &gt; original, scope grew or estimates
          were low.
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <h2>Largest 15 tickets by estimate</h2>
        <span className={styles.muted}>click a key to open in Jira</span>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Sprint</th>
              <th>Summary</th>
              <th>Pri</th>
              <th className={styles.right}>Est.</th>
              <th className={styles.right}>Logged</th>
              <th className={styles.right}>Rem.</th>
            </tr>
          </thead>
          <tbody>
            {top15.map((it) => {
              const tt = it.fields.timetracking ?? {};
              const sl = sprintKeyFor(it);
              const pri = it.fields.priority?.name ?? "";
              return (
                <tr key={it.key}>
                  <td>
                    <a
                      href={`${JIRA_BROWSE_BASE}${it.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {it.key}
                    </a>
                  </td>
                  <td>
                    <span
                      className={`${styles.pill} ${SPRINT_PILL_CLASS[sl]}`}
                    >
                      {SPRINT_LABEL[sl]}
                    </span>
                  </td>
                  <td className="summary">
                    {(it.fields.summary ?? "").slice(0, 80)}
                  </td>
                  <td>{pri}</td>
                  <td className={styles.right}>
                    {fmtTime(tt.originalEstimateSeconds ?? 0, unit)}
                  </td>
                  <td className={styles.right}>
                    {fmtTime(tt.timeSpentSeconds ?? 0, unit)}
                  </td>
                  <td className={styles.right}>
                    {fmtTime(tt.remainingEstimateSeconds ?? 0, unit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.sectionTitle}>
        <h2>Inconsistencies</h2>
        <span className={styles.muted}>
          tickets where original ≠ remaining estimate (likely re-estimate
          stragglers)
        </span>
      </div>
      <div className={styles.tableWrap}>
        {inconsistencies.length === 0 ? (
          <div className={styles.cleanNote}>
            All tickets have matching original and remaining estimates. Clean.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Sprint</th>
                <th>Summary</th>
                <th className={styles.right}>Original</th>
                <th className={styles.right}>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {inconsistencies.map((it) => {
                const tt = it.fields.timetracking ?? {};
                const sl = sprintKeyFor(it);
                return (
                  <tr key={it.key}>
                    <td>
                      <a
                        href={`${JIRA_BROWSE_BASE}${it.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {it.key}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`${styles.pill} ${SPRINT_PILL_CLASS[sl]}`}
                      >
                        {SPRINT_LABEL[sl]}
                      </span>
                    </td>
                    <td className="summary">
                      {(it.fields.summary ?? "").slice(0, 80)}
                    </td>
                    <td className={styles.right}>
                      {fmtTime(tt.originalEstimateSeconds ?? 0, unit)}
                    </td>
                    <td className={styles.right}>
                      {fmtTime(tt.remainingEstimateSeconds ?? 0, unit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SprintBarChart({
  buckets,
  unit,
}: {
  buckets: Buckets;
  unit: Unit;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let chart: { destroy: () => void } | null = null;

    (async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (cancelled || !canvasRef.current) return;

      const factor = unit === "h" ? 3600 : 28800;
      const decimals = unit === "h" ? 0 : 1;
      const labels = ORDER.map((k) => SPRINT_LABEL[k]);
      const orig = ORDER.map((k) =>
        +(sumTT(buckets[k]).orig / factor).toFixed(decimals),
      );
      const spent = ORDER.map((k) =>
        +(sumTT(buckets[k]).spent / factor).toFixed(decimals),
      );
      const rem = ORDER.map((k) =>
        +(sumTT(buckets[k]).rem / factor).toFixed(decimals),
      );

      chart = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Logged",
              data: spent,
              backgroundColor: "#1d9e75",
              borderWidth: 0,
              stack: "outlook",
            },
            {
              label: "Remaining",
              data: rem,
              backgroundColor: "#85b7eb",
              borderWidth: 0,
              stack: "outlook",
            },
            {
              label: "Original estimate",
              data: orig,
              type: "line",
              borderColor: "#444441",
              backgroundColor: "#444441",
              borderDash: [5, 5],
              pointRadius: 5,
              pointStyle: "rectRot",
              fill: false,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              stacked: true,
              beginAtZero: true,
              title: {
                display: true,
                text: unit === "h" ? "Hours" : "Days (8h)",
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 12, boxHeight: 12, font: { size: 12 } },
            },
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: ${c.raw}${unit}`,
              },
            },
          },
        },
      });
      chartRef.current = chart;
    })();

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [buckets, unit]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Bar chart of estimated vs logged time per sprint"
    />
  );
}
