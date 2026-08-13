import postgres from "postgres";

const dbUrl = "postgresql://postgres.yggoxfmtxwzqtmznghnc:rhdrksrudrhkscj1!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

console.log("Connecting to Supabase...");
const sql = postgres(dbUrl, {
  max: 1,
  prepare: false,
  connect_timeout: 10,
});

async function run() {
  try {
    console.log("Querying 'news'...");
    const news = await sql`SELECT COUNT(*)::integer as count FROM news`;
    console.log("News count:", news[0].count);

    console.log("Querying 'events'...");
    const events = await sql`SELECT COUNT(*)::integer as count FROM events`;
    console.log("Events count:", events[0].count);

    console.log("Querying 'feedbacks'...");
    const feedbacks = await sql`SELECT COUNT(*)::integer as count FROM feedbacks`;
    console.log("Feedbacks count:", feedbacks[0].count);

    console.log("Querying 'water_stories'...");
    const stories = await sql`SELECT COUNT(*)::integer as count FROM water_stories`;
    console.log("Stories count:", stories[0].count);

  } catch (err) {
    console.error("Error during query:", err);
  } finally {
    await sql.end();
  }
}

run();
