import { getStoriesSql, skipDatabaseRuntimeSchemaDdl } from "./waterStoriesDb";
import type { News } from "@/types/news";
import type postgres from "postgres";
import fs from "fs";
import path from "path";

let newsSchemaPromise: Promise<void> | null = null;

function ensureNewsSchema(sql: ReturnType<typeof postgres>) {
  if (!newsSchemaPromise) {
    if (skipDatabaseRuntimeSchemaDdl()) {
      newsSchemaPromise = Promise.resolve();
      return newsSchemaPromise;
    }
    newsSchemaPromise = (async () => {
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
    })();
  }
  return newsSchemaPromise;
}

type NewsRow = {
  id: string;
  center_id: string;
  center_name: string;
  title: string;
  content: string;
  views: number;
  is_pinned: boolean;
  image_url: string | null;
  created_at: Date;
};

function rowToNews(r: NewsRow): News {
  return {
    id: r.id,
    centerId: r.center_id,
    centerName: r.center_name,
    title: r.title,
    content: r.content,
    views: Number(r.views),
    isPinned: r.is_pinned,
    imageUrl: r.image_url ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── 로컬 파일 DB 헬퍼 (로컬 테스트용) ──
const LOCAL_NEWS_FILE = path.join(process.cwd(), "db", "local_news.json");

function readLocalNews(): NewsRow[] {
  try {
    if (!fs.existsSync(LOCAL_NEWS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LOCAL_NEWS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      created_at: new Date(item.created_at)
    }));
  } catch (e) {
    console.error("Failed to read local news file", e);
    return [];
  }
}

function writeLocalNews(list: NewsRow[]) {
  try {
    const dir = path.dirname(LOCAL_NEWS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_NEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write local news file", e);
  }
}

export async function listNewsFromDb(centerId?: string): Promise<News[]> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalNews();
    const filtered = centerId && centerId !== "all"
      ? rows.filter((r) => r.center_id === centerId)
      : rows;
    const sorted = [...filtered].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return b.created_at.getTime() - a.created_at.getTime();
    });
    return sorted.map(rowToNews);
  }

  await ensureNewsSchema(sql);

  const rows = centerId && centerId !== "all"
    ? await sql<NewsRow[]>`
        SELECT id, center_id, center_name, title, content, views, is_pinned, image_url, created_at
        FROM news
        WHERE center_id = ${centerId}
        ORDER BY is_pinned DESC, created_at DESC
      `
    : await sql<NewsRow[]>`
        SELECT id, center_id, center_name, title, content, views, is_pinned, image_url, created_at
        FROM news
        ORDER BY is_pinned DESC, created_at DESC
      `;

  return rows.map(rowToNews);
}

export async function getNewsDetailFromDb(id: string): Promise<News | null> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalNews();
    const row = rows.find((r) => r.id === id);
    if (!row) return null;
    row.views = (row.views || 0) + 1;
    writeLocalNews(rows);
    return rowToNews(row);
  }

  await ensureNewsSchema(sql);

  const [row] = await sql<NewsRow[]>`
    SELECT id, center_id, center_name, title, content, views, is_pinned, image_url, created_at
    FROM news
    WHERE id = ${id}::uuid
  `;

  if (!row) return null;

  // Increment views
  await sql`
    UPDATE news
    SET views = views + 1
    WHERE id = ${id}::uuid
  `;

  return rowToNews({
    ...row,
    views: row.views + 1
  });
}

export async function insertNewsDb(input: {
  centerId: string;
  centerName: string;
  title: string;
  content: string;
  isPinned: boolean;
  imageUrl?: string;
}): Promise<News> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalNews();
    const newRow: NewsRow = {
      id: crypto.randomUUID(),
      center_id: input.centerId,
      center_name: input.centerName,
      title: input.title,
      content: input.content,
      views: 0,
      is_pinned: input.isPinned,
      image_url: input.imageUrl ?? null,
      created_at: new Date()
    };
    rows.push(newRow);
    writeLocalNews(rows);
    return rowToNews(newRow);
  }

  await ensureNewsSchema(sql);

  const [row] = await sql<NewsRow[]>`
    INSERT INTO news (center_id, center_name, title, content, is_pinned, image_url)
    VALUES (
      ${input.centerId},
      ${input.centerName},
      ${input.title},
      ${input.content},
      ${input.isPinned},
      ${input.imageUrl ?? null}
    )
    RETURNING id, center_id, center_name, title, content, views, is_pinned, image_url, created_at
  `;

  if (!row) throw new Error("INSERT 실패");
  return rowToNews(row);
}

export async function updateNewsDb(
  id: string,
  input: {
    centerId: string;
    centerName: string;
    title: string;
    content: string;
    isPinned: boolean;
    imageUrl?: string;
  }
): Promise<News> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalNews();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("게시글이 존재하지 않습니다.");
    const updatedRow: NewsRow = {
      ...rows[idx]!,
      center_id: input.centerId,
      center_name: input.centerName,
      title: input.title,
      content: input.content,
      is_pinned: input.isPinned,
      image_url: input.imageUrl ?? null,
    };
    rows[idx] = updatedRow;
    writeLocalNews(rows);
    return rowToNews(updatedRow);
  }

  await ensureNewsSchema(sql);

  const [row] = await sql<NewsRow[]>`
    UPDATE news
    SET
      center_id = ${input.centerId},
      center_name = ${input.centerName},
      title = ${input.title},
      content = ${input.content},
      is_pinned = ${input.isPinned},
      image_url = ${input.imageUrl ?? null}
    WHERE id = ${id}::uuid
    RETURNING id, center_id, center_name, title, content, views, is_pinned, image_url, created_at
  `;

  if (!row) throw new Error("UPDATE 실패 — 게시글이 존재하지 않습니다.");
  return rowToNews(row);
}

export async function deleteNewsDb(id: string): Promise<void> {
  const sql = getStoriesSql();
  if (!sql) {
    const rows = readLocalNews();
    const filtered = rows.filter((r) => r.id !== id);
    writeLocalNews(filtered);
    return;
  }

  await ensureNewsSchema(sql);

  await sql`DELETE FROM news WHERE id = ${id}::uuid`;
}
