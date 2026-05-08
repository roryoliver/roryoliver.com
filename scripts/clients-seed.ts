/**
 * Seed Upstash Redis with the ClientConfig records from lib/clients.ts.
 *
 * Idempotent — re-running overwrites each entry with the latest values
 * from SEED_CLIENTS and re-syncs the email→clients index.
 *
 * Run with: npm run clients:seed
 *
 * Once a record is in Redis, getClientConfig() reads from there in
 * preference to the in-code seed, so future allowlist edits can be
 * made by editing SEED_CLIENTS and re-running this script — no deploy
 * required.
 */
import { SEED_CLIENTS, upsertClientConfig, getClientConfig } from "../src/lib/clients";
import { getRedis } from "../src/lib/redis";

async function main() {
  const redis = getRedis();
  if (!redis) {
    console.error("Upstash Redis env vars not set in .env.local.");
    console.error("Run: vercel env pull .env.local --yes");
    process.exit(1);
  }

  console.log(`Seeding ${Object.keys(SEED_CLIENTS).length} client(s) into Redis…\n`);

  for (const config of Object.values(SEED_CLIENTS)) {
    console.log(`→ ${config.slug} (${config.displayName})`);
    console.log(`  jiraProjectKey: ${config.jiraProjectKey}`);
    console.log(`  allowedEmails:  ${config.allowedEmails.join(", ")}`);
    await upsertClientConfig(config);
    const back = await getClientConfig(config.slug);
    if (!back) {
      console.error(`  ✗ failed to read back ${config.slug}`);
      process.exit(1);
    }
    console.log(`  ✓ written and verified\n`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
