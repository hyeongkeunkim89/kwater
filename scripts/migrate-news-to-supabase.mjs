import fs from "fs";
import path from "path";
import dns from "dns";

// ── 사내망 DNS Suffix 자동 추가로 인한 조회 오류 우회 ──
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

// ── 로컬 환경 변수 (.env 및 .env.local) 파일 직접 파싱 ──
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      content.split(/\r?\n/).forEach((line) => {
        // 주석 제외 및 유효한 KEY=VAL 라인 매칭
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        
        const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
        if (match) {
          const key = match[1];
          let val = match[2] || "";
          
          // 앞뒤 따옴표 제거
          if (val.length >= 2 && val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          } else if (val.length >= 2 && val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
          }
          
          val = val.trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  }
}

// ── Vercel/Supabase DB 호스트 SSL 필수 처리 ──
function ensureSupabaseSslQuery(raw) {
  const u = raw.trim();
  if (!/supabase\.co|pooler\.supabase\.com/i.test(u)) return u;
  if (/[?&]sslmode=/i.test(u)) return u;
  return u.includes("?") ? `${u}&sslmode=require` : `${u}?sslmode=require`;
}

async function run() {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ 오류: DATABASE_URL 환경 변수를 찾을 수 없습니다.");
    console.error("   .env 또는 .env.local 파일에 DATABASE_URL=postgresql://... 설정을 추가한 후 실행해 주세요.");
    process.exit(1);
  }

  const resolvedUrl = ensureSupabaseSslQuery(dbUrl);
  console.log("ℹ️ Supabase 데이터베이스 연결 시도 중...");
  
  const postgres = (await import("postgres")).default;

  let sql;
  try {
    sql = postgres(resolvedUrl, {
      max: 1,
      prepare: false,
      connect_timeout: 10,
    });
  } catch (err) {
    console.error("❌ 데이터베이스 초기화 실패:", err.message);
    process.exit(1);
  }

  try {
    // 1. news 테이블 및 인덱스 생성
    console.log("⚙️ 'news' 테이블 및 인덱스 생성 여부 검사 중...");
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        center_id text NOT NULL,
        center_name text NOT NULL,
        title text NOT NULL,
        content text NOT NULL,
        views integer NOT NULL DEFAULT 0,
        is_pinned boolean NOT NULL DEFAULT false,
        image_url text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS news_created_idx ON news (created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS news_center_idx ON news (center_id)
    `;
    console.log("✅ 'news' 테이블 및 인덱스가 준비되었습니다.");

    // 2. 로컬 db/local_news.json 파일 읽기
    const localFile = path.join(process.cwd(), "db", "local_news.json");
    if (!fs.existsSync(localFile)) {
      console.warn("⚠️ 경고: 로컬 db/local_news.json 파일을 찾을 수 없어 복구할 기존 데이터가 없습니다.");
      await sql.end();
      return;
    }

    const localDataRaw = fs.readFileSync(localFile, "utf-8");
    const localNews = JSON.parse(localDataRaw);
    if (!Array.isArray(localNews) || localNews.length === 0) {
      console.log("ℹ️ 로컬 JSON에 복구할 소식 데이터가 비어 있습니다.");
      await sql.end();
      return;
    }

    console.log(`📂 로컬에서 ${localNews.length}개의 소식 글 데이터를 감지했습니다.`);

    // 3. Supabase 기존 뉴스 조회하여 중복 방지
    const existingNews = await sql`
      SELECT id FROM news
    `;
    const existingIds = new Set(existingNews.map(r => r.id));

    // 4. 없는 뉴스 복구(INSERT)
    let insertCount = 0;
    for (const item of localNews) {
      if (existingIds.has(item.id)) {
        console.log(`⏭️ 이미 DB에 등록되어 건너뜁니다: "${item.title}"`);
        continue;
      }

      console.log(`📤 DB로 복구 중: "${item.title}"`);
      await sql`
        INSERT INTO news (id, center_id, center_name, title, content, views, is_pinned, image_url, created_at)
        VALUES (
          ${item.id},
          ${item.center_id},
          ${item.center_name},
          ${item.title},
          ${item.content},
          ${item.views || 0},
          ${item.is_pinned || false},
          ${item.image_url || null},
          ${item.created_at}
        )
      `;
      insertCount++;
    }

    console.log(`🎉 마이그레이션이 완료되었습니다! (신규 복구: ${insertCount}건)`);

  } catch (err) {
    console.error("❌ 작업 중 오류 발생:", err.message);
    process.exit(1);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

run();
