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

const mockEvents = [
  {
    center_id: "soyang",
    center_name: "소양강댐 물문화관",
    title: "소양강댐 벚꽃길 가족 생태 걷기 대회",
    content: "아름다운 소양강 호반 산책로를 걸으며 댐 주변 생태계를 체험하고 생태 환경 보전 뱃지를 획득하세요. 다양한 가족 미션과 포토존이 준비되어 있습니다.",
    start_date: "2026-09-10",
    end_date: "2026-09-12",
    is_headquarters: false,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/SoyangDam.JPG/640px-SoyangDam.JPG"
  },
  {
    center_id: "all",
    center_name: "본사",
    title: "K-water 전국 물사랑 어린이 사생대회",
    content: "우리의 소중한 물과 자연 환경의 아름다움을 글과 그림으로 표현하는 전국 단위 어린이 사생대회입니다. 본사 주관 공통 이벤트로 시상 내역 및 기념품이 풍성하게 제공됩니다.",
    start_date: "2026-10-01",
    end_date: "2026-10-15",
    is_headquarters: true,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg/640px-Daecheong_Dam_after_rain_-_%EB%8C%80%EC%B2%AD%EB%8C%90.jpg"
  },
  {
    center_id: "daecheong",
    center_name: "대청댐 물문화관",
    title: "대청댐 환경 살리기 업사이클링 체험 교실",
    content: "폐플라스틱과 재활용품을 활용해 나만의 친환경 반려식물 화분을 만들어 보는 업사이클링 클래스입니다. 대청댐 유역의 맑은 물과 환경 보전의 중요성을 배울 수 있습니다.",
    start_date: "2026-09-20",
    end_date: "2026-09-21",
    is_headquarters: false,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Chungju_Lake.jpg/640px-Chungju_Lake.jpg"
  }
];

async function main() {
  const sql = postgres(dbUrl);
  try {
    // 1. Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        center_id text NOT NULL,
        center_name text NOT NULL,
        title text NOT NULL,
        content text NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        is_headquarters boolean NOT NULL DEFAULT false,
        image_url text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    // 2. Check counts
    const countRes = await sql`SELECT count(*)::int as count FROM events`;
    if (countRes[0].count > 0) {
      console.log(`Events table already populated with ${countRes[0].count} items. Skipping seed.`);
      return;
    }

    console.log("Seeding mock events...");
    for (const ev of mockEvents) {
      await sql`
        INSERT INTO events (center_id, center_name, title, content, start_date, end_date, is_headquarters, image_url)
        VALUES (${ev.center_id}, ${ev.center_name}, ${ev.title}, ${ev.content}, ${ev.start_date}, ${ev.end_date}, ${ev.is_headquarters}, ${ev.image_url})
      `;
    }
    console.log("Mock events seeded successfully!");
  } catch (err) {
    console.error("Error seeding events:", err);
  } finally {
    await sql.end();
  }
}

main();
