#!/usr/bin/env node
/**
 * 층별 사진 일괄 등록 — manifest.csv + images/ 폴더 → Supabase Storage + center_floor_photos
 *
 * 사용:
 *   node scripts/import-floor-photos.mjs --dry-run
 *   node scripts/import-floor-photos.mjs
 *   node scripts/import-floor-photos.mjs --force
 *   node scripts/import-floor-photos.mjs --list-centers
 *
 * 환경: 프로젝트 루트 .env.local (DATABASE_URL, DATABASE_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const BUCKET = "center-floor-photos";
const FLOOR_KEY_RE = /^floor-[0-9]+$/;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// ── CLI ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const listCenters = args.includes("--list-centers");
const dirArg = args.find((a) => a.startsWith("--dir="));
const manifestArg = args.find((a) => a.startsWith("--manifest="));
const bulkDir = resolve(ROOT, dirArg ? dirArg.slice("--dir=".length) : "bulk-floor-photos");
const manifestPath = resolve(
  bulkDir,
  manifestArg ? manifestArg.slice("--manifest=".length) : "manifest.csv",
);

// ── env ────────────────────────────────────────────────────────
function loadEnvFile(filepath) {
  if (!existsSync(filepath)) return;
  const text = readFileSync(filepath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function normalizeDatabaseUrl(raw) {
  if (!raw) return "";
  let u = raw.trim();
  if (u.charCodeAt(0) === 0xfeff) u = u.slice(1).trim();
  if (u.length >= 2 && u[0] === u.at(-1) && (u[0] === '"' || u[0] === "'")) {
    u = u.slice(1, -1).trim();
  }
  return u.replace(/\r\n/g, "").replace(/\n/g, "");
}

function getDatabaseUrl() {
  const base = normalizeDatabaseUrl(process.env.DATABASE_URL);
  if (!base) return null;
  const pwd = process.env.DATABASE_PASSWORD?.trim();
  if (!pwd) return base;
  try {
    const u = new URL(base);
    u.password = pwd;
    return u.href;
  } catch {
    return base;
  }
}

function ensureSsl(url) {
  if (!/supabase\.co|pooler\.supabase\.com/i.test(url)) return url;
  if (/[?&]sslmode=/i.test(url)) return url;
  return url.includes("?") ? `${url}&sslmode=require` : `${url}?sslmode=require`;
}

function ensurePooler(url) {
  if (!/pooler\.supabase\.com/i.test(url)) return url;
  if (/[?&]pgbouncer=true/i.test(url)) return url;
  return url.includes("?") ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`;
}

loadEnvFile(join(ROOT, ".env.local"));
loadEnvFile(join(ROOT, ".env"));

// ── centers.ts에서 id·이름 읽기 ────────────────────────────────
function loadCentersFromRepo() {
  const path = join(ROOT, "src/data/centers.ts");
  const text = readFileSync(path, "utf8");
  const centers = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] === "string") continue;
    centers.push({ id: m[1], name: m[2] });
  }
  return centers;
}

// ── CSV ────────────────────────────────────────────────────────
function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      fields.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  fields.push(cur.trim());
  return fields;
}

function parseManifest(csvPath) {
  let raw = readFileSync(csvPath, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  if (lines.length < 2) throw new Error("manifest에 헤더+데이터 행이 필요합니다.");

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const idx = (name) => header.indexOf(name);
  const iCenter = idx("center_id");
  const iFloor = idx("floor_key");
  const iFile = idx("filename");
  const iSort = idx("sort_order");
  const iNote = idx("note");

  if (iCenter < 0 || iFloor < 0 || iFile < 0) {
    throw new Error("manifest 헤더에 center_id, floor_key, filename 컬럼이 필요합니다.");
  }

  const rows = [];
  for (let n = 1; n < lines.length; n++) {
    const cols = parseCsvLine(lines[n]);
    if (cols.every((c) => !c)) continue;
    rows.push({
      line: n + 1,
      centerId: cols[iCenter] ?? "",
      floorKey: cols[iFloor] ?? "",
      filename: cols[iFile] ?? "",
      sortOrder: iSort >= 0 && cols[iSort] ? Number(cols[iSort]) : null,
      note: iNote >= 0 ? cols[iNote] ?? "" : "",
    });
  }
  return rows;
}

function safeFilename(name) {
  return basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
}

function contentTypeFor(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
  return MIME[ext] ?? "application/octet-stream";
}

function localImagePath(imagesRoot, centerId, floorKey, filename) {
  return join(imagesRoot, centerId, floorKey, filename);
}

function storagePathFor(centerId, floorKey, filename) {
  return `${centerId}/${floorKey}/${safeFilename(filename)}`;
}

// ── main ───────────────────────────────────────────────────────
async function main() {
  const centers = loadCentersFromRepo();
  const centerIds = new Set(centers.map((c) => c.id));

  if (listCenters) {
    console.log("center_id\tname");
    for (const c of centers) console.log(`${c.id}\t${c.name}`);
    console.log(`\n총 ${centers.length}개 — centers-reference.csv / manifest.example.csv 참고`);
    return;
  }

  if (!existsSync(manifestPath)) {
    console.error(`manifest 없음: ${manifestPath}`);
    console.error("bulk-floor-photos/manifest.example.csv 를 manifest.csv 로 복사한 뒤 채워 주세요.");
    process.exit(1);
  }

  const imagesRoot = join(bulkDir, "images");
  const rows = parseManifest(manifestPath);
  const results = [];

  console.log(`\n📂 작업 폴더: ${bulkDir}`);
  console.log(`📄 manifest: ${manifestPath}`);
  console.log(`📷 이미지: ${imagesRoot}`);
  console.log(`모드: ${dryRun ? "DRY-RUN (업로드·DB 없음)" : force ? "IMPORT + 덮어쓰기" : "IMPORT (기존 storage_path 스킵)"}\n`);

  const errors = [];
  const planned = [];

  for (const row of rows) {
    const { line, centerId, floorKey, filename } = row;
    const rec = { line, centerId, floorKey, filename, status: "", detail: "" };

    if (!centerIds.has(centerId)) {
      rec.status = "ERROR";
      rec.detail = `알 수 없는 center_id ( --list-centers 로 확인)`;
      errors.push(rec);
      continue;
    }
    if (!FLOOR_KEY_RE.test(floorKey)) {
      rec.status = "ERROR";
      rec.detail = "floor_key는 floor-0, floor-1 형식";
      errors.push(rec);
      continue;
    }
    if (!filename) {
      rec.status = "ERROR";
      rec.detail = "filename 비어 있음";
      errors.push(rec);
      continue;
    }

    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (!IMAGE_EXT.has(ext)) {
      rec.status = "ERROR";
      rec.detail = "JPG/PNG/WebP/GIF만 허용";
      errors.push(rec);
      continue;
    }

    const localPath = localImagePath(imagesRoot, centerId, floorKey, filename);
    if (!existsSync(localPath)) {
      rec.status = "ERROR";
      rec.detail = `파일 없음: ${localPath}`;
      errors.push(rec);
      continue;
    }

    const storagePath = storagePathFor(centerId, floorKey, filename);
    planned.push({ ...row, localPath, storagePath, rec });
  }

  if (errors.length) {
    console.log("❌ 검증 실패:\n");
    for (const e of errors) {
      console.log(`  L${e.line} ${e.centerId}/${e.floorKey}/${e.filename}: ${e.detail}`);
    }
    if (!planned.length) process.exit(1);
    console.log(`\n⚠️  ${planned.length}건은 통과, ${errors.length}건 오류 — 오류만 고치고 다시 실행하세요.\n`);
    if (dryRun) process.exit(1);
  }

  if (dryRun) {
    console.log(`✅ DRY-RUN: ${planned.length}건 업로드 가능\n`);
    for (const p of planned) {
      console.log(`  L${p.line} ${p.storagePath}${p.sortOrder != null ? ` (sort=${p.sortOrder})` : ""}${p.note ? ` — ${p.note}` : ""}`);
    }
    return;
  }

  const dbUrl = getDatabaseUrl();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!dbUrl || !supabaseUrl || !serviceKey) {
    console.error(".env.local 에 DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.");
    process.exit(1);
  }

  const sql = postgres(ensurePooler(ensureSsl(dbUrl)), {
    max: 1,
    prepare: false,
  });
  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const paths = planned.map((p) => p.storagePath);
  const existingRows =
    paths.length > 0
      ? await sql`SELECT storage_path FROM center_floor_photos WHERE storage_path = ANY(${paths})`
      : [];
  const existingSet = new Set(existingRows.map((r) => r.storage_path));

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of planned) {
    const { rec, storagePath, localPath, centerId, floorKey, sortOrder } = p;

    if (existingSet.has(storagePath) && !force) {
      rec.status = "SKIP";
      rec.detail = "DB에 동일 storage_path 존재 (--force 로 덮어쓰기)";
      skipped++;
      results.push(rec);
      console.log(`⏭  SKIP ${storagePath}`);
      continue;
    }

    try {
      if (existingSet.has(storagePath) && force) {
        await sql`DELETE FROM center_floor_photos WHERE storage_path = ${storagePath}`;
        await sb.storage.from(BUCKET).remove([storagePath]);
      }

      const bytes = readFileSync(localPath);
      const contentType = contentTypeFor(localPath);

      const { error: upErr } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
        contentType,
        upsert: force,
      });
      if (upErr) throw new Error(`Storage: ${upErr.message}`);

      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
      const imageUrl = pub.publicUrl;

      let order = sortOrder;
      if (order == null || !Number.isFinite(order)) {
        const [agg] = await sql`
          SELECT COALESCE(MAX(sort_order), 0)::int AS n
          FROM center_floor_photos
          WHERE center_id = ${centerId} AND floor_key = ${floorKey}
        `;
        order = (agg?.n ?? 0) + 1;
      }

      await sql`
        INSERT INTO center_floor_photos (center_id, floor_key, storage_path, image_url, sort_order)
        VALUES (${centerId}, ${floorKey}, ${storagePath}, ${imageUrl}, ${order})
      `;

      rec.status = "OK";
      rec.detail = imageUrl;
      ok++;
      results.push(rec);
      console.log(`✅ OK   ${storagePath}`);
    } catch (err) {
      rec.status = "FAIL";
      rec.detail = err instanceof Error ? err.message : String(err);
      failed++;
      results.push(rec);
      console.log(`❌ FAIL ${storagePath}: ${rec.detail}`);
    }
  }

  await sql.end({ timeout: 5 });

  const outCsv = join(bulkDir, `import-result-${new Date().toISOString().slice(0, 10)}.csv`);
  const csvLines = ["line,center_id,floor_key,filename,status,detail"];
  for (const r of results) {
    const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    csvLines.push([r.line, r.centerId, r.floorKey, r.filename, r.status, esc(r.detail)].join(","));
  }
  writeFileSync(outCsv, csvLines.join("\n"), "utf8");

  console.log(`\n── 완료 ──`);
  console.log(`  성공: ${ok}  스킵: ${skipped}  실패: ${failed}  (검증 오류: ${errors.length})`);
  console.log(`  결과: ${outCsv}\n`);

  if (failed > 0 || errors.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
