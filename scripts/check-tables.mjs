import postgres from "postgres";
import dns from "dns";

// DNS patch
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  let target = hostname;
  if (typeof hostname === "string" && (hostname.endsWith("supabase.co") || hostname.endsWith("supabase.com"))) {
    if (!hostname.endsWith(".")) {
      target = hostname + ".";
    }
  }
  if (typeof options === "function") {
    return originalLookup.call(dns, target, options);
  }
  return originalLookup.call(dns, target, options, callback);
};

const dbUrl = "postgresql://postgres.yggoxfmtxwzqtmznghnc:rhdrksrudrhkscj1!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

async function main() {
  const sql = postgres(dbUrl);
  try {
    const events = await sql`SELECT count(*)::int as count FROM events`;
    const stories = await sql`SELECT count(*)::int as count FROM water_stories`;
    const feedbacks = await sql`SELECT count(*)::int as count FROM feedbacks`;
    const news = await sql`SELECT count(*)::int as count FROM news`;

    console.log("Database Row Counts:");
    console.log(`- news: ${news[0].count}`);
    console.log(`- events: ${events[0].count}`);
    console.log(`- water_stories: ${stories[0].count}`);
    console.log(`- feedbacks: ${feedbacks[0].count}`);
  } catch (err) {
    console.error("Error querying database:", err);
  } finally {
    await sql.end();
  }
}

main();
